import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import { readFile, readdir } from 'fs/promises';
import { existsSync, statSync } from 'fs';
import { resolve, basename } from 'path';
import { homedir } from 'os';
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

const appData = process.env.APPDATA || resolve(homedir(), "AppData", "Roaming");
const localAppData = process.env.LOCALAPPDATA || resolve(homedir(), "AppData", "Local");
const home = homedir();
function isCopilotFolder(folderName, filePath) {
  const lowerName = folderName.toLowerCase();
  const copilotKeywords = [
    "copilot",
    "chat",
    "github",
    "suggestion",
    "emptychat",
    "history",
    "context",
    "logs",
    "cache"
  ];
  return copilotKeywords.some((keyword) => lowerName.includes(keyword));
}
function getDataType(folderName) {
  const lower = folderName.toLowerCase();
  if (lower.includes("chat") || lower.includes("session")) return "chat";
  if (lower.includes("log")) return "logs";
  if (lower.includes("config") || lower.includes("state")) return "config";
  if (lower.includes("cache") || lower.includes("suggest")) return "cache";
  return "unknown";
}
async function scanFolder(folderPath, maxDepth = 3, currentDepth = 0, parentIsCopilot = false) {
  var _a;
  if (currentDepth >= maxDepth || !existsSync(folderPath)) {
    return [];
  }
  const nodes = [];
  try {
    const entries = await readdir(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".copilot") {
        continue;
      }
      const fullPath = resolve(folderPath, entry.name);
      const isCopilot = isCopilotFolder(entry.name, fullPath);
      try {
        const stats = statSync(fullPath);
        if (entry.isDirectory()) {
          const children = await scanFolder(fullPath, maxDepth, currentDepth + 1, isCopilot || parentIsCopilot);
          nodes.push({
            id: fullPath,
            name: entry.name,
            path: fullPath,
            type: "folder",
            hasChildren: children.length > 0 || currentDepth < maxDepth - 1,
            children: children.length > 0 ? children : void 0,
            isCopilotRelated: isCopilot || parentIsCopilot,
            fileCount: children.length,
            dataType: isCopilot ? getDataType(entry.name) : void 0
          });
        } else if (entry.isFile()) {
          const ext = (_a = entry.name.split(".").pop()) == null ? void 0 : _a.toLowerCase();
          if (["json", "log", "txt", "md"].includes(ext || "")) {
            nodes.push({
              id: fullPath,
              name: entry.name,
              path: fullPath,
              type: "file",
              hasChildren: false,
              isCopilotRelated: isCopilot || parentIsCopilot
            });
          }
        }
      } catch (error) {
        console.error(`Error scanning ${fullPath}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${folderPath}:`, error);
  }
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
async function buildIDEStructure(ideId, name, icon, color, rootPath) {
  if (!existsSync(rootPath)) {
    return null;
  }
  try {
    const rootFolders = await scanFolder(rootPath, 2);
    const countCopilotFolders = (nodes) => {
      return nodes.reduce((count, node) => {
        const current = node.isCopilotRelated ? 1 : 0;
        const children = node.children ? countCopilotFolders(node.children) : 0;
        return count + current + children;
      }, 0);
    };
    return {
      id: ideId,
      name,
      icon,
      color,
      rootPath,
      rootFolders,
      totalFiles: rootFolders.length,
      copilotFoldersCount: countCopilotFolders(rootFolders)
    };
  } catch (error) {
    console.error(`Error building structure for ${name}:`, error);
    return null;
  }
}
async function loadFolderContent(folderPath) {
  if (!existsSync(folderPath)) {
    return { error: "Folder not found", path: folderPath };
  }
  try {
    const stats = statSync(folderPath);
    if (!stats.isDirectory()) {
      try {
        const content = await readFile(folderPath, "utf-8");
        return {
          type: "file",
          path: folderPath,
          name: basename(folderPath),
          size: stats.size,
          content: content.substring(0, 1e3)
          // First 1000 chars
        };
      } catch (error) {
        return {
          type: "file",
          path: folderPath,
          name: basename(folderPath),
          size: stats.size,
          cannotRead: "Binary or locked file"
        };
      }
    }
    const entries = await readdir(folderPath, { withFileTypes: true });
    const items = [];
    for (const entry of entries) {
      const fullPath = resolve(folderPath, entry.name);
      const entryStats = statSync(fullPath);
      items.push({
        name: entry.name,
        type: entry.isDirectory() ? "folder" : "file",
        size: entryStats.size,
        modified: entryStats.mtime,
        isCopilot: isCopilotFolder(entry.name, fullPath)
      });
    }
    return {
      type: "folder",
      path: folderPath,
      name: basename(folderPath),
      itemCount: items.length,
      items: items.sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error", path: folderPath };
  }
}
const folderExplorer = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const action = query.action;
  const idePath = query.path;
  try {
    if (action === "load" && idePath) {
      const decodedPath = decodeURIComponent(idePath);
      const content = await loadFolderContent(decodedPath);
      return {
        success: true,
        action: "load",
        data: content
      };
    }
    const ides = [];
    const vscodeInsiderPath = resolve(appData, "Code - Insiders", "User");
    const vscodeInsider = await buildIDEStructure(
      "vscode-insider",
      "Visual Studio Code Insider",
      "mdi-microsoft-visual-studio-code",
      "#3499DB",
      vscodeInsiderPath
    );
    if (vscodeInsider) ides.push(vscodeInsider);
    const vscodePath = resolve(appData, "Code", "User");
    const vscode = await buildIDEStructure(
      "vscode",
      "Visual Studio Code",
      "mdi-microsoft-visual-studio-code",
      "#007ACC",
      vscodePath
    );
    if (vscode) ides.push(vscode);
    const vsPath = resolve(localAppData, "Microsoft", "VisualStudio");
    const vs = await buildIDEStructure(
      "visualstudio",
      "Visual Studio 2022",
      "mdi-microsoft-visual-studio",
      "#7B3FF2",
      vsPath
    );
    if (vs) ides.push(vs);
    const ssmsPath = resolve(localAppData, "SSMSCopilot");
    const ssms = await buildIDEStructure(
      "ssms",
      "SQL Server Management Studio",
      "mdi-database",
      "#CC2927",
      ssmsPath
    );
    if (ssms) ides.push(ssms);
    const cliPath = resolve(home, ".copilot");
    const cli = await buildIDEStructure(
      "copilot-cli",
      "GitHub Copilot CLI",
      "mdi-console",
      "#24292E",
      cliPath
    );
    if (cli) ides.push(cli);
    return {
      success: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      totalIDEs: ides.length,
      ides: ides.map((ide) => ({
        id: ide.id,
        name: ide.name,
        icon: ide.icon,
        color: ide.color,
        rootPath: ide.rootPath,
        totalItems: ide.totalFiles,
        copilotFoldersCount: ide.copilotFoldersCount,
        folders: ide.rootFolders
      }))
    };
  } catch (error) {
    console.error("Error in folder-explorer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
});

export { folderExplorer as default };
//# sourceMappingURL=folder-explorer.mjs.map
