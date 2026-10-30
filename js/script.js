/* ============================================================
   EDIT YOUR DETAILS HERE — everything below reads from SITE
   ============================================================ */
var SITE = {
  name: "Som Singh",
  email: "somsinghrajput1291@gmail.com",
  phone: "+91 6388613827",
  whatsapp: "916388613827",   // country code + number, digits only (must be a WhatsApp number)
  formEndpoint: "",           // optional: Formspree URL (https://formspree.io/f/xxxx) to receive form messages in your inbox
  aiEndpoint: "/api/chat"     // serverless AI function (see README). Falls back to built-in answers if unavailable
};

/* ---------- AI helper (shared by chat + contact form) ---------- */
var AI = { online: false };
function askAI(payload){
  return fetch(SITE.aiEndpoint, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
  }).then(function(r){ if(!r.ok) throw new Error("bad"); return r.json(); })
    .then(function(d){ if(!d || !d.reply) throw new Error("empty"); return String(d.reply); });
}
if(SITE.aiEndpoint){
  fetch(SITE.aiEndpoint).then(function(r){ return r.ok ? r.json() : {}; }).then(function(d){
    if(!d.ai) return;
    AI.online = true;
    var b = document.getElementById("aiImprove"); if(b) b.hidden = false;
    var s = document.querySelector(".chat-head .status"); if(s) s.textContent = "AI assistant";
  }).catch(function(){});
}

