import { c as defineEventHandler, u as useRuntimeConfig } from '../../_/nitro.mjs';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import * as os from 'os';
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

async function getIDEPathsFromExtension(event) {
  var _a, _b, _c, _d;
  try {
    const config = useRuntimeConfig();
    const candidates = [];
    if ((_a = config.public) == null ? void 0 : _a.localApiUrl) candidates.push(config.public.localApiUrl);
    candidates.push("http://127.0.0.1:3001", "http://localhost:3001", "http://host.docker.internal:3001");
    const hostHeader = (_d = (_c = (_b = event.node) == null ? void 0 : _b.req) == null ? void 0 : _c.headers) == null ? void 0 : _d.host;
    if (hostHeader) {
      const hostnameOnly = String(hostHeader).split(":")[0];
      candidates.push(`http://${hostnameOnly}:3001`);
    }
    const unique = [...new Set(candidates)];
    for (const base of unique) {
      try {
        console.log("[Extension API] Fetching IDE paths from", base);
        const resp = await fetch(`${base}/api/ide-paths`);
        if (!resp.ok) {
          console.warn("[Extension API] Not available at", base, resp.status);
          continue;
        }
        const data = await resp.json();
        return data.paths;
      } catch (err) {
        console.warn("[Extension API] Could not fetch paths from", base, err);
        continue;
      }
    }
    console.warn("[Extension API] Could not reach extension on any candidate host:", unique);
    return null;
  } catch (error) {
    console.warn("Could not fetch paths from extension:", error);
    return null;
  }
}
const githubUserInfo = defineEventHandler(async (event) => {
  try {
    let githubUsername = null;
    let installedIDEs = [];
    const extensionPaths = await getIDEPathsFromExtension(event) || {};
    const demoMode = !Object.keys(extensionPaths).length;
    if (demoMode) {
      return {
        success: true,
        githubUsername: os.userInfo().username || "Unknown User",
        installedIDEs: [],
        demoMode: true,
        requiresExtension: true,
        message: "Extension API not reachable. Install/enable the GitHub Copilot Prompts extension in VS Code to load local IDE data."
      };
    }
    const homeDir = os.homedir();
    const appData = process.env.APPDATA || join(homeDir, "AppData", "Roaming");
    const localAppData = process.env.LOCALAPPDATA || join(homeDir, "AppData", "Local");
    const normalized = {
      vscode: extensionPaths.vscode || join(appData, "Code", "User"),
      vscodeInsider: extensionPaths["vscode-insider"] || extensionPaths.vscodeInsiders || join(appData, "Code - Insiders", "User"),
      cursor: extensionPaths.cursor || join(appData, "Cursor", "User"),
      githubCli: extensionPaths["github-cli"] || join(appData, "GitHub CLI"),
      mysqlWorkbench: extensionPaths["mysql-workbench"] || join(appData, "MySQL", "Workbench"),
      copilotCli: extensionPaths["copilot-cli"] || extensionPaths.cli || join(homeDir, ".copilot"),
      copilotPrompts: extensionPaths["copilot-prompts"] || join(homeDir, ".copilotprompts"),
      ssms: extensionPaths.ssms || join(localAppData, "SSMSCopilot"),
      visualstudio: extensionPaths.visualstudio || join(localAppData, "Microsoft", "VisualStudio"),
      jetbrains: extensionPaths["jetbrains"] || join(appData, "JetBrains")
    };
    const vscodeBasePath = normalized.vscode;
    if (!vscodeBasePath) {
      return {
        success: true,
        githubUsername: os.userInfo().username || "Unknown User",
        installedIDEs: [],
        error: "No VS Code path provided by extension"
      };
    }
    const workspaceStoragePath = join(
      vscodeBasePath,
      "workspaceStorage"
    );
    try {
      const workspaceDirs = await readdir(workspaceStoragePath);
      for (const wsDir of workspaceDirs.slice(0, 5)) {
        const chatSessionsPath = join(workspaceStoragePath, wsDir, "chatSessions");
        try {
          const files = await readdir(chatSessionsPath);
          const jsonFiles = files.filter((file) => file.endsWith(".json"));
          if (jsonFiles.length > 0) {
            const sessionFile = join(chatSessionsPath, jsonFiles[0]);
            const content = await readFile(sessionFile, "utf-8");
            const sessionData = JSON.parse(content);
            if (sessionData.requesterUsername) {
              githubUsername = sessionData.requesterUsername;
              break;
            }
          }
        } catch {
          continue;
        }
      }
    } catch (error) {
      console.warn("Could not read workspace storage:", error);
    }
    if (!githubUsername) {
      try {
        githubUsername = os.userInfo().username;
      } catch {
        githubUsername = "Unknown User";
      }
    }
    const ideChecks = [];
    if (normalized.vscode) {
      ideChecks.push({
        name: "Visual Studio Code",
        path: normalized.vscode,
        icon: "mdi-microsoft-visual-studio-code",
        color: "#007ACC",
        hasCopilot: true
      });
    }
    if (normalized.vscodeInsider) {
      ideChecks.push({
        name: "Visual Studio Code Insider",
        path: normalized.vscodeInsider,
        icon: "mdi-microsoft-visual-studio-code",
        color: "#3499DB",
        hasCopilot: true
      });
    }
    if (normalized.cursor) {
      ideChecks.push({
        name: "Cursor",
        path: normalized.cursor,
        icon: "mdi-cursor-default-outline",
        color: "#111827",
        hasCopilot: true
      });
    }
    if (normalized.githubCli) {
      ideChecks.push({
        name: "GitHub CLI",
        path: normalized.githubCli,
        icon: "mdi-github",
        color: "#24292E",
        hasCopilot: false
      });
    }
    if (normalized.copilotCli) {
      ideChecks.push({
        name: "GitHub Copilot CLI",
        path: normalized.copilotCli,
        icon: "mdi-console",
        color: "#24292E",
        hasCopilot: true
      });
    }
    if (normalized.copilotPrompts) {
      ideChecks.push({
        name: "Copilot Prompts Folder",
        path: normalized.copilotPrompts,
        icon: "mdi-folder-text-outline",
        color: "#4B5563",
        hasCopilot: true
      });
    }
    if (normalized.ssms) {
      ideChecks.push({
        name: "SQL Server Management Studio",
        path: normalized.ssms,
        icon: "mdi-database",
        color: "#CC2927",
        hasCopilot: true
      });
    }
    if (normalized.mysqlWorkbench) {
      ideChecks.push({
        name: "MySQL Workbench",
        path: normalized.mysqlWorkbench,
        icon: "mdi-database-outline",
        color: "#00758F",
        hasCopilot: true
      });
    }
    if (normalized.visualstudio) {
      ideChecks.push({
        name: "Visual Studio",
        path: normalized.visualstudio,
        icon: "mdi-microsoft-visual-studio",
        color: "#5C2D91",
        // The extension collector can scan Visual Studio folders for Copilot-related artifacts.
        // Mark as enabled so users can select it in the UI.
        hasCopilot: true
      });
    }
    if (normalized.jetbrains) {
      ideChecks.push({
        name: "JetBrains IDEs",
        path: normalized.jetbrains,
        icon: "mdi-jet-engine",
        color: "#000000",
        hasCopilot: true
      });
    }
    for (const ide of ideChecks) {
      try {
        await readdir(ide.path);
        installedIDEs.push({
          name: ide.name,
          installed: true,
          path: ide.path,
          icon: ide.icon,
          color: ide.color,
          hasGitHubCopilot: ide.hasCopilot
        });
      } catch {
        installedIDEs.push({
          name: ide.name,
          installed: false,
          path: ide.path,
          icon: ide.icon,
          color: ide.color,
          hasGitHubCopilot: ide.hasCopilot
        });
      }
    }
    return {
      success: true,
      githubUsername: githubUsername || "Unknown User",
      installedIDEs,
      currentIDE: "Visual Studio Code",
      // Default to VS Code since we're reading from there
      demoMode
    };
  } catch (error) {
    console.error("Error getting GitHub user info:", error);
    return {
      success: false,
      error: error.message,
      githubUsername: "Unknown User",
      installedIDEs: []
    };
  }
});

export { githubUserInfo as default };
//# sourceMappingURL=github-user-info.mjs.map
