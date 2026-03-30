/**
 * Web Search & Debunking Service
 *
 * Performs web search for a claim, collects related resources,
 * and generates a debunking report using counter-evidence.
 */

const WEB_SEARCH_ENDPOINT = "https://web-search-aicode.ilabhub.atc.gr/web_search/";

export interface WebSearchResult {
  claimDebunked: boolean;
  debunkReport: string;
}

/**
 * Search the web for evidence about a single claim
 * @param claimText - The claim text to research
 * @returns Search result or null if error
 */
export async function webSearchClaim(claimText: string): Promise<WebSearchResult | null> {
  try {
    const response = await fetch(WEB_SEARCH_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim_text: claimText }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Web search API error: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    return {
      claimDebunked: data.claim_debunked === true,
      debunkReport: data.debunk_report ?? "",
    };
  } catch (error) {
    console.error("webSearchClaim error:", error);
    return null;
  }
}
