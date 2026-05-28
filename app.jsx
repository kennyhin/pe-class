/* eslint-disable */
// SLAM! ES Athletics — Landing page

const { useState, useEffect } = React;

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
    case "thumbs-up":
      return (
        <svg {...common}>
          <path d="M7 10v11" />
          <path d="M15 5.9 14 10h5.7a2 2 0 0 1 1.9 2.5l-1.5 6A2 2 0 0 1 18.2 20H9.5A2.5 2.5 0 0 1 7 17.5v-6.2c0-.8.4-1.5 1-2L13.1 4a1.4 1.4 0 0 1 1.9 1.9Z" />
          <path d="M3 10h4v11H3z" />
        </svg>
      );
    case "bull-head":
      return (
        <svg {...common} viewBox="0 0 28 24">
          <path d="M8.2 9.1C5.3 8.2 3.3 6.3 2.4 3.4c2.5-.1 4.9.8 6.7 2.6" />
          <path d="M19.8 9.1c2.9-.9 4.9-2.8 5.8-5.7-2.5-.1-4.9.8-6.7 2.6" />
          <path d="M8.2 9.1c.6-3.2 2.5-4.8 5.8-4.8s5.2 1.6 5.8 4.8" />
          <path d="M7.3 10.4c.4 6.2 2.6 10 6.7 10s6.3-3.8 6.7-10" />
          <path d="M10.4 13.5h.1" />
          <path d="M17.5 13.5h.1" />
          <path d="M12.1 18.1c.8.6 3 .6 3.8 0" />
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
  const [open, setOpen] = useState(false);
  const items = [
    ["Register for sports", "slam-register.html"],
    ["Athletic eligibility", "slam-eligibility.html"],
    ["Sports physicals/insurance", "#physicals"],
    ["Bulls commitment", "#commitment"],
    ["Sports offered", "#sports"],
    ["Tryouts", "slam-tryouts.html"],
    ["Coach for SLAM!", "#coach"],
  ];
  return (
    <nav className={`side-nav ${open ? "open" : ""}`} aria-label="Athletics navigation">
      <button
        className="side-nav-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>Menu</span>
        <i aria-hidden="true" />
      </button>
      <button
        className="side-nav-logo"
        type="button"
        aria-label="Open athletics menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <img src="assets/bull-only-transparent.png" alt="SLAM! Athletics bull" />
      </button>
      {items.map(([label, href]) => (
        <a key={label} href={href}>
          <span>{label}</span>
          <i aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
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

const HERO_SHORTCUTS = [
  { key: "register", eyebrow: "Register", label: "Register for sports", href: "slam-register.html", mode: "page" },
  { key: "eligibility", eyebrow: "Eligibility", label: "Athletic eligibility", href: "slam-eligibility.html", mode: "page" },
  { key: "physicals", eyebrow: "Physicals", label: "Sports physicals", href: "#physicals", mode: "info" },
  { key: "sports", eyebrow: "Sports", label: "Sports offered", href: "#sports", mode: "info" },
  { key: "tryouts", eyebrow: "Tryouts", label: "Tryout form", href: "slam-tryouts.html", mode: "page" },
  { key: "coach", eyebrow: "Coach", label: "Coach for SLAM!", href: "#coach", mode: "info" },
];

function ShortcutModal({ item, onClose }) {
  const isPage = item.mode === "page";

  useEffect(() => {
    function handleShortcutMessage(event) {
      if (event?.data?.type === "closeShortcutModal") {
        onClose();
      }
    }

    window.addEventListener("message", handleShortcutMessage);
    return () => window.removeEventListener("message", handleShortcutMessage);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="shortcut-modal" role="dialog" aria-modal="true" aria-label={item.label}>
      <button className="shortcut-modal-backdrop" type="button" aria-label="Close" onClick={onClose} />
      <section className={`shortcut-modal-panel ${isPage ? "page-panel" : ""}`}>
        <button className="shortcut-modal-close" type="button" onClick={onClose}>×</button>
        {isPage ? (
          <iframe title={item.label} src={`${item.href}?modal=1`} />
        ) : (
          <ShortcutInfo item={item} />
        )}
      </section>
    </div>,
    document.body
  );
}

function ShortcutInfo({ item }) {
  if (item.key === "physicals") {
    return (
      <div className="shortcut-info">
        <div className="shortcut-kicker">Sports Physicals</div>
        <h2>Clear before tryouts</h2>
        <p>Sports physicals should be uploaded to Register My Athlete. Please do not turn physicals in to teachers, office admin, or athletic directors.</p>
        <div className="shortcut-actions">
          <a href="https://www.ncsaasports.com/physicals.html" target="_blank" rel="noopener">Physical form</a>
          <a href="https://www.cvs.com/minuteclinic/services/sports-physicals" target="_blank" rel="noopener">Schedule physical</a>
        </div>
      </div>
    );
  }
  if (item.key === "sports") {
    const seasons = [
      ["Fall", "Flag Football, Girls Volleyball, Cross Country, Cheer, Baseball"],
      ["Winter", "Basketball, Bowling, Cheer, Baseball"],
      ["Spring", "Soccer, Boys Volleyball, Cheer Competitions, Track & Field"],
    ];
    return (
      <div className="shortcut-info">
        <div className="shortcut-kicker">Sports Offered</div>
        <h2>Elementary athletics</h2>
        <p>SLAM! Athletics offers seasonal sports for elementary students. Final divisions depend on league offerings, coach availability, and student interest.</p>
        <div className="season-list">
          {seasons.map(([season, copy]) => (
            <article key={season}>
              <span>{season}</span>
              <strong>{copy}</strong>
            </article>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="shortcut-info">
      <div className="shortcut-kicker">Coach for SLAM!</div>
      <h2>Lead the next team</h2>
      <p>Interested coaches can help build a positive, organized, student-first athletics experience. Reach out to SLAM! Athletics with the sport, season, and grade level you can support.</p>
      <div className="shortcut-actions">
        <a href="mailto:kenny.hin@slamnv.org">Email athletics</a>
      </div>
    </div>
  );
}

function Hero({ bg, endpoint }) {
  const [shortcutModal, setShortcutModal] = useState(null);

  function openShortcut(event, item) {
    const smallScreen = window.matchMedia("(max-width: 760px)").matches;
    if (smallScreen && item.mode === "page") return;
    event.preventDefault();
    setShortcutModal(item);
  }

  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <HeroBackground variant={bg} />
      <Nav />
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

        <div className="hero-shortcuts" aria-label="Quick links">
          {HERO_SHORTCUTS.map((item) => (
            <a className="hero-shortcut" href={item.href} key={item.key} onClick={(event) => openShortcut(event, item)}>
              <span>{item.eyebrow}</span>
              <strong>{item.label}</strong>
              <Icon name="arrow-right" size={14} />
            </a>
          ))}
        </div>
      </div>
      {shortcutModal && <ShortcutModal item={shortcutModal} onClose={() => setShortcutModal(null)} />}
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

const STAFF_POST_ROLES = ["Admin", "Teacher", "Coach"];
const COMMUNITY_POST_ROLES = ["Parent", "Student"];
const STAFF_PIN_HASH = 1687348;
const STUDENT_GRADES = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade"];
const STAFF_BADGE_COLORS = [
  ["gold", "Gold"],
  ["lime", "Green"],
  ["red", "Red"],
  ["blue", "Blue"],
  ["white", "White"],
];
const COACH_QUOTES = [
  ["John Wooden", "Make each day your masterpiece."],
  ["John Wooden", "Success is peace of mind, which is a direct result of self-satisfaction in knowing you made the effort."],
  ["Vince Lombardi", "Individual commitment to a group effort is what makes a team work."],
  ["Pat Summitt", "Discipline helps you finish a job, and finishing is what separates excellent work from average work."],
  ["Phil Jackson", "The strength of the team is each individual member. The strength of each member is the team."],
];

const POST_NAME_OPTIONS = [
  "SLAM! ES Football",
  "SLAM! ES Volleyball",
  "SLAM! ES Basketball",
  "SLAM! ES Soccer",
  "SLAM! ES Track",
  "SLAM! ES Cross Country",
  "SLAM! ES Cheer",
  "SLAM! ES Baseball",
  "Teacher",
  "Admin",
];

const DEFAULT_FAQ = [
  { q: "What ages do you serve?", a: "Kindergarten through 5th grade (ages 5-11). Programs are split by age band so kids play with peers their own size and skill level.", link: "" },
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

function postDateKey(post) {
  return String(post?.date || post?.time || "").slice(0, 10);
}

function postSortKey(post) {
  return String(post?.timestamp || post?.time || post?.date || "");
}

function sortPostsByDate(a, b) {
  return postSortKey(b).localeCompare(postSortKey(a))
    || String(b.name || "").localeCompare(String(a.name || ""));
}

function formatRelativePostTime(post) {
  const raw = post?.timestamp || post?.time || post?.date;
  if (!raw) return "";
  let date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime()) && postDateKey(post)) {
    date = new Date(`${postDateKey(post)}T00:00:00`);
  }
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "now";
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours <= 5) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) {
    const count = Math.max(1, days);
    return `${count} ${count === 1 ? "day" : "days"} ago`;
  }
  const weeks = Math.floor(days / 7);
  const count = Math.max(1, weeks);
  return `${count} ${count === 1 ? "week" : "weeks"} ago`;
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

function linkifyNotes(text) {
  const str = String(text || "");
  // Handle [display text](url) markdown-style links
  const mdParts = str.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\))/g);
  if (mdParts.length > 1) {
    return mdParts.map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
      if (match) {
        return (
          <a key={i} className="post-link" href={match[2]} target="_blank" rel="noopener noreferrer">
            {match[1]}
          </a>
        );
      }
      return part;
    });
  }
  // Fallback: plain URL linkification
  return linkifyText(str);
}

function isImageUrl(url) {
  const value = String(url || "").trim();
  return /^https?:\/\//i.test(value) || /^data:image\//i.test(value);
}

function googleDriveFileId(url) {
  const value = String(url || "").trim();
  return value.match(/\/d\/([^/?#]+)/)?.[1]
    || value.match(/[?&]id=([^&#]+)/)?.[1]
    || "";
}

function displayImageUrl(url) {
  const value = String(url || "").trim();
  const driveId = googleDriveFileId(value);
  return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w500` : value;
}

function postBadge(post) {
  const submitter = String(post?.submitter || post?.name || "").trim().toLowerCase();
  const grade = String(post?.grade || "").trim().toLowerCase();
  if (["admin", "teacher", "coach"].includes(submitter)) {
    const color = String(post?.badgeColor || post?.badge || "").trim().toLowerCase();
    const colorKey = STAFF_BADGE_COLORS.some(([key]) => key === color) ? color : "gold";
    return { label: "✓", className: `staff staff-${colorKey}`, title: "Verified staff" };
  }
  if (submitter === "parent") {
    return { label: "✓", className: "parent", title: "Approved parent" };
  }
  if (submitter === "student" || grade) {
    const gradeKey = studentBadgeClass(grade).replace("grade-", "");
    return { label: "✓", className: `student grade-${gradeKey}`, title: "Approved student" };
  }
  return { label: "✓", className: "staff", title: "Verified update" };
}

function studentBadgeClass(grade) {
  const value = String(grade || "").trim().toLowerCase();
  if (value.includes("kindergarten")) return "grade-kinder";
  if (value.includes("1st")) return "grade-first";
  if (value.includes("2nd")) return "grade-second";
  if (value.includes("3rd")) return "grade-third";
  if (value.includes("4th")) return "grade-fourth";
  if (value.includes("5th")) return "grade-fifth";
  return "grade-student";
}

function reactionDeviceKey() {
  const storageKey = "slam_reaction_device";
  try {
    let value = localStorage.getItem(storageKey);
    if (!value) {
      value = `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(storageKey, value);
    }
    return value;
  } catch (_) {
    return navigator.userAgent || "unknown-device";
  }
}

function reactedPostIds() {
  try {
    return JSON.parse(localStorage.getItem("slam_reacted_posts") || "{}");
  } catch (_) {
    return {};
  }
}

function saveReactedPostIds(value) {
  try { localStorage.setItem("slam_reacted_posts", JSON.stringify(value)); } catch (_) {}
}

function LoadingState({ label = "Loading..." }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
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
    const cacheKey = "slam_content_cache";
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (cached && cached.posts && cached.events && cached.faq) {
        setContent({ ...cached, loaded: true, error: false });
      } else {
        setContent({ posts: [], events: [], faq: [], loaded: false, error: false });
      }
    } catch (_) {
      setContent({ posts: [], events: [], faq: [], loaded: false, error: false });
    }
    fetch(`${endpoint}?action=all&t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const next = {
          posts: Array.isArray(data.posts) ? data.posts : [],
          events: Array.isArray(data.events) ? data.events : [],
          faq: Array.isArray(data.faq) ? data.faq : [],
        };
        try { localStorage.setItem(cacheKey, JSON.stringify(next)); } catch (_) {}
        setContent({
          ...next,
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

function EventDetailModal({ event, onClose }) {
  const type = eventType(event);
  const icon = getEventIcon(event);
  const hasNotes = event.notes && event.notes.trim();
  const hasOpponent = event.opponent && event.opponent.trim();
  const hasLocation = event.location && event.location.trim();

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="event-detail-modal" role="dialog" aria-modal="true" aria-label={event.title}>
      <button className="event-detail-backdrop" type="button" aria-label="Close" onClick={onClose} />
      <div className="event-detail-panel">
        <button className="shortcut-modal-close" type="button" onClick={onClose}>×</button>
        <div className="event-detail-icon">{icon}</div>
        <div className={`event-detail-type tag-${type}`}>{type}</div>
        <h2 className="event-detail-title">{event.title}</h2>
        <div className="event-detail-rows">
          {event.time && (
            <div className="event-detail-row">
              <span className="event-detail-label">When</span>
              <span>{event.time}</span>
            </div>
          )}
          {hasLocation && (
            <div className="event-detail-row">
              <span className="event-detail-label">Where</span>
              <span>{event.location}</span>
            </div>
          )}
          {event.sport && (
            <div className="event-detail-row">
              <span className="event-detail-label">Sport</span>
              <span>{event.sport}</span>
            </div>
          )}
          {hasOpponent && (
            <div className="event-detail-row">
              <span className="event-detail-label">Vs.</span>
              <span>{event.opponent}</span>
            </div>
          )}
        </div>
        {hasNotes && (
          <div className="event-detail-notes">
            <div className="event-detail-notes-label">Notes</div>
            <p>{linkifyNotes(event.notes)}</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
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
  const [detailEvent, setDetailEvent] = useState(null);
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });
  const next3DaysStr = addDaysToKey(todayStr, 3);

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
      return dateKey >= todayStr && dateKey <= next3DaysStr;
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

  const gamesNextWeek = futureGames.filter((e) => eventDateKey(e) <= next3DaysStr).length;

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
    const hasDetail = (e.notes && e.notes.trim()) || (e.opponent && e.opponent.trim());
    return (
      <button
        key={`${mode}-${dateKey}-${i}`}
        type="button"
        className={`cal-month-event${selectedDate === dateKey ? " selected" : ""}${hasDetail ? " has-detail" : ""}`}
        onClick={() => { setSelectedDate(dateKey); setDetailEvent(e); }}
      >
        <span className="cal-month-day">
          <span className="cal-month-dow">{dow}</span>
          <span>{Number.isNaN(dayNum) ? "?" : dayNum}</span>
        </span>
        <span className="cal-month-copy">
          <span className="cal-month-title">{getEventIcon(e)} {e.title}</span>
          <span className="cal-month-meta">{type} · {e.time || "Time TBA"}</span>
        </span>
        {hasDetail && <span className="cal-month-info-badge" aria-hidden="true">i</span>}
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

      {(loading || selectedEvents.length > 0) && (
        <div className="cal-upcoming">
          <div className="cal-upcoming-label">{formatEventDate(selectedDate)}</div>
          {loading ? (
            <LoadingState label="Loading schedule..." />
          ) : selectedEvents.map((e, i) => {
          const type = eventType(e);
          const icon = getEventIcon(e);
          return (
            <button key={i} type="button" className="cal-event cal-event-clickable" onClick={() => setDetailEvent(e)}>
              <div className="cal-event-icon">
                <span className="cal-event-emoji">{icon}</span>
              </div>
              <div className="cal-event-body">
                <div className={`cal-event-tag tag-${type}`}>{type}</div>
                <div className="cal-event-title">{e.title}</div>
                <div className="cal-event-time">{e.time}</div>
              </div>
              <span className="cal-event-info-badge" aria-hidden="true">i</span>
            </button>
          );
          })}
        </div>
      )}

      <div className="cal-month-list">
        <div className="cal-section-head">
          <div>
            <div className="cal-upcoming-label">Upcoming events</div>
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
          <LoadingState label="Loading events..." />
        ) : visibleUpcoming.length === 0 ? (
          <div className="cal-empty">No matching events in the next 7 days.</div>
        ) : visibleUpcoming.map((e, i) => renderEventRow(e, i, "upcoming"))}
      </div>

      <div className="cal-games-list">
        <div className="cal-section-head">
          <div>
            <div className="cal-upcoming-label">Games</div>
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
          <LoadingState label="Loading games..." />
        ) : visibleGames.length === 0 ? (
          <div className="cal-empty">No games match this sport yet.</div>
        ) : visibleGames.map((e, i) => renderEventRow(e, i, "game"))}
      </div>
      {detailEvent && <EventDetailModal event={detailEvent} onClose={() => setDetailEvent(null)} />}
    </div>
  );
}

function staffPinHash(pin) {
  return String(pin || "").split("").reduce((total, char) => (
    (total * 31) + char.charCodeAt(0)
  ), 0);
}

function readPhotoAsPostImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const sx = Math.round((img.width - size) / 2);
        const sy = Math.round((img.height - size) / 2);
        const canvas = document.createElement("canvas");
        canvas.width = 420;
        canvas.height = 420;
        canvas.getContext("2d").drawImage(img, sx, sy, size, size, 0, 0, 420, 420);
        resolve(canvas.toDataURL("image/jpeg", 0.64));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function DesktopPostModal({ endpoint, onClose }) {
  const [role, setRole] = useState("");
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");
  const [title, setTitle] = useState("Admin");
  const [handle, setHandle] = useState("");
  const [sport, setSport] = useState("");
  const [grade, setGrade] = useState("");
  const [badgeColor, setBadgeColor] = useState("gold");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageType, setImageType] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isStaff = STAFF_POST_ROLES.includes(role);
  const needsReview = role === "Parent" || role === "Student";
  const canShowForm = role && (!isStaff || unlocked);
  const visibleTitle = isStaff ? title : role;
  const quote = useState(() => COACH_QUOTES[Math.floor(Math.random() * COACH_QUOTES.length)])[0];
  const cleanHandle = handle.trim().replace(/^@+/, "");
  const previewHandle = cleanHandle || (role === "Parent" ? "johnnys_mom" : role === "Student" ? "student_name" : "mr_wong");
  const previewSport = sport || "Other";

  function chooseRole(nextRole) {
    setRole(nextRole);
    setTitle(STAFF_POST_ROLES.includes(nextRole) ? nextRole : nextRole);
    setUnlocked(!STAFF_POST_ROLES.includes(nextRole));
    setBadgeColor("gold");
    setPin("");
    setPinError("");
  }

  function enterPinDigit(digit) {
    if (!isStaff || unlocked) return;
    const next = `${pin}${digit}`.slice(0, 4);
    setPin(next);
    setPinError("");
    if (next.length === 4) {
      if (staffPinHash(next) === STAFF_PIN_HASH) {
        setUnlocked(true);
      } else {
        setPinError("That code did not match. Try again.");
        setTimeout(() => setPin(""), 140);
      }
    }
  }

  function resetRole() {
    setRole("");
    setPin("");
    setUnlocked(false);
    setPinError("");
    setStatus("");
  }

  async function handlePhoto(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    setStatus("Preparing photo...");
    try {
      const dataUrl = await readPhotoAsPostImage(file);
      setImageData(dataUrl);
      setImageName(file.name || "slam-update.jpg");
      setImageType("image/jpeg");
      setStatus("Photo ready.");
    } catch (_) {
      setStatus("Could not prepare that photo. Try another image.");
    }
  }

  async function submitPost(event) {
    event.preventDefault();
    if (!role || !body.trim() || !sport || !cleanHandle || (role === "Student" && !grade)) {
      setStatus("Please finish the required fields.");
      return;
    }
    setSubmitting(true);
    setStatus(needsReview ? "Sending for review..." : "Posting update...");
    const fd = new FormData();
    fd.append("action", "post");
    fd.append("pin", isStaff ? pin : "");
    fd.append("submitter", role);
    fd.append("name", visibleTitle);
    fd.append("grade", role === "Student" ? grade : "");
    fd.append("badgeColor", isStaff ? badgeColor : "");
    fd.append("sport", sport);
    fd.append("handle", `@${cleanHandle}`);
    fd.append("body", body.trim());
    fd.append("link", link.trim());
    fd.append("image", "");
    fd.append("imageData", imageData);
    fd.append("imageName", imageName);
    fd.append("imageType", imageType);
    fd.append("ua", navigator.userAgent);
    try {
      await fetch(endpoint, { method: "POST", body: fd, mode: "no-cors" });
      setStatus(needsReview ? "Sent for review." : "Post sent. It may take a moment to appear.");
      setTimeout(onClose, 1200);
    } catch (_) {
      setSubmitting(false);
      setStatus("Could not submit. Check connection and try again.");
    }
  }

  return (
    <div className="staff-post-modal native" role="dialog" aria-modal="true" aria-label="Create update">
      <button className="staff-post-modal-backdrop" type="button" aria-label="Close post form" onClick={onClose} />
      <div className="staff-post-modal-panel native">
        <button className="staff-post-modal-close" type="button" onClick={onClose}>×</button>
        <div className="native-post">
          <aside className="native-post-side">
            <img src="assets/bull-only-transparent.png" alt="" />
            <span>SLAM! Athletics</span>
            <h2>Coach's Note</h2>
            <p>“{quote[1]}”</p>
            <small>— {quote[0]}</small>
          </aside>

          <section className="native-post-work">
            {!role && (
              <div className="native-step">
                <div className="native-kicker">Choose access</div>
                <h3>Who is posting?</h3>
                <div className="native-role-grid">
                  {[...STAFF_POST_ROLES, ...COMMUNITY_POST_ROLES].map((item) => (
                    <button type="button" key={item} onClick={() => chooseRole(item)}>
                      <strong>{item}</strong>
                      <span>{STAFF_POST_ROLES.includes(item) ? "Staff" : "Review first"}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {role && isStaff && !unlocked && (
              <div className="native-step pin">
                <button className="native-back" type="button" onClick={resetRole}>← Change role</button>
                <div className="native-kicker">Authorized staff only</div>
                <h3>Enter staff PIN</h3>
                <div className="native-pin-dots" aria-label="PIN progress">
                  {[0, 1, 2, 3].map((dot) => <span key={dot} className={dot < pin.length ? "on" : ""} />)}
                </div>
                {pinError && <p className="native-error">{pinError}</p>}
                <div className="native-keypad">
                  {[1,2,3,4,5,6,7,8,9].map((digit) => (
                    <button type="button" key={digit} onClick={() => enterPinDigit(digit)}>{digit}</button>
                  ))}
                  <button type="button" onClick={() => setPin((value) => value.slice(0, -1))}>⌫</button>
                  <button type="button" onClick={() => enterPinDigit(0)}>0</button>
                  <button type="button" onClick={() => setPin("")}>Clear</button>
                </div>
              </div>
            )}

            {canShowForm && (
              <form className="native-builder" onSubmit={submitPost}>
                <div className="native-builder-fields">
                  <button className="native-back" type="button" onClick={resetRole}>← Change role</button>
                  <div className="native-kicker">{isStaff ? "Staff post" : `${role} post`}</div>
                  <h3>Post</h3>
                  {isStaff && (
                    <label>Title
                      <div className="native-title-row">
                        {STAFF_POST_ROLES.map((item) => (
                          <button type="button" key={item} className={title === item ? "active" : ""} onClick={() => setTitle(item)}>{item}</button>
                        ))}
                      </div>
                    </label>
                  )}
                  {isStaff && (
                    <label>Badge color
                      <div className="native-badge-row">
                        {STAFF_BADGE_COLORS.map(([key, label]) => (
                          <button
                            type="button"
                            key={key}
                            className={`badge-choice ${key}${badgeColor === key ? " active" : ""}`}
                            onClick={() => setBadgeColor(key)}
                            aria-label={`${label} verified badge`}
                          >
                            <span>✓</span>
                            <strong>{label}</strong>
                          </button>
                        ))}
                      </div>
                    </label>
                  )}
                  <label>Handle
                    <div className="native-handle"><span>@</span><input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder={previewHandle} /></div>
                  </label>
                  {role === "Student" && (
                    <label>Grade
                      <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                        <option value="">Pick a grade</option>
                        {STUDENT_GRADES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </label>
                  )}
                  <label>Sport supporting
                    <select value={sport} onChange={(e) => setSport(e.target.value)}>
                      <option value="">Pick a sport</option>
                      {SPORT_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>
                  <label>Post
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} />
                  </label>
                  <label>Link
                    <input type="url" value={link} onChange={(e) => setLink(e.target.value)} />
                  </label>
                  <div className="native-photo-row">
                    <label>Add photo<input type="file" accept="image/*" onChange={handlePhoto} /></label>
                    <label>Take photo<input type="file" accept="image/*" capture="environment" onChange={handlePhoto} /></label>
                  </div>
                </div>

                <aside className="native-preview">
                  <div className="native-kicker">Live preview</div>
                  <article className="post native-preview-post">
                    <div className="post-avatar">{getEventIcon({ sport: previewSport, title: previewSport, type: "event" })}</div>
                    <div className="post-body">
                      <div className="post-meta">
                        <span className="post-name">{visibleTitle || "Post"}</span>
                        <span className={`post-badge ${isStaff ? `staff staff-${badgeColor}` : role === "Parent" ? "parent" : `student ${studentBadgeClass(grade)}`}`}>✓</span>
                        <span className="post-handle">@{previewHandle}</span>
                        {role === "Student" && grade && <span className="post-grade">{grade}</span>}
                        <span className="post-date">now</span>
                      </div>
                      <p className="post-text">{body.trim() || "Your update will preview here as you type."}</p>
                      {imageData && <img className="post-image" src={imageData} alt="" />}
                    </div>
                  </article>
                  {needsReview && <p className="native-review-note">Parent and student posts go to the spreadsheet for approval first.</p>}
                  <button className="native-submit" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Submit post"}</button>
                  {status && <p className="native-status">{status}</p>}
                </aside>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// --- Updates feed (Twitter/X style) ---
function Feed({ posts, loading, endpoint }) {
  const sortedPosts = [...posts].sort(sortPostsByDate);
  const [reactionBumps, setReactionBumps] = useState({});
  const [reacted, setReacted] = useState(reactedPostIds);
  const [showPostModal, setShowPostModal] = useState(false);

  function reactToPost(post, reaction) {
    const postId = String(post.id || "").trim();
    if (!postId) return;
    const previous = reacted[postId] || "";
    const nextReacted = { ...reacted };
    if (previous === reaction) {
      delete nextReacted[postId];
    } else {
      nextReacted[postId] = reaction;
    }
    setReacted(nextReacted);
    saveReactedPostIds(nextReacted);
    setReactionBumps((current) => ({
      ...current,
      [postId]: {
        ...current[postId],
        ...(previous && { [previous]: (current[postId]?.[previous] || 0) - 1 }),
        ...(previous !== reaction && { [reaction]: (current[postId]?.[reaction] || 0) + 1 }),
      },
    }));
    if (!endpoint) return;
    const body = new FormData();
    body.append("action", "react");
    body.append("postId", postId);
    body.append("reaction", reaction);
    body.append("mode", previous === reaction ? "remove" : "add");
    body.append("previousReaction", previous);
    body.append("voterKey", reactionDeviceKey());
    body.append("ua", navigator.userAgent);
    fetch(endpoint, { method: "POST", body, mode: "no-cors" }).catch(() => {});
  }

  return (
    <div className="card feed">
      <div className="card-head">
        <span className="card-eyebrow">Feed</span>
        <span className="card-meta">@slamES</span>
      </div>
      <div className="feed-list">
        {loading ? (
          <LoadingState label="Loading updates..." />
        ) : sortedPosts.length === 0 ? (
          <div className="cal-empty">No updates yet.</div>
        ) : sortedPosts.map((p, i) => {
          const icon = getEventIcon({ sport: p.sport, title: p.sport, type: "event" });
          const dateLabel = formatRelativePostTime(p);
          const link = String(p.link || "").trim();
          const imageUrl = String(p.image || "").trim();
          const displayUrl = displayImageUrl(imageUrl);
          const badge = postBadge(p);
          const postId = String(p.id || "").trim();
          const bumps = reactionBumps[postId] || {};
          const counts = {
            like: Math.max(0, (Number(p.likes) || 0) + (bumps.like || 0)),
            heart: Math.max(0, (Number(p.hearts) || 0) + (bumps.heart || 0)),
            celebrate: Math.max(0, (Number(p.celebrates) || 0) + (bumps.celebrate || 0)),
          };
          return (
            <article key={i} className="post">
              <div className="post-avatar" aria-label={p.sport || "Update"}>{icon}</div>
              <div className="post-body">
                <div className="post-meta">
                  <span className="post-name">{p.name}</span>
                  <span className={`post-badge ${badge.className}`} title={badge.title} aria-label={badge.title}>{badge.label}</span>
                  <span className="post-handle">{p.handle}</span>
                  {p.grade && <span className="post-grade">{p.grade}</span>}
                  {dateLabel && <span className="post-date">{dateLabel}</span>}
                </div>
                <p className="post-text">{linkifyText(p.body)}</p>
                {isImageUrl(imageUrl) && (
                  <a className="post-image-link" href={imageUrl} target="_blank" rel="noopener noreferrer" aria-label="Open update photo">
                    <img className="post-image" src={displayUrl} alt="" loading="lazy" />
                  </a>
                )}
                {link && (
                  <a className="post-cta" href={link} target="_blank" rel="noopener noreferrer">
                    Open link <Icon name="arrow-right" size={13} />
                  </a>
                )}
                {imageUrl && (
                  <a className="post-cta" href={imageUrl} target="_blank" rel="noopener noreferrer">
                    View photo <Icon name="arrow-right" size={13} />
                  </a>
                )}
                <div className="post-reactions" aria-label="Post reactions">
                  {[
                    ["like", "thumbs-up", counts.like],
                    ["heart", "heart", counts.heart],
                    ["celebrate", "bull-head", counts.celebrate],
                  ].map(([key, iconName, count]) => (
                    <button
                      key={key}
                      type="button"
                      className={`reaction-btn${reacted[postId] === key ? " selected" : ""}`}
                      onClick={() => reactToPost(p, key)}
                      aria-label={`React with ${key}`}
                    >
                      <Icon name={iconName} size={15} />
                      <strong>{count}</strong>
                    </button>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <a
        className="staff-post-open"
        href="slam-staff-post.html"
        onClick={(event) => {
          if (window.matchMedia("(max-width: 760px)").matches) return;
          event.preventDefault();
          setShowPostModal(true);
        }}
      >
        Post
      </a>
      {showPostModal && ReactDOM.createPortal(
        <DesktopPostModal endpoint={endpoint} onClose={() => setShowPostModal(false)} />,
        document.body
      )}
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
  const [form, setForm] = useState({ email: "", question: "" });
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
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ kind: "error", msg: "That email does not look right." });
      return;
    }

    setStatus({ kind: "sending", msg: "Sending..." });

    try {
      const key = "slam_parent_questions";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push({
        name: "",
        email,
        question,
        at: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
    } catch (_) {}

    if (!endpoint) {
      setStatus({ kind: "success", msg: "Saved locally for now." });
      setForm({ email: "", question: "" });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("action", "question");
      fd.append("name", "");
      fd.append("email", email);
      fd.append("question", question);
      fd.append("ua", navigator.userAgent);
      await fetch(endpoint, { method: "POST", body: fd, mode: "no-cors" });
      setStatus({ kind: "success", msg: "Question sent. We will follow up soon." });
      setForm({ email: "", question: "" });
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
      <input
        className="ask-input"
        type="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        placeholder="Email"
        autoComplete="email"
        required
      />
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
        <a className="card-meta card-link" href="slam-faq.html">View all</a>
      </div>
      <div className="qa-list">
        {loading ? (
          <LoadingState label="Loading answers..." />
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
                <p className="qa-a">{linkifyText(item.a)}</p>
                {item.link && (
                  <a className="qa-link" href={item.link} target="_blank" rel="noopener noreferrer">
                    Open link <Icon name="arrow-right" size={13} />
                  </a>
                )}
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
        <h2 className="happening-title">What<span className="display-apostrophe">’</span>s happening</h2>
        <p className="happening-sub">Schedules · Feed · Answers</p>
      </div>
      <div className="happening-grid">
        <Feed posts={posts} loading={loading} endpoint={endpoint} />
        <Calendar events={events} loading={loading} />
        <QA faq={faq} endpoint={endpoint} loading={loading} />
      </div>
    </section>
  );
}

function BullsCommitmentCard() {
  const commitments = [
    "Respect all people at all times.",
    "Work hard and sacrifice personal glory for the team.",
    "Represent SLAM Academy with pride, honor, and integrity.",
    "Avoid drugs, alcohol, and tobacco to reach full potential.",
    "Be a positive role model for peers.",
    "Give best effort and attitude in class and competition.",
    "Act and play like a winner, regardless of the outcome.",
    "Abide by decisions made by coaches and officials.",
    "Wear approved team attire for practices, games, and travel.",
    "Communicate respectfully with players, coaches, and staff.",
  ];
  return (
    <section className="commitment-card" id="commitment">
      <div className="commitment-title-row">
        <h2 className="commitment-title">Bulls Commitment</h2>
        <span className="commitment-promise">I promise to</span>
      </div>
      <ol className="commitment-list">
        {commitments.map((item, i) => (
          <li key={item}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{item}</strong>
          </li>
        ))}
      </ol>
      <div className="commitment-signoff">I agree to uphold these promises at all times.</div>
    </section>
  );
}

function HomeLayout({ endpoint, heroBg }) {
  const { posts, events, faq, loaded } = useContent(endpoint);
  const loading = !loaded;
  return (
    <div className="home-layout">
      <main className="main-scroll">
        <Hero bg={heroBg} endpoint={endpoint} />
        <BullsCommitmentCard />
        <section className="support-grid" aria-label="Calendar and questions">
          <Calendar events={events} loading={loading} />
          <QA faq={faq} endpoint={endpoint} loading={loading} />
        </section>
      </main>

      <aside className="feed-rail" aria-label="SLAM! Athletics updates">
        <div className="feed-rail-head">
          <h2 className="feed-rail-title">What<span className="display-apostrophe">’</span>s happening</h2>
        </div>
        <Feed posts={posts} loading={loading} endpoint={endpoint} />
      </aside>
    </div>
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
      <HomeLayout endpoint={t.signupEndpoint} heroBg={t.heroBg} />

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
