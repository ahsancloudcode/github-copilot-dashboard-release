import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import { readdir, readFile } from 'fs/promises';
import { existsSync, statSync } from 'fs';
import { join, resolve } from 'path';
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

async function getIDEPathsFromExtension() {
  try {
    const response = await fetch("http://127.0.0.1:3001/api/ide-paths");
    if (!response.ok) {
      console.warn("Extension API not available at 127.0.0.1:3001");
      return null;
    }
    const data = await response.json();
    return data.paths;
  } catch (error) {
    console.warn("Could not fetch paths from extension (127.0.0.1:3001):", error);
    return null;
  }
}
async function parseSessionFile(filePath, ideId, ideName) {
  var _a, _b, _c;
  try {
    const content = await readFile(filePath, "utf-8");
    const data = JSON.parse(content);
    if (data.emptyWindowChatSessions && Array.isArray(data.emptyWindowChatSessions)) {
      for (const session of data.emptyWindowChatSessions) {
        if (((_a = session.conversation) == null ? void 0 : _a.length) > 0) {
          const firstMessage = session.conversation[0];
          return {
            id: session.sessionId || "",
            ide: ideId,
            ideName,
            title: ((_b = firstMessage.message) == null ? void 0 : _b.substring(0, 100)) || "Untitled",
            lastModified: statSync(filePath).mtimeMs,
            dataType: "chat",
            contentPreview: (_c = firstMessage.message) == null ? void 0 : _c.substring(0, 200)
          };
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}
const dynamicChatSessions = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const ideFilter = query.ide;
  try {
    const extensionPaths = await getIDEPathsFromExtension();
    if (!extensionPaths) {
      console.log("\u{1F4CA} Demo Mode: Extension not providing paths for dynamic chat sessions");
      return {
        sessions: [],
        demoMode: true,
        error: "Extension not running"
      };
    }
    let allSessions = [];
    const vscodePath = extensionPaths.vscode ? join(extensionPaths.vscode, "globalStorage", "emptyWindowChatSessions") : null;
    if (vscodePath && existsSync(vscodePath)) {
      try {
        const files = await readdir(vscodePath, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith(".json")) {
            const session = await parseSessionFile(resolve(vscodePath, file.name), "vscode", "Visual Studio Code");
            if (session) allSessions.push(session);
          }
        }
      } catch (e) {
        console.error("Error reading VS Code sessions:", e);
      }
    }
    const vscodeInsiderPath = extensionPaths["vscode-insider"] ? join(extensionPaths["vscode-insider"], "globalStorage", "emptyWindowChatSessions") : null;
    if (vscodeInsiderPath && existsSync(vscodeInsiderPath)) {
      try {
        const files = await readdir(vscodeInsiderPath, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith(".json")) {
            const session = await parseSessionFile(resolve(vscodeInsiderPath, file.name), "vscode-insider", "Visual Studio Code Insider");
            if (session) allSessions.push(session);
          }
        }
      } catch (e) {
        console.error("Error reading VS Code Insider sessions:", e);
      }
    }
    const ssmsPath = extensionPaths.ssms;
    if (ssmsPath && existsSync(ssmsPath)) {
      try {
        const files = await readdir(ssmsPath, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && (file.name.endsWith(".log") || file.name.endsWith(".json"))) {
            const content = await readFile(resolve(ssmsPath, file.name), "utf-8");
            allSessions.push({
              id: file.name,
              ide: "ssms",
              ideName: "SQL Server Management Studio",
              title: file.name.substring(0, 100),
              lastModified: statSync(resolve(ssmsPath, file.name)).mtimeMs,
              dataType: "log",
              contentPreview: content.substring(0, 200)
            });
          }
        }
      } catch (e) {
        console.error("Error reading SSMS sessions:", e);
      }
    }
    const cliPath = extensionPaths["copilot-cli"] ? join(extensionPaths["copilot-cli"], "history-session-state") : null;
    if (cliPath && existsSync(cliPath)) {
      try {
        const files = await readdir(cliPath, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith(".json")) {
            const content = await readFile(resolve(cliPath, file.name), "utf-8");
            allSessions.push({
              id: file.name,
              ide: "copilot-cli",
              ideName: "GitHub Copilot CLI",
              title: "Command Line History: " + file.name,
              lastModified: statSync(resolve(cliPath, file.name)).mtimeMs,
              dataType: "json",
              contentPreview: content.substring(0, 200)
            });
          }
        }
      } catch (e) {
        console.error("Error reading CLI sessions:", e);
      }
    }
    if (ideFilter) {
      const filterMap = {
        "Visual Studio Code": ["vscode"],
        "Visual Studio Code Insider": ["vscode-insider"],
        "SQL Server Management Studio": ["ssms"],
        "GitHub Copilot CLI": ["copilot-cli"]
      };
      const ideIds = filterMap[ideFilter] || [];
      allSessions = allSessions.filter((s) => ideIds.includes(s.ide));
    }
    allSessions.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));
    const byIDE = {};
    for (const s of allSessions) {
      byIDE[s.ideName] = (byIDE[s.ideName] || 0) + 1;
    }
    return {
      success: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      totalSessions: allSessions.length,
      summary: {
        byIDE
      },
      sessions: allSessions.slice(0, 50),
      // Limit to 50 for API response
      _metadata: {
        dynamic: true,
        autoScans: ["VS Code", "VS Code Insider", "SSMS", "GitHub Copilot CLI"],
        newFilesDetected: "Automatically included on next request"
      }
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      sessions: []
    };
  }
});

export { dynamicChatSessions as default };
//# sourceMappingURL=dynamic-chat-sessions.mjs.map
