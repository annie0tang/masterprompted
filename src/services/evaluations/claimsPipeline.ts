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
export function findSnippetPosition(text: string, snippet: string): number {
  const exactIndex = text.indexOf(snippet);
  if (exactIndex !== -1) return exactIndex;

  // Fallback: normalize whitespace and try again
  const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
  const normalizedText = normalize(text);
  const normalizedSnippet = normalize(snippet);
  const normIndex = normalizedText.indexOf(normalizedSnippet);
  if (normIndex === -1) return -1;

  // Map normalized index back to original text position.
  let origPos = 0;
  let normPos = 0;
  while (normPos < normIndex && origPos < text.length) {
    if (/\s/.test(text[origPos])) {
      while (origPos < text.length && /\s/.test(text[origPos])) origPos++;
      normPos++;
    } else {
      origPos++;
      normPos++;
    }
  }
  return origPos;
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
