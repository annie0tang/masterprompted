/**
 * Claims Pipeline
 *
 * Orchestrates: extract_claims -> claim_match per claim -> merged EvaluationSpan[]
 * Web search is handled separately by the orchestrator for sequential execution.
 */

import type { EvaluationSpan, ClaimsMatchPipelineResult } from "./types";
import { extractClaims } from "./claimExtractionService";
import { matchClaim } from "./claimMatchService";

/**
 * Find the start index of a snippet in the source text.
 * Falls back to whitespace-normalized search if exact match fails.
 */
/**
 * Map an index in a transformed string back to the original string,
 * given a char-removal function that was applied to produce the transformed version.
 */
function mapTransformedIndexToOriginal(
  original: string,
  transformedIndex: number,
  shouldSkip: (char: string, pos: number, src: string) => boolean,
): number {
  let tIdx = 0;
  let oIdx = 0;
  while (tIdx < transformedIndex && oIdx < original.length) {
    if (shouldSkip(original[oIdx], oIdx, original)) {
      oIdx++;
    } else {
      oIdx++;
      tIdx++;
    }
  }
  // Skip any trailing chars that would be removed at the match start
  while (oIdx < original.length && shouldSkip(original[oIdx], oIdx, original)) {
    oIdx++;
  }
  return oIdx;
}

/**
 * Find snippet in text, returning { start, end } in the original text.
 * `end` accounts for characters (like markdown markers) that may exist in
 * the original but not in the snippet.
 */
export function findSnippetRange(text: string, snippet: string): { start: number; end: number } | null {
  // 1. Exact match
  const exactIndex = text.indexOf(snippet);
  if (exactIndex !== -1) return { start: exactIndex, end: exactIndex + snippet.length };

  // 2. Whitespace-normalized match
  const normalizeWS = (s: string) => s.replace(/\s+/g, " ").trim();
  const wsText = normalizeWS(text);
  const wsSnippet = normalizeWS(snippet);
  const wsIndex = wsText.indexOf(wsSnippet);
  if (wsIndex !== -1) {
    const skipWS = (ch: string, pos: number, src: string) => {
      if (!/\s/.test(ch)) return false;
      return pos > 0 && /\s/.test(src[pos - 1]);
    };
    const start = mapTransformedIndexToOriginal(text, wsIndex, skipWS);
    const end = mapTransformedIndexToOriginal(text, wsIndex + wsSnippet.length, skipWS);
    return { start, end };
  }

  // 3. Markdown-stripped match (handles API segments without ** / * / _ markers)
  const stripMd = (s: string) => s.replace(/\*{1,2}|_{1,2}/g, "");
  const mdText = stripMd(text);
  const mdSnippet = stripMd(snippet);
  const mdIndex = mdText.indexOf(mdSnippet);
  if (mdIndex !== -1) {
    const skipMd = (ch: string) => ch === "*" || ch === "_";
    const start = mapTransformedIndexToOriginal(text, mdIndex, skipMd);
    const end = mapTransformedIndexToOriginal(text, mdIndex + mdSnippet.length, skipMd);
    return { start, end };
  }

  // 4. Both normalizations combined
  const bothText = normalizeWS(stripMd(text));
  const bothSnippet = normalizeWS(stripMd(snippet));
  const bothIndex = bothText.indexOf(bothSnippet);
  if (bothIndex !== -1) {
    const mdStripped = stripMd(text);
    const idxInMd = normalizeWS(mdStripped).indexOf(bothSnippet);
    if (idxInMd !== -1) {
      const skipWS = (ch: string, pos: number, src: string) => {
        if (!/\s/.test(ch)) return false;
        return pos > 0 && /\s/.test(src[pos - 1]);
      };
      const skipMd = (ch: string) => ch === "*" || ch === "_";
      const mdStart = mapTransformedIndexToOriginal(mdStripped, idxInMd, skipWS);
      const mdEnd = mapTransformedIndexToOriginal(mdStripped, idxInMd + bothSnippet.length, skipWS);
      const start = mapTransformedIndexToOriginal(text, mdStart, skipMd);
      const end = mapTransformedIndexToOriginal(text, mdEnd, skipMd);
      return { start, end };
    }
  }

  return null;
}

/**
 * Convenience wrapper returning just the start position (backward compat).
 */
export function findSnippetPosition(text: string, snippet: string): number {
  const range = findSnippetRange(text, snippet);
  return range ? range.start : -1;
}

/**
 * Run the claims extraction + claim_match pipeline (no web_search).
 * Returns both the flagged spans and the extracted claims for later web_search use.
 */
export async function runClaimsMatchPipeline(text: string): Promise<ClaimsMatchPipelineResult | null> {
  if (!text.trim()) return { spans: [], extractedClaims: [] };

  const claims = await extractClaims(text);
  if (claims === null) return null;
  if (claims.length === 0) return { spans: [], extractedClaims: [] };

  // Locate all snippets. If a snippet contains newlines, split it into
  // sub-snippets (one per line) sharing the same claim, since the API
  // sometimes returns multi-line snippets that span non-contiguous text.
  const locatedClaims: Array<{ claim: string; snippet: string; snippetStart: number }> = [];

  for (const claim of claims) {
    const subSnippets = claim.snippet.includes("\n")
      ? claim.snippet.split("\n").map(s => s.trim()).filter(Boolean)
      : [claim.snippet];

    let anyFound = false;
    for (const sub of subSnippets) {
      const start = findSnippetPosition(text, sub);
      if (start !== -1) {
        locatedClaims.push({ claim: claim.claim, snippet: sub, snippetStart: start });
        anyFound = true;
      }
    }
    if (!anyFound) {
      console.warn(`Claims pipeline: could not locate snippet in text: "${claim.snippet.slice(0, 80)}..."`);
    }
  }

  // Deduplicate claim texts so we only call claim_match once per unique claim
  const uniqueClaims = [...new Set(locatedClaims.map(c => c.claim))];
  const matchResults = await Promise.allSettled(
    uniqueClaims.map(claim => matchClaim(claim))
  );

  // Build a map from claim text -> match result
  const matchMap = new Map<string, Awaited<ReturnType<typeof matchClaim>>>();
  matchResults.forEach((result, i) => {
    matchMap.set(uniqueClaims[i], result.status === "fulfilled" ? result.value : null);
  });

  const spans: EvaluationSpan[] = [];

  for (const entry of locatedClaims) {
    const match = matchMap.get(entry.claim);
    if (!match?.debunked) continue;

    spans.push({
      start: entry.snippetStart,
      end: entry.snippetStart + entry.snippet.length,
      segment: entry.snippet,
      confidence: match.similarityScore,
      value: "factual_inaccuracy",
      source: "claim_match",
      explanation: `This claim was debunked [here](${match.url}).`,
      href: match.url,
    });
  }

  return {
    spans,
    extractedClaims: locatedClaims.map(c => ({
      claim: c.claim,
      snippet: c.snippet,
      snippetStart: c.snippetStart,
    })),
  };
}
