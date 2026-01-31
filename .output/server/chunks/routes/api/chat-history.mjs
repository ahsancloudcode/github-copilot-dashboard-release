import { c as defineEventHandler, g as getQuery, u as useRuntimeConfig, e as createError } from '../../_/nitro.mjs';
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

const chatHistory = defineEventHandler(async (event) => {
  const logger = console;
  try {
    const query = getQuery(event);
    const isMocked = query.mock === "true" || useRuntimeConfig().public.isDataMocked;
    if (isMocked) {
      const mockData = await $fetch("/mock-data/chat_sessions_sample.json");
      return {
        sessions: mockData,
        total: mockData.length,
        date_range: {
          since: query.since || "2025-12-19",
          until: query.until || (/* @__PURE__ */ new Date()).toISOString()
        }
      };
    }
    logger.warn("Chat history API: Real data endpoint not yet implemented. Using mock data.");
    return {
      sessions: [],
      total: 0,
      date_range: {
        since: query.since || (/* @__PURE__ */ new Date()).toISOString(),
        until: query.until || (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  } catch (error) {
    logger.error("Error fetching chat history:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching chat history: " + errorMessage
    });
  }
});

export { chatHistory as default };
//# sourceMappingURL=chat-history.mjs.map
