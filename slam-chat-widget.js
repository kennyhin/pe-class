// SLAM Nevada Athletics — parent chatbot widget.
// Floating bottom-right button + expandable chat panel. Grounded on the
// AthleticsOS knowledge base + site content via https://athleticsos.io/api/chat.
// Drop this on any page with a single <script src="/slam-chat-widget.js"></script>.

(function () {
  if (window.__slamChatMounted) return;
  window.__slamChatMounted = true;

  var API_URL = "https://www.athleticsos.io/api/chat";
  var LOGO = "assets/bull-only-transparent.png";

  var GREEN = "#1b4d20";
  var LIME  = "#80FF00";
  var RED   = "#DA0016";
  var BLACK = "#0B0B0B";

  var styles = ""
    + "#slam-chat-launcher{position:fixed;right:20px;bottom:20px;width:64px;height:64px;border-radius:50%;background:" + BLACK + ";border:3px solid " + LIME + ";cursor:pointer;z-index:2147483000;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(128,255,0,0.5),0 8px 24px rgba(0,0,0,0.3);transition:transform 0.15s ease;animation:slamGlow 2.4s ease-in-out infinite;}"
    + "#slam-chat-launcher:hover{transform:scale(1.08);}"
    + "#slam-chat-launcher img{width:44px;height:44px;object-fit:contain;}"
    + "#slam-chat-launcher .slam-close-icon{color:#fff;font-size:24px;line-height:1;font-family:sans-serif;font-weight:bold;}"
    + "@keyframes slamGlow{0%,100%{box-shadow:0 0 20px rgba(128,255,0,0.5),0 8px 24px rgba(0,0,0,0.3);}50%{box-shadow:0 0 32px rgba(128,255,0,0.9),0 8px 24px rgba(0,0,0,0.3);}}"
    + "#slam-chat-panel{position:fixed;right:20px;bottom:100px;width:380px;max-width:calc(100vw - 40px);height:560px;max-height:calc(100vh - 140px);background:#fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);z-index:2147482999;display:none;flex-direction:column;overflow:hidden;font-family:'Space Grotesk','Archivo',system-ui,sans-serif;color:" + BLACK + ";}"
    + "#slam-chat-panel.open{display:flex;}"
    + "#slam-chat-header{background:" + BLACK + ";padding:14px 16px;display:flex;align-items:center;gap:10px;border-bottom:3px solid " + LIME + ";}"
    + "#slam-chat-header img{width:36px;height:36px;object-fit:contain;}"
    + "#slam-chat-header .slam-chat-title{color:#fff;font-weight:700;font-size:14px;letter-spacing:0.02em;text-transform:uppercase;font-family:'Archivo Black','Impact',sans-serif;}"
    + "#slam-chat-header .slam-chat-sub{color:rgba(255,255,255,0.6);font-size:11px;}"
    + "#slam-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#f4f5f2;}"
    + ".slam-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.45;word-wrap:break-word;}"
    + ".slam-msg.bot{align-self:flex-start;background:#fff;color:" + BLACK + ";border:1px solid #e5e7eb;border-bottom-left-radius:4px;}"
    + ".slam-msg.user{align-self:flex-end;background:" + GREEN + ";color:#fff;border-bottom-right-radius:4px;}"
    + ".slam-msg.error{align-self:flex-start;background:#fef2f2;color:" + RED + ";border:1px solid #fecaca;border-bottom-left-radius:4px;}"
    + ".slam-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:16px;border-bottom-left-radius:4px;}"
    + ".slam-typing span{width:8px;height:8px;border-radius:50%;background:" + GREEN + ";opacity:0.5;animation:slamTypingBounce 1.2s ease-in-out infinite;}"
    + ".slam-typing span:nth-child(2){animation-delay:0.15s;}"
    + ".slam-typing span:nth-child(3){animation-delay:0.3s;}"
    + "@keyframes slamTypingBounce{0%,60%,100%{transform:translateY(0);opacity:0.5;}30%{transform:translateY(-6px);opacity:1;}}"
    + "#slam-chat-input-row{display:flex;gap:8px;padding:12px;background:#fff;border-top:1px solid #e5e7eb;}"
    + "#slam-chat-input{flex:1;border:1px solid #d1d5db;border-radius:24px;padding:10px 14px;font-size:14px;font-family:inherit;outline:none;color:" + BLACK + ";background:#fff;}"
    + "#slam-chat-input:focus{border-color:" + GREEN + ";}"
    + "#slam-chat-send{background:" + RED + ";color:#fff;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:filter 0.15s;}"
    + "#slam-chat-send:hover{filter:brightness(1.1);}"
    + "#slam-chat-send:disabled{opacity:0.5;cursor:not-allowed;}"
    + "@media (max-width:480px){#slam-chat-panel{right:10px;left:10px;bottom:88px;width:auto;height:calc(100vh - 108px);}}";

  var style = document.createElement("style");
  style.textContent = styles;
  document.head.appendChild(style);

  var launcher = document.createElement("button");
  launcher.id = "slam-chat-launcher";
  launcher.setAttribute("aria-label", "Open SLAM chat");
  launcher.innerHTML = '<img src="' + LOGO + '" alt="">';
  document.body.appendChild(launcher);

  var panel = document.createElement("div");
  panel.id = "slam-chat-panel";
  panel.innerHTML = ''
    + '<div id="slam-chat-header">'
    +   '<img src="' + LOGO + '" alt="">'
    +   '<div>'
    +     '<div class="slam-chat-title">SLAM Bull Bot</div>'
    +     '<div class="slam-chat-sub">Ask me anything about SLAM Athletics</div>'
    +   '</div>'
    + '</div>'
    + '<div id="slam-chat-messages"></div>'
    + '<div id="slam-chat-input-row">'
    +   '<input id="slam-chat-input" type="text" placeholder="Ask a question..." maxlength="500" autocomplete="off">'
    +   '<button id="slam-chat-send" aria-label="Send">➤</button>'
    + '</div>';
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector("#slam-chat-messages");
  var inputEl = panel.querySelector("#slam-chat-input");
  var sendEl = panel.querySelector("#slam-chat-send");

  var greeted = false;

  function greet() {
    if (greeted) return;
    greeted = true;
    addBot("Hi! I'm the SLAM Bull Bot. Ask me anything about tryouts, teams, practices, or payments.");
  }

  function togglePanel() {
    var open = panel.classList.toggle("open");
    launcher.innerHTML = open ? '<span class="slam-close-icon">✕</span>' : '<img src="' + LOGO + '" alt="">';
    if (open) {
      greet();
      setTimeout(function () { inputEl.focus(); }, 80);
    }
  }

  launcher.addEventListener("click", togglePanel);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  }

  function addUser(text) {
    var d = document.createElement("div");
    d.className = "slam-msg user";
    d.textContent = text;
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  // Auto-link known resources (case-insensitive, longest match first).
  // Applied to already-escaped HTML so no injection risk.
  var LINKS = [
    { re: /\bRegister My Athlete\b/gi, url: "https://www.registermyathlete.com/login/" },
    { re: /\bRMA\b/g, url: "https://www.registermyathlete.com/login/" },
    { re: /\bNational Sports ID\b/gi, url: "https://www.nationalsportsid.com/" },
    { re: /\bNSID\b/g, url: "https://www.nationalsportsid.com/" },
    { re: /\b(?:www\.)?ncsaasports\.com\b/gi, url: "https://www.ncsaasports.com/" },
    { re: /\bNCSAA\b/g, url: "https://www.ncsaasports.com/" },
    { re: /\bslamnvathletics\.org\b/gi, url: "https://slamnvathletics.org" },
    { re: /\b(?:www\.)?slamnv\.org\b/gi, url: "https://www.slamnv.org" },
    { re: /\bkenny\.hin@slamnv\.org\b/gi, url: "mailto:kenny.hin@slamnv.org" },
  ];

  function linkify(html) {
    // Skip regions already inside a link, and only match on plain text.
    return LINKS.reduce(function (h, l) {
      return h.replace(l.re, function (match) {
        return '<a href="' + l.url + '" target="_blank" rel="noopener" style="color:' + GREEN + ';text-decoration:underline;font-weight:600;">' + match + "</a>";
      });
    }, html);
  }

  function addBot(text) {
    var d = document.createElement("div");
    d.className = "slam-msg bot";
    d.innerHTML = linkify(esc(text).replace(/\n/g, "<br>"));
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function addError(text) {
    var d = document.createElement("div");
    d.className = "slam-msg error";
    d.textContent = text;
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function showTyping() {
    var d = document.createElement("div");
    d.className = "slam-typing";
    d.id = "slam-typing";
    d.innerHTML = "<span></span><span></span><span></span>";
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById("slam-typing");
    if (t) t.remove();
  }

  async function send() {
    var q = inputEl.value.trim();
    if (!q) return;
    inputEl.value = "";
    sendEl.disabled = true;
    addUser(q);
    showTyping();
    try {
      var res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      hideTyping();
      if (!res.ok) {
        addError("Sorry, I couldn't reach the answer service. Please try again in a moment.");
        return;
      }
      var data = await res.json();
      addBot(data.answer || "I'm not sure — try emailing Kenny at kenny.hin@slamnv.org.");
    } catch (e) {
      hideTyping();
      addError("Network issue — check your connection and try again.");
    } finally {
      sendEl.disabled = false;
      inputEl.focus();
    }
  }

  sendEl.addEventListener("click", send);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
})();
