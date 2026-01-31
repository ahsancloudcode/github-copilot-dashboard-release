import { c as defineEventHandler } from '../../_/nitro.mjs';
import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, basename } from 'path';
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

const allInstalledIdes = defineEventHandler(async () => {
  try {
    let allIDEs = [];
    const ideProfiles = [
      // DEVELOPMENT IDEs
      {
        category: "Code Editors",
        ides: [
          {
            name: "Visual Studio Code",
            icon: "mdi-microsoft-visual-studio-code",
            color: "#007ACC",
            paths: [
              join(homedir(), "AppData", "Roaming", "Code"),
              join(homedir(), "AppData", "Roaming", "Code", "User")
            ],
            hasCopilot: true,
            copilotPlugin: "GitHub Copilot Extension"
          },
          {
            name: "Visual Studio Code Insider",
            icon: "mdi-microsoft-visual-studio-code",
            color: "#3499DB",
            paths: [
              join(homedir(), "AppData", "Roaming", "Code - Insiders"),
              join(homedir(), "AppData", "Roaming", "Code - Insiders", "User")
            ],
            hasCopilot: true,
            copilotPlugin: "GitHub Copilot Extension (Insider Build)"
          },
          {
            name: "Sublime Text 3",
            icon: "mdi-text-editor",
            color: "#FF7800",
            paths: [
              join(homedir(), "AppData", "Local", "Sublime Text 3"),
              join(homedir(), "AppData", "Local", "Sublime Text")
            ],
            hasCopilot: false,
            copilotPlugin: "N/A"
          },
          {
            name: "Notepad++",
            icon: "mdi-notepad",
            color: "#98C300",
            paths: [
              join(homedir(), "AppData", "Roaming", "Notepad++")
            ],
            hasCopilot: false,
            copilotPlugin: "N/A"
          },
          {
            name: "Atom",
            icon: "mdi-atom",
            color: "#66BB6A",
            paths: [
              join(homedir(), "AppData", "Local", "atom")
            ],
            hasCopilot: false,
            copilotPlugin: "Archived (no longer supported)"
          }
        ]
      },
      // FULL IDEs
      {
        category: "Full IDEs",
        ides: [
          {
            name: "Visual Studio 2022",
            icon: "mdi-microsoft-visual-studio",
            color: "#5C2D91",
            paths: [
              join(homedir(), "AppData", "Local", "Microsoft", "VisualStudio", "17.0_b5345e54"),
              join(homedir(), "AppData", "Local", "Microsoft", "VisualStudio")
            ],
            hasCopilot: true,
            copilotPlugin: "GitHub Copilot extension (cloud-synced)"
          },
          {
            name: "Visual Studio 2019",
            icon: "mdi-microsoft-visual-studio",
            color: "#5C2D91",
            paths: [
              join(homedir(), "AppData", "Local", "Microsoft", "VisualStudio", "16.0_*")
            ],
            hasCopilot: true,
            copilotPlugin: "GitHub Copilot extension"
          },
          {
            name: "SQL Server Management Studio",
            icon: "mdi-database",
            color: "#CC2927",
            paths: [
              join(homedir(), "AppData", "Local", "SSMSCopilot")
            ],
            hasCopilot: true,
            copilotPlugin: "SQL Copilot (integrated)"
          }
        ]
      },
      // DATABASE IDEs
      {
        category: "Database Tools",
        ides: [
          {
            name: "Azure Data Studio",
            icon: "mdi-database-outline",
            color: "#0078D4",
            paths: [
              join(homedir(), "AppData", "Roaming", "azuredatastudio")
            ],
            hasCopilot: true,
            copilotPlugin: "GitHub Copilot extension"
          },
          {
            name: "DataGrip",
            icon: "mdi-database-search",
            color: "#087CFA",
            paths: [
              join(homedir(), "AppData", "Roaming", "JetBrains", "DataGrip*")
            ],
            hasCopilot: true,
            copilotPlugin: "JetBrains AI (with Copilot)"
          }
        ]
      },
      // JETBRAINS IDEs
      {
        category: "JetBrains IDEs",
        ides: [
          {
            name: "IntelliJ IDEA",
            icon: "mdi-language-java",
            color: "#087CFA",
            paths: [
              join(homedir(), "AppData", "Roaming", "JetBrains", "IntelliJIdea*")
            ],
            hasCopilot: true,
            copilotPlugin: "JetBrains AI + GitHub Copilot"
          },
          {
            name: "PyCharm",
            icon: "mdi-language-python",
            color: "#3776AB",
            paths: [
              join(homedir(), "AppData", "Roaming", "JetBrains", "PyCharm*")
            ],
            hasCopilot: true,
            copilotPlugin: "JetBrains AI + GitHub Copilot"
          },
          {
            name: "WebStorm",
            icon: "mdi-language-javascript",
            color: "#F3C623",
            paths: [
              join(homedir(), "AppData", "Roaming", "JetBrains", "WebStorm*")
            ],
            hasCopilot: true,
            copilotPlugin: "JetBrains AI + GitHub Copilot"
          },
          {
            name: "Rider",
            icon: "mdi-language-csharp",
            color: "#68217A",
            paths: [
              join(homedir(), "AppData", "Roaming", "JetBrains", "Rider*")
            ],
            hasCopilot: true,
            copilotPlugin: "JetBrains AI + GitHub Copilot"
          },
          {
            name: "GoLand",
            icon: "mdi-language-go",
            color: "#00ADD8",
            paths: [
              join(homedir(), "AppData", "Roaming", "JetBrains", "GoLand*")
            ],
            hasCopilot: true,
            copilotPlugin: "JetBrains AI + GitHub Copilot"
          },
          {
            name: "CLion",
            icon: "mdi-language-cpp",
            color: "#1EC542",
            paths: [
              join(homedir(), "AppData", "Roaming", "JetBrains", "CLion*")
            ],
            hasCopilot: true,
            copilotPlugin: "JetBrains AI + GitHub Copilot"
          },
          {
            name: "RustRover",
            icon: "mdi-language-rust",
            color: "#CE4833",
            paths: [
              join(homedir(), "AppData", "Roaming", "JetBrains", "RustRover*")
            ],
            hasCopilot: true,
            copilotPlugin: "JetBrains AI + GitHub Copilot"
          }
        ]
      },
      // GITHUB COPILOT CLI
      {
        category: "Copilot CLI & Tools",
        ides: [
          {
            name: "GitHub Copilot CLI",
            icon: "mdi-console",
            color: "#24292E",
            paths: [
              join(homedir(), ".copilot"),
              join(homedir(), ".copilot", "history-session-state"),
              join(homedir(), ".copilot", "session-state")
            ],
            hasCopilot: true,
            copilotPlugin: "Command-line Interface for GitHub Copilot"
          }
        ]
      },
      // TERMINAL/EDITOR IDEs
      {
        category: "Terminal Editors",
        ides: [
          {
            name: "Vim/Neovim",
            icon: "mdi-vim",
            color: "#019833",
            paths: [
              join(homedir(), "AppData", "Local", "nvim"),
              join(homedir(), ".vim")
            ],
            hasCopilot: true,
            copilotPlugin: "copilot.vim plugin"
          }
        ]
      },
      // OPEN SOURCE IDEs
      {
        category: "Open Source IDEs",
        ides: [
          {
            name: "Eclipse IDE",
            icon: "mdi-eclipse",
            color: "#FF7800",
            paths: [
              join(homedir(), "AppData", "Roaming", "eclipse")
            ],
            hasCopilot: false,
            copilotPlugin: "No official support"
          },
          {
            name: "NetBeans",
            icon: "mdi-file-code",
            color: "#1B6AC6",
            paths: [
              join(homedir(), "AppData", "Roaming", "NetBeans")
            ],
            hasCopilot: false,
            copilotPlugin: "No official support"
          }
        ]
      },
      // WEB IDEs
      {
        category: "Web/Cloud IDEs",
        ides: [
          {
            name: "GitHub Codespaces",
            icon: "mdi-cloud-outline",
            color: "#24292E",
            paths: [
              "Cloud-based (no local storage)"
            ],
            hasCopilot: true,
            copilotPlugin: "Native support"
          },
          {
            name: "Replit",
            icon: "mdi-web",
            color: "#F26207",
            paths: [
              "Cloud-based (no local storage)"
            ],
            hasCopilot: true,
            copilotPlugin: "Available"
          }
        ]
      }
    ];
    for (const category of ideProfiles) {
      for (const ide of category.ides) {
        let found = false;
        let foundPath = "";
        for (const pathPattern of ide.paths) {
          if (pathPattern.includes("Cloud-based")) {
            continue;
          }
          try {
            if (existsSync(pathPattern)) {
              found = true;
              foundPath = pathPattern;
              break;
            }
            if (pathPattern.includes("*")) {
              const dirPath = pathPattern.split("*")[0];
              const parentDir = dirname(dirPath);
              const prefix = basename(dirPath);
              try {
                const items = await readdir(parentDir);
                const match = items.find((item) => item.startsWith(prefix));
                if (match) {
                  foundPath = join(parentDir, match);
                  found = true;
                  break;
                }
              } catch {
                continue;
              }
            }
          } catch {
            continue;
          }
        }
        allIDEs.push({
          category: category.category,
          name: ide.name,
          icon: ide.icon,
          color: ide.color,
          installed: found,
          path: foundPath || ide.paths[0],
          hasCopilot: ide.hasCopilot,
          copilotPlugin: ide.copilotPlugin,
          allPaths: ide.paths
        });
      }
    }
    allIDEs.sort((a, b) => {
      if (a.installed !== b.installed) {
        return b.installed ? 1 : -1;
      }
      return a.name.localeCompare(b.name);
    });
    const stats = {
      total: allIDEs.length,
      installed: allIDEs.filter((ide) => ide.installed).length,
      withCopilot: allIDEs.filter((ide) => ide.hasCopilot).length,
      withCopilotInstalled: allIDEs.filter((ide) => ide.installed && ide.hasCopilot).length
    };
    return {
      success: true,
      stats,
      ides: allIDEs
    };
  } catch (error) {
    console.error("Error getting all installed IDEs:", error);
    return {
      success: false,
      error: error.message,
      stats: {
        total: 0,
        installed: 0,
        withCopilot: 0,
        withCopilotInstalled: 0
      },
      ides: []
    };
  }
});

export { allInstalledIdes as default };
//# sourceMappingURL=all-installed-ides.mjs.map
