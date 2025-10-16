import * as jsdiff from "diff";

// Extend jsdiff.Change type
export type DiffPart = jsdiff.Change;

/**
 * Wraps jsdiff.diffWords to prevent diff spans from visibly starting with a newline
 * OR visibly ending with a whitespace character (like a space or newline).
 *
 * This ensures that diff highlighting only wraps the core modified text content,
 * improving visual separation and preventing highlighting from bleeding onto
 * line breaks or surrounding spaces.
 *
 * @param oldStr The original string.
 * @param newStr The new string.
 * @returns An array of diff parts, where no 'added' or 'removed' part starts with '\n' or ends with whitespace.
 */
export function diffWordsWithNewlineProtection(oldStr: string, newStr: string): DiffPart[] {
  // Use jsdiff.diffWords to get the initial word-level comparison
  const result: jsdiff.Change[] = jsdiff.diffWords(oldStr, newStr, {ignoreCase: true});
//   const result: jsdiff.Change[] = jsdiff.diffSentences(oldStr, newStr);
  const cleaned: DiffPart[] = [];

  const WHITESPACE_REGEX = /\s$/;

  for (const part of result) {
    if (part.added || part.removed) {
      let value = part.value;
      let trailingWhitespace = '';

      // --- 1. Handle Leading Newline ---
      if (value.startsWith('\n') && part.added) {
        // Prepend the newline as a neutral part
        cleaned.push({ value: '\n', added: false, removed: false, count: 1 });
        
        // Remove the leading newline from the diff part's value
        value = value.substring(1);
      }
      
      // --- 2. Handle Trailing Whitespace (Space, Tab, or Newline) ---
      // This is done after the leading newline check, and only if content remains.
      if (value.length > 0 && WHITESPACE_REGEX.test(value)) {
          // Extract the last character (which is guaranteed to be whitespace by the regex)
          trailingWhitespace = value.slice(-1);
          // Remove the trailing whitespace from the diff part's value
          value = value.slice(0, -1);
      }
      
      // --- 3. Add the cleaned diff part (if content remains) ---
      if (value.length > 0) {
        cleaned.push({ ...part, value });
      }
      
      // --- 4. Append the trailing whitespace as a neutral part ---
      if (trailingWhitespace.length > 0 && part.added) {
        cleaned.push({ value: trailingWhitespace, added: false, removed: false, count: 1 });
      }


    } else {
      // Non-diff parts are neutral and can contain newlines/whitespace, which is fine.
      cleaned.push(part);
    }
  }

  return cleaned;
}
