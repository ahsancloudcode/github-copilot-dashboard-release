import { c as defineEventHandler, f as getMetricsData } from '../../_/nitro.mjs';
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

const githubStats = defineEventHandler(async (event) => {
  try {
    const metricsData = await getMetricsData(event);
    const stats = calculateGitHubStats(metricsData);
    return stats;
  } catch (error) {
    const logger = console;
    logger.error("Error in github-stats endpoint:", error);
    return new Response("Error fetching metrics data: " + (error instanceof Error ? error.message : String(error)), { status: 500 });
  }
});
function calculateGitHubStats(metrics) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const totals = metrics.reduce((acc, metric) => {
    var _a2, _b2, _c2, _d2, _e2;
    acc.totalIdeCodeCompletionUsers += ((_a2 = metric.copilot_ide_code_completions) == null ? void 0 : _a2.total_engaged_users) || 0;
    acc.totalIdeChatUsers += ((_b2 = metric.copilot_ide_chat) == null ? void 0 : _b2.total_engaged_users) || 0;
    acc.totalDotcomChatUsers += ((_c2 = metric.copilot_dotcom_chat) == null ? void 0 : _c2.total_engaged_users) || 0;
    acc.totalDotcomPRUsers += ((_d2 = metric.copilot_dotcom_pull_requests) == null ? void 0 : _d2.total_engaged_users) || 0;
    if ((_e2 = metric.copilot_dotcom_pull_requests) == null ? void 0 : _e2.repositories) {
      acc.totalPRSummariesCreated += metric.copilot_dotcom_pull_requests.repositories.reduce((repoSum, repo) => {
        var _a3;
        return repoSum + (((_a3 = repo.models) == null ? void 0 : _a3.reduce((modelSum, model) => {
          return modelSum + (model.total_pr_summaries_created || 0);
        }, 0)) || 0);
      }, 0);
    }
    return acc;
  }, {
    totalIdeCodeCompletionUsers: 0,
    totalIdeChatUsers: 0,
    totalDotcomChatUsers: 0,
    totalDotcomPRUsers: 0,
    totalPRSummariesCreated: 0
  });
  const modelSets = {
    ideCodeCompletion: /* @__PURE__ */ new Set(),
    ideChat: /* @__PURE__ */ new Set(),
    dotcomChat: /* @__PURE__ */ new Set(),
    dotcomPR: /* @__PURE__ */ new Set()
  };
  const modelMaps = {
    ideCodeCompletion: /* @__PURE__ */ new Map(),
    ideChat: /* @__PURE__ */ new Map(),
    dotcomChat: /* @__PURE__ */ new Map(),
    dotcomPR: /* @__PURE__ */ new Map()
  };
  for (const metric of metrics) {
    (_b = (_a = metric.copilot_ide_code_completions) == null ? void 0 : _a.editors) == null ? void 0 : _b.forEach((editor) => {
      var _a2;
      (_a2 = editor.models) == null ? void 0 : _a2.forEach((model) => {
        modelSets.ideCodeCompletion.add(model.name);
        const key = `${model.name}-${editor.name}`;
        if (!modelMaps.ideCodeCompletion.has(key)) {
          modelMaps.ideCodeCompletion.set(key, {
            name: model.name,
            editor: editor.name,
            model_type: model.is_custom_model ? "Custom" : "Default",
            total_engaged_users: 0
          });
        }
        modelMaps.ideCodeCompletion.get(key).total_engaged_users += model.total_engaged_users;
      });
    });
    (_d = (_c = metric.copilot_ide_chat) == null ? void 0 : _c.editors) == null ? void 0 : _d.forEach((editor) => {
      var _a2;
      (_a2 = editor.models) == null ? void 0 : _a2.forEach((model) => {
        modelSets.ideChat.add(model.name);
        const key = `${model.name}-${editor.name}`;
        if (!modelMaps.ideChat.has(key)) {
          modelMaps.ideChat.set(key, {
            name: model.name,
            editor: editor.name,
            model_type: model.is_custom_model ? "Custom" : "Default",
            total_engaged_users: 0,
            total_chats: 0,
            total_chat_insertion_events: 0,
            total_chat_copy_events: 0
          });
        }
        const entry = modelMaps.ideChat.get(key);
        entry.total_engaged_users += model.total_engaged_users;
        entry.total_chats += model.total_chats;
        entry.total_chat_insertion_events += model.total_chat_insertion_events;
        entry.total_chat_copy_events += model.total_chat_copy_events;
      });
    });
    (_f = (_e = metric.copilot_dotcom_chat) == null ? void 0 : _e.models) == null ? void 0 : _f.forEach((model) => {
      modelSets.dotcomChat.add(model.name);
      if (!modelMaps.dotcomChat.has(model.name)) {
        modelMaps.dotcomChat.set(model.name, {
          name: model.name,
          model_type: model.is_custom_model ? "Custom" : "Default",
          total_engaged_users: 0,
          total_chats: 0
        });
      }
      const entry = modelMaps.dotcomChat.get(model.name);
      entry.total_engaged_users += model.total_engaged_users;
      entry.total_chats += model.total_chats;
    });
    (_h = (_g = metric.copilot_dotcom_pull_requests) == null ? void 0 : _g.repositories) == null ? void 0 : _h.forEach((repo) => {
      var _a2;
      (_a2 = repo.models) == null ? void 0 : _a2.forEach((model) => {
        modelSets.dotcomPR.add(model.name);
        const key = `${model.name}-${repo.name}`;
        if (!modelMaps.dotcomPR.has(key)) {
          modelMaps.dotcomPR.set(key, {
            name: model.name,
            repository: repo.name,
            model_type: model.is_custom_model ? "Custom" : "Default",
            total_engaged_users: 0,
            total_pr_summaries_created: 0
          });
        }
        const entry = modelMaps.dotcomPR.get(key);
        entry.total_engaged_users += model.total_engaged_users;
        entry.total_pr_summaries_created += model.total_pr_summaries_created;
      });
    });
  }
  const labels = metrics.map((metric) => metric.date);
  const agentModeChartData = {
    labels,
    datasets: [
      {
        label: "IDE Code Completions",
        data: metrics.map((metric) => {
          var _a2;
          return ((_a2 = metric.copilot_ide_code_completions) == null ? void 0 : _a2.total_engaged_users) || 0;
        }),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1
      },
      {
        label: "IDE Chat",
        data: metrics.map((metric) => {
          var _a2;
          return ((_a2 = metric.copilot_ide_chat) == null ? void 0 : _a2.total_engaged_users) || 0;
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1
      },
      {
        label: "GitHub.com Chat",
        data: metrics.map((metric) => {
          var _a2;
          return ((_a2 = metric.copilot_dotcom_chat) == null ? void 0 : _a2.total_engaged_users) || 0;
        }),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.1
      },
      {
        label: "GitHub.com PR",
        data: metrics.map((metric) => {
          var _a2;
          return ((_a2 = metric.copilot_dotcom_pull_requests) == null ? void 0 : _a2.total_engaged_users) || 0;
        }),
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.1
      }
    ]
  };
  const modelUsageChartData = {
    labels: ["IDE Code Completions", "IDE Chat", "GitHub.com Chat", "GitHub.com PR"],
    datasets: [
      {
        label: "Total Models",
        data: [
          modelSets.ideCodeCompletion.size,
          modelSets.ideChat.size,
          modelSets.dotcomChat.size,
          modelSets.dotcomPR.size
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)"
        ],
        borderColor: [
          "rgb(75, 192, 192)",
          "rgb(255, 99, 132)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)"
        ],
        borderWidth: 1
      }
    ]
  };
  return {
    ...totals,
    totalIdeCodeCompletionModels: modelSets.ideCodeCompletion.size,
    totalIdeChatModels: modelSets.ideChat.size,
    totalDotcomChatModels: modelSets.dotcomChat.size,
    totalDotcomPRModels: modelSets.dotcomPR.size,
    ideCodeCompletionModels: Array.from(modelMaps.ideCodeCompletion.values()),
    ideChatModels: Array.from(modelMaps.ideChat.values()),
    dotcomChatModels: Array.from(modelMaps.dotcomChat.values()),
    dotcomPRModels: Array.from(modelMaps.dotcomPR.values()),
    agentModeChartData,
    modelUsageChartData
  };
}

export { githubStats as default };
//# sourceMappingURL=github-stats.mjs.map
