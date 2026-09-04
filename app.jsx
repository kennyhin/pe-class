/* eslint-disable */
// SLAM! ES Athletics — Landing page

const { useState, useEffect } = React;

const API_BASE = "https://www.athleticsos.io";

// Editable page copy from AthleticsOS (/api/site-content). Fetched once and shared
// via context; every consumer falls back to its own hardcoded text until (or if)
// the fetch resolves, so the homepage never depends on the network to render.
const SiteContentContext = React.createContext({});
function useSiteContentValue() {
  const [content, setContent] = useState({});
  useEffect(() => {
    let cancelled = false;
    fetch(API_BASE + "/api/site-content")
      .then((r) => r.json())
      .then((data) => { if (!cancelled && data && typeof data === "object") setContent(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return content;
}
function useSC(key) {
  const content = React.useContext(SiteContentContext);
  return (content && content[key]) || {};
}

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
// Signup form — POSTs to AthleticsOS. Always mirrors to localStorage too.
// ---------------------------------------------------------------------------
function SignupForm({ accent }) {
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

    // Always mirror to localStorage so the data isn't lost if the request fails
    try {
      const key = "slam_signups";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      if (!prev.find((r) => r.email === cleaned)) {
        prev.push({ email: cleaned, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(prev));
      }
    } catch (_) {}

    try {
      const res = await fetch(`${API_BASE}/api/site-signups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleaned, source: "landing" }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || "request failed");
      setStatus({ kind: "success", msg: "You're in. We'll be in touch." });
      setEmail("");
    } catch (err) {
      setStatus({
        kind: "error",
        msg: "Couldn't reach the server — saved locally.",
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
          {status.kind === "sending" ? "Sending…" : "Subscribe"}
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
function Nav({ onOpenInfo }) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Register for sports", href: "slam-register.html" },
    { label: "Athletic eligibility", href: "slam-eligibility.html" },
    { label: "Games & schedules", href: "games.html" },
    { label: "Sports physicals/insurance", href: "#physicals", infoKey: "physicals" },
    { label: "Bulls commitment", href: "#commitment" },
    { label: "Sports offered", href: "#sports", infoKey: "sports" },
    { label: "Tryouts", href: "slam-tryouts.html" },
    { label: "Coach for SLAM!", href: "slam-coach-apply.html" },
  ];

  function handleNavClick(event, item) {
    // Close the drawer first so it doesn't sit over the destination.
    setOpen(false);

    if (item.infoKey) {
      event.preventDefault();
      onOpenInfo?.(item.infoKey);
      return;
    }

    if (item.href.startsWith("#")) {
      event.preventDefault();
      const id = item.href.slice(1);
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  return (
    <nav className={`side-nav ${open ? "open" : ""}`} aria-label="Athletics navigation">
      {open && (
        <button
          className="side-nav-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
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
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={(event) => handleNavClick(event, item)}
        >
          <span>{item.label}</span>
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
  { key: "schedules", eyebrow: "Schedules", label: "Games & schedules", href: "games.html", mode: "page" },
  { key: "physicals", eyebrow: "Physicals", label: "Sports physicals", href: "#physicals", mode: "info" },
  { key: "sports", eyebrow: "Sports", label: "Sports offered", href: "#sports", mode: "info" },
  { key: "tryouts", eyebrow: "Tryouts", label: "Tryout form", href: "slam-tryouts.html", mode: "page" },
  { key: "coach", eyebrow: "Coach", label: "Coach for SLAM!", href: "slam-coach-apply.html", mode: "page" },
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
        ) : item.key === "tryout-schedule" ? (
          <TryoutScheduleInfo />
        ) : (
          <ShortcutInfo item={item} />
        )}
      </section>
    </div>,
    document.body
  );
}

function renderShortcutLinks(section, fallback) {
  const links = Array.isArray(section.links) && section.links.length ? section.links : fallback;
  return links.map((l, i) => {
    const ext = /^https?:\/\//i.test(l.url);
    return (
      <a key={i} href={l.url} target={ext ? "_blank" : undefined} rel={ext ? "noopener" : undefined}>
        {l.label}
      </a>
    );
  });
}

function ShortcutInfo({ item }) {
  // All hooks unconditionally at the top (the branches below early-return).
  const physicals = useSC("home.physicals");
  const sportsIntro = useSC("home.sports.intro");
  const fall = useSC("home.sports.fall");
  const winter = useSC("home.sports.winter");
  const spring = useSC("home.sports.spring");
  const coach = useSC("home.coach");

  if (item.key === "physicals") {
    return (
      <div className="shortcut-info">
        <div className="shortcut-kicker">{physicals.eyebrow || "Sports Physicals"}</div>
        <h2>{physicals.title || "Clear before tryouts"}</h2>
        <p dangerouslySetInnerHTML={{ __html: physicals.body || "Sports physicals should be uploaded to Register My Athlete. Please do not turn physicals in to teachers, office admin, or athletic directors." }} />
        <div className="shortcut-actions">
          {renderShortcutLinks(physicals, [
            { label: "Physical form", url: "https://www.ncsaasports.com/physicals.html" },
            { label: "Schedule physical", url: "https://www.cvs.com/minuteclinic/services/sports-physicals" },
          ])}
        </div>
      </div>
    );
  }
  if (item.key === "sports") {
    const seasons = [
      [fall.title || "Fall", (Array.isArray(fall.bullets) && fall.bullets.length) ? fall.bullets : [
        "Elementary Recreational Flag Football (1-3)",
        "Elementary Flag Football (3-5)",
        "Elementary Girls Competitive Volleyball (3-5)",
        "Elementary Girls Recreational Volleyball (3-5)",
        "Elementary Cross Country (3-4)",
        "Elementary T-Ball (K-1)",
        "Elementary Coach Pitch Baseball (2-3)",
        "Elementary Cheer",
      ]],
      [winter.title || "Winter", (Array.isArray(winter.bullets) && winter.bullets.length) ? winter.bullets : [
        "Elementary Bowling (3-5)",
        "Elementary Comp Boys Basketball (4-5)",
        "Elementary Comp Girls Basketball (4-5)",
        "Elementary Recreational Basketball (K-1)",
        "Elementary Recreational Basketball (2-3)",
        "Elementary Kids Pitch Baseball (4-5)",
      ]],
      [spring.title || "Spring", (Array.isArray(spring.bullets) && spring.bullets.length) ? spring.bullets : [
        "Elementary Boys Volleyball (4-5)",
        "Elementary Comp Boys Soccer (4-5)",
        "Elementary Comp Girls Soccer (4-5)",
        "Elementary Recreational Soccer (2-3)",
        "Elementary Recreational Soccer (K-1)",
        "Elementary Track (4-5)",
      ]],
    ];
    return (
      <div className="shortcut-info">
        <div className="shortcut-kicker">{sportsIntro.eyebrow || "Sports Offered"}</div>
        <h2>{sportsIntro.title || "Elementary athletics"}</h2>
        <p dangerouslySetInnerHTML={{ __html: sportsIntro.body || "SLAM! Athletics offers seasonal sports for elementary students. Final divisions depend on league offerings, coach availability, and student interest." }} />
        <div className="season-list">
          {seasons.map(([season, sports]) => (
            <article key={season}>
              <span>{season}</span>
              <ul className="season-sports">
                {sports.map((sport) => <li key={sport}>{sport}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="shortcut-info">
      <div className="shortcut-kicker">{coach.eyebrow || "Coach for SLAM!"}</div>
      <h2>{coach.title || "Lead the next team"}</h2>
      <p dangerouslySetInnerHTML={{ __html: coach.body || "Interested coaches can help build a positive, organized, student-first athletics experience. Reach out to SLAM! Athletics with the sport, season, and grade level you can support." }} />
      <div className="shortcut-actions">
        {renderShortcutLinks(coach, [{ label: "Email athletics", url: "mailto:kenny.hin@slamnv.org" }])}
      </div>
    </div>
  );
}

// Standalone shortcut panel — live schedule + notes, independent of the
// tryout form page. Dates auto-drop off the API the day after they pass.
function TryoutScheduleInfo() {
  const [state, setState] = useState({ loading: true, data: null, error: false });

  useEffect(() => {
    let cancelled = false;
    fetch(API_BASE + "/api/tryout-schedule")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setState({ loading: false, data, error: false }); })
      .catch(() => { if (!cancelled) setState({ loading: false, data: null, error: true }); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="shortcut-info">
      <div className="shortcut-kicker">Tryouts</div>
      <h2>Tryout Schedule &amp; Info</h2>
      {state.loading ? (
        <p>Loading schedule…</p>
      ) : state.error ? (
        <p>Could not load the schedule right now — try again in a moment.</p>
      ) : (
        <TryoutScheduleTable schedule={state.data.schedule} notes={state.data.notes} />
      )}
    </div>
  );
}

function Hero({ bg }) {
  const [shortcutModal, setShortcutModal] = useState(null);
  const heroSC = useSC("home.hero");

  function openShortcut(event, item) {
    const smallScreen = window.matchMedia("(max-width: 760px)").matches;
    if (smallScreen && item.mode === "page") return;
    event.preventDefault();
    setShortcutModal(item);
  }

  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <HeroBackground variant={bg} />
      <Nav
        onOpenInfo={(key) => {
          const item = HERO_SHORTCUTS.find((entry) => entry.key === key);
          if (item) setShortcutModal(item);
        }}
      />
      <div className="hero-inner hero-center">
        <div className="welcome-eyebrow">Welcome to</div>

        <img
          src="assets/slam-logo.png"
          alt="SLAM! Athletics"
          className="hero-logo"
        />

        <div className="signup-wrap-center">
          <div className="signup-kicker">Newsletter Sign-Up</div>
          <SignupForm accent="red" />
        </div>

        <p
          className="hero-desc"
          dangerouslySetInnerHTML={{
            __html:
              heroSC.body ||
              "Sign up for our newsletter — schedules, sign-ups, and updates on upcoming events, sent straight to your inbox.",
          }}
        />

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
// Content comes from the AthleticsOS API (/api/site-posts, /api/site-events,
// /api/site-faq).
// ---------------------------------------------------------------------------

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

function eventEndDateKey(event) {
  const end = String(event?.endDate || "").slice(0, 10);
  return end || eventDateKey(event);
}

function eventIsMultiDay(event) {
  const end = eventEndDateKey(event);
  const start = eventDateKey(event);
  return !!end && !!start && end !== start;
}

function eventCoversDate(event, dateKey) {
  const start = eventDateKey(event);
  const end = eventEndDateKey(event);
  if (!start) return false;
  return dateKey >= start && dateKey <= end;
}

function formatEventDateRange(event) {
  const start = eventDateKey(event);
  const end = eventEndDateKey(event);
  if (!start) return "";
  if (!eventIsMultiDay(event)) return formatEventDate(start);
  return `${formatEventDate(start)} – ${formatEventDate(end)}`;
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

// A post is pinned while its pinnedUntil date is still in the future; the pin
// expires on its own with no cleanup needed (the date just falls into the past).
function isPinned(post) {
  const until = post && post.pinnedUntil;
  if (!until) return false;
  const t = new Date(until).getTime();
  return !Number.isNaN(t) && t > Date.now();
}

function sortPostsByDate(a, b) {
  const pa = isPinned(a) ? 1 : 0;
  const pb = isPinned(b) ? 1 : 0;
  if (pa !== pb) return pb - pa; // pinned cards sit at the top of the feed
  return postSortKey(b).localeCompare(postSortKey(a))
    || String(b.name || "").localeCompare(String(a.name || ""));
}

function formatAbsolutePostDate(post) {
  const raw = post?.timestamp || post?.time || post?.date;
  if (!raw) return "";
  let date = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(date.getTime()) && postDateKey(post)) {
    date = new Date(`${postDateKey(post)}T00:00:00`);
  }
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("default", { month: "short", day: "numeric" });
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

// Pulls posts/events/faq from AthleticsOS on mount.
function useContent() {
  const [content, setContent] = useState({
    posts: [],
    events: [],
    faq: [],
    loaded: false,
    error: false,
  });

  useEffect(() => {
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
    Promise.all([
      fetch(`${API_BASE}/api/site-posts`).then((r) => r.json()),
      fetch(`${API_BASE}/api/site-events`).then((r) => r.json()),
      fetch(`${API_BASE}/api/site-faq`).then((r) => r.json()),
    ])
      .then(([postsData, eventsData, faqData]) => {
        if (cancelled) return;
        const next = {
          posts: Array.isArray(postsData.posts) ? postsData.posts : [],
          events: Array.isArray(eventsData.events) ? eventsData.events : [],
          faq: Array.isArray(faqData.faq) ? faqData.faq : [],
        };
        try { localStorage.setItem(cacheKey, JSON.stringify(next)); } catch (_) {}
        setContent({ ...next, loaded: true, error: false });
      })
      .catch(() => {
        if (!cancelled) {
          setContent({ posts: [], events: [], faq: [], loaded: true, error: true });
        }
      });
    return () => { cancelled = true; };
  }, []);

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
          {(event.time || eventIsMultiDay(event)) && (
            <div className="event-detail-row">
              <span className="event-detail-label">When</span>
              <span>
                {eventIsMultiDay(event) ? formatEventDateRange(event) : event.time}
                {eventIsMultiDay(event) && event.time ? ` · ${event.time}` : ""}
              </span>
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
  const now = new Date();
  const actualYear = now.getFullYear();
  const actualMonth = now.getMonth();
  const today = now.getDate();
  const todayStr = `${actualYear}-${String(actualMonth + 1).padStart(2, "0")}-${String(today).padStart(2, "0")}`;
  const [viewYear, setViewYear] = useState(actualYear);
  const [viewMonth, setViewMonth] = useState(actualMonth);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [upcomingType, setUpcomingType] = useState("all");
  const [detailEvent, setDetailEvent] = useState(null);
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString("default", { month: "long", year: "numeric" });
  const next3DaysStr = addDaysToKey(todayStr, 3);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Which days this month have events? Multi-day events (e.g. a tryout
  // window spanning Aug 1-18) mark every day they cover, not just the start.
  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
  const monthDayKeys = [];
  for (let d = 1; d <= daysInMonth; d++) {
    monthDayKeys.push(`${monthPrefix}-${String(d).padStart(2, "0")}`);
  }
  const dayEventInfo = {};
  events.forEach((e) => {
    const start = eventDateKey(e);
    if (!start) return;
    const end = eventEndDateKey(e);
    const isRange = eventIsMultiDay(e);
    monthDayKeys.forEach((dayKey) => {
      if (dayKey < start || dayKey > end) return;
      const info = dayEventInfo[dayKey] || { hasEvent: false, hasRange: false };
      info.hasEvent = true;
      if (isRange) info.hasRange = true;
      dayEventInfo[dayKey] = info;
    });
  });

  const selectedEvents = events
    .filter((e) => eventCoversDate(e, selectedDate))
    .sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));

  const upcomingEvents = events
    .filter((e) => {
      const start = eventDateKey(e);
      const end = eventEndDateKey(e);
      return end >= todayStr && start <= next3DaysStr;
    })
    .sort(sortEventsByDate);

  const visibleUpcoming = upcomingType === "all"
    ? upcomingEvents
    : upcomingEvents.filter((e) => eventType(e) === upcomingType);

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
    const isRange = eventIsMultiDay(e);
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
          <span className="cal-month-meta">
            {isRange ? formatEventDateRange(e) : type} · {e.time || "Time TBA"}
          </span>
        </span>
        {hasDetail && <span className="cal-month-info-badge" aria-hidden="true">i</span>}
      </button>
    );
  }

  return (
    <div className="card cal">
      <div className="card-head">
        <span className="card-eyebrow">Calendar</span>
        <div className="cal-month-nav">
          <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">‹</button>
          <span className="card-meta">{monthLabel}</span>
          <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">›</button>
        </div>
      </div>

      <div className="cal-dow">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => {
          if (d === null) return <span key={i} className="cal-cell empty" />;
          const dayKey = `${monthPrefix}-${String(d).padStart(2, "0")}`;
          const info = dayEventInfo[dayKey] || {};
          const hasEvent = !!info.hasEvent;
          const hasRange = !!info.hasRange;
          const isToday = viewYear === actualYear && viewMonth === actualMonth && d === today;
          const isSelected = selectedDate === dayKey;
          return (
            <button
              key={i}
              type="button"
              className={`cal-cell${isToday ? " today" : ""}${hasEvent ? " has-event" : ""}${hasRange ? " has-range" : ""}${isSelected ? " selected" : ""}`}
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
          <div className="cal-empty">No matching events in the next 3 days.</div>
        ) : visibleUpcoming.map((e, i) => renderEventRow(e, i, "upcoming"))}
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

function DesktopPostModal({ onClose }) {
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
    try {
      const res = await fetch(`${API_BASE}/api/site-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: visibleTitle,
          handle: `@${cleanHandle}`,
          body: body.trim(),
          link: link.trim(),
          sport,
          grade: role === "Student" ? grade : "",
          badgeColor: isStaff ? badgeColor : "",
          submitterRole: role,
          pin: isStaff ? pin : "",
          imageData,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || "request failed");
      setStatus(data.needsReview ? "Sent for review." : "Post sent. It may take a moment to appear.");
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
                    <span className="post-date">{new Date().toLocaleDateString("default", { month: "short", day: "numeric" })}</span>
                    <div className="post-avatar">{getEventIcon({ sport: previewSport, title: previewSport, type: "event" })}</div>
                    <div className="post-body">
                      <div className="post-meta">
                        <span className="post-name">{visibleTitle || "Post"}</span>
                        <span className={`post-badge ${isStaff ? `staff staff-${badgeColor}` : role === "Parent" ? "parent" : `student ${studentBadgeClass(grade)}`}`}>✓</span>
                        {role === "Student" && grade && <span className="post-grade">{grade}</span>}
                      </div>
                      <span className="post-handle">@{previewHandle}</span>
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

// A highlighted sponsor card (created from AthleticsOS) — same feed, but a
// glowing tiered treatment instead of the normal post layout.
function SponsorCard({ sponsor, tier }) {
  const name = String(sponsor.name || "").trim();
  const body = String(sponsor.body || "").trim();
  const link = String(sponsor.link || "").trim();
  const imageUrl = String(sponsor.image || "").trim();
  const displayUrl = displayImageUrl(imageUrl);
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  return (
    <article className={"sponsor-card sponsor-card--" + tier}>
      <div className="sponsor-head">
        <span className="sponsor-eyebrow">★ Sponsor</span>
        <span className="sponsor-tier">{tierLabel}</span>
      </div>
      <div className="sponsor-main">
        {isImageUrl(imageUrl)
          ? <img className="sponsor-logo" src={displayUrl} alt="" loading="lazy" />
          : <div className="sponsor-logo sponsor-logo--placeholder">★</div>}
        <div className="sponsor-info">
          <div className="sponsor-name">{name || "Sponsor"}</div>
          {body && <p className="sponsor-message">{linkifyText(body)}</p>}
        </div>
      </div>
      {link && (
        <a className="sponsor-cta" href={link} target="_blank" rel="noopener noreferrer">
          Visit site <Icon name="arrow-right" size={13} />
        </a>
      )}
    </article>
  );
}

// --- Updates feed (Twitter/X style) ---
function Feed({ posts, loading }) {
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
    fetch(`${API_BASE}/api/site-reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        reaction,
        mode: previous === reaction ? "remove" : "add",
        voterKey: reactionDeviceKey(),
      }),
    }).catch(() => {});
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
          const tier = String(p.sponsorTier || "").trim().toLowerCase();
          if (["platinum", "gold", "silver", "bronze"].indexOf(tier) !== -1) {
            return <SponsorCard key={i} sponsor={p} tier={tier} />;
          }
          const icon = getEventIcon({ sport: p.sport, title: p.sport, type: "event" });
          const dateLabel = formatAbsolutePostDate(p);
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
              {dateLabel && <span className="post-date">{dateLabel}</span>}
              <div className="post-avatar" aria-label={p.sport || "Update"}>{icon}</div>
              <div className="post-body">
                <div className="post-meta">
                  <span className="post-name">{p.name}</span>
                  <span className={`post-badge ${badge.className}`} title={badge.title} aria-label={badge.title}>{badge.label}</span>
                  {p.grade && <span className="post-grade">{p.grade}</span>}
                </div>
                <span className="post-handle">{p.handle}</span>
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
        <DesktopPostModal onClose={() => setShowPostModal(false)} />,
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

function AskQuestionForm({ faq }) {
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

    try {
      const res = await fetch(`${API_BASE}/api/site-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, question }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || "request failed");
      setStatus({ kind: "success", msg: "Question sent. We will follow up soon." });
      setForm({ email: "", question: "" });
    } catch (_) {
      setStatus({ kind: "error", msg: "Could not reach the server. Saved locally." });
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

function QA({ faq, loading }) {
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
      <AskQuestionForm faq={faq} />
    </div>
  );
}

function BullsCommitmentCard() {
  const sc = useSC("home.commitment");
  const commitments = (Array.isArray(sc.bullets) && sc.bullets.length) ? sc.bullets : [
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
        <h2 className="commitment-title">{sc.title || "Bulls Commitment"}</h2>
        <span className="commitment-promise">{sc.subtitle || "I promise to"}</span>
      </div>
      <ol className="commitment-list">
        {commitments.map((item, i) => (
          <li key={item}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{item}</strong>
          </li>
        ))}
      </ol>
      <div className="commitment-signoff">{sc.footer || "I agree to uphold these promises at all times."}</div>
    </section>
  );
}

// Homepage popup — built from reorderable blocks in AthleticsOS
// (/admin/website/popups) instead of hand-coded here. Pops up once per
// browser session, per popup id, until its optional endsAt. Renders whatever
// the currently-active popup's blocks are — could be none.
const POPUP_OPEN_DELAY_MS = 800;

function formatScheduleDate(dateStr) {
  const noon = new Date(dateStr + "T12:00:00");
  return noon.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }).toUpperCase();
}

function formatScheduleTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function PopupFaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`qa-item ${open ? "open" : ""}`}>
      <button className="qa-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{item.question}</span>
        <span className="qa-icon" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div className="qa-a-wrap" style={{ maxHeight: open ? 300 : 0 }}>
        <p className="qa-a">{item.answer}</p>
      </div>
    </div>
  );
}

// Shared by the popup's "tryoutSchedule" block and the standalone "Tryout
// schedule & dates" hero shortcut — same markup, two different homes.
function TryoutScheduleTable({ schedule, notes }) {
  const days = schedule || [];
  const noteList = notes || [];
  return (
    <>
      {days.length === 0 ? (
        <p className="promo-popup-note">Dates are being finalized — check back soon.</p>
      ) : (
        <div className="tryout-popup-schedule">
          {days.map((day) => (
            <div key={day.date} className="tryout-popup-day">
              <div className="tryout-popup-date">{formatScheduleDate(day.date)}</div>
              <div className="tryout-popup-col-head">
                <span>Sport</span>
                <span>Time</span>
              </div>
              {day.rows.map((row, i) => (
                <div key={i} className="tryout-popup-row">
                  <span className="tryout-popup-sport">
                    {row.teamName.toUpperCase()}
                    {row.roundLabel && <span className="tryout-popup-badge">{row.roundLabel}</span>}
                  </span>
                  <span className="tryout-popup-time">
                    {formatScheduleTime(row.start)} – {formatScheduleTime(row.end)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {noteList.length > 0 && (
        <div className="tryout-popup-notes">
          <div className="tryout-popup-notes-title">Important</div>
          <ul>{noteList.map((note, i) => <li key={i}>{note}</li>)}</ul>
        </div>
      )}
    </>
  );
}

function PopupBlock({ block }) {
  switch (block.type) {
    case "header":
      return <h3 className="promo-popup-title">{block.data.text}</h3>;

    case "subheader":
      return <div className="promo-popup-kicker">{block.data.text}</div>;

    case "text": {
      const lines = String(block.data.body || "").split("\n").filter((l) => l.trim());
      if (block.data.style === "callout") {
        return (
          <div className="tryout-popup-notes">
            <div className="tryout-popup-notes-title">{block.data.title || "Important"}</div>
            <ul>{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
          </div>
        );
      }
      return (
        <div>
          {block.data.title && <p className="promo-popup-note" style={{ fontWeight: 700 }}>{block.data.title}</p>}
          {lines.map((l, i) => <p key={i} className="promo-popup-note">{l}</p>)}
        </div>
      );
    }

    case "tryoutSchedule":
      return <TryoutScheduleTable schedule={block.data.schedule} notes={block.data.notes} />;

    case "faq": {
      const items = block.data.items || [];
      if (items.length === 0) return null;
      return (
        <div className="tryout-popup-faq">
          <div className="tryout-popup-section-title">Common Questions</div>
          {items.map((item, i) => <PopupFaqItem key={i} item={item} />)}
        </div>
      );
    }

    case "button":
      return (
        <a className="promo-popup-cta" href={block.data.href}>
          {block.data.label}
          <Icon name="arrow-right" size={16} />
        </a>
      );

    default:
      return null;
  }
}

function SitePopup() {
  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    fetch(API_BASE + "/api/popup")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data || !data.popup) return;
        const p = data.popup;
        if (p.endsAt && new Date() > new Date(p.endsAt)) return;
        const storageKey = `slamPopupDismissed:${p.id}`;
        let dismissed = false;
        try { dismissed = !!sessionStorage.getItem(storageKey); } catch (_) {}
        if (dismissed) return;

        setPopup(p);
        timer = setTimeout(() => {
          if (cancelled) return;
          setOpen(true);
          try { sessionStorage.setItem(storageKey, "1"); } catch (_) {}
        }, POPUP_OPEN_DELAY_MS);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!open || !popup) return null;

  return ReactDOM.createPortal(
    <div className="promo-popup" role="dialog" aria-modal="true" aria-label={popup.name}>
      <button className="promo-popup-backdrop" type="button" aria-label="Close" onClick={() => setOpen(false)} />
      <section className="promo-popup-panel promo-popup-panel--flyer">
        <button className="promo-popup-close" type="button" onClick={() => setOpen(false)}>&times;</button>
        {popup.blocks.map((block, i) => <PopupBlock key={i} block={block} />)}
      </section>
    </div>,
    document.body
  );
}

function HomeLayout({ heroBg }) {
  const { posts, events, faq, loaded } = useContent();
  const loading = !loaded;
  return (
    <div className="home-layout">
      <SitePopup />
      <main className="main-scroll">
        <Hero bg={heroBg} />
        <BullsCommitmentCard />
        <section className="support-grid" aria-label="Calendar and questions">
          <Calendar events={events} loading={loading} />
          <QA faq={faq} loading={loading} />
        </section>
      </main>

      <aside className="feed-rail" aria-label="SLAM! Athletics updates">
        <div className="feed-rail-head">
          <h2 className="feed-rail-title">What<span className="display-apostrophe">’</span>s happening</h2>
        </div>
        <Feed posts={posts} loading={loading} />
      </aside>
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroBg": "pattern"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const siteContent = useSiteContentValue();

  return (
    <SiteContentContext.Provider value={siteContent}>
    <div className="page">
      <HomeLayout heroBg={t.heroBg} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero background" />
        <TweakRadio
          label="Style"
          value={t.heroBg}
          options={["pattern", "scoreboard", "black", "red", "lime"]}
          onChange={(v) => setTweak("heroBg", v)}
        />

        <TweakSection label="Local backups" />
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
    </SiteContentContext.Provider>
  );
}

window.App = App;
