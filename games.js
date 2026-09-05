/* Fall 2026 elementary games page.
   TODO: Prefer data/ncsaa-fall2026-games.json once the parallel executor
   pushes it. Until then, merge the per-sport + meta files listed below. */
(function () {
  "use strict";

  var COMBINED_URL = "data/ncsaa-fall2026-games.json";
  var INDEX_URL = "data/ncsaa-fall2026-index.json";
  var META_URL = "data/ncsaa-fall2026-meta.json";
  var FALLBACK_PARTS = [
    [META_URL, ""],
    ["data/ncsaa-fall2026-flag-football.json", "Flag Football"],
    ["data/ncsaa-fall2026-girls-volleyball.json", "Girls Volleyball"],
    ["data/ncsaa-fall2026-t-ball-coach-pitch.json", "T-Ball / Coach Pitch"]
  ];

  var SPORTS = [
    { id: "all", label: "All" },
    { id: "flag", label: "Flag Football" },
    { id: "volleyball", label: "Girls Volleyball" },
    { id: "tball", label: "T-Ball / Coach Pitch" },
    { id: "xc", label: "Cross Country" }
  ];

  var DISPLAY_FALLBACK = {
    "SLAM (Vevers-Royball)": "Adrianna / Vevers-Royball",
    "SLAM (Vevers Royball)": "Adrianna / Vevers-Royball",
    "SLAM Vevers-Royball": "Adrianna / Vevers-Royball"
  };

  var DEFAULT_SOURCE = "NCSAA Fall 2026 schedules";

  var state = {
    games: [],
    notes: {},
    source: DEFAULT_SOURCE,
    sport: "all",
    team: "",
    slamOnly: false,
    selected: null,
    loaded: false,
    error: ""
  };

  var els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function text(value) {
    return value == null ? "" : String(value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function todayStamp() {
    var now = new Date();
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(now);
    var map = {};
    parts.forEach(function (part) { map[part.type] = part.value; });
    return map.year + "-" + map.month + "-" + map.day;
  }

  function sportId(value) {
    var s = text(value).toLowerCase();
    if (!s) return "";
    if (s === "all") return "all";
    if (s.indexOf("cross") !== -1 || s === "xc" || /\bxc\b/.test(s) || s.indexOf("xc_meet") !== -1) return "xc";
    if (s.indexOf("volley") !== -1) return "volleyball";
    if (/\bt-?ball\b/.test(s) || s.indexOf("coach pitch") !== -1 || s.indexOf("tee-ball") !== -1 || s.indexOf("tee ball") !== -1) return "tball";
    if (s.indexOf("flag") !== -1) return "flag";
    return s.replace(/[^a-z0-9]+/g, "-");
  }

  function sportLabel(id) {
    for (var i = 0; i < SPORTS.length; i++) {
      if (SPORTS[i].id === id) return SPORTS[i].label;
    }
    return id;
  }

  function looksLikeSlamName(name) {
    var raw = text(name);
    if (!raw) return false;
    if (/\bSLAM\b/i.test(raw)) return true;
    if (/adrianna\s*\/\s*vevers/i.test(raw)) return true;
    if (/vevers-?royball/i.test(raw)) return true;
    return false;
  }

  function noteMap(notes) {
    var map = {};
    if (!notes) return map;
    if (Array.isArray(notes)) {
      notes.forEach(function (row) {
        if (!row || typeof row !== "object") return;
        var from = text(row.from || row.team || row.name || row.key);
        var to = text(row.to || row.label || row.display || row.value);
        if (from && to) map[from] = to;
      });
      return map;
    }
    if (typeof notes === "object") {
      Object.keys(notes).forEach(function (key) {
        var value = notes[key];
        if (value && typeof value === "object") {
          var to = text(value.to || value.label || value.display);
          if (to) map[key] = to;
        } else if (text(value)) {
          map[key] = text(value);
        }
      });
    }
    return map;
  }

  function mergeNotes() {
    var merged = {};
    var i;
    for (i = 0; i < arguments.length; i++) {
      var part = noteMap(arguments[i]);
      Object.keys(part).forEach(function (key) { merged[key] = part[key]; });
    }
    Object.keys(DISPLAY_FALLBACK).forEach(function (key) {
      if (!merged[key]) merged[key] = DISPLAY_FALLBACK[key];
    });
    return merged;
  }

  function displayTeam(name, notes) {
    var raw = text(name);
    if (!raw) return "";
    if (notes && notes[raw]) return notes[raw];
    var keys = notes ? Object.keys(notes) : [];
    for (var i = 0; i < keys.length; i++) {
      var from = keys[i];
      if (from && raw.indexOf(from) !== -1) {
        return raw.split(from).join(notes[from]);
      }
    }
    if (/vevers-?royball/i.test(raw) && !/adrianna/i.test(raw)) {
      return "Adrianna / Vevers-Royball";
    }
    return raw;
  }

  function parseTime(value) {
    var raw = text(value);
    if (!raw || /^tbd$/i.test(raw)) return "";
    var match = raw.match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*([ap]m)?$/i);
    if (!match) return raw;
    var hour = parseInt(match[1], 10);
    var minute = match[2] || "00";
    var suffix = (match[3] || "").toLowerCase();
    if (suffix === "pm" && hour < 12) hour += 12;
    if (suffix === "am" && hour === 12) hour = 0;
    if (!suffix && hour > 24) return raw;
    return String(hour).padStart(2, "0") + ":" + minute;
  }

  function formatTime(value) {
    var raw = text(value);
    if (!raw) return "TBD";
    var parts = raw.match(/^(\d{1,2}):(\d{2})/);
    if (!parts) return raw;
    var hour = parseInt(parts[1], 10);
    var minute = parts[2];
    var suffix = hour >= 12 ? "PM" : "AM";
    var hour12 = hour % 12;
    if (!hour12) hour12 = 12;
    return hour12 + ":" + minute + " " + suffix;
  }

  function formatDate(iso) {
    var raw = text(iso);
    if (!raw) return "Date TBD";
    var bits = raw.split("-");
    if (bits.length !== 3) return raw;
    var date = new Date(Number(bits[0]), Number(bits[1]) - 1, Number(bits[2]));
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  function collectFromPayload(payload, fallbackSport) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    var out = [];
    var keys = ["games", "events", "schedule", "meets", "xc_meets", "cross_country", "rows", "items"];
    keys.forEach(function (key) {
      if (Array.isArray(payload[key])) {
        payload[key].forEach(function (row) {
          var copy = Object.assign({}, row);
          if (fallbackSport && !copy.sport) copy.sport = fallbackSport;
          if (key === "xc_meets" || key === "cross_country" || key === "meets") {
            if (!copy.sport) copy.sport = "Cross Country";
            if (!copy.event_type) copy.event_type = copy.event_type || "xc_meet";
          }
          out.push(copy);
        });
      }
    });
    if (payload.jamboree) {
      var jamboree = Array.isArray(payload.jamboree) ? payload.jamboree : [payload.jamboree];
      jamboree.forEach(function (row) {
        var copy = Object.assign({
          sport: "Flag Football",
          event_type: "jamboree",
          date: "2026-09-05",
          venue: "Ed Fountain Park"
        }, row);
        out.push(copy);
      });
    }
    if (payload.special_events && Array.isArray(payload.special_events)) {
      payload.special_events.forEach(function (row) { out.push(row); });
    }
    if (!out.length && (payload.date || payload.away || payload.home || payload.venue)) {
      out.push(payload);
    }
    return out;
  }

  function normalizeGame(raw, index, notes, source) {
    if (!raw || typeof raw !== "object") return null;
    var away = text(raw.away || raw.away_team || raw.visitor || raw.guest);
    var home = text(raw.home || raw.home_team || raw.host);
    var venue = text(raw.venue || raw.location || raw.site || raw.place);
    var sport = text(raw.sport) || "Game";
    var eventType = text(raw.event_type || raw.type || raw.kind).toLowerCase();
    var slamTeam = text(raw.slam_team || raw.slamTeam);
    var slam = raw.slam === true || raw.involves_slam === true || raw.involvesSlam === true;
    if (!slam) slam = looksLikeSlamName(away) || looksLikeSlamName(home) || looksLikeSlamName(slamTeam);
    if (!slamTeam && slam) {
      if (looksLikeSlamName(home)) slamTeam = home;
      else if (looksLikeSlamName(away)) slamTeam = away;
    }
    var date = text(raw.date || raw.game_date || raw.gameDate);
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
      var slash = date.split("/");
      date = slash[2] + "-" + slash[0].padStart(2, "0") + "-" + slash[1].padStart(2, "0");
    }
    var start = parseTime(raw.start_time || raw.startTime || raw.time || raw.start);
    var week = raw.week;
    if (week == null || week === "") week = "";
    else if (typeof week === "number") week = "Week " + week;
    else week = text(week);

    var isMeet = eventType === "meet" || eventType === "xc_meet" || sportId(sport) === "xc";
    if (isMeet) {
      if (/^meet\b/i.test(home) && !away) home = "";
      if (/^meet\b/i.test(away) && !home) away = "";
    }
    var title = text(raw.title || raw.name || raw.event || raw.meet || raw.date_display);
    if (!title) {
      if (eventType === "jamboree") title = "Flag Football Jamboree";
      else if (isMeet) title = text(raw.week || raw.home || raw.meet) || "Cross Country meet";
      else if (away && home) title = displayTeam(away, notes) + " vs " + displayTeam(home, notes);
      else title = sport;
    }

    return {
      id: text(raw.id) || ("game-" + index + "-" + date + "-" + start + "-" + away + "-" + home),
      sport: sport,
      sportId: sportId(sport),
      division: text(raw.division || raw.conference || raw.level),
      date: date,
      start_time: start,
      venue: venue,
      venue_map_url: text(raw.venue_map_url || raw.map_url || raw.map),
      away: away,
      home: home,
      awayLabel: displayTeam(away, notes),
      homeLabel: displayTeam(home, notes),
      week: week,
      slam: slam,
      slam_team: slamTeam,
      slamTeamLabel: displayTeam(slamTeam, notes),
      event_type: eventType || (sportId(sport) === "xc" ? "meet" : "game"),
      source: text(raw.source) || source || DEFAULT_SOURCE,
      title: title,
      notes: text(raw.notes || raw.note || raw.details)
    };
  }

  function gameKey(game) {
    return [game.date, game.start_time, game.venue, game.away, game.home, game.sport, game.event_type].join("|");
  }

  function dedupe(games) {
    var seen = {};
    var out = [];
    games.forEach(function (game) {
      if (!game) return;
      var key = gameKey(game);
      if (seen[key]) return;
      seen[key] = true;
      out.push(game);
    });
    return out;
  }

  function sortGames(games) {
    return games.slice().sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      if (a.start_time !== b.start_time) return a.start_time < b.start_time ? -1 : 1;
      if (a.venue !== b.venue) return a.venue < b.venue ? -1 : 1;
      return (a.away + a.home).localeCompare(b.away + b.home);
    });
  }

  function payloadNotes(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};
    return payload.display_notes || payload.displayNotes || payload.notes || {};
  }

  function payloadSource(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return "";
    return text(payload.source || payload.source_url || payload.url);
  }

  function applyPayload(payload, fallbackSport, bag) {
    collectFromPayload(payload, fallbackSport).forEach(function (row) {
      bag.rows.push(row);
    });
    bag.notes = mergeNotes(bag.notes, payloadNotes(payload));
    var src = payloadSource(payload);
    if (src) bag.source = src;
  }

  async function fetchJson(url) {
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      var err = new Error("HTTP " + res.status + " for " + url);
      err.status = res.status;
      throw err;
    }
    var raw = await res.text();
    var trimmed = raw.trim();
    if (!trimmed) throw new Error("Empty file " + url);
    if (trimmed.indexOf("file://") === 0) {
      throw new Error("Placeholder pointer in " + url + " — waiting for real JSON");
    }
    try {
      return JSON.parse(trimmed);
    } catch (err) {
      throw new Error("Invalid JSON in " + url);
    }
  }

  async function loadIndexParts() {
    try {
      var index = await fetchJson(INDEX_URL);
      var parts = [[META_URL, ""]];
      if (index && Array.isArray(index.files)) {
        index.files.forEach(function (file) {
          var path = text(file && (file.path || file.url || file.file));
          var sport = text(file && file.sport);
          if (path) parts.push([path, sport]);
        });
      }
      if (index && index.meta) parts.unshift([text(index.meta), ""]);
      return parts;
    } catch (_) {
      return FALLBACK_PARTS.slice();
    }
  }

  async function loadData() {
    var bag = { rows: [], notes: mergeNotes(), source: DEFAULT_SOURCE };
    try {
      var combined = await fetchJson(COMBINED_URL);
      applyPayload(combined, "", bag);
      if (bag.rows.length) return bag;
    } catch (err) {
      if (err && err.status && err.status !== 404) {
        console.warn("Combined schedule failed", err);
      }
    }

    var parts = await loadIndexParts();
    var seen = {};
    var found = 0;
    var lastError = "";
    for (var i = 0; i < parts.length; i++) {
      var url = parts[i][0];
      if (!url || seen[url]) continue;
      seen[url] = true;
      try {
        var payload = await fetchJson(url);
        applyPayload(payload, parts[i][1], bag);
        found += 1;
      } catch (err) {
        lastError = (err && err.message) || String(err);
      }
    }
    if (!found) {
      bag.error = lastError || "Schedule JSON not found yet.";
    } else if (!bag.rows.length) {
      bag.error = lastError || "Schedule files loaded but no game rows yet.";
    }
    return bag;
  }

  function teamNames(game) {
    return [game.awayLabel, game.homeLabel, game.slamTeamLabel].filter(Boolean);
  }

  function gameHasTeam(game, team) {
    if (!team) return true;
    var labels = [game.away, game.home, game.slam_team, game.awayLabel, game.homeLabel, game.slamTeamLabel];
    return labels.some(function (name) { return text(name) === team; });
  }

  function filteredGames() {
    return state.games.filter(function (game) {
      if (state.sport !== "all" && game.sportId !== state.sport) return false;
      if (state.slamOnly && !game.slam) return false;
      if (state.team && !gameHasTeam(game, state.team)) return false;
      return true;
    });
  }

  function uniqueTeams(games) {
    var map = {};
    games.forEach(function (game) {
      if (isMeetLike(game)) return;
      [game.away, game.home].forEach(function (raw, idx) {
        var label = idx === 0 ? game.awayLabel : game.homeLabel;
        if (!label) return;
        if (!map[label]) {
          map[label] = { label: label, raw: raw, slam: looksLikeSlamName(raw) || looksLikeSlamName(label) || game.slam && game.slamTeamLabel === label };
        } else if (looksLikeSlamName(raw) || looksLikeSlamName(label)) {
          map[label].slam = true;
        }
      });
      if (game.slamTeamLabel && !map[game.slamTeamLabel]) {
        map[game.slamTeamLabel] = { label: game.slamTeamLabel, raw: game.slam_team, slam: true };
      }
    });
    return Object.keys(map).map(function (key) { return map[key]; }).sort(function (a, b) {
      if (a.slam !== b.slam) return a.slam ? -1 : 1;
      return a.label.localeCompare(b.label);
    });
  }

  function groupByDate(games) {
    var groups = [];
    var index = {};
    games.forEach(function (game) {
      var key = game.date || "tbd";
      if (!index[key]) {
        index[key] = { date: key, games: [] };
        groups.push(index[key]);
      }
      index[key].games.push(game);
    });
    return groups;
  }

  function isMeetLike(game) {
    return game.event_type === "meet" || game.event_type === "xc_meet" || game.sportId === "xc";
  }

  function matchupHtml(game) {
    if (isMeetLike(game) || (!game.away && !game.home)) {
      return escapeHtml(game.title);
    }
    return escapeHtml(game.awayLabel || "TBD") +
      '<span class="vs">vs</span>' +
      escapeHtml(game.homeLabel || "TBD");
  }

  function metaLine(game) {
    var bits = [];
    if (game.venue) bits.push(game.venue);
    if (game.division) bits.push(game.division);
    if (game.week) bits.push(game.week);
    return bits.join(" · ");
  }

  function renderCard(game) {
    var flags = [];
    if (game.slam) flags.push('<span class="pill slam">SLAM</span>');
    if (game.event_type && game.event_type !== "game") {
      flags.push('<span class="pill event">' + escapeHtml(game.event_type) + "</span>");
    }
    flags.push('<span class="pill">' + escapeHtml(game.sport) + "</span>");
    return (
      '<button class="game-card' + (game.slam ? " is-slam" : "") + '" type="button" data-id="' + escapeHtml(game.id) + '">' +
        '<div class="game-time">' + escapeHtml(formatTime(game.start_time)) + "</div>" +
        '<div class="game-matchup">' +
          '<p class="game-teams">' + matchupHtml(game) + "</p>" +
          (metaLine(game) ? '<p class="game-meta">' + escapeHtml(metaLine(game)) + "</p>" : "") +
        "</div>" +
        '<div class="game-flags">' + flags.join("") + "</div>" +
      "</button>"
    );
  }

  function renderGroups(groups, past) {
    if (!groups.length) return "";
    return groups.map(function (group) {
      return (
        '<section class="date-group' + (past ? " is-past" : "") + '">' +
          '<div class="date-heading">' +
            "<h2>" + escapeHtml(formatDate(group.date)) + "</h2>" +
            "<span>" + group.games.length + (group.games.length === 1 ? " game" : " games") + "</span>" +
          "</div>" +
          '<div class="game-list">' + group.games.map(renderCard).join("") + "</div>" +
        "</section>"
      );
    }).join("");
  }

  function renderTeamOptions() {
    var sportGames = state.games.filter(function (game) {
      return state.sport === "all" || game.sportId === state.sport;
    });
    var teams = uniqueTeams(sportGames);
    var current = state.team;
    var html = '<option value="">All teams</option>';
    teams.forEach(function (team) {
      html += '<option value="' + escapeHtml(team.label) + '"' +
        (team.label === current ? " selected" : "") + ">" +
        escapeHtml(team.label) + (team.slam ? " · SLAM" : "") +
        "</option>";
    });
    els.teamFilter.innerHTML = html;
    if (current && !teams.some(function (team) { return team.label === current; })) {
      state.team = "";
      els.teamFilter.value = "";
    }
  }

  function renderSports() {
    els.sportFilters.innerHTML = SPORTS.map(function (sport) {
      return '<button class="chip" type="button" role="tab" data-sport="' + sport.id + '" aria-selected="' +
        (state.sport === sport.id ? "true" : "false") + '">' + escapeHtml(sport.label) + "</button>";
    }).join("");
  }

  function renderSchedule() {
    var games = filteredGames();
    var today = todayStamp();
    var upcoming = games.filter(function (game) { return !game.date || game.date >= today; });
    var past = games.filter(function (game) { return game.date && game.date < today; });
    var slamCount = games.filter(function (game) { return game.slam; }).length;

    els.filterCount.textContent =
      games.length + (games.length === 1 ? " game" : " games") +
      " · " + slamCount + " SLAM" +
      (state.slamOnly || state.sport !== "all" || state.team ? " · filtered" : "");

    if (!state.loaded) {
      els.schedule.innerHTML = '<p class="empty">Loading Fall 2026 elementary games…</p>';
      return;
    }

    if (!state.games.length) {
      els.schedule.innerHTML = "";
      return;
    }

    if (!games.length) {
      els.schedule.innerHTML = '<p class="empty">No elementary games match these filters.</p>';
      renderPrint(games);
      return;
    }

    var html = "";
    if (upcoming.length) {
      html += '<p class="section-kicker">Upcoming</p>' + renderGroups(groupByDate(upcoming), false);
    } else {
      html += '<p class="empty">No upcoming games in this filter. Past dates are below.</p>';
    }
    if (past.length) {
      html +=
        '<details class="past-wrap">' +
          '<summary class="past-toggle"><span>Earlier games · ' + past.length + '</span><span>›</span></summary>' +
          renderGroups(groupByDate(past), true) +
        "</details>";
    }
    els.schedule.innerHTML = html;
    renderPrint(games);
  }

  function renderPrint(games) {
    var groups = groupByDate(games);
    var filterBits = [];
    if (state.sport !== "all") filterBits.push(sportLabel(state.sport));
    else filterBits.push("All elementary sports");
    if (state.team) filterBits.push(state.team);
    if (state.slamOnly) filterBits.push("SLAM only");
    var generated = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

    var tables = groups.map(function (group) {
      var rows = group.games.map(function (game) {
        var matchup = game.awayLabel || game.homeLabel
          ? escapeHtml(game.awayLabel || "TBD") + " vs " + escapeHtml(game.homeLabel || "TBD")
          : escapeHtml(game.title);
        return (
          '<tr class="' + (game.slam ? "is-slam" : "") + '">' +
            "<td>" + escapeHtml(formatTime(game.start_time)) + "</td>" +
            '<td class="' + (game.slam ? "team-slam" : "") + '">' + matchup + "</td>" +
            "<td>" + escapeHtml(game.venue || "TBD") + "</td>" +
            "<td>" + escapeHtml(game.sport) + (game.division ? "<br>" + escapeHtml(game.division) : "") + "</td>" +
            "<td>" + escapeHtml(game.week || game.event_type || "") + "</td>" +
          "</tr>"
        );
      }).join("");
      return (
        '<section class="print-date">' +
          "<h2>" + escapeHtml(formatDate(group.date)) + "</h2>" +
          '<table class="print-table">' +
            "<thead><tr><th>Time</th><th>Matchup</th><th>Venue</th><th>Sport / division</th><th>Week</th></tr></thead>" +
            "<tbody>" + rows + "</tbody>" +
          "</table>" +
        "</section>"
      );
    }).join("");

    els.printRoot.innerHTML =
      '<header class="print-head">' +
        '<div class="print-brand">SLAM! <em>Elementary</em> Athletics</div>' +
        '<div class="print-meta">Fall 2026 master calendar<br>Draft · ' + escapeHtml(generated) + "</div>" +
      "</header>" +
      '<p class="print-note">Showing ' + games.length + " currently filtered elementary games. " +
        escapeHtml(filterBits.join(" · ")) + ". Source: " + escapeHtml(state.source) + ".</p>" +
      (tables || '<p class="print-note">No games in this filter.</p>') +
      '<p class="print-foot">SLAM games are highlighted. Display names use schedule notes (Adrianna / Vevers-Royball).</p>';
  }

  function renderStatus() {
    if (state.games.length) {
      els.status.hidden = true;
      els.status.innerHTML = "";
      return;
    }
    els.status.hidden = false;
    els.status.innerHTML =
      "<strong>TODO — schedule data is not on this deploy yet.</strong><br>" +
      "This draft page is ready and will load <code>data/ncsaa-fall2026-games.json</code> " +
      "or the merged per-sport files (<code>meta</code>, <code>flag-football</code>, " +
      "<code>girls-volleyball</code>, <code>t-ball-coach-pitch</code>) as soon as they land on this branch.<br>" +
      (state.error ? "Last load note: " + escapeHtml(state.error) : "");
  }

  function openDetail(game) {
    state.selected = game;
    var rows = [
      ["When", formatDate(game.date) + " · " + formatTime(game.start_time)],
      ["Opponent", game.awayLabel && game.homeLabel ? game.awayLabel + " at " + game.homeLabel : (game.title || "—")],
      ["Venue", game.venue || "TBD"],
      ["Map", game.venue_map_url || ""],
      ["Sport", game.sport],
      ["Division", game.division || "—"],
      ["Week", game.week || "—"],
      ["SLAM team", game.slam ? (game.slamTeamLabel || "Yes") : "No"],
      ["Event", game.event_type || "game"],
      ["Source", game.source || state.source]
    ];
    if (game.notes) rows.push(["Notes", game.notes]);
    rows = rows.filter(function (row) { return text(row[1]); });
    els.detailBody.innerHTML =
      '<div class="detail-kicker">' + (game.slam ? "SLAM game" : "Elementary game") + "</div>" +
      "<h2 id=\"detail-title\">" + matchupHtml(game) + "</h2>" +
      '<dl class="detail-rows">' +
        rows.map(function (row) {
          return '<div class="detail-row"><dt>' + escapeHtml(row[0]) + "</dt><dd>" + escapeHtml(row[1]) + "</dd></div>";
        }).join("") +
      "</dl>";
    els.modal.hidden = false;
    els.detailClose.focus();
  }

  function closeDetail() {
    state.selected = null;
    els.modal.hidden = true;
  }

  function findGame(id) {
    for (var i = 0; i < state.games.length; i++) {
      if (state.games[i].id === id) return state.games[i];
    }
    return null;
  }

  function syncUrl() {
    var params = new URLSearchParams(window.location.search);
    var modal = params.get("modal");
    if (state.sport !== "all") params.set("sport", state.sport);
    else params.delete("sport");
    if (state.team) params.set("team", state.team);
    else params.delete("team");
    if (state.slamOnly) params.set("slam", "1");
    else params.delete("slam");
    if (modal) params.set("modal", modal);
    var next = params.toString();
    var url = next ? "?" + next : window.location.pathname;
    window.history.replaceState({}, "", url);
  }

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    var sport = sportId(params.get("sport") || "all") || "all";
    if (!SPORTS.some(function (item) { return item.id === sport; })) sport = "all";
    state.sport = sport;
    state.team = text(params.get("team"));
    state.slamOnly = params.get("slam") === "1" || params.get("slam") === "true";
    if (params.get("modal") === "1") {
      document.body.classList.add("in-modal");
      els.backLink.addEventListener("click", function (event) {
        if (window.parent !== window) {
          event.preventDefault();
          window.parent.postMessage({ type: "closeShortcutModal" }, "*");
        }
      });
    }
  }

  function bind() {
    els.sportFilters.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-sport]");
      if (!btn) return;
      state.sport = btn.getAttribute("data-sport");
      renderSports();
      renderTeamOptions();
      renderSchedule();
      syncUrl();
    });

    els.teamFilter.addEventListener("change", function () {
      state.team = els.teamFilter.value;
      renderSchedule();
      syncUrl();
    });

    els.slamOnly.addEventListener("change", function () {
      state.slamOnly = els.slamOnly.checked;
      renderSchedule();
      syncUrl();
    });

    els.schedule.addEventListener("click", function (event) {
      var card = event.target.closest(".game-card");
      if (!card) return;
      var game = findGame(card.getAttribute("data-id"));
      if (game) openDetail(game);
    });

    els.modal.addEventListener("click", function (event) {
      if (event.target === els.backdrop || event.target === els.detailClose) closeDetail();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !els.modal.hidden) closeDetail();
    });

    els.printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  async function init() {
    els.sportFilters = $("sport-filters");
    els.teamFilter = $("team-filter");
    els.slamOnly = $("slam-only");
    els.filterCount = $("filter-count");
    els.schedule = $("schedule");
    els.status = $("status");
    els.modal = $("detail-modal");
    els.backdrop = els.modal.querySelector(".detail-backdrop");
    els.detailClose = els.modal.querySelector(".detail-close");
    els.detailBody = $("detail-body");
    els.printBtn = $("print-btn");
    els.printRoot = $("print-root");
    els.backLink = $("back-link");

    readUrl();
    els.slamOnly.checked = state.slamOnly;
    renderSports();
    renderTeamOptions();
    renderSchedule();
    bind();

    var bag = await loadData();
    var notes = bag.notes;
    state.source = bag.source || DEFAULT_SOURCE;
    state.error = bag.error || "";
    state.games = sortGames(dedupe(bag.rows.map(function (row, index) {
      return normalizeGame(row, index, notes, state.source);
    })));
    state.notes = notes;
    state.loaded = true;
    renderStatus();
    renderTeamOptions();
    renderSchedule();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
