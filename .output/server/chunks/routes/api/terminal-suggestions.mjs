import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';
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
const terminalSuggestions = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const source = query.source;
  try {
    const extensionPaths = await getIDEPathsFromExtension();
    if (!extensionPaths) {
      console.log("\u{1F4CA} Demo Mode: Extension not providing paths for terminal suggestions");
      return {
        suggestions: {},
        demoMode: true,
        error: "Extension not running"
      };
    }
    const suggestions = {};
    if ((!source || source === "vscode-insider") && extensionPaths["vscode-insider"]) {
      const cacheFile = resolve(
        extensionPaths["vscode-insider"],
        "globalStorage",
        "vscode.terminal-suggest",
        "terminal-suggest",
        "terminalSuggestGlobalsCacheV2.json"
      );
      if (existsSync(cacheFile)) {
        try {
          const content = await readFile(cacheFile, "utf-8");
          const data = JSON.parse(content);
          suggestions["Visual Studio Code Insider"] = {
            source: "vscode.terminal-suggest",
            filePath: cacheFile,
            cacheVersion: "V2",
            data
          };
        } catch (error) {
          console.error("Error parsing VS Code Insider terminal suggestions:", error);
          suggestions["Visual Studio Code Insider"] = {
            error: "Failed to parse cache",
            filePath: cacheFile
          };
        }
      }
    }
    const processedSuggestions = {};
    let totalCommands = 0;
    let totalSuggestions = 0;
    for (const [ide, data] of Object.entries(suggestions)) {
      if (data.error) {
        processedSuggestions[ide] = data;
        continue;
      }
      const ideData = data.data;
      const shells = {};
      for (const [key, shell] of Object.entries(ideData)) {
        if (typeof shell === "object" && shell !== null && "commands" in shell) {
          const commands = shell.commands || [];
          shells[key] = {
            commandCount: commands.length,
            commands: commands.map((cmd) => ({
              label: cmd.label,
              detail: cmd.detail,
              kind: cmd.kind,
              // 2=builtin, 3=command
              definitionCommand: cmd.definitionCommand
            }))
          };
          totalCommands += commands.length;
          totalSuggestions += commands.length;
        }
      }
      processedSuggestions[ide] = {
        source: data.source,
        cacheVersion: data.cacheVersion,
        filePath: data.filePath,
        shellCount: Object.keys(shells).length,
        totalCommands,
        shells
      };
    }
    return {
      success: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      summary: {
        totalIDEs: Object.keys(processedSuggestions).length,
        totalCommands,
        totalSuggestions,
        source: source || "all"
      },
      suggestions: processedSuggestions,
      _description: "Terminal suggestions are cached commands from VS Code terminal that have been run or suggested"
    };
  } catch (error) {
    console.error("Error in terminal-suggestions API:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
});

export { terminalSuggestions as default };
//# sourceMappingURL=terminal-suggestions.mjs.map
