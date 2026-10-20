const links=[...document.querySelectorAll('.nav nav a')];
const sections=[...document.querySelectorAll('main section[id]')];

function setActive(id){
  links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+id));
}

const sectionObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(visible) setActive(visible.target.id);
},{rootMargin:'-20% 0px -65% 0px',threshold:[0.05,0.2,0.5]});
sections.forEach(s=>sectionObserver.observe(s));

const hero=document.querySelector('.hero');
const heroObserver=new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting) setActive('top');
},{threshold:.55});
if(hero) heroObserver.observe(hero);

const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.section > *, .journey-item, .impact-number, .skill-block, .credential-list > div, .flow-node').forEach(el=>revealObserver.observe(el));

const heroVisual=document.querySelector('.hero-visual');
if(heroVisual){
  window.addEventListener('pointermove',e=>{
    const x=(e.clientX/window.innerWidth-.5)*7;
    const y=(e.clientY/window.innerHeight-.5)*5;
    heroVisual.style.transform=`translate3d(${x}px,${y}px,0)`;
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=document.querySelector(a.getAttribute('href'));
  if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
}));

const style=document.createElement('style');
style.textContent=`.section>*{opacity:.001;transform:translateY(22px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}.section>.is-visible{opacity:1;transform:none}.journey-item,.impact-number,.skill-block,.credential-list>div,.flow-node{opacity:.001;transform:translateY(22px);transition:opacity .75s cubic-bezier(.2,.7,.2,1),transform .75s cubic-bezier(.2,.7,.2,1)}.journey-item.is-visible,.impact-number.is-visible,.skill-block.is-visible,.credential-list>div.is-visible,.flow-node.is-visible{opacity:1;transform:none}`;
document.head.appendChild(style);

