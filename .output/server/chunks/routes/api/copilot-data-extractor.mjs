import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import { readdir, stat, readFile } from 'fs/promises';
import { join, extname } from 'path';
import 'fs';
import 'date-holidays';
import 'crypto';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'undici';
import 'node:fs';
import 'node:url';
import 'node:path';

const MARKETPLACE_EXTENSION_PORT = 3001;
const REQUIRED_VERSION = "2.0.2";
async function verifyMarketplaceExtension() {
  try {
    console.log("[Marketplace Extension] Verifying online marketplace extension v" + REQUIRED_VERSION + " on port " + MARKETPLACE_EXTENSION_PORT);
    const response = await fetch(`http://127.0.0.1:${MARKETPLACE_EXTENSION_PORT}/api/health`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(3e3)
      // 3 second timeout
    });
    if (response.ok) {
      const data = await response.json();
      console.log("[Marketplace Extension] \u2705 Online marketplace extension is running");
      console.log("[Marketplace Extension] Version:", data.version || "unknown");
      return {
        status: "connected",
        port: MARKETPLACE_EXTENSION_PORT,
        version: data.version,
        isMarketplace: true,
        message: "\u2705 Online marketplace extension v" + (data.version || REQUIRED_VERSION) + " is active"
      };
    } else {
      console.log("[Marketplace Extension] \u274C Extension API returned error:", response.status);
      return {
        status: "disconnected",
        port: MARKETPLACE_EXTENSION_PORT,
        isMarketplace: false,
        message: "\u274C Extension not responding (HTTP " + response.status + ") - Make sure GitHub is authenticated in VS Code"
      };
    }
  } catch (error) {
    console.log("[Marketplace Extension] \u274C Extension not found on port " + MARKETPLACE_EXTENSION_PORT);
    console.log("[Marketplace Extension] This could mean:");
    console.log("[Marketplace Extension] 1. Extension is not installed");
    console.log("[Marketplace Extension] 2. User is not logged in to GitHub");
    console.log("[Marketplace Extension] 3. Extension failed to start");
    console.log("[Marketplace Extension] Error:", error instanceof Error ? error.message : error);
    return {
      status: "notfound",
      port: MARKETPLACE_EXTENSION_PORT,
      isMarketplace: false,
      message: "\u274C Marketplace extension not found. Please:\n1. Install: ahsansaeed.github-copilot-prompts\n2. Sign in with GitHub (VS Code)\n3. Reload VS Code"
    };
  }
}
async function getIDEPathsFromExtension() {
  try {
    const extensionInfo = await verifyMarketplaceExtension();
    if (!extensionInfo.isMarketplace) {
      console.log("[Extension] \u26A0\uFE0F " + extensionInfo.message);
      throw new Error(extensionInfo.message);
    }
    console.log("[Extension API] Fetching IDE paths from marketplace extension on port " + MARKETPLACE_EXTENSION_PORT);
    const response = await fetch("http://127.0.0.1:" + MARKETPLACE_EXTENSION_PORT + "/api/ide-paths", {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(5e3)
    });
    if (response.ok) {
      const data = await response.json();
      console.log("[Extension API] \u2705 Successfully fetched IDE paths from marketplace extension");
      console.log("[Extension API] Paths:", JSON.stringify(data.paths));
      return data.paths || {};
    } else {
      throw new Error("Marketplace extension returned status " + response.status);
    }
  } catch (error) {
    console.log("[Extension API] \u274C Cannot connect to marketplace extension");
    console.log("[Extension API] Make sure to install: ahsansaeed.github-copilot-prompts from VS Code Marketplace");
    console.log("[Extension API] Error:", error instanceof Error ? error.message : error);
    return {};
  }
}
let IDE_PATHS = {};
const COPILOT_FOLDERS = {
  "vscode": [
    "globalStorage/github.copilot-chat",
    "globalStorage/emptyWindowChatSessions",
    "mcp"
  ],
  "vscode-insider": [
    "globalStorage/github.copilot-chat",
    "globalStorage/emptyWindowChatSessions"
  ],
  "visualstudio": [
    "Copilot",
    "SettingsLogs"
  ],
  "ssms": [
    ""
    // Root folder contains log files
  ],
  "copilot-cli": [
    "history-session-state",
    "logs",
    "session-state"
  ]
};
async function scanVSCodeChatSessions(basePath) {
  const results = [];
  const workspaceStoragePath = join(basePath, "workspaceStorage");
  try {
    const workspaces = await readdir(workspaceStoragePath, { withFileTypes: true });
    for (const workspace of workspaces) {
      if (!workspace.isDirectory()) continue;
      const chatSessionsPath = join(workspaceStoragePath, workspace.name, "chatSessions");
      try {
        const sessions = await readdir(chatSessionsPath, { withFileTypes: true });
        for (const session of sessions) {
          if (!session.isFile() || !session.name.endsWith(".json")) continue;
          const fullPath = join(chatSessionsPath, session.name);
          try {
            const fileStat = await stat(fullPath);
            if (fileStat.size > 50 * 1024 * 1024) {
              console.log(`Processing large file (${Math.round(fileStat.size / 1024 / 1024)}MB): ${fullPath}`);
            }
          } catch {
          }
          const extracted = await extractFromJsonFile(fullPath, session.name);
          extracted.forEach((item) => {
            item.file = fullPath;
          });
          results.push(...extracted);
        }
      } catch {
      }
    }
  } catch (error) {
    console.error("Error scanning workspaceStorage:", error);
  }
  return results;
}
async function readJSONFile(filePath) {
  try {
    const content = await readFile(filePath, "utf-8");
    try {
      return JSON.parse(content);
    } catch {
      return { raw: content };
    }
  } catch (error) {
    return null;
  }
}
async function readLogFile(filePath) {
  try {
    const content = await readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    return "";
  }
}
async function extractFromJsonFile(filePath, fileName) {
  const results = [];
  try {
    const data = await readJSONFile(filePath);
    if (!data) return results;
    if (data.requests && Array.isArray(data.requests)) {
      data.requests.forEach((req, idx) => {
        const hasPrompt = req.message && (typeof req.message === "string" || req.message.text);
        const hasResponse = req.response && (req.response.value && req.response.value.length > 0 || req.response.result || typeof req.response === "string");
        if (hasPrompt || hasResponse) {
          results.push({
            id: req.requestId || `req-${idx}`,
            timestamp: req.timestamp,
            prompt: hasPrompt ? typeof req.message === "string" ? req.message : req.message.text : void 0,
            response: hasResponse ? typeof req.response === "string" ? req.response : req.response.value ? req.response.value.map((v) => v.value || v).join("") : req.response.result || "" : void 0,
            source: fileName,
            type: "vscode-chat"
          });
        }
      });
    }
    if (fileName === "copilot.cli.oldGlobalSessions.json" && data.sessions) {
      data.sessions.forEach((session, idx) => {
        var _a, _b;
        results.push({
          id: session.id || `session-${idx}`,
          timestamp: session.createdAt || session.timestamp,
          prompt: ((_a = session.userMessage) == null ? void 0 : _a.content) || session.prompt,
          response: ((_b = session.assistantMessage) == null ? void 0 : _b.content) || session.response,
          source: fileName,
          type: "cli-session"
        });
      });
    }
    if (data.messages && Array.isArray(data.messages)) {
      data.messages.forEach((msg, idx) => {
        var _a, _b;
        if (msg.role === "user" || msg.role === "assistant") {
          results.push({
            id: msg.id || `msg-${idx}`,
            timestamp: msg.timestamp,
            prompt: msg.role === "user" ? ((_a = msg.content) == null ? void 0 : _a.text) || msg.content || (Array.isArray(msg.content) ? msg.content.map((c) => c.text || c).join("") : "") : void 0,
            response: msg.role === "assistant" ? ((_b = msg.content) == null ? void 0 : _b.text) || msg.content || (Array.isArray(msg.content) ? msg.content.map((c) => c.text || c).join("") : "") : void 0,
            messages: [msg],
            source: fileName,
            type: "chat"
          });
        }
      });
    }
    if (fileName === "commandEmbeddings.json" && data.commands) {
    }
    if (fileName === "settingEmbeddings.json" && data.settings) {
    }
  } catch (error) {
    console.error(`Error extracting from ${filePath}:`, error);
  }
  return results;
}
async function extractFromLogFile(filePath, fileName) {
  const results = [];
  try {
    const content = await readLogFile(filePath);
    if (!content) return results;
    if (fileName.startsWith("chat_") && fileName.endsWith(".log")) {
      const lines = content.split("\n");
      let currentPrompt = "";
      let currentResponse = "";
      let isPrompt = false;
      lines.forEach((line, idx) => {
        if (line.includes("[USER]") || line.includes("User:") || line.includes("Prompt:")) {
          if (currentPrompt && currentResponse) {
            results.push({
              id: `ssms-${idx}`,
              prompt: currentPrompt,
              response: currentResponse,
              source: fileName,
              type: "sql-chat",
              timestamp: extractTimestamp(fileName)
            });
            currentPrompt = "";
            currentResponse = "";
          }
          currentPrompt = line.replace(/\[USER\]|User:|Prompt:/gi, "").trim();
          isPrompt = true;
        } else if (line.includes("[ASSISTANT]") || line.includes("Assistant:") || line.includes("Response:")) {
          isPrompt = false;
          currentResponse = line.replace(/\[ASSISTANT\]|Assistant:|Response:/gi, "").trim();
        } else if (line.trim() && (isPrompt || currentPrompt)) {
          if (isPrompt) {
            currentPrompt += " " + line.trim();
          } else {
            currentResponse += " " + line.trim();
          }
        }
      });
      if (currentPrompt && currentResponse) {
        results.push({
          id: `ssms-${lines.length}`,
          prompt: currentPrompt,
          response: currentResponse,
          source: fileName,
          type: "sql-chat",
          timestamp: extractTimestamp(fileName)
        });
      }
    }
    if (content.includes("prompt") || content.includes("message")) {
      const lines = content.split("\n");
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes("prompt")) {
          results.push({
            id: `log-${idx}`,
            prompt: line,
            source: fileName,
            type: "log-entry"
          });
        }
      });
    }
  } catch (error) {
    console.error(`Error extracting from ${filePath}:`, error);
  }
  return results;
}
function extractTimestamp(fileName) {
  const match = fileName.match(/(\d{8})_(\d{9})/);
  if (match) {
    const date = match[1];
    const time = match[2];
    return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}T${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}.${time.substring(6)}Z`;
  }
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function scanDirectory(dirPath, depth = 0, maxDepth = 5) {
  const results = [];
  if (depth > maxDepth) return results;
  try {
    const items = await readdir(dirPath, { withFileTypes: true });
    for (const item of items) {
      const fullPath = join(dirPath, item.name);
      try {
        if (item.isDirectory()) {
          if (item.name === "chatSessions" || dirPath.includes("workspaceStorage") && depth <= maxDepth) {
            const subResults = await scanDirectory(fullPath, depth + 1, maxDepth);
            results.push(...subResults);
          } else if (!item.name.startsWith(".") && !item.name.includes("node_modules") && !item.name.includes("cache")) {
            const subResults = await scanDirectory(fullPath, depth + 1, maxDepth);
            results.push(...subResults);
          }
        } else if (item.isFile()) {
          const ext = extname(item.name).toLowerCase();
          if (ext === ".json") {
            const extracted = await extractFromJsonFile(fullPath, item.name);
            extracted.forEach((item2) => {
              item2.file = fullPath;
            });
            results.push(...extracted);
          } else if (ext === ".log" || item.name.startsWith("chat_")) {
            const extracted = await extractFromLogFile(fullPath, item.name);
            extracted.forEach((item2) => {
              item2.file = fullPath;
            });
            results.push(...extracted);
          }
        }
      } catch (error) {
        if (error.code !== "EACCES" && error.code !== "EPERM") {
          console.error(`Error processing ${fullPath}:`, error);
        }
      }
    }
  } catch (error) {
    if (error.code !== "EACCES" && error.code !== "EPERM") {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }
  }
  return results;
}
async function extractFromIDE(ideKey) {
  const ideData = {
    ide: ideKey,
    totalPrompts: 0,
    totalResponses: 0,
    dataFiles: []
  };
  const basePath = IDE_PATHS[ideKey];
  if (!basePath) return ideData;
  if (ideKey === "vscode" || ideKey === "vscode-insider") {
    const chatResults = await scanVSCodeChatSessions(basePath);
    ideData.dataFiles.push(...chatResults);
  }
  const folders = COPILOT_FOLDERS[ideKey] || [];
  for (const folder of folders) {
    try {
      const fullPath = join(basePath, folder);
      const results = await scanDirectory(fullPath);
      ideData.dataFiles.push(...results);
    } catch (error) {
      console.error(`Error extracting from ${ideKey}/${folder}:`, error);
    }
  }
  ideData.totalPrompts = ideData.dataFiles.filter((d) => d.prompt).length;
  ideData.totalResponses = ideData.dataFiles.filter((d) => d.response).length;
  return ideData;
}
const copilotDataExtractor = defineEventHandler(async (event) => {
  IDE_PATHS = await getIDEPathsFromExtension();
  if (Object.keys(IDE_PATHS).length === 0) {
    return {
      success: false,
      demoMode: true,
      message: "Extension not running. No IDE paths available. Install and run the VS Code extension to see your local Copilot prompts.",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  const query = getQuery(event);
  const action = query.action;
  const ide = query.ide;
  try {
    if (action === "extract-all") {
      const allData = [];
      let totalPrompts = 0;
      let totalResponses = 0;
      for (const ideKey of Object.keys(IDE_PATHS)) {
        const ideData = await extractFromIDE(ideKey);
        allData.push(ideData);
        totalPrompts += ideData.totalPrompts;
        totalResponses += ideData.totalResponses;
      }
      return {
        success: true,
        action: "extract-all",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        summary: {
          totalIDEs: allData.length,
          totalPrompts,
          totalResponses,
          totalDataPoints: allData.reduce((sum, ide2) => sum + ide2.dataFiles.length, 0)
        },
        data: allData
      };
    }
    if (action === "extract-ide" && ide) {
      const ideData = await extractFromIDE(ide);
      return {
        success: true,
        action: "extract-ide",
        ide,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        data: ideData
      };
    }
    const summary = {
      success: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      availableIDEs: Object.keys(IDE_PATHS),
      copilotFolders: COPILOT_FOLDERS,
      message: "Use ?action=extract-all to extract all data or ?action=extract-ide&ide=vscode to extract from specific IDE"
    };
    return summary;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
});

export { copilotDataExtractor as default };
//# sourceMappingURL=copilot-data-extractor.mjs.map
