/* eslint-disable */
// SLAM! ES Athletics — Landing page

const { useState, useEffect, useRef } = React;

// ---------------------------------------------------------------------------
// Inline icons (don't use lucide.createIcons — it mutates DOM nodes React
// owns, which breaks reconciliation on the next state change).
// ---------------------------------------------------------------------------
function Icon({ name, size = 16, style }) {
  const common = {
    width: size, height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { display: "inline-block", verticalAlign: "middle", ...style },
    "aria-hidden": true,
  };
  switch (name) {
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    case "check-circle-2":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "alert-circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    case "shield-check":
      return (
        <svg {...common}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "message-circle":
      return (
        <svg {...common}>
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
        </svg>
      );
    case "repeat":
      return (
        <svg {...common}>
          <path d="m17 2 4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="m7 22-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Hero background variants
// ---------------------------------------------------------------------------
function HeroBackground({ variant }) {
  if (variant === "pattern") {
    return (
      <div className="hero-bg vignette" aria-hidden="true">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"
             style={{ width: "100%", height: "100%" }}>
          <defs>
            <pattern id="hp-stripes" patternUnits="userSpaceOnUse"
                     width="56" height="56" patternTransform="rotate(-14)">
              <rect width="56" height="56" fill="#0A0A0A" />
              <rect width="2" height="56" fill="#1F1F1F" />
            </pattern>
          </defs>
          <rect width="1600" height="900" fill="url(#hp-stripes)" />
          <circle cx="1340" cy="920" r="540" fill="none"
                  stroke="#DA0016" strokeWidth="3" strokeDasharray="6 10" opacity="0.55" />
          <circle cx="1340" cy="920" r="160" fill="none"
                  stroke="#80FF00" strokeWidth="3" opacity="0.85" />
          <circle cx="1340" cy="920" r="40" fill="#80FF00" opacity="0.9" />
        </svg>
      </div>
    );
  }

  if (variant === "scoreboard") {
    return (
      <div className="hero-bg vignette" aria-hidden="true"
           style={{ background: "var(--slam-black)" }}>
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"
             style={{ width: "100%", height: "100%" }}>
          <defs>
            <pattern id="hp-dots" patternUnits="userSpaceOnUse"
                     width="32" height="32">
              <circle cx="16" cy="16" r="1.4" fill="#1F1F1F" />
            </pattern>
          </defs>
          <rect width="1600" height="900" fill="url(#hp-dots)" />
          {/* Large outline ! mark */}
          <text x="1280" y="780" fontFamily="Illini, Anton, Impact, sans-serif"
                fontSize="900" fill="none" stroke="#DA0016" strokeWidth="3"
                opacity="0.35">!</text>
        </svg>
      </div>
    );
  }

  if (variant === "red") {
    return (
      <div className="hero-bg" aria-hidden="true"
           style={{ background: "var(--slam-red)" }}>
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"
             style={{ width: "100%", height: "100%", opacity: 0.18 }}>
          <defs>
            <pattern id="hp-red-stripes" patternUnits="userSpaceOnUse"
                     width="44" height="44" patternTransform="rotate(-14)">
              <rect width="2" height="44" fill="#000" />
            </pattern>
          </defs>
          <rect width="1600" height="900" fill="url(#hp-red-stripes)" />
        </svg>
        <div style={{
          position: "absolute", right: -120, bottom: -260,
          fontFamily: "Illini, Impact, sans-serif", fontSize: 820, lineHeight: 1,
          color: "rgba(0,0,0,0.18)", pointerEvents: "none",
        }}>!</div>
      </div>
    );
  }

  if (variant === "lime") {
    return (
      <div className="hero-bg" aria-hidden="true"
           style={{ background: "var(--slam-lime)" }}>
        <div style={{
          position: "absolute", right: -120, bottom: -260,
          fontFamily: "Illini, Impact, sans-serif", fontSize: 820, lineHeight: 1,
          color: "rgba(0,0,0,0.14)", pointerEvents: "none",
        }}>!</div>
      </div>
    );
  }

  // solid black (default fallback)
  return (
    <div className="hero-bg vignette solid-black" aria-hidden="true">
      <div style={{
        position: "absolute", right: -80, bottom: -200,
        fontFamily: "Illini, Impact, sans-serif", fontSize: 760, lineHeight: 1,
        color: "rgba(255,255,255,0.04)", pointerEvents: "none",
      }}>!</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Signup form — POSTs to a Google Apps Script Web App URL.
// Falls back to localStorage when no endpoint is configured.
// ---------------------------------------------------------------------------
function SignupForm({ endpoint, accent }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ kind: "idle", msg: "" });

  async function submit(e) {
    e.preventDefault();
    const cleaned = email.trim().toLowerCase();
    if (!cleaned || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setStatus({ kind: "error", msg: "Drop a real email" });
      return;
    }

    setStatus({ kind: "sending", msg: "Sending…" });

    // Always mirror to localStorage so the data isn't lost if the endpoint is down
    try {
      const key = "slam_signups";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      if (!prev.find((r) => r.email === cleaned)) {
        prev.push({ email: cleaned, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(prev));
      }
    } catch (_) {}

    if (!endpoint) {
      setStatus({
        kind: "success",
        msg: "Saved locally — add endpoint in Tweaks to ship to the sheet.",
      });
      setEmail("");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("email", cleaned);
      fd.append("source", "landing");
      fd.append("ua", navigator.userAgent);
      // Apps Script web apps don't set CORS headers — use no-cors and assume
      // success on resolution. (Errors only fire on network failure.)
      await fetch(endpoint, { method: "POST", body: fd, mode: "no-cors" });
      setStatus({ kind: "success", msg: "You're in. We'll be in touch." });
      setEmail("");
    } catch (err) {
      setStatus({
        kind: "error",
        msg: "Couldn't reach the endpoint — saved locally.",
      });
    }
  }

  return (
    <div className="signup">
      <form className="signup-form" onSubmit={submit}>
        <input
          className="signup-input"
          type="email"
          placeholder="parent@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          autoComplete="email"
          required
        />
        <button
          className="signup-submit"
          type="submit"
          disabled={status.kind === "sending"}
          style={accent === "lime" ? { background: "var(--slam-lime)", color: "var(--slam-black)" } : null}
        >
          {status.kind === "sending" ? "Sending…" : "Sign me up"}
          <Icon name="arrow-right" size={16} />
        </button>
      </form>

      <div className={`signup-status ${status.kind}`} role="status" aria-live="polite">
        {status.kind === "success" && <><Icon name="check-circle-2" size={14} /> {status.msg}</>}
        {status.kind === "error" && <><Icon name="alert-circle" size={14} /> {status.msg}</>}
        {status.kind === "sending" && <span>{status.msg}</span>}
        {status.kind === "idle" && <span>&nbsp;</span>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------
function Nav() {
  return null;
}

// Word-by-word reveal for the welcome headline.
function AnimatedHeadline({ text, className }) {
  const words = text.split(/(\s+)/); // keep whitespace
  return (
    <h1 className={className} aria-label={text}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <React.Fragment key={i}>{w}</React.Fragment>;
        return (
          <span
            className="word"
            key={i}
            style={{ animationDelay: `${0.08 * i + 0.15}s` }}
          >
            {w}
          </span>
        );
      })}
    </h1>
  );
}

function Hero({ bg, endpoint }) {
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <HeroBackground variant={bg} />
      <div className="hero-inner hero-center">
        <div className="welcome-eyebrow">Welcome to</div>

        <img
          src="assets/slam-logo.png"
          alt="SLAM! Athletics"
          className="hero-logo"
        />

        <div className="signup-wrap-center">
          <SignupForm endpoint={endpoint} accent="red" />
        </div>

        <p className="hero-desc">
          Sign up for our newsletter — schedules, sign-ups, and updates
          on upcoming events, sent straight to your inbox.
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" data-screen-label="02 About">
      <div className="about-grid">
        <div>
          <div className="about-eyebrow">About / Mission</div>
        </div>
        <div>
          <h2 className="about-mission">
            We're building <span className="lime">kids</span> who love to move
            <span className="dim"> — and parents who trust us with the season.</span>
          </h2>

          <div className="about-body">
            <p>
              SLAM! runs <strong>high-energy, fundamentals-first</strong> sports programs
              for elementary-aged kids. Practices look like recess; the curriculum
              looks like a college playbook. Both are true.
            </p>
            <p>
              Every coach is <strong>CPR + first-aid certified, background-checked,
              and trained on our developmental model.</strong> Every program is
              insured. Every parent gets the schedule, the photos, and a real
              conversation at pickup.
            </p>
          </div>

          <div className="about-tenets">
            <div className="tenet">
              <div className="tenet-n">01</div>
              <div className="tenet-h">Every kid gets a touch</div>
              <div className="tenet-p">No benchwarmers. No "ringers." Every kid plays every game.</div>
            </div>
            <div className="tenet">
              <div className="tenet-n">02</div>
              <div className="tenet-h">Fundamentals over flash</div>
              <div className="tenet-p">Footwork, passing, sportsmanship. The flashy stuff comes free with the basics.</div>
            </div>
            <div className="tenet">
              <div className="tenet-n">03</div>
              <div className="tenet-h">Parents get the truth</div>
              <div className="tenet-p">Specific praise &gt; hype words. Real feedback on what your kid is working on.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot-l">© 2026 SLAM! Elementary Athletics</div>
      <div className="foot-r">
        <span>Insured · Certified · Background-checked</span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// "What's happening" — calendar · feed · Q&A
// Content comes from the Apps Script endpoint (Posts/Events/FAQ sheet tabs);
// these arrays are fallbacks shown before the fetch completes or if it fails.
// ---------------------------------------------------------------------------

const DEFAULT_EVENTS = [
  { date: "2026-05-27", type: "practice", sport: "Basketball", title: "Basketball · Grades 3-5", time: "5:30 PM · Gym B" },
  { date: "2026-05-29", type: "game", sport: "Soccer", title: "Soccer Friday Night Lights", time: "6:00 PM · East Field" },
  { date: "2026-06-02", type: "practice", sport: "Baseball", title: "T-Ball · Grades K-2", time: "4:30 PM · Field 1" },
  { date: "2026-06-05", type: "event", sport: "Other", title: "Family BBQ + Skills Day", time: "11:00 AM · Park Pavilion" },
  { date: "2026-06-10", type: "game", sport: "Basketball", title: "Championship — Spring League", time: "7:00 PM · Center Court" },
  { date: "2026-06-14", type: "event", sport: "Other", title: "Summer Camp Kickoff", time: "9:00 AM · Main Gym" },
];

const DEFAULT_POSTS = [
  {
    date: "2026-05-24",
    sport: "Basketball",
    name: "Coach Marcus",
    handle: "@coachmarc",
    body: "Practice moved indoors tonight — field's a mud pit. Gym B, same time. Bring water bottles.",
  },
  {
    date: "2026-05-23",
    sport: "Soccer",
    name: "SLAM! Athletics",
    handle: "@slamES",
    body: "Spring league finals THIS Saturday. 4 fields, 8 games, 100+ kids. Come loud.",
  },
  {
    date: "2026-05-22",
    sport: "Basketball",
    name: "Coach Riley",
    handle: "@rileyhoops",
    body: "Mason hit his first three-pointer in a game today. The bench EXPLODED. This is why we coach.",
  },
  {
    date: "2026-05-20",
    sport: "Other",
    name: "SLAM! Athletics",
    handle: "@slamES",
    body: "Summer camp registration opens Monday at 9AM. K-5, 8 weeks, every kid plays every game.",
  },
];

const SPORT_OPTIONS = [
  "Basketball",
  "Soccer",
  "Track and Field",
  "Cross Country",
  "Cheer",
  "Volleyball",
  "Flag Football",
  "Baseball",
  "Softball",
  "Tennis",
  "Other",
];

const DEFAULT_FAQ = [
  { q: "What ages do you serve?", a: "Kindergarten through 5th grade (ages 5-11). Programs are split by age band so kids play with peers their own size and skill level." },
  { q: "How much does it cost?", a: "Most seasons run $240 for 8 weeks (1 practice + 1 game per week). Scholarships available — just ask." },
  { q: "Are coaches certified?", a: "Every coach is CPR + first-aid certified, background-checked, and trained on our developmental model." },
  { q: "What if my kid has never played before?", a: "Perfect. That's exactly who we built this for. Every program starts with fundamentals — running, throwing, catching, sportsmanship. No experience required." },
  { q: "Can I get a refund if my kid hates it?", a: "Yes. Full refund within the first 2 weeks, no questions asked." },
];

function getEventIcon(event) {
  const title = `${event?.sport || ""} ${event?.title || ""}`.toLowerCase();
  const type = String(event?.type || "event").toLowerCase();

  if (title.includes("basketball")) return "🏀";
  if (title.includes("soccer")) return "⚽";
  if (title.includes("t-ball") || title.includes("baseball")) return "⚾";
  if (title.includes("softball")) return "🥎";
  if (title.includes("football")) return "🏈";
  if (title.includes("volleyball")) return "🏐";
  if (title.includes("tennis")) return "🎾";
  if (title.includes("cross country")) return "👟";
  if (title.includes("cheer")) return "📣";
  if (title.includes("swim")) return "🏊";
  if (title.includes("track") || title.includes("running")) return "🏃";
  if (title.includes("camp")) return "⛺";
  if (title.includes("bbq")) return "🔥";
  if (title.includes("championship")) return "🏆";

  return {
    practice: "🏃",
    game: "🏆",
    event: "🎉",
  }[type] || "📅";
}

function eventDateKey(event) {
  return String(event?.date || "").slice(0, 10);
}

function addDaysToKey(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateKey;
  date.setDate(date.getDate() + days);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function eventType(event) {
  const type = String(event?.type || "event").toLowerCase().trim();
  return type === "games" ? "game" : type;
}

function getEventSport(event) {
  const text = `${event?.sport || ""} ${event?.title || ""}`.toLowerCase();
  if (text.includes("basketball") || text.includes("hoops")) return "basketball";
  if (text.includes("soccer") || text.includes("futsal")) return "soccer";
  if (text.includes("track")) return "track";
  if (text.includes("cross country") || text.includes("xc")) return "cross-country";
  if (text.includes("cheer")) return "cheer";
  if (text.includes("volleyball")) return "volleyball";
  if (text.includes("t-ball") || text.includes("tball") || text.includes("baseball")) return "baseball";
  if (text.includes("softball")) return "softball";
  if (text.includes("football") || text.includes("flag")) return "football";
  if (text.includes("tennis")) return "tennis";
  if (text.includes("swim")) return "swim";
  return "other";
}

function sportLabel(sport) {
  return {
    basketball: "Basketball",
    soccer: "Soccer",
    track: "Track and Field",
    "cross-country": "Cross Country",
    cheer: "Cheer",
    baseball: "Baseball",
    softball: "Softball",
    football: "Football",
    volleyball: "Volleyball",
    tennis: "Tennis",
    swim: "Swim",
    other: "Other",
  }[sport] || sport;
}

function sortEventsByDate(a, b) {
  return eventDateKey(a).localeCompare(eventDateKey(b))
    || String(a.time || "").localeCompare(String(b.time || ""))
    || String(a.title || "").localeCompare(String(b.title || ""));
}

function formatEventDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Selected day";
  return date.toLocaleDateString("default", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatPostDate(dateKey) {
  const date = new Date(`${String(dateKey || "").slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function postDateKey(post) {
  return String(post?.date || post?.time || "").slice(0, 10);
}

function sortPostsByDate(a, b) {
  return postDateKey(b).localeCompare(postDateKey(a))
    || String(b.name || "").localeCompare(String(a.name || ""));
}

function linkifyText(text) {
  const parts = String(text || "").split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    if (!/^https?:\/\//i.test(part)) return part;
    const cleanUrl = part.replace(/[),.]+$/, "");
    const trailing = part.slice(cleanUrl.length);
    return (
      <React.Fragment key={`${cleanUrl}-${i}`}>
        <a className="post-link" href={cleanUrl} target="_blank" rel="noopener noreferrer">
          {cleanUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
        </a>
        {trailing}
      </React.Fragment>
    );
  });
}

// Pulls all three content arrays from the Apps Script endpoint on mount.
// Keep the sheet-backed sections empty while loading so old fallback content
// does not flash before the live sheet response arrives.
function useContent(endpoint) {
  const [content, setContent] = useState({
    posts: [],
    events: [],
    faq: [],
    loaded: false,
    error: false,
  });

  useEffect(() => {
    if (!endpoint) {
      setContent({
        posts: DEFAULT_POSTS,
        events: DEFAULT_EVENTS,
        faq: DEFAULT_FAQ,
        loaded: true,
        error: false,
      });
      return;
    }

    let cancelled = false;
    setContent({ posts: [], events: [], faq: [], loaded: false, error: false });
    fetch(`${endpoint}?action=all&t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setContent({
          posts: Array.isArray(data.posts) ? data.posts : [],
          events: Array.isArray(data.events) ? data.events : [],
          faq: Array.isArray(data.faq) ? data.faq : [],
          loaded: true,
          error: data.ok === false,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setContent({ posts: [], events: [], faq: [], loaded: true, error: true });
        }
      });
    return () => { cancelled = true; };
  }, [endpoint]);

  return content;
}

function Calendar({ events, loading }) {
  // Show the current month, dynamically. Today is highlighted.
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(today).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [upcomingType, setUpcomingType] = useState("all");
  const [gameSport, setGameSport] = useState("all");
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });
  const nextWeekStr = addDaysToKey(todayStr, 7);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Which days this month have events?
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const eventDays = events
    .filter((e) => eventDateKey(e).startsWith(monthPrefix))
    .map((e) => parseInt(eventDateKey(e).slice(8, 10), 10))
    .filter((n) => !isNaN(n));

  const selectedEvents = events
    .filter((e) => eventDateKey(e) === selectedDate)
    .sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));

  const upcomingEvents = events
    .filter((e) => {
      const dateKey = eventDateKey(e);
      return dateKey >= todayStr && dateKey <= nextWeekStr;
    })
    .sort(sortEventsByDate);

  const visibleUpcoming = upcomingType === "all"
    ? upcomingEvents
    : upcomingEvents.filter((e) => eventType(e) === upcomingType);

  const futureGames = events
    .filter((e) => eventType(e) === "game" && eventDateKey(e) >= todayStr)
    .sort(sortEventsByDate);

  const gameSports = Array.from(new Set(futureGames.map(getEventSport)))
    .filter(Boolean)
    .sort((a, b) => sportLabel(a).localeCompare(sportLabel(b)));

  const visibleGames = gameSport === "all"
    ? futureGames
    : futureGames.filter((e) => getEventSport(e) === gameSport);

  const gamesNextWeek = futureGames.filter((e) => eventDateKey(e) <= nextWeekStr).length;

  function renderFilterButton(group, value, label, active, onClick) {
    return (
      <button
        key={`${group}-${value}`}
        type="button"
        className={`cal-filter-btn${active ? " active" : ""}`}
        onClick={onClick}
        aria-pressed={active}
      >
        {label}
      </button>
    );
  }

  function renderEventRow(e, i, mode = "date") {
    const dateKey = eventDateKey(e);
    const type = eventType(e);
    const date = new Date(`${dateKey}T00:00:00`);
    const dayNum = parseInt(dateKey.slice(8, 10), 10);
    const dow = Number.isNaN(date.getTime())
      ? "TBD"
      : date.toLocaleDateString("default", { weekday: "short" }).toUpperCase();
    return (
      <button
        key={`${mode}-${dateKey}-${i}`}
        type="button"
        className={`cal-month-event${selectedDate === dateKey ? " selected" : ""}`}
        onClick={() => setSelectedDate(dateKey)}
      >
        <span className="cal-month-day">
          <span className="cal-month-dow">{dow}</span>
          <span>{Number.isNaN(dayNum) ? "?" : dayNum}</span>
        </span>
        <span className="cal-month-copy">
          <span className="cal-month-title">{getEventIcon(e)} {e.title}</span>
          <span className="cal-month-meta">{type} · {e.time || "Time TBA"}</span>
        </span>
      </button>
    );
  }

  return (
    <div className="card cal">
      <div className="card-head">
        <span className="card-eyebrow">Calendar</span>
        <span className="card-meta">{monthLabel}</span>
      </div>

      <div className="cal-dow">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => {
          if (d === null) return <span key={i} className="cal-cell empty" />;
          const hasEvent = eventDays.includes(d);
          const isToday = d === today;
          const dayKey = `${monthPrefix}-${String(d).padStart(2, "0")}`;
          const isSelected = selectedDate === dayKey;
          return (
            <button
              key={i}
              type="button"
              className={`cal-cell${isToday ? " today" : ""}${hasEvent ? " has-event" : ""}${isSelected ? " selected" : ""}`}
              onClick={() => setSelectedDate(dayKey)}
              aria-pressed={isSelected}
              aria-label={`${formatEventDate(dayKey)}${hasEvent ? ", has events" : ""}`}
            >
              {d}
              {hasEvent && <span className="cal-dot" />}
            </button>
          );
        })}
      </div>

      <div className="cal-upcoming">
        <div className="cal-upcoming-label">{formatEventDate(selectedDate)}</div>
        {loading ? (
          <div className="cal-empty">Loading schedule...</div>
        ) : selectedEvents.length === 0 ? (
          <div className="cal-empty">No events scheduled for this day.</div>
        ) : selectedEvents.map((e, i) => {
          const type = eventType(e);
          const icon = getEventIcon(e);
          return (
            <div key={i} className="cal-event">
              <div className="cal-event-icon">
                <span className="cal-event-emoji">{icon}</span>
              </div>
              <div className="cal-event-body">
                <div className={`cal-event-tag tag-${type}`}>{type}</div>
                <div className="cal-event-title">{e.title}</div>
                <div className="cal-event-time">{e.time}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cal-month-list">
        <div className="cal-section-head">
          <div>
            <div className="cal-upcoming-label">Upcoming events</div>
            <div className="cal-section-sub">Next 7 days</div>
          </div>
          <div className="cal-filter" aria-label="Filter upcoming events">
            {[
              ["all", "All"],
              ["event", "Events"],
              ["practice", "Practice"],
              ["game", "Games"],
            ].map(([value, label]) => renderFilterButton(
              "upcoming",
              value,
              label,
              upcomingType === value,
              () => setUpcomingType(value)
            ))}
          </div>
        </div>
        {loading ? (
          <div className="cal-empty">Loading upcoming events...</div>
        ) : visibleUpcoming.length === 0 ? (
          <div className="cal-empty">No matching events in the next 7 days.</div>
        ) : visibleUpcoming.map((e, i) => renderEventRow(e, i, "upcoming"))}
      </div>

      <div className="cal-games-list">
        <div className="cal-section-head">
          <div>
            <div className="cal-upcoming-label">Games</div>
            <div className="cal-section-sub">
              {gamesNextWeek} game{gamesNextWeek === 1 ? "" : "s"} in the next 7 days
            </div>
          </div>
          <div className="cal-filter" aria-label="Filter games by sport">
            {renderFilterButton("games", "all", "All sports", gameSport === "all", () => setGameSport("all"))}
            {gameSports.map((sport) => renderFilterButton(
              "games",
              sport,
              sportLabel(sport),
              gameSport === sport,
              () => setGameSport(sport)
            ))}
          </div>
        </div>
        {loading ? (
          <div className="cal-empty">Loading games...</div>
        ) : visibleGames.length === 0 ? (
          <div className="cal-empty">No games match this sport yet.</div>
        ) : visibleGames.map((e, i) => renderEventRow(e, i, "game"))}
      </div>
    </div>
  );
}

// --- Updates feed (Twitter/X style) ---
function ShoutoutForm({ endpoint }) {
  const [form, setForm] = useState({ name: "", sport: "Basketball", body: "" });
  const [status, setStatus] = useState({ kind: "idle", msg: "" });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    const name = form.name.trim();
    const body = form.body.trim();
    if (name.length < 2) {
      setStatus({ kind: "error", msg: "Add a name first." });
      return;
    }
    if (body.length < 8) {
      setStatus({ kind: "error", msg: "Add a little more to the shoutout." });
      return;
    }

    setStatus({ kind: "sending", msg: "Sending..." });

    try {
      const key = "slam_parent_shoutouts";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push({ ...form, name, body, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
    } catch (_) {}

    if (!endpoint) {
      setStatus({ kind: "success", msg: "Saved locally for review." });
      setForm({ name: "", sport: form.sport, body: "" });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("action", "shoutout");
      fd.append("name", name);
      fd.append("sport", form.sport);
      fd.append("body", body);
      await fetch(endpoint, { method: "POST", body: fd, mode: "no-cors" });
      setStatus({ kind: "success", msg: "Shoutout sent for review." });
      setForm({ name: "", sport: form.sport, body: "" });
    } catch (_) {
      setStatus({ kind: "error", msg: "Could not reach the sheet. Saved locally." });
    }
  }

  return (
    <form className="shoutout-form" onSubmit={submit}>
      <div className="shoutout-head">
        <div>
          <div className="shoutout-title">Parent shoutout</div>
          <div className="shoutout-sub">Send a quick win for review.</div>
        </div>
        <div className="shoutout-icon" aria-hidden="true">📣</div>
      </div>
      <div className="shoutout-row">
        <input
          className="shoutout-input"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Name"
          autoComplete="name"
          required
        />
        <select
          className="shoutout-input"
          value={form.sport}
          onChange={(e) => update("sport", e.target.value)}
          aria-label="Sport"
        >
          {SPORT_OPTIONS.map((sport) => (
            <option key={sport} value={sport}>{sport}</option>
          ))}
        </select>
      </div>
      <textarea
        className="shoutout-textarea"
        value={form.body}
        onChange={(e) => update("body", e.target.value)}
        placeholder="Shoutout"
        rows={3}
        required
      />
      <div className="shoutout-actions">
        <button className="shoutout-submit" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending..." : "Send shoutout"}
        </button>
        <span className={`shoutout-status ${status.kind}`} role="status" aria-live="polite">
          {status.msg}
        </span>
      </div>
    </form>
  );
}

function Feed({ posts, loading, endpoint }) {
  const sortedPosts = [...posts].sort(sortPostsByDate);
  return (
    <div className="card feed">
      <div className="card-head">
        <span className="card-eyebrow">Updates</span>
        <span className="card-meta">@slamES</span>
      </div>
      <div className="feed-list">
        {loading ? (
          <div className="cal-empty">Loading updates...</div>
        ) : sortedPosts.length === 0 ? (
          <div className="cal-empty">No updates yet.</div>
        ) : sortedPosts.map((p, i) => {
          const icon = getEventIcon({ sport: p.sport, title: p.sport, type: "event" });
          const dateLabel = formatPostDate(postDateKey(p));
          const link = String(p.link || "").trim();
          return (
            <article key={i} className="post">
              <div className="post-avatar" aria-label={p.sport || "Update"}>{icon}</div>
              <div className="post-body">
                <div className="post-meta">
                  <span className="post-name">{p.name}</span>
                  <span className="post-handle">{p.handle}</span>
                  {dateLabel && <span className="post-date">{dateLabel}</span>}
                </div>
                <p className="post-text">{linkifyText(p.body)}</p>
                {link && (
                  <a className="post-cta" href={link} target="_blank" rel="noopener noreferrer">
                    Open link <Icon name="arrow-right" size={13} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <ShoutoutForm endpoint={endpoint} />
    </div>
  );
}

// --- Q&A ---
const FAQ_STOP_WORDS = new Set([
  "about", "after", "again", "answer", "because", "before", "bring", "child",
  "could", "does", "from", "have", "know", "like", "need", "parent", "question",
  "should", "that", "their", "there", "they", "this", "what", "when", "where",
  "which", "will", "with", "would", "your",
]);

function faqTokens(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !FAQ_STOP_WORDS.has(token));
}

function findFaqMatches(question, faq) {
  const queryTokens = Array.from(new Set(faqTokens(question)));
  if (queryTokens.length < 1) return [];
  const maxMatches = 6;

  function scoreBy(text) {
    const tokens = new Set(faqTokens(text));
    return queryTokens.reduce((sum, token) => (
      tokens.has(token) ? sum + 1 : sum
    ), 0);
  }

  const keywordMatches = faq
    .map((item, index) => ({ ...item, index, score: scoreBy(item.keywords || "") }))
    .filter((item) => item.score > 0)
    .sort((a, b) => (b.score - a.score) || (a.index - b.index));

  if (keywordMatches.length) return keywordMatches.slice(0, maxMatches);

  return faq
    .map((item, index) => ({ ...item, index, score: scoreBy(`${item.q} ${item.a}`) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => (b.score - a.score) || (a.index - b.index))
    .slice(0, maxMatches);
}

function AskQuestionForm({ endpoint, faq }) {
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [status, setStatus] = useState({ kind: "idle", msg: "" });
  const matches = findFaqMatches(form.question, faq);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    const question = form.question.trim();
    const email = form.email.trim().toLowerCase();

    if (question.length < 8) {
      setStatus({ kind: "error", msg: "Add a little more detail first." });
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ kind: "error", msg: "That email does not look right." });
      return;
    }

    setStatus({ kind: "sending", msg: "Sending..." });

    try {
      const key = "slam_parent_questions";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push({
        name: form.name.trim(),
        email,
        question,
        at: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
    } catch (_) {}

    if (!endpoint) {
      setStatus({ kind: "success", msg: "Saved locally for now." });
      setForm({ name: "", email: "", question: "" });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("action", "question");
      fd.append("name", form.name.trim());
      fd.append("email", email);
      fd.append("question", question);
      fd.append("ua", navigator.userAgent);
      await fetch(endpoint, { method: "POST", body: fd, mode: "no-cors" });
      setStatus({ kind: "success", msg: "Question sent. We will follow up soon." });
      setForm({ name: "", email: "", question: "" });
    } catch (_) {
      setStatus({ kind: "error", msg: "Could not reach the sheet. Saved locally." });
    }
  }

  return (
    <form className="ask-form" onSubmit={submit}>
      <div className="ask-head">
        <div className="ask-title">Ask a question</div>
        <div className="ask-sub">We will use new questions to keep this FAQ fresh.</div>
      </div>
      <div className="ask-row">
        <input
          className="ask-input"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
        <input
          className="ask-input"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="Email (optional)"
          autoComplete="email"
        />
      </div>
      <textarea
        className="ask-textarea"
        value={form.question}
        onChange={(e) => update("question", e.target.value)}
        placeholder="What would you like to know?"
        rows={3}
        required
      />
      {matches.length > 0 && (
        <div className="ask-suggestions" aria-live="polite">
          <div className="ask-suggestions-label">Possible answers</div>
          {matches.map((item, i) => (
            <details className="ask-suggestion" key={`${item.q}-${i}`}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      )}
      <div className="ask-actions">
        <button className="ask-submit" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending..." : "Send question"}
        </button>
        <span className={`ask-status ${status.kind}`} role="status" aria-live="polite">
          {status.msg}
        </span>
      </div>
    </form>
  );
}

function QA({ faq, endpoint, loading }) {
  const [open, setOpen] = useState(-1);
  const visibleFaq = faq.slice(0, 3);
  return (
    <div className="card qa">
      <div className="card-head">
        <span className="card-eyebrow">Q and A</span>
      </div>
      <div className="qa-list">
        {loading ? (
          <div className="cal-empty">Loading answers...</div>
        ) : visibleFaq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={`qa-item ${isOpen ? "open" : ""}`}>
              <button
                className="qa-q"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span className="qa-icon" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <div className="qa-a-wrap" style={{ maxHeight: isOpen ? 400 : 0 }}>
                <p className="qa-a">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
      <AskQuestionForm endpoint={endpoint} faq={faq} />
    </div>
  );
}

function WhatsHappening({ endpoint }) {
  const { posts, events, faq, loaded } = useContent(endpoint);
  const loading = !loaded;
  return (
    <section className="happening" data-screen-label="02 Happening">
      <div className="happening-head">
        <h2 className="happening-title">What's happening</h2>
        <p className="happening-sub">Schedules · Updates · Answers</p>
      </div>
      <div className="happening-grid">
        <Feed posts={posts} loading={loading} endpoint={endpoint} />
        <Calendar events={events} loading={loading} />
        <QA faq={faq} endpoint={endpoint} loading={loading} />
      </div>
    </section>
  );
}
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroBg": "pattern",
  "signupEndpoint": "https://script.google.com/macros/s/AKfycbxKWDLcTjDwwXb-rNq9LTpqQwmlGgvLHZf9kJKDG7DHqwNp6vjaXD8S4ccG_41CBMfk/exec"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <div className="page">
      <Nav />
      <Hero bg={t.heroBg} endpoint={t.signupEndpoint} />
      <WhatsHappening endpoint={t.signupEndpoint} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero background" />
        <TweakRadio
          label="Style"
          value={t.heroBg}
          options={["pattern", "scoreboard", "black", "red", "lime"]}
          onChange={(v) => setTweak("heroBg", v)}
        />

        <TweakSection label="Email backend" />
        <TweakText
          label="Apps Script URL"
          value={t.signupEndpoint}
          placeholder="https://script.google.com/.../exec"
          onChange={(v) => setTweak("signupEndpoint", v)}
        />
        <TweakButton
          label="View local backup"
          onClick={() => {
            const rows = JSON.parse(localStorage.getItem("slam_signups") || "[]");
            if (!rows.length) { alert("No local signups yet."); return; }
            const csv = "email,at\n" + rows.map((r) => `${r.email},${r.at}`).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "slam-signups.csv"; a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download CSV
        </TweakButton>
      </TweaksPanel>
    </div>
  );
}

window.App = App;