// V8 cinematic interaction layer: scroll progress, ambient card lighting and gentle tilt.
const progressBar = document.querySelector('.scroll-progress span');
const navBar = document.querySelector('.nav');
let progressTicking = false;
function updateScrollChrome(){
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  if(progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  if(navBar) navBar.classList.toggle('scrolled', window.scrollY > 24);
  progressTicking = false;
}
window.addEventListener('scroll',()=>{
  if(!progressTicking){window.requestAnimationFrame(updateScrollChrome);progressTicking=true;}
},{passive:true});
updateScrollChrome();

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if(canHover){
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('pointermove',event=>{
      const rect=card.getBoundingClientRect();
      card.style.setProperty('--pointer-x',`${event.clientX-rect.left}px`);
      card.style.setProperty('--pointer-y',`${event.clientY-rect.top}px`);
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      card.style.transform=`perspective(1000px) rotateX(${-y*1.4}deg) rotateY(${x*1.4}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave',()=>{card.style.transform='';});
  });
}


// V9 balanced polish: keep cursor movement subtle and avoid motion for reduced-motion users.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', () => { card.style.transform = ''; });
  });
} else {
  const tiltCards = document.querySelectorAll('.project-card');
  tiltCards.forEach(card => {
    card.addEventListener('pointerleave', () => { card.style.setProperty('--pointer-x', '50%'); card.style.setProperty('--pointer-y', '50%'); });
  });
}

// V13: accessible mobile navigation. Menu closes after navigation or Escape.
const menuToggle = document.querySelector('.menu-toggle');
const primaryMenu = document.querySelector('#primary-menu');
if (menuToggle && primaryMenu) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    primaryMenu.classList.remove('menu-open');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    primaryMenu.classList.toggle('menu-open', open);
  });
  primaryMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
}


// V20: polished voice selection with honest fallback behavior.
(() => {
  const button = document.querySelector('#talk-to-me');
  const heroVisual = document.querySelector('.hero-visual');
  if (!button) return;
  let speaking = false;
  const intro = "Hello, I’m Seshu Kumar Gollapalli, a Cloud Engineer with 3.9 years of experience supporting cloud platforms across AWS, Azure and Google Cloud. My work includes infrastructure, Terraform, CI/CD, security and cloud operations. Welcome to my portfolio. Feel free to ask me about my experience and skills.";
  const voices = () => ('speechSynthesis' in window ? window.speechSynthesis.getVoices() : []);
  const isEnglish = v => /^en([_-]|$)/i.test(v.lang || '');
  const likelyMale = /david|mark|guy|ryan|christopher|eric|roger|james|daniel|george|thomas|aaron|andrew|brian|prabhat|ravi|male|matthew|oliver|liam|arthur|fred|alex/i;
  const likelyFemale = /aria|jenny|sonia|samantha|zira|ava|susan|female|heera|priya|karen|siri female/i;
  function chooseVoice() {
    const english = voices().filter(isEnglish);
    return english.find(v => likelyMale.test(v.name)) ||
      english.find(v => /en-IN/i.test(v.lang) && !likelyFemale.test(v.name)) ||
      english.find(v => !likelyFemale.test(v.name)) || english[0] || null;
  }
  const setState = state => {
    speaking = state;
    button.setAttribute('aria-pressed', String(state));
    button.querySelector('.talk-button-copy strong').textContent = state ? 'Speaking…' : 'AI Voice Intro';
    button.querySelector('.talk-button-copy small').textContent = state ? 'Click to stop' : 'Hear the introduction';
    if (heroVisual) heroVisual.classList.toggle('is-speaking', state);
  };
  button.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      button.querySelector('.talk-button-copy small').textContent = 'Speech is not supported in this browser';
      return;
    }
    if (speaking) { window.speechSynthesis.cancel(); setState(false); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(intro);
    utterance.lang = 'en-IN'; utterance.rate = 0.91; utterance.pitch = 0.94; utterance.volume = 1;
    const selected = chooseVoice();
    if (selected) utterance.voice = selected;
    utterance.onend = () => setState(false);
    utterance.onerror = () => setState(false);
    setState(true); window.speechSynthesis.speak(utterance);
  });
  window.addEventListener('pagehide', () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); });
})();

// V15: lightweight portfolio Q&A with optional browser voice and speech recognition.
(() => {
  const launcher = document.querySelector('#concierge-launcher');
  const panel = document.querySelector('#concierge-panel');
  const close = document.querySelector('#concierge-close');
  const form = document.querySelector('#concierge-form');
  const input = document.querySelector('#concierge-input');
  const messages = document.querySelector('#concierge-messages');
  const mic = document.querySelector('#concierge-mic');
  const voiceSelect = document.querySelector('#concierge-voice');
  const stop = document.querySelector('#concierge-stop');
  if (!launcher || !panel || !form) return;
  let recognition = null;
  let listening = false;
  const openPanel = (open) => {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) setTimeout(() => input.focus(), 80);
  };
  launcher.addEventListener('click', () => openPanel(panel.hidden));
  close.addEventListener('click', () => openPanel(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') openPanel(false); });

  const addMessage = (text, who, extra='') => {
    const el = document.createElement('div'); el.className = `chat-message ${who}`;
    el.textContent = text;
    if (extra) { const small = document.createElement('small'); small.textContent = extra; el.appendChild(small); }
    messages.appendChild(el); messages.scrollTop = messages.scrollHeight; return el;
  };
  const answers = [
    {keys:['experience','years','career','work history','tcs','careernet'], answer:'Seshu has 3.9 years of cloud and infrastructure experience. At TCS (January 2022–July 2025), he supported AWS, Azure and GCP environments, infrastructure, security policies, CI/CD troubleshooting, migration and disaster recovery, and contributed SOPs and L2 team training. At Careernet (January–March 2026), he supported cloud platform availability, troubleshooting and Terraform deployment documentation.'},
    {keys:['skill','technology','technologies','tools','terraform','jenkins','python','linux'], answer:'His core skills include AWS, Microsoft Azure, Google Cloud, Terraform, ARM templates, Git, GitHub, Jenkins, YAML, CI/CD, IAM, CSPM, Linux, Bash and Python. He also has foundational exposure to Docker and Kubernetes.'},
    {keys:['certification','certified','certificate','az-104'], answer:'The portfolio lists AWS Certified SysOps Administrator, Microsoft Azure Administrator (AZ-104), and Google Associate Cloud Engineer (ACE).'},
    {keys:['project','projects','case study','built'], answer:'The portfolio highlights experience-based case studies in multi-cloud infrastructure, infrastructure automation, and cloud reliability/operations. They describe the type of work Seshu has supported; they should not be interpreted as independent personal projects unless explicitly identified that way.'},
    {keys:['aws','azure','gcp','cloud platform','clouds'], answer:'Seshu has worked across AWS, Azure and GCP. His portfolio focuses on cloud infrastructure support, platform operations, security, Terraform and deployment troubleshooting.'},
    {keys:['contact','email','linkedin','hire','opportunity','reach'], answer:'You can contact Seshu at seshugollapalli9848@gmail.com, connect on LinkedIn at linkedin.com/in/seshu-kumar-gollapalli/, or use the contact section on this page.'},
    {keys:['resume','cv'], answer:'Use the Download Resume button in the navigation or hero section to open Seshu’s resume.'},
    {keys:['location','where','hyderabad'], answer:'Seshu is based in Hyderabad, India.'},
    {keys:['education','college','degree','b.tech'], answer:'Seshu completed a B.Tech at Aditya College of Engineering and Technology (2017–2021).'}
  ];
  const getAnswer = q => {
    const text = q.toLowerCase();
    for (const item of answers) if (item.keys.some(k => text.includes(k))) return item.answer;
    return 'I can help with Seshu’s cloud engineering experience, AWS/Azure/GCP skills, Terraform and CI/CD, certifications, education, or contact details. Try asking one of those questions, or use the Contact section to reach him directly.';
  };
  const voiceStatus = document.querySelector('#voice-status');
  const voiceName = v => `${v.name} (${v.lang})`;
  const getEnglishVoices = () => ('speechSynthesis' in window ? window.speechSynthesis.getVoices() : []).filter(v => /^en([_-]|$)/i.test(v.lang || ''));
  const malePattern = /david|mark|guy|ryan|christopher|eric|roger|james|daniel|george|thomas|aaron|andrew|brian|prabhat|ravi|male|matthew|oliver|liam|arthur|fred|alex/i;
  const femalePattern = /aria|jenny|sonia|samantha|zira|ava|susan|female|heera|priya|karen/i;
  function populateVoiceChoices() {
    if (!voiceSelect) return;
    const current = voiceSelect.value || 'male';
    [...voiceSelect.querySelectorAll('option[data-installed="true"]')].forEach(o => o.remove());
    getEnglishVoices().forEach(v => {
      const option = document.createElement('option'); option.value = `voice:${v.name}`; option.textContent = voiceName(v); option.dataset.installed = 'true';
      voiceSelect.appendChild(option);
    });
    voiceSelect.value = current;
    if (voiceStatus) voiceStatus.textContent = getEnglishVoices().length ? 'Choose a voice available on this device.' : 'Loading voices from your browser…';
  }
  populateVoiceChoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = populateVoiceChoices;
  const speak = text => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-IN'; utterance.rate = .91; utterance.pitch = .94; utterance.volume = 1;
    const english = getEnglishVoices();
    let chosen = null;
    if (voiceSelect.value.startsWith('voice:')) chosen = english.find(v => v.name === voiceSelect.value.slice(6));
    else if (voiceSelect.value === 'male') chosen = english.find(v => malePattern.test(v.name)) || english.find(v => /en-IN/i.test(v.lang) && !femalePattern.test(v.name)) || english.find(v => !femalePattern.test(v.name)) || english[0];
    else chosen = english.find(v => /en-IN/i.test(v.lang)) || english[0];
    if (chosen) utterance.voice = chosen;
    if (voiceStatus) voiceStatus.textContent = chosen ? `Speaking with: ${chosen.name} · ${chosen.lang}` : 'No English voice is installed; using browser default.';
    const hero = document.querySelector('.hero-visual');
    if (hero) hero.classList.add('is-speaking');
    utterance.onend = utterance.onerror = () => { if (hero) hero.classList.remove('is-speaking'); };
    window.speechSynthesis.speak(utterance);
  };
  const respond = question => {
    const q = question.trim(); if (!q) return;
    addMessage(q, 'user'); input.value = '';
    const answer = getAnswer(q);
    addMessage(answer, 'bot'); speak(answer);
  };
  form.addEventListener('submit', e => { e.preventDefault(); respond(input.value); });
  document.querySelectorAll('[data-question]').forEach(b => b.addEventListener('click', () => respond(b.dataset.question)));
  stop.addEventListener('click', () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); const hero = document.querySelector('.hero-visual'); if(hero) hero.classList.remove('is-speaking'); if (voiceStatus) voiceStatus.textContent = 'Voice stopped.'; });
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition(); recognition.lang = 'en-IN'; recognition.interimResults = false; recognition.maxAlternatives = 1;
    recognition.onresult = event => { const heard = event.results[0][0].transcript; input.value = heard; respond(heard); };
    recognition.onend = () => { listening = false; mic.textContent = '🎙'; mic.setAttribute('aria-label','Speak your question'); };
    recognition.onerror = () => { listening = false; mic.textContent = '🎙'; addMessage('Microphone input did not work. You can type your question instead.','bot'); };
    mic.addEventListener('click', () => { if (listening) { recognition.stop(); return; } try { recognition.start(); listening = true; mic.textContent = '■'; mic.setAttribute('aria-label','Stop listening'); } catch (_) {} });
  } else {
    mic.addEventListener('click', () => addMessage('Voice input is not supported in this browser/file setup. Please type your question.','bot'));
    mic.title = 'Voice input may require Chrome/Edge and microphone permission';
  }

})();

// V21 reel-style interactions: restrained portrait parallax and pointer-reactive cards.
(() => {
  const portrait = document.querySelector('.portrait-wrap');
  const heroVisual = document.querySelector('.hero-visual');
  const lensCards = [...document.querySelectorAll('.lens-card')];
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reduceMotion) return;
  if (portrait && heroVisual) {
    heroVisual.addEventListener('pointermove', event => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      portrait.style.transform = `perspective(1200px) rotateY(${x * 4.2}deg) rotateX(${-y * 3.2}deg) translate3d(${x * 5}px,${y * 4}px,0)`;
      const pRect = portrait.getBoundingClientRect();
      portrait.style.setProperty('--pointer-x', `${Math.max(0,Math.min(100,(event.clientX-pRect.left)/pRect.width*100))}%`);
      portrait.style.setProperty('--pointer-y', `${Math.max(0,Math.min(100,(event.clientY-pRect.top)/pRect.height*100))}%`);
    });
    heroVisual.addEventListener('pointerleave', () => {
      portrait.style.transform = '';
      portrait.style.setProperty('--pointer-x','50%');
      portrait.style.setProperty('--pointer-y','45%');
    });
  }
  lensCards.forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty('--pointer-x', `${x}px`);
      card.style.setProperty('--pointer-y', `${y}px`);
      const rx = (y / rect.height - .5) * -2.5;
      const ry = (x / rect.width - .5) * 3;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; card.style.setProperty('--pointer-x','50%'); card.style.setProperty('--pointer-y','50%'); });
  });
})();

// V23 — parallax the entire 3D stage independently from the portrait for real layered depth.
(() => {
  const visual = document.querySelector('.hero-visual');
  const scene = document.querySelector('.hero-scene');
  const portrait = document.querySelector('.portrait-wrap');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!visual || !scene || !finePointer || reduceMotion) return;
  visual.addEventListener('pointermove', e => {
    const r = visual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    scene.style.transform = `translate3d(${x * -13}px,${y * -10}px,0) rotateY(${x * 3.5}deg) rotateX(${-y * 2.5}deg)`;
    if (portrait) portrait.style.setProperty('--stage-depth', `${Math.abs(x) * 18 + 8}px`);
  });
  visual.addEventListener('pointerleave', () => {
    scene.style.transform = '';
    if (portrait) portrait.style.removeProperty('--stage-depth');
  });
})();


// V35 cinematic intro: camera push-in, subtle pointer parallax, and seamless reveal.
(function(){
  const intro=document.getElementById('cinematic-entry');
  const skip=document.getElementById('entry-skip');
  const shot=intro && intro.querySelector('.reel-shot');
  if(!intro) return;
  let closed=false, timer;
  function closeIntro(){
    if(closed) return; closed=true;
    if(timer) window.clearTimeout(timer);
    intro.classList.add('is-pushing-in');
    document.body.classList.remove('cinematic-entry-active');
    window.setTimeout(()=>{
      intro.classList.add('is-leaving');
      window.setTimeout(()=>intro.remove(),650);
    },780);
  }
  if(skip) skip.addEventListener('click',closeIntro);
  // Gentle camera-relative movement makes the scene feel filmed, without swinging the laptop unnaturally.
  intro.addEventListener('pointermove',e=>{
    if(closed || !shot || e.pointerType==='touch') return;
    const r=intro.getBoundingClientRect();
    const nx=(e.clientX-r.left)/r.width-.5;
    const ny=(e.clientY-r.top)/r.height-.5;
    intro.style.setProperty('--room-x',(nx*-9).toFixed(1)+'px');
    intro.style.setProperty('--room-y',(ny*-6).toFixed(1)+'px');
    intro.style.setProperty('--light-x',(nx*12).toFixed(1)+'px');
    intro.style.setProperty('--light-y',(ny*8).toFixed(1)+'px');
  },{passive:true});
  intro.addEventListener('pointerleave',()=>{
    intro.style.setProperty('--room-x','0px'); intro.style.setProperty('--room-y','0px');
    intro.style.setProperty('--light-x','0px'); intro.style.setProperty('--light-y','0px');
  },{passive:true});
  timer=window.setTimeout(closeIntro,8200);
})();
