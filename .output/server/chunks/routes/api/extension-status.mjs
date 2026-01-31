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

const extensionStatus = defineEventHandler(async (event) => {
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
        console.log("[Extension Status] Checking", base);
        const resp = await fetch(`${base}/api/status`);
        if (!resp.ok) {
          console.warn("[Extension Status] Not available at", base, resp.status);
          continue;
        }
        const data = await resp.json();
        return {
          success: true,
          host: base,
          authenticated: !!data.authenticated,
          username: data.username || null,
          version: data.version || null,
          allowUnauthenticatedLocalAccess: !!data.allowUnauthenticatedLocalAccess,
          raw: data
        };
      } catch (err) {
        console.warn("[Extension Status] Error contacting", base, err);
        continue;
      }
    }
    return { success: false, error: "Extension API not reachable on any candidate host" };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
});

export { extensionStatus as default };
//# sourceMappingURL=extension-status.mjs.map
