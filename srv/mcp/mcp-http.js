// srv/mcp/mcp-http.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createStreamableHttpServer } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export function mountMcp(app) { 

    const CAP_BASE = process.env.CAP_BASE || "https://pr-mcp-cap.cfapps.us10-001.hana.ondemand.com";

    async function callCapApi(tool, input) {
        const r = await fetch(`${CAP_BASE}/mcp/call`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ tool, input }),
        });
        if (!r.ok) throw new Error(`CAP tool call failed (${r.status})`);
        return await r.json();
    }

    const mcp = new McpServer({ name: "pr-mcp-cap", version: "1.0.0" });

    mcp.tool(
        "sap_s4_get_purschase_requistion",
        "Busca Purchase Requisition no S/4 Sandbox",
        {
            type: "object",
            properties: { prId: { type: "string" } },
            required: ["prId"],
            additionalProperties: false
        },
        async ({ prId }) => callCapApi("sap_s4_get_purschase_requistion", { prId })
    );

    const handler = createStreamableHttpServer(mcp);

    // Monta em /mcp (isso é o que o Copilot vai POSTar)
    app.use("/mcp", (req, res) => handler(req, res));

}