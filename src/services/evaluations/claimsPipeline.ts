/**
 * Claims Pipeline
 *
 * Orchestrates: extract_claims -> (claim_match + web_search per claim) -> merged EvaluationSpan[]
 */

import type { EvaluationSpan } from "./types";
import { extractClaims } from "./claimExtractionService";
import { matchClaim } from "./claimMatchService";
import { webSearchClaim } from "./webSearchService";

/**
 * Find the start index of a snippet in the source text.
 * Falls back to whitespace-normalized search if exact match fails.
 */
function findSnippetPosition(text: string, snippet: string): number {
  const exactIndex = text.indexOf(snippet);
  if (exactIndex !== -1) return exactIndex;

  // Fallback: normalize whitespace and try again
  const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
  const normalizedText = normalize(text);
  const normalizedSnippet = normalize(snippet);
  const normIndex = normalizedText.indexOf(normalizedSnippet);
  if (normIndex === -1) return -1;

  // Map normalized index back to original text position.
  // Walk the original text, skipping excess whitespace to align with the normalized version.
  let origPos = 0;
  let normPos = 0;
  while (normPos < normIndex && origPos < text.length) {
    if (/\s/.test(text[origPos])) {
      // In normalized form, consecutive whitespace collapses to a single space
      while (origPos < text.length && /\s/.test(text[origPos])) origPos++;
      normPos++; // one space in normalized form
    } else {
      origPos++;
      normPos++;
    }
  }
  return origPos;
}

/**
 * Run the full claims pipeline on a text.
 * @param text - The full answer text to analyze
 * @returns Array of evaluation spans for debunked claims, or null on extraction failure
 */
export async function runClaimsPipeline(text: string): Promise<EvaluationSpan[] | null> {
  if (!text.trim()) return [];

  const claims = await extractClaims(text);
  if (claims === null) return null;
  if (claims.length === 0) return [];

  // For each claim, run claim_match and web_search in parallel
  const results = await Promise.allSettled(
    claims.map(async (claim) => {
      const [matchResult, searchResult] = await Promise.allSettled([
        matchClaim(claim.claim),
        webSearchClaim(claim.claim),
      ]);

      const match = matchResult.status === "fulfilled" ? matchResult.value : null;
      const search = searchResult.status === "fulfilled" ? searchResult.value : null;

      const matchFlagged = match?.debunked === true;
      const searchFlagged = search?.claimDebunked === true;

      if (!matchFlagged && !searchFlagged) return null;

      // Build explanation
      const explanations: string[] = [];
      let href: string | undefined;

      if (matchFlagged && match) {
        explanations.push(`This claim was debunked [here](${match.url}).`);
        href = match.url;
      }
      if (searchFlagged && search) {
        explanations.push(search.debunkReport);
      }

      // Locate the snippet in the original text
      const snippetStart = findSnippetPosition(text, claim.snippet);
      if (snippetStart === -1) {
        console.warn(`Claims pipeline: could not locate snippet in text: "${claim.snippet.slice(0, 80)}..."`);
        return null;
      }

      const span: EvaluationSpan = {
        start: snippetStart,
        end: snippetStart + claim.snippet.length,
        segment: claim.snippet,
        confidence: match?.similarityScore ?? 1.0,
        value: "factual_inaccuracy",
        source: matchFlagged ? "claim_match" : "web_search",
        explanation: explanations.join("\n\n"),
        href,
      };

      return span;
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<EvaluationSpan | null> => r.status === "fulfilled")
    .map(r => r.value)
    .filter((span): span is EvaluationSpan => span !== null);
}
