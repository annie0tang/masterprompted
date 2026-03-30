/**
 * Disinformation API Service - Re-export wrapper
 *
 * This module re-exports from the modularized evaluations directory
 * for backward compatibility.
 */

export type { EvaluationSpan as DisinformationSpan } from "./evaluations/types";
export { getFallacyExplanation, fallacyExplanations } from "./evaluations/fallacyService";
export { checkFallacies as checkDisinformation } from "./evaluations/fallacyService";
