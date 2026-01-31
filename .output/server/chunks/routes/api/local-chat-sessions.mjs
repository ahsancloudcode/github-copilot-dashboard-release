import { c as defineEventHandler, g as getQuery, u as useRuntimeConfig } from '../../_/nitro.mjs';
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
        const response = await fetch(`${base}/api/ide-paths`, { cache: "no-store" });
        if (!response.ok) {
          console.warn("Extension API not available at", base, response.status);
          continue;
        }
        const data = await response.json();
        return data.paths;
      } catch (error) {
        console.warn("Could not fetch paths from extension at", base, error);
        continue;
      }
    }
    return null;
  } catch (error) {
    console.warn("Could not fetch paths from extension:", error);
    return null;
  }
}
async function getPromptsFromExtension(event) {
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
        const response = await fetch(`${base}/api/prompts`, { cache: "no-store" });
        if (!response.ok) {
          console.warn("Extension prompts API not available at", base, response.status);
          continue;
        }
        return await response.json();
      } catch (error) {
        console.warn("Could not fetch prompts from extension at", base, error);
        continue;
      }
    }
    return null;
  } catch (error) {
    console.warn("Could not fetch prompts from extension:", error);
    return null;
  }
}
const localChatSessions = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filterUsername = query.username;
    const filterIDE = query.ide;
    const extensionPaths = await getIDEPathsFromExtension(event) || {};
    let demoMode = !Object.keys(extensionPaths).length;
    if (demoMode) {
      return {
        sessions: [],
        total: 0,
        totalUnfiltered: 0,
        demoMode: true,
        requiresExtension: true,
        message: "Extension API not reachable. Install/enable the GitHub Copilot Prompts extension in VS Code to load local chat sessions."
      };
    }
    const allSessions = [];
    const homeDir = os.homedir();
    const appData = process.env.APPDATA || join(homeDir, "AppData", "Roaming");
    const localAppData = process.env.LOCALAPPDATA || join(homeDir, "AppData", "Local");
    const normalized = {
      vscode: extensionPaths.vscode || join(appData, "Code", "User"),
      vscodeInsider: extensionPaths["vscode-insider"] || extensionPaths.vscodeInsiders || join(appData, "Code - Insiders", "User"),
      copilotCli: extensionPaths["copilot-cli"] || extensionPaths.cli || join(homeDir, ".copilot"),
      ssms: extensionPaths.ssms || join(localAppData, "SSMSCopilot"),
      visualstudio: extensionPaths.visualstudio || join(localAppData, "Microsoft", "VisualStudio"),
      jetbrains: extensionPaths["jetbrains"] || join(appData, "JetBrains")
    };
    const vscodeBasePath = normalized.vscode;
    if (!vscodeBasePath) {
      return {
        sessions: [],
        total: 0,
        totalUnfiltered: 0,
        error: "No VS Code path provided by extension"
      };
    }
    const emptyWindowPath = join(
      vscodeBasePath,
      "globalStorage",
      "emptyWindowChatSessions"
    );
    try {
      const files = await readdir(emptyWindowPath);
      const jsonFiles = files.filter((file) => file.endsWith(".json"));
      for (const file of jsonFiles) {
        const session = await readSessionFile(join(emptyWindowPath, file), file, "Global");
        if (session) allSessions.push(session);
      }
    } catch (error) {
      console.warn("Could not read emptyWindowChatSessions:", error);
    }
    const copilotChatPath = join(vscodeBasePath, "globalStorage", "github.copilot-chat");
    try {
      const files = await readdir(copilotChatPath);
      const jsonFiles = files.filter((file) => file.endsWith(".json"));
      for (const file of jsonFiles) {
        const session = await readSessionFile(join(copilotChatPath, file), file, "VS Code Copilot Chat");
        if (session) {
          session.ide = "Visual Studio Code";
          session.source = "Visual Studio Code";
          allSessions.push(session);
        }
      }
    } catch {
    }
    const workspaceStoragePath = join(
      vscodeBasePath,
      "workspaceStorage"
    );
    try {
      const workspaceDirs = await readdir(workspaceStoragePath);
      for (const wsDir of workspaceDirs) {
        const chatSessionsPath = join(workspaceStoragePath, wsDir, "chatSessions");
        try {
          const files = await readdir(chatSessionsPath);
          const jsonFiles = files.filter((file) => file.endsWith(".json"));
          for (const file of jsonFiles) {
            const session = await readSessionFile(join(chatSessionsPath, file), file, "Workspace");
            if (session) allSessions.push(session);
          }
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      console.warn("Could not read workspaceStorage:", error);
    }
    const vscodeInsiderBasePath = normalized.vscodeInsider;
    if (!vscodeInsiderBasePath) {
      console.log("VS Code Insider path not provided by extension");
    }
    const codeInsidersPath = vscodeInsiderBasePath ? join(
      vscodeInsiderBasePath,
      "globalStorage",
      "emptyWindowChatSessions"
    ) : null;
    if (codeInsidersPath) {
      try {
        const files = await readdir(codeInsidersPath);
        const jsonFiles = files.filter((file) => file.endsWith(".json"));
        for (const file of jsonFiles) {
          const session = await readSessionFile(join(codeInsidersPath, file), file, "Global");
          if (session) {
            session.ide = "Visual Studio Code Insider";
            session.source = "Visual Studio Code Insider";
            allSessions.push(session);
          }
        }
      } catch (error) {
        console.warn("Could not read VS Code Insider sessions:", error);
      }
    }
    if (vscodeInsiderBasePath) {
      const insidersCopilotChatPath = join(vscodeInsiderBasePath, "globalStorage", "github.copilot-chat");
      try {
        const files = await readdir(insidersCopilotChatPath);
        const jsonFiles = files.filter((file) => file.endsWith(".json"));
        for (const file of jsonFiles) {
          const session = await readSessionFile(join(insidersCopilotChatPath, file), file, "VS Code Insiders Copilot Chat");
          if (session) {
            session.ide = "Visual Studio Code Insider";
            session.source = "Visual Studio Code Insider";
            allSessions.push(session);
          }
        }
      } catch {
      }
    }
    const cliBasePath = normalized.copilotCli;
    const cliPath = cliBasePath ? join(cliBasePath, "history-session-state") : null;
    if (cliPath) {
      try {
        const files = await readdir(cliPath);
        const jsonFiles = files.filter((file) => file.endsWith(".json"));
        for (const file of jsonFiles) {
          const content = await readFile(join(cliPath, file), "utf-8");
          const data = JSON.parse(content);
          if (data.sessions && Array.isArray(data.sessions)) {
            for (const cliSession of data.sessions) {
              if (cliSession.title) {
                const session = {
                  id: `cli_${file}_${cliSession.title}`,
                  title: cliSession.title || "GitHub Copilot CLI Session",
                  description: cliSession.title || "Command-line interaction with GitHub Copilot",
                  tags: ["Copilot CLI", "Command-Line"],
                  start_date: (/* @__PURE__ */ new Date()).toISOString(),
                  end_date: (/* @__PURE__ */ new Date()).toISOString(),
                  source: "GitHub Copilot CLI",
                  ide: "GitHub Copilot CLI",
                  username: "Unknown",
                  prompt_count: 1,
                  prompts: [
                    {
                      type: "user",
                      text: cliSession.title,
                      timestamp: (/* @__PURE__ */ new Date()).getTime()
                    }
                  ]
                };
                allSessions.push(session);
              }
            }
          }
        }
      } catch (error) {
        console.warn("Could not read Copilot CLI history:", error);
      }
    }
    const ssmsPath = normalized.ssms;
    if (ssmsPath) {
      try {
        const files = await readdir(ssmsPath);
        const logFiles = files.filter((file) => file.endsWith(".log"));
        for (const file of logFiles) {
          const session = await readSSMSLogFile(join(ssmsPath, file), file);
          if (session) allSessions.push(session);
        }
      } catch (error) {
        console.warn("Could not read SSMS Copilot logs:", error);
      }
    }
    allSessions.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
    let filteredSessions = allSessions;
    if (filterUsername && filterUsername.toLowerCase() !== "unknown") {
      filteredSessions = filteredSessions.filter(
        (s) => !s.username || s.username.toLowerCase() === "unknown" || s.username.toLowerCase() === filterUsername.toLowerCase()
      );
    }
    if (filterIDE) {
      filteredSessions = filteredSessions.filter(
        (s) => s.ide && s.ide.toLowerCase().includes(filterIDE.toLowerCase())
      );
    }
    const shouldTryExtensionPrompts = (ideName) => {
      if (!ideName) return false;
      const n = ideName.toLowerCase();
      if (n.includes("visual studio code")) return false;
      return n.includes("cursor") || n.includes("jetbrains") || n.includes("sql server") || n.includes("management studio") || n.includes("mysql") || (n === "github cli" || n.includes("github cli")) || n.includes("copilot prompts") || n.includes("copilot cli") || (n === "visual studio" || n.includes("visual studio") && !n.includes("code"));
    };
    if (filteredSessions.length === 0 && shouldTryExtensionPrompts(filterIDE)) {
      const ext = await getPromptsFromExtension(event);
      const extPrompts = (ext == null ? void 0 : ext.prompts) || (ext == null ? void 0 : ext.data);
      if (Array.isArray(extPrompts) && extPrompts.length > 0) {
        demoMode = false;
        const matchesSelectedIDE = (p) => {
          if (!filterIDE) return true;
          const needle = String(filterIDE).toLowerCase();
          const hay = `${(p == null ? void 0 : p.source) || ""} ${(p == null ? void 0 : p.editor) || ""} ${(p == null ? void 0 : p.type) || ""}`.toLowerCase();
          if (needle.includes("cursor")) return hay.includes("cursor");
          if (needle.includes("jetbrains")) return hay.includes("jetbrains");
          if (needle.includes("mysql")) return hay.includes("mysql");
          if (needle === "github cli" || needle.includes("github cli")) return hay.includes("github cli");
          if (needle.includes("copilot prompts")) return hay.includes(".copilotprompts") || hay.includes("copilot prompts");
          if (needle.includes("copilot cli")) return hay.includes("copilot cli") || hay.includes("cli");
          if (needle.includes("management studio") || needle.includes("sql server")) return hay.includes("ssms") || hay.includes("management studio");
          if (needle === "visual studio" || needle.includes("visual studio") && !needle.includes("code")) return hay.includes("visual studio");
          return hay.includes(needle);
        };
        const toIso = (ts) => {
          if (!ts) return (/* @__PURE__ */ new Date()).toISOString();
          const d = new Date(ts);
          return isNaN(d.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : d.toISOString();
        };
        const synthesized = extPrompts.filter(matchesSelectedIDE).slice(0, 500).map((p) => {
          var _a, _b, _c;
          const promptText = (p == null ? void 0 : p.prompt) || (p == null ? void 0 : p.command) || ((_a = p == null ? void 0 : p.metadata) == null ? void 0 : _a.prompt) || ((_b = p == null ? void 0 : p.metadata) == null ? void 0 : _b.text) || "";
          const responseText = (p == null ? void 0 : p.response) || ((_c = p == null ? void 0 : p.metadata) == null ? void 0 : _c.response) || "";
          const timestamp = toIso(p == null ? void 0 : p.timestamp);
          const prompts = [];
          if (promptText) {
            prompts.push({ type: "user", text: String(promptText), timestamp });
          }
          if (responseText) {
            prompts.push({ type: "assistant", text: String(responseText), timestamp });
          }
          return {
            id: (p == null ? void 0 : p.id) || `ext_${Math.random().toString(36).slice(2)}`,
            title: promptText ? String(promptText).slice(0, 80) : "Copilot Interaction",
            description: promptText ? String(promptText).slice(0, 240) : "No description",
            tags: [(p == null ? void 0 : p.source) || "Extension", (p == null ? void 0 : p.type) || "unknown"].filter(Boolean),
            start_date: timestamp,
            end_date: timestamp,
            source: filterIDE || (p == null ? void 0 : p.source) || "Extension",
            ide: filterIDE || "Unknown",
            username: filterUsername || "Unknown",
            prompt_count: prompts.filter((x) => x.type === "user").length,
            prompts
          };
        });
        return {
          sessions: synthesized,
          total: synthesized.length,
          totalUnfiltered: synthesized.length,
          demoMode
        };
      }
    }
    return {
      sessions: filteredSessions,
      total: filteredSessions.length,
      totalUnfiltered: allSessions.length,
      demoMode
    };
  } catch (error) {
    console.error("Error reading local chat sessions:", error);
    return {
      sessions: [],
      total: 0,
      error: "Could not read local chat sessions"
    };
  }
});
async function readSessionFile(filePath, fileName, source, ideOverride) {
  var _a, _b, _c, _d, _e, _f, _g;
  try {
    const content = await readFile(filePath, "utf-8");
    const sessionData = JSON.parse(content);
    if (sessionData.requests && sessionData.requests.length > 0) {
      const prompts = [];
      for (const req of sessionData.requests) {
        const userPrompt = ((_a = req.message) == null ? void 0 : _a.text) || ((_d = (_c = (_b = req.message) == null ? void 0 : _b.parts) == null ? void 0 : _c[0]) == null ? void 0 : _d.text) || "";
        const userTimestamp = req.timestamp || ((_e = req.message) == null ? void 0 : _e.timestamp) || Date.now();
        if (userPrompt) {
          prompts.push({
            type: "user",
            text: userPrompt,
            timestamp: userTimestamp
          });
        }
        if (req.response && Array.isArray(req.response)) {
          for (const resp of req.response) {
            if (resp.value && typeof resp.value === "string") {
              prompts.push({
                type: "assistant",
                text: resp.value,
                timestamp: userTimestamp + 1e3
                // Add 1 second after user prompt
              });
            }
          }
        }
      }
      const session = {
        id: sessionData.sessionId || fileName.replace(".json", ""),
        title: sessionData.customTitle || ((_f = prompts.find((p) => p.type === "user")) == null ? void 0 : _f.text) || "Untitled Session",
        description: ((_g = prompts.find((p) => p.type === "user")) == null ? void 0 : _g.text) || "No description",
        tags: ["Copilot Chat", sessionData.requesterUsername || "User", source],
        start_date: new Date(sessionData.creationDate || Date.now()).toISOString(),
        end_date: new Date(sessionData.lastMessageDate || Date.now()).toISOString(),
        source: ideOverride || source,
        ide: ideOverride || (source === "Global" ? "Visual Studio Code" : "Visual Studio Code"),
        username: sessionData.requesterUsername || "Unknown",
        prompt_count: prompts.filter((p) => p.type === "user").length,
        prompts
      };
      return session;
    }
    return null;
  } catch (fileError) {
    console.error(`Error reading file ${fileName}:`, fileError);
    return null;
  }
}
async function readSSMSLogFile(filePath, fileName) {
  var _a;
  try {
    const content = await readFile(filePath, "utf-8");
    const lines = content.split("\n");
    const prompts = [];
    let sessionStartTime = "";
    let sessionEndTime = "";
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const timeMatch = line.match(/DateTime=(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
      if (timeMatch) {
        if (!sessionStartTime) {
          sessionStartTime = timeMatch[1];
        }
        sessionEndTime = timeMatch[1];
      }
      if (line.includes("Prompt received:")) {
        let promptTime = sessionEndTime;
        const currentTimeMatch = line.match(/DateTime=(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
        if (currentTimeMatch) {
          promptTime = currentTimeMatch[1];
        }
        let j = i + 1;
        let promptText = "";
        while (j < lines.length) {
          const nextLine = lines[j];
          if (nextLine.includes("SqlCopilotServerTracer") || nextLine.includes("DateTime=")) {
            break;
          }
          const trimmed = nextLine.trim();
          if (trimmed) {
            promptText += (promptText ? " " : "") + trimmed;
          }
          j++;
        }
        if (promptText.trim()) {
          prompts.push({
            type: "user",
            text: promptText.trim(),
            timestamp: (/* @__PURE__ */ new Date(promptTime + "Z")).getTime()
          });
          prompts.push({
            type: "assistant",
            text: "[Response generated by GitHub Copilot in SSMS - Full response not stored in logs]",
            timestamp: (/* @__PURE__ */ new Date(promptTime + "Z")).getTime() + 5e3
          });
        }
      }
    }
    if (prompts.length === 0) {
      return null;
    }
    const firstUserPrompt = ((_a = prompts.find((p) => p.type === "user")) == null ? void 0 : _a.text) || "SSMS Query";
    const cleanedTitle = firstUserPrompt.substring(0, 80);
    const session = {
      id: fileName.replace(".log", ""),
      title: cleanedTitle,
      description: firstUserPrompt.substring(0, 120),
      tags: ["Copilot Chat", "SSMS", "SQL"],
      start_date: sessionStartTime ? (/* @__PURE__ */ new Date(sessionStartTime + "Z")).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      end_date: sessionEndTime ? (/* @__PURE__ */ new Date(sessionEndTime + "Z")).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      source: "SSMS",
      ide: "SQL Server Management Studio",
      username: "Unknown",
      prompt_count: prompts.filter((p) => p.type === "user").length,
      prompts
    };
    return session;
  } catch (fileError) {
    console.error(`Error reading SSMS log file ${fileName}:`, fileError);
    return null;
  }
}

export { localChatSessions as default };
//# sourceMappingURL=local-chat-sessions.mjs.map
