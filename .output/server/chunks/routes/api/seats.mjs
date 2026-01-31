import { c as defineEventHandler, g as getQuery, O as Options } from '../../_/nitro.mjs';
import { readFileSync } from 'fs';
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class Seat {
  constructor(data) {
    __publicField(this, "login");
    __publicField(this, "name");
    __publicField(this, "id");
    __publicField(this, "team");
    __publicField(this, "created_at");
    __publicField(this, "last_activity_at");
    __publicField(this, "last_activity_editor");
    __publicField(this, "plan_type");
    __publicField(this, "email");
    __publicField(this, "pending_invite_date");
    __publicField(this, "revoked_date");
    __publicField(this, "pending_cancellation_date");
    var _a;
    this.login = data.assignee ? data.assignee.login : "deprecated";
    this.name = data.assignee ? data.assignee.name || "-" : "-";
    this.id = data.assignee ? data.assignee.id : 0;
    this.team = data.assigning_team ? data.assigning_team.name : "";
    this.created_at = data.created_at;
    this.last_activity_at = data.last_activity_at;
    this.last_activity_editor = data.last_activity_editor;
    this.plan_type = data.plan_type;
    this.email = ((_a = data.assignee) == null ? void 0 : _a.email) || void 0;
    this.pending_cancellation_date = data.pending_cancellation_date;
    if (this.plan_type && this.plan_type.includes("Pending invite")) {
      const dateMatch = this.plan_type.match(/\(([^)]+)\)/);
      this.pending_invite_date = dateMatch ? dateMatch[1] : this.created_at;
    }
    if (this.plan_type && this.plan_type.includes("Access will be removed on")) {
      const revokedMatch = this.plan_type.match(/Access will be removed on\s+([^<]*)/);
      this.revoked_date = revokedMatch ? revokedMatch[1].trim() : null;
    }
    if (!this.revoked_date && this.pending_cancellation_date) {
      this.revoked_date = this.pending_cancellation_date;
    }
  }
}

async function fetchAllTeamMembers(options, headers) {
  if (!(options.scope === "team-organization" || options.scope === "team-enterprise") || !options.githubTeam) {
    return [];
  }
  const membersUrl = options.getTeamMembersApiUrl();
  const perPage = 100;
  let page = 1;
  const members = [];
  while (true) {
    const pageData = await $fetch(membersUrl, {
      headers,
      params: { per_page: perPage, page }
    });
    if (!Array.isArray(pageData) || pageData.length === 0) break;
    members.push(...pageData);
    if (pageData.length < perPage) break;
    page += 1;
  }
  return members;
}
async function fetchUserProfile(username, headers) {
  try {
    const userApiUrl = `https://api.github.com/users/${username}`;
    const userProfile = await $fetch(userApiUrl, { headers });
    return {
      name: userProfile.name || "-",
      login: userProfile.login,
      email: userProfile.email || void 0
    };
  } catch (error) {
    console.warn(`Failed to fetch profile for ${username}:`, error);
    return { name: "-", login: username, email: void 0 };
  }
}
async function enhanceSeatsWithNames(seats, headers) {
  const userProfiles = /* @__PURE__ */ new Map();
  const uniqueUsernames = [...new Set(seats.map((seat) => seat.login))];
  const profilePromises = uniqueUsernames.map(async (username) => {
    const profile = await fetchUserProfile(username, headers);
    userProfiles.set(username, {
      name: profile.name || "-",
      login: profile.login,
      email: profile.email
    });
  });
  await Promise.all(profilePromises);
  return seats.map((seat) => {
    const profile = userProfiles.get(seat.login);
    if (profile) {
      seat.name = profile.name;
      seat.email = profile.email;
    }
    return seat;
  });
}
function deduplicateSeats(seats) {
  const uniqueSeats = /* @__PURE__ */ new Map();
  for (const seat of seats) {
    if (!seat.id || seat.id === 0) {
      continue;
    }
    const existingSeat = uniqueSeats.get(seat.id);
    if (!existingSeat) {
      uniqueSeats.set(seat.id, seat);
    } else {
      const seatActivity = seat.last_activity_at || "1970-01-01T00:00:00Z";
      const existingActivity = existingSeat.last_activity_at || "1970-01-01T00:00:00Z";
      if (seatActivity > existingActivity) {
        uniqueSeats.set(seat.id, seat);
      }
    }
  }
  return Array.from(uniqueSeats.values());
}
const seats = defineEventHandler(async (event) => {
  const logger = console;
  const query = getQuery(event);
  const options = Options.fromQuery(query);
  const apiUrl = options.getSeatsApiUrl();
  const mockedDataPath = options.getSeatsMockDataPath();
  if (options.isDataMocked && mockedDataPath) {
    const path = resolve(mockedDataPath);
    const data = readFileSync(path, "utf8");
    const dataJson = JSON.parse(data);
    const seatsData2 = dataJson.seats.map((item) => new Seat(item));
    const deduplicatedSeats2 = deduplicateSeats(seatsData2);
    logger.info("Using mocked data");
    return deduplicatedSeats2;
  }
  if (!event.context.headers.has("Authorization")) {
    logger.error("No Authentication provided");
    return new Response("No Authentication provided", { status: 401 });
  }
  const teamMembers = await fetchAllTeamMembers(options, event.context.headers);
  const perPage = 100;
  let page = 1;
  let response;
  logger.info(`Fetching 1st page of seats data from ${apiUrl}`);
  try {
    response = await $fetch(apiUrl, {
      headers: event.context.headers,
      params: {
        per_page: perPage,
        page
      }
    });
  } catch (error) {
    logger.error("Error fetching seats data:", error);
    const status = typeof error === "object" && error && "statusCode" in error ? error.statusCode : 500;
    return new Response("Error fetching seats data. Error: " + String(error), { status: status || 500 });
  }
  let seatsData = response.seats.map((item) => new Seat(item));
  const totalSeats = response.total_seats;
  const totalPages = Math.ceil(totalSeats / perPage);
  for (page = 2; page <= totalPages; page++) {
    response = await $fetch(apiUrl, {
      headers: event.context.headers,
      params: {
        per_page: perPage,
        page
      }
    });
    seatsData = seatsData.concat(response.seats.map((item) => new Seat(item)));
  }
  const deduplicatedSeats = deduplicateSeats(seatsData);
  const enhancedSeats = await enhanceSeatsWithNames(deduplicatedSeats, event.context.headers);
  if (teamMembers.length > 0) {
    return enhancedSeats.filter((seat) => teamMembers.some((member) => member.id === seat.id));
  }
  return enhancedSeats;
});

export { seats as default, fetchAllTeamMembers };
//# sourceMappingURL=seats.mjs.map
