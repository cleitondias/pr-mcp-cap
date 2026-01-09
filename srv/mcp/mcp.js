const { json } = require("@sap/cds/lib/compile/parse");

express = require("express");

// ---- CONFIG ----
// Coloca isso no ambiente: SAP_API_KEY=<sua_api_key_do_hub>
const SAP_API_KEY = "7Z2b82jFQOaogD2ZMMcFCEGy9CNE5nw1";

// Ajuste conforme a API do Sandbox que você escolher
// Exemplo de base (você troca depois):
const SAP_BASE = process.env.SAP_BASE || "https://sandbox.api.sap.com";

module.exports = (app) => { 
    const router = express.Router();   
    router.use(express.json());

    // Health check
    router.get("/health", (_, res) => res.json({ ok: true }));

    // 1) Handshake / capabilities 
    router.get("/", (_, res) => {
        res.json({
            name: "pr-mcp-cap",
            version: "0.1.0",
            tools: [
                {
                    name: "sap_s4_get_purschase_requistion",
                    description: "Busca Purchase Requisition no S/4 Sandbox (API Hub) por PRID",
                    inputSchema: {
                        type: "object",
                        properties: { prId: { type: "string" } },
                        required: ["prId"],
                    },
                },
            ],
        });
    });

    // 2) Generic Endpoint to execute the tool
    router.post("/call", async (req, res) => {
        try {
            const { tool, input } = req.body || {};
            if (!tool) return res.status(400).json({ error: "Missing tool" });

            if (tool === "sap_s4_get_purschase_requistion") {
                if(!SAP_API_KEY) {
                    return res.status(500).json({ error: "SAP API Key not configured" });
                }

                const url = `${SAP_BASE}/s4hanacloud/sap/opu/odata4/sap/api_purchaserequisition_2/` + 
                                       `srvd_a2x/sap/purchaserequisition/0001/PurchaseReqn(PurchaseRequisition='${encodeURIComponent(input.prId)}')` + 
                                       `?$expand=_PurchaseRequisitionItem($expand=_PurchaseReqnItemText,_PurchaseReqnAcctAssgmt,_PurchaseReqnDelivAddress)&$format=json`;

                // Call SAP API to get Purchase Requisition by prId
                const response = await fetch(url, {
                    //method: "GET",
                    headers: {
                        "APIKey": SAP_API_KEY,
                        "Accept": "application/json"
                    }
                });

                if (!response.ok) {
                    const text = await response.text();
                    return res
                    .status(response.status)
                    .json({ error: "SAP API call failed", details: text });
                }

                const data = await response.json();
                const pr = data?.d || data
                return res.json({ content: [{ type: "json", json: pr }] });
            }

            return res.status(400).json({ error: "Unknown tool" });
        } catch (error) {
            console.error("Error handling /call:", error);
            return res.status(500).json({ error: "Internal server error", details: error.message });
        }
    });

    app.use("/mcp", router);    
}