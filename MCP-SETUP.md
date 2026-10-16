# Top AI Writing Tools MCP

This repository includes a read-only Model Context Protocol endpoint for the site's public guides and benchmark. It exposes `search`, `fetch`, and `get_benchmark`; it cannot publish, message, submit forms, or change site content.

## Endpoint

When this Cloudflare Pages project is deployed, the Streamable HTTP MCP endpoint is:

`https://topaiwritertools.com/mcp`

The function reads the deployed `search-index.json` and page assets through the Pages `ASSETS` binding. It does not require API keys or user credentials because it only exposes public site content.

## Connect from ChatGPT web

1. Confirm your ChatGPT account or workspace permits custom MCP connections. Availability depends on plan and workspace permissions.
2. In ChatGPT web, open **Plugins** (or the Apps settings in the legacy interface) and choose **Add custom MCP server**.
3. Name it **Top AI Writing Tools** and enter `https://topaiwritertools.com/mcp` as the public HTTPS MCP endpoint.
4. Leave authentication unset, scan the tools, and create the connection.
5. Start a chat, select the connector, and try: “Search Top AI Writing Tools for the 2026 benchmark, then summarize Rytr's short-form and long-form results with the source link.”

ChatGPT connects only to a reachable remote endpoint; it cannot connect directly to a local server. If this endpoint is not yet deployed, deploy the Pages project first or use a Secure MCP Tunnel for private development.

## Deployment notes

`functions/mcp.js` is a Cloudflare Pages Function and is deployed with the Pages project. The route responds to JSON POST requests at `/mcp` using MCP Streamable HTTP's stateless request pattern. It requires no third-party packages. After deployment, add the endpoint to ChatGPT and verify tool discovery and a sample `search` / `fetch` call.
