import { randomUUID } from 'node:crypto';
import { createUIResource } from '@mcp-ui/server';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import cors from 'cors';
import express from 'express';
import z from 'zod';

const app = express();
const port = 4040;

app.use(
  cors({
    origin: '*',
    exposedHeaders: '*',
    allowedHeaders: '*',
    credentials: true,
  }),
);
app.use(express.json());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication.
app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // A session already exists; reuse the existing transport.
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // This is a new initialization request. Create a new transport.
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport;
        console.log(`MCP Session initialized: ${sid}`);
      },
    });

    // Clean up the transport from our map when the session closes.
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log(`MCP Session closed: ${transport.sessionId}`);
        delete transports[transport.sessionId];
      }
    };

    // Create a new server instance for this specific session.
    const server = new McpServer({
      name: 'typescript-server-walkthrough',
      version: '1.0.0',
    });

    // Register our MCP-UI tool on the new server instance.
    server.registerTool(
      'get_hello_world',
      {
        title: 'HelloWorld',
        description: 'シンプルなHTMLのリソースを返すツールです',
        inputSchema: {},
      },
      async () => {
        const uiResource = createUIResource({
          uri: 'ui://hello_world',
          content: { type: 'rawHtml', htmlString: '<p>hello_world</p>' },
          encoding: 'text',
        });

        return {
          content: [uiResource],
        };
      },
    );

    server.registerTool(
      'get_external_link',
      {
        title: 'GetExternalLink',
        description: '外部リソースのリンクを返します',
        inputSchema: {},
      },
      async () => {
        // Create the UI resource to be returned to the client (this is the only part specific to MCP-UI)
        const uiResource = createUIResource({
          uri: 'ui://external_link',
          content: { type: 'externalUrl', iframeUrl: 'https://example.com' },
          encoding: 'text',
        });

        return {
          content: [uiResource],
        };
      },
    );

    server.registerTool(
      'get_action_button',
      {
        title: 'GetActionButton',
        description: 'インタラクティブなアクションボタンのUIリソースを返します',
        inputSchema: {
          label: z.string(),
        },
      },
      async ({ label }) => {
        console.log('label ->', label);
        const uiResource = createUIResource({
          uri: 'ui://action_button',
          content: {
            type: 'remoteDom',
            framework: 'react',
            script: `
					  const button = document.createElement('ui-button');
					  button.setAttribute('label', '${label}');
					  button.addEventListener('press', () => {
					    window.parent.postMessage({
								type: 'tool',
								payload: {
									toolName: 'ui_interation',
									params: {
										data: 'クリック完了',
										timestamp: ${Date.now()}
									}
								}
							}, '*');
					  });
					  root.appendChild(button);
            `,
          },
          encoding: 'text',
        });

        return {
          content: [uiResource],
        };
      },
    );

    // Connect the server instance to the transport for this session.
    await server.connect(transport);
  } else {
    return res.status(400).json({
      error: { message: 'Bad Request: No valid session ID provided' },
    });
  }

  // Handle the client's request using the session's transport.
  await transport.handleRequest(req, res, req.body);
});

// A separate, reusable handler for GET and DELETE requests.
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    return res.status(404).send('Session not found');
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// GET handles the long-lived stream for server-to-client messages.
app.get('/mcp', handleSessionRequest);

// DELETE handles explicit session termination from the client.
app.delete('/mcp', handleSessionRequest);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`MCP endpoint available at http://localhost:${port}/mcp`);
});
