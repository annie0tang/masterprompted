/**
 * Evaluation Orchestrator
 *
 * Runs all evaluation pipelines in parallel and merges results.
 */

import type { EvaluationResult } from "./types";
import { checkFallacies } from "./fallacyService";
import { runClaimsPipeline } from "./claimsPipeline";

/**
 * Run all evaluation pipelines on the given text.
 * Fallacy detection and claims pipeline run in parallel.
 * @param text - The full answer text to analyze
 * @returns Combined evaluation result with pipeline status
 */
export async function runAllEvaluations(text: string): Promise<EvaluationResult | null> {
  if (!text.trim()) {
    return { spans: [], pipelineStatus: { fallacy: "success", claims: "success" } };
  }

  const [fallacyResult, claimsResult] = await Promise.allSettled([
    checkFallacies(text),
    runClaimsPipeline(text),
  ]);

  const fallacySpans =
    fallacyResult.status === "fulfilled" && fallacyResult.value !== null
      ? fallacyResult.value
      : [];

  const claimsSpans =
    claimsResult.status === "fulfilled" && claimsResult.value !== null
      ? claimsResult.value
      : [];

  const fallacyStatus =
    fallacyResult.status === "fulfilled" && fallacyResult.value !== null
      ? "success" as const
      : "error" as const;

  const claimsStatus =
    claimsResult.status === "fulfilled" && claimsResult.value !== null
      ? "success" as const
      : "error" as const;

  const allSpans = [...fallacySpans, ...claimsSpans].sort((a, b) => a.start - b.start);

  return {
    spans: allSpans,
    pipelineStatus: {
      fallacy: fallacyStatus,
      claims: claimsStatus,
    },
  };
}
