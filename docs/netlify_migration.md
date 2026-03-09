# TECHNICAL SPEC: MIGRATE NETLIFY FUNCTION TO EDGE

## 1. Context & Objective
The standard Netlify Function is hitting the **25s Execution Guard** because AI summarization is slow. We are migrating to **Netlify Edge Functions** (Deno runtime) to bypass Lambda timeouts and achieve stable, long-running streaming.

## 2. File System Changes
* **Move from:** `netlify/functions/chat.js`
* **Move to:** `netlify/edge-functions/chat.ts`

## 3. Netlify Configuration (netlify.toml)
Ensure the Edge Function is registered correctly by adding or updating this section:

```toml
[[edge_functions]]
  path = "/api/chat"
  function = "chat"
```

## 4. Edge Function Implementation (Deno)

**Agent Instructions:**
1. Use **Deno** environment (no Node.js built-ins like `path` or `fs`).
2. Use `Deno.env.get("VARIABLE_NAME")` for secrets.
3. **Crucial:** Return the model's `body` directly as a `ReadableStream` to prevent buffering and timeouts.

```typescript
import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { text, modelConfig } = await request.json();

    const hfResponse = await fetch("[https://api-inference.huggingface.co/models/YOUR_MODEL_ID](https://api-inference.huggingface.co/models/YOUR_MODEL_ID)", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("HF_TOKEN")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        stream: true,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          ...modelConfig
        },
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      return new Response(`Upstream Error: ${errorText}`, { status: hfResponse.status });
    }

    return new Response(hfResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (err) {
    console.error("[EDGE_ERROR]:", err);
    return new Response(JSON.stringify({ error: "Edge Function Crash" }), { status: 500 });
  }
};

export const config: Config = { path: "/api/chat" };
```

## 5. Deployment Checklist
* [ ] Remove old function from `netlify/functions/` to avoid path conflicts.
* [ ] Verify `HF_TOKEN` is set in Netlify Environment Variables.
* [ ] Ensure Frontend `fetch` call points to `/api/chat`.