(function(){
  "use strict";
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- LOADER ---------- */
  window.addEventListener('load', function(){
    setTimeout(function(){
      document.getElementById('loader').classList.add('hidden');
    }, 500);
  });

  setTimeout(function(){ document.getElementById('loader').classList.add('hidden'); }, 4000);

  /* ---------- THEME TOGGLE (in-memory only, no storage APIs) ---------- */
  var html = document.documentElement;
  var themeBtn = document.getElementById('themeToggle');
  try{ var saved = localStorage.getItem('theme'); if(saved) html.setAttribute('data-theme', saved); }catch(e){}
  themeBtn.addEventListener('click', function(){
    var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try{ localStorage.setItem('theme', next); }catch(e){}
  });

  /* ---------- MOBILE NAV ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', function(){
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach(function(link){
    link.addEventListener('click', function(){
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ navToggle.classList.remove('open'); navLinks.classList.remove('open'); } });

  /* ---------- NAVBAR SCROLL STATE + ACTIVE LINK ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinkEls = document.querySelectorAll('.nav-link');
  var sectionObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        navLinkEls.forEach(function(l){ l.classList.remove('active'); });
        var active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if(active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function(s){ sectionObserver.observe(s); });

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  /* ---------- COUNT-UP STATS ---------- */
  var counted = false;
  var statObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting && !counted){
        counted = true;
        document.querySelectorAll('[data-count]').forEach(function(el){
          var target = parseInt(el.getAttribute('data-count'), 10);
          var current = 0;
          var step = Math.max(1, Math.round(target / 40));
          var timer = setInterval(function(){
            current += step;
            if(current >= target){ current = target; clearInterval(timer); }
            el.textContent = current;
          }, 30);
        });
      }
    });
  }, { threshold: 0.5 });
  var heroStats = document.querySelector('.hero-stats');
  if(heroStats) statObserver.observe(heroStats);

  /* ---------- BACK TO TOP + CURSOR GLOW ---------- */
  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function(){
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  var glow = document.getElementById('cursorGlow');
  if(glow && !reduceMotion){
    window.addEventListener('mousemove', function(e){
      glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if(!reduceMotion){
    document.querySelectorAll('.magnetic').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        btn.style.transform = 'translate(' + (x*0.18) + 'px,' + (y*0.35) + 'px)';
      });
      btn.addEventListener('mouseleave', function(){
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  var slidesWrap = document.getElementById('testSlides');
  var slides = slidesWrap.children;
  var dotsWrap = document.getElementById('testDots');
  var idx = 0;
  for(var i=0;i<slides.length;i++){
    var dot = document.createElement('button');
    dot.className = 'test-dot' + (i===0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i+1));
    (function(n){ dot.addEventListener('click', function(){ goTo(n); }); })(i);
    dotsWrap.appendChild(dot);
  }
  function goTo(n){
    idx = (n + slides.length) % slides.length;
    slidesWrap.style.transform = 'translateX(-' + (idx*100) + '%)';
    dotsWrap.querySelectorAll('.test-dot').forEach(function(d,di){
      d.classList.toggle('active', di===idx);
    });
  }
  document.getElementById('testPrev').addEventListener('click', function(){ goTo(idx-1); });
  document.getElementById('testNext').addEventListener('click', function(){ goTo(idx+1); });
  var testTimer = setInterval(function(){ if(!reduceMotion) goTo(idx+1); }, 6000);

  /* ---------- CONTACT: email + WhatsApp ---------- */
  function waLink(t){ return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(t); }
  document.querySelectorAll('[data-link]').forEach(function(a){
    var k = a.getAttribute('data-link');
    if(k === 'mail') a.href = 'mailto:' + SITE.email;
    if(k === 'tel') a.href = 'tel:+' + SITE.whatsapp;
    if(k === 'whatsapp') a.href = waLink('Hi ' + SITE.name + ', I found your portfolio and would like to talk.');
  });
  document.querySelectorAll('[data-text]').forEach(function(el){ el.textContent = SITE[el.getAttribute('data-text')]; });
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(!navigator.clipboard) return;
      navigator.clipboard.writeText(SITE[btn.getAttribute('data-copy')]).then(function(){
        btn.classList.add('copied');
        setTimeout(function(){ btn.classList.remove('copied'); }, 1600);
      });
    });
  });

  var form = document.getElementById('contactForm');
  var formMsg = document.getElementById('formMsg');
  function val(id){ return document.getElementById(id).value.trim(); }
  function say(text, kind, link){
    formMsg.textContent = text;
    formMsg.className = 'form-msg show ' + kind;
    if(link){
      var a = document.createElement('a');
      a.href = link.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = ' ' + link.label;
      formMsg.appendChild(a);
    }
  }
  function compose(){
    return 'Hi ' + SITE.name + ", I'm " + val('cf-name') + (val('cf-email') ? ' (' + val('cf-email') + ')' : '') + '.\n\n' +
      (val('cf-subject') ? 'Subject: ' + val('cf-subject') + '\n\n' : '') + val('cf-message');
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(form.website.value) return; /* honeypot: bots fill this */
    var subject = val('cf-subject');
    var body = val('cf-message') + '\n\n— ' + val('cf-name') + ' (' + val('cf-email') + ')';

    if(SITE.formEndpoint){
      say('Sending…', 'success');
      fetch(SITE.formEndpoint, { method:'POST', headers:{ 'Accept':'application/json' }, body:new FormData(form) })
        .then(function(r){ if(!r.ok) throw new Error('bad'); say('Message sent. I usually reply within a day.', 'success'); form.reset(); })
        .catch(function(){ say('Could not send your message. Try WhatsApp or email me directly at ' + SITE.email + '.', 'error'); });
      return;
    }
    window.location.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    say('Opening your email app. No email app?', 'success', {
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(SITE.email) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body),
      label: 'Compose in Gmail instead'
    });
  });

  document.getElementById('sendWhatsapp').addEventListener('click', function(){
    var n = document.getElementById('cf-name'), m = document.getElementById('cf-message');
    if(!n.value.trim()){ n.focus(); return say('Add your name so I know who to reply to.', 'error'); }
    if(!m.value.trim()){ m.focus(); return say('Write a short message first, then send it on WhatsApp.', 'error'); }
    window.open(waLink(compose()), '_blank', 'noopener');
    say('Opening WhatsApp with your message ready to send.', 'success');
  });

  var aiBtn = document.getElementById('aiImprove');
  aiBtn.addEventListener('click', function(){
    var m = document.getElementById('cf-message');
    if(m.value.trim().length < 10){ m.focus(); return say('Write a rough draft first (at least a sentence) and AI will polish it.', 'error'); }
    aiBtn.disabled = true; aiBtn.textContent = 'Improving…';
    askAI({ mode:'improve', message:m.value.trim() })
      .then(function(t){ m.value = t; say('Message polished. Review it before sending.', 'success'); })
      .catch(function(){ say("AI isn't available right now. You can still send your message as written.", 'error'); })
      .then(function(){ aiBtn.disabled = false; aiBtn.textContent = '✨ Improve with AI'; });
  });

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- CONSTELLATION PARTICLE BACKGROUND ---------- */
  var canvas = document.getElementById('constellation');
  var ctx = canvas.getContext('2d');
  var w, h, particles = [];
  var mouse = { x: null, y: null };
  var PARTICLE_COUNT = reduceMotion ? 0 : (window.innerWidth < 700 ? 45 : 90);
  var LINK_DIST = 130;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  resize();
  window.addEventListener('resize', function(){ resize(); initParticles(); });

  function accentColor(){
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7C5CFC';
  }
  function accent2Color(){
    return getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim() || '#2DD4BF';
  }

  function initParticles(){
    particles = [];
    for(var i=0;i<PARTICLE_COUNT;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*Math.min(h, window.innerHeight*1.4),
        vx: (Math.random()-0.5)*0.35,
        vy: (Math.random()-0.5)*0.35,
        r: Math.random()*1.6+0.8
      });
    }
  }
  initParticles();

  window.addEventListener('mousemove', function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;
  });
  window.addEventListener('mouseleave', function(){ mouse.x = null; mouse.y = null; });

  function hexToRgb(hex){
    hex = hex.replace('#','');
    if(hex.length===3){ hex = hex.split('').map(function(c){return c+c;}).join(''); }
    var num = parseInt(hex,16);
    return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
  }

  function tick(){
    if(PARTICLE_COUNT === 0) return;
    ctx.clearRect(0,0,w,h);
    var c1 = hexToRgb(accentColor());
    var c2 = hexToRgb(accent2Color());
    var viewTop = window.scrollY, viewBottom = window.scrollY + window.innerHeight + 100;

    for(var i=0;i<particles.length;i++){
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      if(p.y < viewTop - 100 || p.y > viewBottom) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(' + c2.r + ',' + c2.g + ',' + c2.b + ',0.55)';
      ctx.fill();

      for(var j=i+1;j<particles.length;j++){
        var q = particles[j];
        if(q.y < viewTop - 100 || q.y > viewBottom) continue;
        var dx = p.x-q.x, dy = p.y-q.y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < LINK_DIST){
          var op = (1 - dist/LINK_DIST) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = 'rgba(' + c1.r + ',' + c1.g + ',' + c1.b + ',' + op + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      if(mouse.x !== null){
        var mdx = p.x-mouse.x, mdy = p.y-mouse.y;
        var mdist = Math.sqrt(mdx*mdx+mdy*mdy);
        if(mdist < LINK_DIST*1.3){
          var mop = (1 - mdist/(LINK_DIST*1.3)) * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(' + c1.r + ',' + c1.g + ',' + c1.b + ',' + mop + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

})();

/* ================= AI CHAT WIDGET ================= */
(function(){
  "use strict";

  /* AI is wired through askAI() at the top of this file. If the serverless function is offline, the built-in answers below are used. */

  /* ---------- Knowledge base: edit these answers to match your real details ---------- */
  var KB = [
    { keys:["hi","hello","hey","namaste","hola"],
      text:"Hi! I'm Som's portfolio assistant. Ask me about his skills, projects, experience, services, or how to get in touch." },

    { keys:["help","menu","topics","options"],
      text:"I can tell you about:\n• Skills & tech stack\n• Projects\n• Experience\n• Education\n• Services & availability\n• Contact details & resume" },

    { keys:["who","about","yourself","introduce","background","bio","som"],
      text:"Som Singh is a full-stack developer and product engineer based in Varanasi, India. He builds fast, accessible software, from polished interfaces to the APIs and systems behind them.",
      go:"#about", goLabel:"Read About" },

    { keys:["skill","skills","tech","stack","tools","technology","technologies","programming","react","node","typescript","frontend","backend","database","docker","aws","figma"],
      text:"Som's toolkit:\n• Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion\n• Backend: Node.js, Express, PostgreSQL, GraphQL, Redis\n• Infra: Docker, AWS, CI/CD, Git, Terraform\n• Design: Figma, design systems, prototyping, accessibility\n• Quality: Jest, Playwright, Testing Library",
      go:"#skills", goLabel:"See Skills" },

    { keys:["project","work","built","build","portfolio","edusphere","maison","aurel","ecommerce","atlas","pathfinder","demo","case"],
      text:"Featured projects:\n• EduSphere: a college management system (students, faculty, courses, attendance) built with HTML, CSS, JavaScript and Firebase. It has a live demo.\n• Maison Aurél: a luxury e-commerce website (live demo available)\n• Atlas: an accessible component design system\n• Pathfinder: a route optimization API",
      go:"#projects", goLabel:"View Projects" },

    { keys:["experience","job","career","worked","history","timeline","years","role"],
      text:"Som's path so far:\n• 2025 to now: Full-Stack Web Developer (personal projects & freelance)\n• 2025 to now: Backend Developer (learning & project development)\n• 2023 to 2024: Frontend Developer\n• 2022 to 2023: Junior Web Developer",
      go:"#experience", goLabel:"See Experience" },

    { keys:["education","study","studied","degree","bca","college","university","qualification","qualifications"],
      text:"Som is pursuing a Bachelor of Computer Applications (BCA), alongside hands-on web development projects.",
      go:"#experience", goLabel:"See Experience" },

    { keys:["service","services","offer","offers","provide"],
      text:"Services Som offers:\n• Web app development (end to end)\n• UI/UX design & design systems\n• API & backend architecture\n• Performance & SEO improvements",
      go:"#services", goLabel:"See Services" },

    { keys:["hire","available","availability","freelance","full-time","fulltime","opening","open"],
      text:"Yes! Som is available for both freelance projects and full-time roles. The quickest way to start is the contact form or an email.",
      go:"#contact", goLabel:"Contact Som" },

    { keys:["price","pricing","rate","rates","cost","budget","quote","charge","fee","fees"],
      text:"Pricing depends on the scope of the project. Send Som a short description of what you need through the contact form and he'll get back to you, usually within a day.",
      go:"#contact", goLabel:"Contact Som" },

    { keys:["contact","whatsapp","email","mail","phone","call","number","reach","message","linkedin","github","twitter","social"],
      text:"You can reach Som here:\n• Email: somsinghrajput1291@gmail.com\n• Phone / WhatsApp: +91 6388613827\n• Location: Varanasi, India\n\nHe usually replies within a day.",
      go:"#contact", goLabel:"Open Contact" },

    { keys:["where","location","located","based","live","city","varanasi","india"],
      text:"Som is based in Varanasi, India.",
      go:"#contact", goLabel:"Open Contact" },

    { keys:["resume","cv","download"],
      text:"You can download Som's resume using the Resume button at the top of the page.",
      go:"#home", goLabel:"Go to top" },

    { keys:["testimonial","testimonials","review","reviews","client","clients","feedback"],
      text:"Clients describe Som as communicative, fast, and honest about trade-offs. You can read their words in the Testimonials section.",
      go:"#testimonials", goLabel:"Read Testimonials" },

    { keys:["english","hindi","speak","language","languages"],
      text:"Som speaks English and Hindi." },

    { keys:["thanks","thank","bye","goodbye","great","cool","awesome"],
      text:"You're welcome! If you'd like to work together, the contact form is the fastest way to reach Som." }
  ];

  var FALLBACK = "I'm not sure about that one. Try asking about Som's skills, projects, experience, services, or how to contact him, or reach out directly through the contact form.";
  var CHIPS = ["Skills","Projects","Experience","Services","Contact"];

  /* ---------- Elements ---------- */
  var launcher = document.getElementById("chatLauncher");
  var panel    = document.getElementById("chatPanel");
  var body     = document.getElementById("chatBody");
  var chipsEl  = document.getElementById("chatChips");
  var form     = document.getElementById("chatForm");
  var input    = document.getElementById("chatInput");
  if(!launcher || !panel) return;

  var history = [];
  var greeted = false;
  var busy = false;

  /* ---------- Helpers ---------- */
  function scrollDown(){ body.scrollTop = body.scrollHeight; }

  function addMessage(role, text, go, goLabel){
    var el = document.createElement("div");
    el.className = "chat-msg " + role;
    el.textContent = text;
    if(go){
      var link = document.createElement("a");
      link.href = go;
      link.className = "chat-go";
      link.textContent = (goLabel || "Go to section") + " →";
      link.addEventListener("click", function(e){
        e.preventDefault();
        var target = document.querySelector(go);
        if(target){ target.scrollIntoView({ behavior:"smooth", block:"start" }); }
        if(window.innerWidth < 700){ setOpen(false); }
      });
      el.appendChild(document.createElement("br"));
      el.appendChild(link);
    }
    body.appendChild(el);
    scrollDown();
    return el;
  }

  function showTyping(){
    var el = document.createElement("div");
    el.className = "chat-msg bot chat-typing";
    el.setAttribute("aria-label","Assistant is typing");
    el.innerHTML = "<i></i><i></i><i></i>";
    body.appendChild(el);
    scrollDown();
    return el;
  }

  function setOpen(open){
    panel.classList.toggle("open", open);
    launcher.setAttribute("aria-expanded", open ? "true" : "false");
    launcher.setAttribute("aria-label", open ? "Close chat assistant" : "Open chat assistant");
    if(open){
      if(!greeted){
        greeted = true;
        addMessage("bot", "Hi! 👋 I'm Som's portfolio assistant. What would you like to know?");
      }
      setTimeout(function(){ input.focus(); }, 250);
    }
  }

  /* ---------- Answer logic ---------- */
  function localReply(text){
    var msg = text.toLowerCase();
    var best = null, bestScore = 0;
    KB.forEach(function(item){
      var score = 0;
      item.keys.forEach(function(k){
        if(new RegExp("\\b" + k + "(s|es)?\\b").test(msg)) score++;
      });
      if(score > bestScore){ best = item; bestScore = score; }
    });
    return best ? { text:best.text, go:best.go, goLabel:best.goLabel } : { text:FALLBACK };
  }

  function remoteReply(text){
    return askAI({ mode:"chat", message:text, history:history.slice(-8, -1) }).then(function(t){
      var l = localReply(text);
      return { text:t, go:l.go, goLabel:l.goLabel };
    });
  }

  function send(text){
    text = text.trim();
    if(!text || busy) return;
    busy = true;
    addMessage("user", text);
    history.push({ role:"user", content:text });
    input.value = "";
    var typing = showTyping();

    var getReply = AI.online
      ? remoteReply(text).catch(function(){ return localReply(text); })
      : new Promise(function(resolve){ setTimeout(function(){ resolve(localReply(text)); }, 550); });

    getReply.then(function(res){
      typing.remove();
      addMessage("bot", res.text, res.go, res.goLabel);
      history.push({ role:"assistant", content:res.text });
      busy = false;
    });
  }

  /* ---------- Wire up ---------- */
  CHIPS.forEach(function(label){
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chat-chip";
    b.textContent = label;
    b.addEventListener("click", function(){ send(label); });
    chipsEl.appendChild(b);
  });

  launcher.addEventListener("click", function(){
    setOpen(!panel.classList.contains("open"));
  });
  form.addEventListener("submit", function(e){
    e.preventDefault();
    send(input.value);
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && panel.classList.contains("open")){
      setOpen(false);
      launcher.focus();
    }
  });
})();
