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

const health = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  return {
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: config.public.version,
    uptime: process.uptime()
  };
});

export { health as default };
//# sourceMappingURL=health.mjs.map
