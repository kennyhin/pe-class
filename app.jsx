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

      <div className="signup-footnote">
        <Icon name="shield-check" size={13} />
        No spam, ever · Unsubscribe any time
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
  { date: "2026-05-27", type: "practice", title: "Basketball · Grades 3-5", time: "5:30 PM · Gym B" },
  { date: "2026-05-29", type: "game",     title: "Soccer Friday Night Lights", time: "6:00 PM · East Field" },
  { date: "2026-06-02", type: "practice", title: "T-Ball · Grades K-2", time: "4:30 PM · Field 1" },
  { date: "2026-06-05", type: "event",    title: "Family BBQ + Skills Day", time: "11:00 AM · Park Pavilion" },
  { date: "2026-06-10", type: "game",     title: "Championship — Spring League", time: "7:00 PM · Center Court" },
  { date: "2026-06-14", type: "event",    title: "Summer Camp Kickoff", time: "9:00 AM · Main Gym" },
];

const DEFAULT_POSTS = [
  {
    name: "Coach Marcus",
    handle: "@coachmarc",
    time: "2h",
    body: "Practice moved indoors tonight — field's a mud pit. Gym B, same time. Bring water bottles.",
    accent: "red",
  },
  {
    name: "SLAM! Athletics",
    handle: "@slamES",
    time: "1d",
    body: "Spring league finals THIS Saturday. 4 fields, 8 games, 100+ kids. Come loud.",
    accent: "lime",
  },
  {
    name: "Coach Riley",
    handle: "@rileyhoops",
    time: "2d",
    body: "Mason hit his first three-pointer in a game today. The bench EXPLODED. This is why we coach.",
    accent: "lime",
  },
  {
    name: "SLAM! Athletics",
    handle: "@slamES",
    time: "4d",
    body: "Summer camp registration opens Monday at 9AM. K-5, 8 weeks, every kid plays every game.",
    accent: "red",
  },
];

const DEFAULT_FAQ = [
  { q: "What ages do you serve?", a: "Kindergarten through 5th grade (ages 5-11). Programs are split by age band so kids play with peers their own size and skill level." },
  { q: "How much does it cost?", a: "Most seasons run $240 for 8 weeks (1 practice + 1 game per week). Scholarships available — just ask." },
  { q: "Are coaches certified?", a: "Every coach is CPR + first-aid certified, background-checked, and trained on our developmental model." },
  { q: "What if my kid has never played before?", a: "Perfect. That's exactly who we built this for. Every program starts with fundamentals — running, throwing, catching, sportsmanship. No experience required." },
  { q: "Can I get a refund if my kid hates it?", a: "Yes. Full refund within the first 2 weeks, no questions asked." },
];

