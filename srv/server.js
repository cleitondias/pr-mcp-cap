const cdfs = require('@sap/cds');

cdfs.on('bootstrap', (app) => {
  console.log('[bootstrap] loading MCP routes...');
  require('./mcp/mcp')(app);
});

module.exports = cdfs.server;