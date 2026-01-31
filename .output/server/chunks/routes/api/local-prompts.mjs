import { c as defineEventHandler, u as useRuntimeConfig } from '../../_/nitro.mjs';
import 'fs';
import 'path';
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

const localPrompts = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
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
    const uniqueCandidates = [...new Set(candidates)];
    const method = ((_f = (_e = event.node) == null ? void 0 : _e.req) == null ? void 0 : _f.method) || "GET";
    for (const base of uniqueCandidates) {
      try {
        console.log(`[Local Prompts API] Trying extension at: ${base}`);
        if (method === "POST") {
          const response = await $fetch(`${base}/api/prompts/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });
          const promptList = response.data || response.prompts || [];
          const count = response.count || promptList.length;
          console.log(`[Local Prompts API] Refreshed ${count} prompts from ${base}`);
          return {
            success: true,
            data: promptList,
            count,
            source: "local-extension-api",
            host: base,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        } else {
          const response = await $fetch(`${base}/api/prompts`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
          const promptList = response.data || response.prompts || [];
          const count = response.count || promptList.length;
          console.log(`[Local Prompts API] Received ${count} prompts from ${base}`);
          return {
            success: true,
            data: promptList,
            count,
            source: "local-extension-api",
            host: base,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      } catch (err) {
        console.warn(`[Local Prompts API] Could not fetch from ${base}:`, (err == null ? void 0 : err.message) || err);
      }
    }
    console.error("[Local Prompts API] All extension hosts failed:", uniqueCandidates);
    return {
      success: false,
      data: [],
      count: 0,
      error: "Extension API not reachable on any known host.",
      message: "Make sure the GitHub Copilot Prompts Viewer extension is active in VS Code and accessible from this machine.",
      triedHosts: uniqueCandidates,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("[Local Prompts API] Unexpected error fetching prompts:", error.message || error);
    return {
      success: false,
      error: "Failed to fetch prompts",
      message: error.message || "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
});

export { localPrompts as default };
//# sourceMappingURL=local-prompts.mjs.map
