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
        Season schedules · Coach updates · No spam, ever
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------
function Nav() {
  return (
    <nav className="nav" data-screen-label="Nav">
      <a className="nav-logo" href="#top">
        SLAM<span className="bang">!</span>
        <span className="tag">ELEMENTARY · ATHLETICS</span>
      </a>
      <div className="nav-links">
        <a>Programs</a>
        <a>Coaches</a>
        <a>Schedule</a>
        <a>About</a>
      </div>
      <button className="nav-cta">
        Find a program
        <Icon name="arrow-right" size={14} />
      </button>
    </nav>
  );
}

function Hero({ bg, endpoint }) {
  // On red/lime backgrounds, soften eyebrow + body text
  const isLight = bg === "lime";
  const isRed = bg === "red";
  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <HeroBackground variant={bg} />
      <div className="hero-inner">
        <div className="hero-eyebrow"
             style={isLight ? { color: "var(--slam-black)", borderColor: "var(--slam-black)", background: "rgba(0,0,0,0.08)" }
                    : isRed ? { color: "var(--slam-white)", borderColor: "var(--slam-white)", background: "rgba(255,255,255,0.12)" }
                    : null}>
          <span className="pulse" style={isLight ? { background: "var(--slam-black)", boxShadow: "0 0 12px rgba(0,0,0,0.3)" } : isRed ? { background: "var(--slam-white)", boxShadow: "0 0 12px rgba(255,255,255,0.5)" } : null} />
          Fall 2026 registration · open now
        </div>

        <h1 className="hero-title"
            style={isLight ? { color: "var(--slam-black)" } : null}>
          Big sports<br />
          energy <span className="accent-red"
                       style={isLight ? { color: "var(--slam-black)" } : isRed ? { color: "var(--slam-white)" } : null}>for</span> small<br />
          humans<span className="bang"
                     style={isLight ? { color: "var(--slam-red)" } : null}>!</span>
        </h1>

        <p className="hero-sub"
           style={isLight ? { color: "rgba(0,0,0,0.72)" } : isRed ? { color: "rgba(255,255,255,0.85)" } : null}>
          Fundamentals-first sports programs for K&ndash;5. Every kid gets a touch.
          Every kid gets a cheer. Drop your email and we'll send the season schedule
          + a free trial pass.
        </p>

        <SignupForm endpoint={endpoint} accent={isRed ? "lime" : "red"} />
      </div>

      <div className="hero-rail"
           style={isLight ? { borderTopColor: "rgba(0,0,0,0.2)" } : isRed ? { borderTopColor: "rgba(255,255,255,0.25)" } : null}>
        <div className="rail-stat">
          <span className="rail-n" style={isLight ? { color: "var(--slam-black)" } : null}>12K</span>
          <span className="rail-l" style={isLight ? { color: "rgba(0,0,0,0.6)" } : isRed ? { color: "rgba(255,255,255,0.75)" } : null}>Kids served</span>
        </div>
        <div className="rail-stat">
          <span className="rail-n lime" style={isLight ? { color: "var(--slam-red)" } : null}>87<span style={{ fontSize: "0.6em" }}>%</span></span>
          <span className="rail-l" style={isLight ? { color: "rgba(0,0,0,0.6)" } : isRed ? { color: "rgba(255,255,255,0.75)" } : null}>Return next season</span>
        </div>
        <div className="rail-stat">
          <span className="rail-n red" style={isLight ? { color: "var(--slam-black)" } : isRed ? { color: "var(--slam-white)" } : null}>32</span>
          <span className="rail-l" style={isLight ? { color: "rgba(0,0,0,0.6)" } : isRed ? { color: "rgba(255,255,255,0.75)" } : null}>Partner schools</span>
        </div>
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
// App with tweaks
// ---------------------------------------------------------------------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroBg": "pattern",
  "signupEndpoint": "https://script.google.com/macros/s/AKfycbxX77wDe5fHka_2uuybQVdUMKZG2eMRdc_LD7-D_3I3X1Rnz931gWNA05UIc3TAdp9v/exec"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <div className="page">
      <Nav />
      <Hero bg={t.heroBg} endpoint={t.signupEndpoint} />
      <About />
      <Footer />

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
          label="Download CSV"
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