function getEventIcon(event) {
  const title = String(event?.title || "").toLowerCase();
  const type = String(event?.type || "event").toLowerCase();

  if (title.includes("basketball")) return "🏀";
  if (title.includes("soccer")) return "⚽";
  if (title.includes("t-ball") || title.includes("baseball")) return "⚾";
  if (title.includes("softball")) return "🥎";
  if (title.includes("football")) return "🏈";
  if (title.includes("volleyball")) return "🏐";
  if (title.includes("tennis")) return "🎾";
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

function formatEventDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Selected day";
  return date.toLocaleDateString("default", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Pulls all three content arrays from the Apps Script endpoint on mount.
// Returns the fallback arrays until the fetch resolves, so the page is never
// blank. If the fetch fails (CORS, network, sheet empty, etc.), the fallbacks
// remain — no error UI for content, just defaults.
function useContent(endpoint) {
  const [content, setContent] = useState({
    posts: DEFAULT_POSTS,
    events: DEFAULT_EVENTS,
    faq: DEFAULT_FAQ,
    loaded: false,
  });

  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    fetch(`${endpoint}?action=all&t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setContent((prev) => ({
          posts:  Array.isArray(data.posts)  && data.posts.length  ? data.posts  : prev.posts,
          events: Array.isArray(data.events) && data.events.length ? data.events : prev.events,
          faq:    Array.isArray(data.faq)    && data.faq.length    ? data.faq    : prev.faq,
          loaded: true,
        }));
      })
      .catch(() => {
        // Silent fail — keep fallback content.
        if (!cancelled) setContent((prev) => ({ ...prev, loaded: true }));
      });
    return () => { cancelled = true; };
  }, [endpoint]);

  return content;
}

function Calendar({ events }) {
  // Show the current month, dynamically. Today is highlighted.
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(today).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

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

  const monthEvents = events
    .filter((e) => eventDateKey(e).startsWith(monthPrefix))
    .sort((a, b) => eventDateKey(a).localeCompare(eventDateKey(b)));

  const selectedEvents = events
    .filter((e) => eventDateKey(e) === selectedDate)
    .sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));

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
        {selectedEvents.length === 0 ? (
          <div className="cal-empty">No events scheduled for this day.</div>
        ) : selectedEvents.map((e, i) => {
          const type = String(e.type || "event").toLowerCase();
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
        <div className="cal-upcoming-label">This month</div>
        {monthEvents.length === 0 ? (
          <div className="cal-empty">No events listed for {monthLabel}.</div>
        ) : monthEvents.map((e, i) => {
          const dateKey = eventDateKey(e);
          const dayNum = parseInt(dateKey.slice(8, 10), 10);
          return (
            <button
              key={`${dateKey}-${i}`}
              type="button"
              className={`cal-month-event${selectedDate === dateKey ? " selected" : ""}`}
              onClick={() => setSelectedDate(dateKey)}
            >
              <span className="cal-month-day">{Number.isNaN(dayNum) ? "?" : dayNum}</span>
              <span className="cal-month-title">{getEventIcon(e)} {e.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Updates feed (Twitter/X style) ---
function Feed({ posts }) {
  return (
    <div className="card feed">
      <div className="card-head">
        <span className="card-eyebrow">Updates</span>
        <span className="card-meta">@slamES</span>
      </div>
      <div className="feed-list">
        {posts.length === 0 ? (
          <div className="cal-empty">No updates yet.</div>
        ) : posts.map((p, i) => {
          const accent = (p.accent || "").toLowerCase() === "lime" ? "lime"
                       : (p.accent || "").toLowerCase() === "red"  ? "red"
                       : "neutral";
          const initials = String(p.name || "?")
            .split(/\s+/).filter(Boolean)
            .map((w) => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <article key={i} className="post">
              <div className={`post-avatar accent-${accent}`}>{initials}</div>
              <div className="post-body">
                <div className="post-meta">
                  <span className="post-name">{p.name}</span>
                  <span className="post-handle">{p.handle}{p.time ? ` · ${p.time}` : ""}</span>
                </div>
                <p className="post-text">{p.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// --- Q&A ---
function AskQuestionForm({ endpoint }) {
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [status, setStatus] = useState({ kind: "idle", msg: "" });

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

function QA({ faq, endpoint }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="card qa">
      <div className="card-head">
        <span className="card-eyebrow">Q&amp;A</span>
        <span className="card-meta">{faq.length} {faq.length === 1 ? "question" : "questions"}</span>
      </div>
      <div className="qa-list">
        {faq.map((item, i) => {
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
      <AskQuestionForm endpoint={endpoint} />
    </div>
  );
}

function WhatsHappening({ endpoint }) {
  const { posts, events, faq } = useContent(endpoint);
  return (
    <section className="happening" data-screen-label="02 Happening">
      <div className="happening-head">
        <h2 className="happening-title">What's happening</h2>
        <p className="happening-sub">Schedules · Updates · Answers</p>
      </div>
      <div className="happening-grid">
        <Calendar events={events} />
        <Feed posts={posts} />
        <QA faq={faq} endpoint={endpoint} />
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
