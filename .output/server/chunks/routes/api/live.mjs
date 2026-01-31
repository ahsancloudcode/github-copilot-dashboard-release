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

const live = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  return {
    status: "alive",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: config.public.version,
    pid: process.pid,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  };
});

export { live as default };
//# sourceMappingURL=live.mjs.map
