# MCP CAP - Model Context Protocol Server for SAP S/4HANA

This project implements a Model Context Protocol (MCP) server using SAP Cloud Application Programming (CAP) model that provides tools to query SAP S/4HANA Purchase Requisition data via the SAP Business Accelerator Hub Sandbox APIs.

The MCP server can be integrated with AI assistants and agents (like Microsoft Copilot Studio) to enable natural language queries against SAP S/4HANA data.

## Architecture

AI Assistant/Agent (e.g., Copilot Studio)
→ HTTP POST to MCP Server
→ SAP CAP (BTP Cloud Foundry or Local)
→ SAP S/4HANA Purchase Requisition API (Business Accelerator Hub Sandbox)

## Features

- **MCP Protocol Support**: Implements Model Context Protocol for AI tool integration
- **SAP S/4HANA Integration**: Connects to SAP Business Accelerator Hub APIs
- **Purchase Requisition Queries**: Retrieves detailed Purchase Requisition data including items, texts, assignments, and delivery addresses
- **OpenAPI Specification**: Includes OpenAPI spec for easy integration with external systems

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /mcp/ | MCP handshake - returns server capabilities and available tools |
| GET | /mcp/health | Health check endpoint |
| POST | /mcp/call | Executes an MCP tool (main endpoint) |

## Available Tools

### `sap_s4_get_purschase_requistion`

Retrieves Purchase Requisition data from SAP S/4HANA Sandbox by Purchase Requisition ID.

**Input Schema:**
```json
{
  "prId": "10000000"
}
```

**Request Example:**
```json
{
  "tool": "sap_s4_get_purschase_requistion",
  "input": {
    "prId": "10000000"
  }
}
```

**Response:**
Returns Purchase Requisition details including expanded items, item texts, account assignments, and delivery addresses.

## Configuration

Set the following environment variables:

- `SAP_API_KEY` - Your SAP Business Accelerator Hub API key (required)
- `SAP_BASE` - SAP API base URL (default: `https://sandbox.api.sap.com`)

## Local Development

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will start on the default CAP port (typically http://localhost:4004).

## Deploy to SAP BTP (Cloud Foundry)

```bash
cf push
```

Configure environment variables in Cloud Foundry:
```bash
cf set-env pr-mcp-cap SAP_API_KEY <your-api-key>
```

## Project Structure

```
pr-mcp-cap/
├── srv/
│   ├── server.js              # CAP server bootstrap
│   ├── dummy.cds              # CDS service definition
│   └── mcp/
│       ├── mcp.js             # MCP server implementation
│       └── mcp-http.js        # HTTP utilities
├── mcp-cap-openapi.yaml       # OpenAPI specification
├── package.json               # Project dependencies
└── manifest.yml               # Cloud Foundry deployment config
```

## Integration with AI Assistants

This MCP server can be integrated with various AI assistants:

1. **Microsoft Copilot Studio**: Import the OpenAPI specification to create an Action
2. **Other MCP Clients**: Use the `/mcp/` endpoint for capability discovery and `/mcp/call` for tool execution

## API Key

To obtain an SAP Business Accelerator Hub API key:
1. Visit [SAP Business Accelerator Hub](https://api.sap.com)
2. Sign in and navigate to your profile
3. Generate an API key
4. Set it as the `SAP_API_KEY` environment variable

## License

UNLICENSED - Private project
