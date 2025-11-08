import {
  basicComponentLibrary,
  remoteButtonDefinition,
  remoteTextDefinition,
  type UIActionResult,
  UIResourceRenderer,
} from "@mcp-ui/client";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type {
  ContentBlock,
  Resource,
} from "@modelcontextprotocol/sdk/types.js";
import type React from "react";
import { useState } from "react";

const fetchMcpResource = async (
  toolName: string
): Promise<ContentBlock | undefined> => {
  const client = new Client({
    name: "streamable-http-client",
    version: "1.0.0",
  });

  const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:4040/mcp")
  );
  await client.connect(transport);
  let result: any;

  // server で実装した ツールを呼び出す
  if (toolName === "get_hello_world") {
    result = await client.callTool({
      name: toolName,
      arguments: {},
    });
  } else if (toolName === "get_external_link") {
    result = await client.callTool({
      name: toolName,
      arguments: {},
    });
  } else if (toolName === "get_action_button") {
    result = await client.callTool({
      name: toolName,
      arguments: {
        label: "Click Me!!!",
      },
    });
  } else {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  return (result?.content as ContentBlock[])[0];
};

const App: React.FC = () => {
  const [uiResource, setUIResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<any>(null);

  const loadResource = async (toolName: string) => {
    setLoading(true);
    setError(null);
    setUIResource(null);
    try {
      const block = await fetchMcpResource(toolName);
      setUIResource(block?.resource as Resource);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleGenericMcpAction = async (result: UIActionResult) => {
    // 現在は tool の場合のみ検証
    if (result.type === "tool") {
      if (result.payload.toolName === "processData") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          status: "success",
          processedData: `Processed: ${result.payload.params.data}`,
          timestamp: new Date().toISOString(),
        };
      }

      console.log(
        `Action received in host app - Tool: ${result.payload.toolName}, Params: ${result.payload.params.data}, Timestamp: ${result.payload.params.timestamp}`
      );
      setLastAction({
        tool: result.payload.toolName,
        params: result.payload.params,
      });
    } else if (result.type === "prompt") {
      console.log(`Prompt received in host app:`, result.payload.prompt);
      setLastAction({ prompt: result.payload.prompt });
    } else if (result.type === "link") {
      console.log(`Link received in host app:`, result.payload.url);
      setLastAction({ url: result.payload.url });
    } else if (result.type === "intent") {
      console.log(`Intent received in host app:`, result.payload.intent);
      setLastAction({ intent: result.payload.intent });
    } else if (result.type === "notify") {
      console.log(`Notification received in host app:`, result.payload.message);
      setLastAction({ message: result.payload.message });
    }

    return {
      status: "Action handled by host application",
    };
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-green-50 to-green-100">
      <div className="w-250 bg-linear-to-b from-green-600 to-green-700 shadow-[4px_0_12px_rgba(0,0,0,0.1)] flex flex-col">
        <h1 className="text-14 font-bold text-white p-3 border-b border-green-800/30 bg-green-700/50">
          MCP-UI Example
        </h1>
        <nav className="text-16 flex-1 p-2 flex flex-col [&>button]:w-full [&>button]:text-left [&>button]:px-3 [&>button]:py-2 [&>button]:text-white [&>button]:rounded-8 [&>button]:font-normal [&>button]:text-16 [&>button]:transition-all [&>button]:duration-200 [&>button:hover]:bg-green-500/30 [&>button:hover]:pl-4 [&>button:focus]:bg-green-500/40 [&>button:focus]:outline-none [&>button:focus]:ring-2 [&>button:focus]:ring-green-300/50">
          <button
            type="button"
            className="py-3"
            onClick={() => loadResource("get_hello_world")}
          >
            📄 Simple Html
          </button>
          <button
            type="button"
            onClick={() => loadResource("get_external_link")}
          >
            🔗 External Link
          </button>
          <button
            type="button"
            onClick={() => loadResource("get_action_button")}
          >
            ▶️ Action Button
          </button>
          <button
            type="button"
            onClick={() => loadResource("get_custom_action_button")}
          >
            ⚙️ Custom Action
          </button>
        </nav>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center min-h-[40px] flex items-center justify-center mb-3">
            {loading && <p className="text-green-700">Loading resource...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}
            {!loading && !error && !uiResource && (
              <p className="text-green-600">
                ← Select an option from the sidebar
              </p>
            )}
          </div>

          {uiResource && (
            <div className="bg-white rounded-16 shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-3 border border-green-200">
              <h2 className="text-20 font-bold text-green-800 mb-2">
                Rendering Resource: {uiResource.uri}
              </h2>
              <div className="border-2 border-green-300 rounded-12 p-2 bg-green-50/30">
                <UIResourceRenderer
                  resource={uiResource}
                  onUIAction={handleGenericMcpAction}
                  remoteDomProps={{
                    library: basicComponentLibrary,
                    remoteElements: [
                      remoteButtonDefinition,
                      remoteTextDefinition,
                    ],
                  }}
                  htmlProps={{
                    style: {
                      width: "100%",
                      minHeight: "400px",
                      padding: "16px",
                    },
                  }}
                />
              </div>
            </div>
          )}

          {lastAction && (
            <div className="mt-3 bg-white rounded-16 shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-3 border border-green-200">
              <h3 className="text-20 font-bold text-green-800 mb-2">
                Last Action Received
              </h3>
              <pre className="bg-green-50 border border-green-200 rounded-8 p-2 text-green-900 text-16 overflow-x-auto font-mono">
                {JSON.stringify(lastAction, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
