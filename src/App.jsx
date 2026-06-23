import React, { useEffect, useRef, useState } from "react";

/* ============================================================
   PORTFOLIO — recreación fiel de iqtidartara.framer.website
   Tokens extraídos en vivo. Movimiento nativo (IntersectionObserver
   = whileInView, keyframes CSS = marquees, rAF = contadores).
   Sustituye los textos/placeholders marcados con TU contenido.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
:root{
  --bg:#05071A; --bg2:#080B22;
  --txt:#E7ECFB; --muted:#9AA6C8; --line:rgba(255,255,255,.08);
  --blue:#427BD8; --blue2:#92BBFF; --ice:#C5EBFF;
  --card:linear-gradient(to bottom, rgba(15,16,37,0.55), rgba(19,15,35,0.55));
  --cardBlue:linear-gradient(to bottom, rgba(27,38,66,0.6), rgba(28,48,96,0.6));
  --display:'Outfit',sans-serif; --body:'Inter',sans-serif;
}
.site{ background:var(--bg); color:var(--txt); font-family:var(--body);
  position:relative; overflow-x:hidden; min-height:100vh; }
.grid-overlay{
  position:absolute; inset:0; pointer-events:none; z-index:1;
  background-image:radial-gradient(circle, rgba(255,255,255,.045) 1.2px, transparent 1.2px);
  background-size:24px 24px;
}
.wrap{ max-width:1200px; margin:0 auto; padding-inline:24px; }
.section{ padding-block:110px; position:relative; z-index:2; }

/* ---- reveal (whileInView equivalent) ---- */
.reveal{ opacity:0; transform:translateY(28px);
  transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.reveal.in{ opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce){
  .reveal{opacity:1;transform:none;transition:none}
  .marquee__track{animation:none !important}
}

/* ---- typography ---- */
.display{ font-family:var(--display); font-weight:700; line-height:1.02; letter-spacing:-.02em; }
.h-grad{ background: linear-gradient(120deg, #427BD8 0%, #92BBFF 25%, #FFFFFF 50%, #92BBFF 75%, #427BD8 100%);
  background-size: 200% auto; -webkit-background-clip:text; background-clip:text; color:transparent;
  animation: textShimmer 8s linear infinite; }
@keyframes textShimmer {
  0% { background-position: 0% center; }
  100% { background-position: -200% center; }
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(142, 193, 255, 0.34);
  background: linear-gradient(rgba(149, 170, 255, 0.06) 0%, rgba(142, 193, 255, 0.06) 49.5%, rgba(197, 235, 255, 0.06) 100%);
  backdrop-filter: blur(10px);
}
.eyebrow span {
  background: linear-gradient(0deg, #95AAFF, #8EC1FF 50%, #C5EBFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.dot{ width:7px; height:7px; border-radius:50%; background:#8EC1FF;
  box-shadow:0 0 10px #8EC1FF; }
.kicker{ color:var(--muted); font-size:14px; letter-spacing:.04em; text-transform:uppercase; }
.lead{ color:var(--muted); font-size:18px; line-height:1.6; max-width:620px; }

/* ---- botón píldora cristalino con efectos de luz ---- */
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
.btn {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: var(--body);
  font-weight: 500;
  font-size: 15px;
  color: #fff;
  padding: 14px 26px;
  border-radius: 100px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  overflow: visible;
  box-shadow: 0 .6px 1.08px -.83px rgba(0,0,0,.05), 0 2.29px 4.12px -1.67px rgba(0,0,0,.05), 0 10px 18px -2.5px rgba(0,0,0,.05);
  transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
}
.btn:hover {
  transform: scale(1.02);
}
.btn:focus-visible {
  outline: 2px solid #8EC1FF;
  outline-offset: 3px;
}
/* (1) Glow detrás del botón (difuminado de 15px) */
.btn__glow {
  position: absolute;
  inset: -12px;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  filter: blur(15px);
  background: radial-gradient(35% 50% at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: var(--hovered, 0);
  transition: opacity 0.3s ease;
}
/* (2) Brillo del borde (sweep) */
.btn__sweep {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(25% 50% at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: var(--hovered, 0);
  transition: opacity 0.3s ease;
}
/* (3) Núcleo del botón */
.btn__core {
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: #05071a;
  z-index: 2;
  pointer-events: none;
}
/* (4) Contenido / Texto */
.btn > span.btn__label {
  position: relative;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
/* --- Variante Glossy (Botón Blanco/Holográfico del Hero) --- */
.btn--glossy {
  color: #050505;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.45) inset,
    0 18px 32px -10px rgba(0, 132, 255, 0.25);
}
.btn--glossy .btn__core {
  inset: 3.5px;
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(245, 249, 255, 0.95) 100%);
  border: 0.5px solid rgba(255, 255, 255, 0.9);
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.btn--glossy .btn__sweep {
  opacity: 1;
  background: conic-gradient(from var(--a) at var(--mx, 50%) 50%, transparent 300deg, rgba(255, 255, 255, 0.95) 330deg, transparent 360deg);
  animation: spin 4s linear infinite;
}
.btn--glossy .btn__bglow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(87% 100% at 50% 100%, rgb(0, 153, 255) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: 0.65;
}
@keyframes spin {
  0% { --a: 0deg; }
  100% { --a: 360deg; }
}

/* ---- nav ---- */
.nav{ position:fixed; top:0; left:0; right:0; z-index:50; transition:all .3s ease; }
.nav__inner{ display:flex; align-items:center; justify-content:space-between;
  max-width:1200px; margin:0 auto; padding:16px 24px; }
.nav.scrolled .nav__inner{ background:rgba(8,11,34,.7); backdrop-filter:blur(14px);
  border:1px solid var(--line); border-radius:100px; margin:10px auto; max-width:1100px; }
.nav__brand{ display:flex; align-items:center; gap:10px; font-weight:700; font-family:var(--display); }
.nav__ava{ width:34px; height:34px; border-radius:50%; overflow:hidden;
  background:linear-gradient(135deg,#427BD8,#C5EBFF); flex-shrink:0; }
.nav__ava img{ width:100%; height:100%; object-fit:cover; display:block; }
.nav__links{ display:flex; gap:28px; }
.nav__links a{ color:var(--muted); text-decoration:none; font-size:15px; transition:color .2s; }
.nav__links a:hover{ color:#fff; }
.nav__cta{ position:relative; }
.nav__cta::before{ content:''; position:absolute; top:-14px; left:50%; transform:translateX(-50%);
  width:120px; height:30px; background:radial-gradient(ellipse,rgba(146,187,255,.5),transparent 70%);
  filter:blur(8px); pointer-events:none; }

/* ---- hero ---- */
.hero{ padding:170px 0 90px; text-align:center; }
.hero h1{ font-size:clamp(40px,7vw,82px); margin:26px auto 22px; max-width:14ch; }
.hero .lead{ margin:0 auto 34px; text-align:center; }

/* Multi-layered premium ambient lighting */
.hero__glow {
  position: absolute;
  top: -220px; left: 50%;
  transform: translateX(-50%);
  width: min(1400px, 130vw);
  height: min(900px, 90vh);
  background:
    radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0, 82, 255, 0.78), transparent 65%),
    radial-gradient(ellipse 60% 50% at 48% 20%, rgba(0, 180, 255, 0.52), transparent 55%),
    radial-gradient(ellipse 40% 30% at 52% 10%, rgba(142, 193, 255, 0.35), transparent 50%);
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;
  animation: glowPulse 12s ease-in-out infinite;
}
.hero__interactive-glow {
  position: absolute;
  top: -150px; left: 50%;
  transform: translate(calc(-50% + (var(--gmx, 0px) - 50vw) * 0.04), calc((var(--gmy, 0px) - 30vh) * 0.04));
  width: 650px; height: 650px;
  background: radial-gradient(circle, rgba(0, 132, 255, 0.42) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.hero__aurora {
  position: absolute;
  top: -300px; left: 50%;
  transform: translateX(-50%) rotate(0deg);
  width: 1000px; height: 700px;
  background: conic-gradient(from 0deg at 50% 50%, rgba(0, 82, 255, 0.12), rgba(197, 235, 255, 0.10), rgba(142, 193, 255, 0.12), rgba(0, 82, 255, 0.12));
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
  animation: auroraRotate 48s linear infinite;
  opacity: 0.95;
}
.ambient-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: min(1300px, 120vw);
  height: 600px;
  background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30, 100, 255, 0.38) 0%, transparent 70%);
  filter: blur(90px);
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;
}
@keyframes auroraRotate {
  from { transform: translateX(-50%) rotate(0deg); }
  to { transform: translateX(-50%) rotate(360deg); }
}
@keyframes glowPulse {
  0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.72; transform: translateX(-50%) scale(0.96); }
}

/* ---- marquee ---- */
.marquee{ overflow:hidden; position:relative; padding:12px 0;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent); }
.marquee__track{ display:flex; gap:20px; width:max-content;
  animation:marquee var(--dur,38s) linear infinite; }
.marquee:hover .marquee__track{ animation-play-state:paused; }
.marquee--rev .marquee__track{ animation-direction:reverse; }
@keyframes marquee{ from{transform:translateX(0)} to{transform:translateX(-50%)} }

/* project strip cards */
.shot{
  width:420px; height:280px; border-radius:18px; flex:none; overflow:hidden;
  border:1px solid rgba(255,255,255,.10); position:relative; isolation:isolate;
  background:var(--cardBlue);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14), 0 24px 48px -20px rgba(0,0,0,.7);
  transition:transform .5s cubic-bezier(.16,1,.3,1), border-color .5s, box-shadow .5s;
}
.shot__img{
  position:absolute; inset:0; z-index:1;
  width:100%; height:100%; object-fit:cover; object-position:center top;
  display:block; transition:transform .6s cubic-bezier(.16,1,.3,1);
}
.shot:hover .shot__img{ transform:scale(1.05); }
.shot:hover{ transform:translateY(-4px); border-color:rgba(146,187,255,.4);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 26px 50px -22px rgba(40,80,170,.5); }
/* top-glow radial */
.shot::after{ content:''; position:absolute; inset:0; z-index:2;
  background:radial-gradient(120% 80% at 50% 0%,rgba(146,187,255,.18),transparent 60%); }
/* crystalline edge glint — visible at rest, full on hover */
.shot::before{ content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; z-index:4; pointer-events:none;
  background:linear-gradient(115deg, transparent 25%, rgba(197,235,255,.65) 50%, transparent 75%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude; opacity:0.25; transition:opacity .5s; }
.shot:hover::before{ opacity:1; }
.shot b{ position:absolute; left:16px; bottom:14px; z-index:5; font-family:var(--display);
  font-weight:600; opacity:.9;
  text-shadow:0 1px 8px rgba(0,0,0,.8); }

/* brands */
.brand{ font-family:var(--display); font-weight:700; font-size:22px; color:#7E8BB5;
  white-space:nowrap; opacity:.8; transition:opacity .3s,color .3s; flex:none; }
.brands{ position:relative; }
.brands__glow{ position:absolute; inset:0; background:radial-gradient(ellipse at 50% 50%,rgba(40,72,140,.35),transparent 60%); pointer-events:none; }

/* ---- comparison ---- */
.cols{ display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:48px; }
.col{ border-radius:20px; padding:32px; border:1px solid var(--line);
  position:relative; overflow:hidden; isolation:isolate;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08), 0 20px 40px -20px rgba(0,0,0,.5);
  transition:transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s; }
/* crystalline border glint */
.col::before{ content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; z-index:2; pointer-events:none;
  background:linear-gradient(120deg, transparent 25%, rgba(146,187,255,.45) 50%, transparent 75%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  opacity:0.2; transition:opacity .5s; }
.col:hover{ transform:translateY(-4px); border-color:rgba(146,187,255,.25); }
.col:hover::before{ opacity:1; }

/* ---- "Sin mí" column: magenta/pink accent glow bar at bottom ---- */
.col--no{ background:linear-gradient(180deg, #15101f 0%, #1a0e1a 100%); --glare-color: rgba(255, 60, 142, 0.14); --glare-size: 180px; }
.col--no::after{ content:''; position:absolute; bottom:-2px; left:10%; right:10%; height:6px; z-index:3;
  background:linear-gradient(90deg, transparent, #ff3c8e 30%, #ff6eb4 50%, #ff3c8e 70%, transparent);
  border-radius:0 0 20px 20px;
  filter:blur(6px);
  opacity:0; transition:opacity .4s ease-out, filter .4s ease-out; }
.col--no:hover::after{ opacity:1; filter:blur(8px); }
/* extra magenta ambient behind the bar */
.col--no .glow-accent{ position:absolute; bottom:-20px; left:20%; right:20%; height:40px; z-index:0;
  background:radial-gradient(ellipse at 50% 100%, rgba(255,60,142,.35), transparent 70%);
  filter:blur(20px); pointer-events:none;
  opacity:0; transition:opacity .4s ease-out; }
.col--no:hover .glow-accent{ opacity:1; }
/* vertical magenta glow bar on the top-left edge - refined to align with outer card border (compensating for 32px parent padding) */
.col--no .glow-side{ position:absolute; top:-35px; height:120px; left:-35px; width:6px; z-index:3;
  background:linear-gradient(180deg, #ff6eb4 0%, #ff3c8e 50%, transparent 100%);
  border-radius:20px 0 0 20px;
  filter:blur(5px);
  opacity:0; transition:opacity .4s ease-out, filter .4s ease-out; }
.col--no:hover .glow-side{ opacity:1; filter:blur(6px); }

/* ---- "Conmigo" column: cyan/ice-blue accent glow bar at bottom + left side vertical bar ---- */
.col--yes{ background:var(--cardBlue); --glare-color: rgba(66, 123, 216, 0.14); --glare-size: 180px; }
.col--yes::after{ content:''; position:absolute; bottom:-2px; left:10%; right:10%; height:6px; z-index:3;
  background:linear-gradient(90deg, transparent, #00d4ff 30%, #7eedff 50%, #00d4ff 70%, transparent);
  border-radius:0 0 20px 20px;
  filter:blur(6px);
  opacity:0; transition:opacity .4s ease-out, filter .4s ease-out; }
.col--yes:hover::after{ opacity:1; filter:blur(8px); }
/* vertical blue glow bar on the top-left edge - refined to align with outer card border (compensating for 32px parent padding) */
.col--yes .glow-side{ position:absolute; top:-35px; height:120px; left:-35px; width:6px; z-index:3;
  background:linear-gradient(180deg, #7eedff 0%, #00d4ff 50%, transparent 100%);
  border-radius:20px 0 0 20px;
  filter:blur(5px);
  opacity:0; transition:opacity .4s ease-out, filter .4s ease-out; }
.col--yes:hover .glow-side{ opacity:1; filter:blur(6px); }
/* ambient glow behind the left bar - disabled to prevent bleed-in and keep text/checks completely clean */
.col--yes .glow-ambient{ display:none; }

.col h3{ font-family:var(--display); font-size:20px; margin-bottom:22px; }
.row{ display:flex; gap:12px; align-items:flex-start; padding:13px 0; border-top:1px solid var(--line); color:var(--muted); font-size:15px; }
.ic{ width:22px;height:22px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:13px;font-weight:700; }
.ic--x{ background:rgba(255,90,90,.15); color:#ff8a8a; }
.ic--v{ background:rgba(120,220,160,.15); color:#7fe3a6; }

/* ---- section heading ---- */
.shead{ text-align:center; max-width:760px; margin:0 auto 10px; }
.shead h2{ font-family:var(--display); font-weight:700; font-size:clamp(30px,4.4vw,52px);
  letter-spacing:-.02em; line-height:1.05; margin:16px 0; }

/* ---- bento services ---- */
.bento{ display:grid; grid-template-columns:repeat(6,1fr); gap:20px; margin-top:52px; }
.scard{ background:var(--card); border:1px solid rgba(255,255,255,0.09); border-radius:20px; padding:26px;
  position:relative; overflow:hidden; min-height:300px; display:flex; flex-direction:column;
  justify-content:flex-end; isolation:isolate;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10), 0 24px 50px -30px rgba(0,0,0,.8);
  transition:transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s; }
.card__sweep {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(350px circle at var(--mx, 50%) var(--my, 50%), rgba(142, 193, 255, 0.10), transparent 70%);
  opacity: var(--hovered, 0);
  transition: opacity 0.5s ease;
}
/* crystalline edge: visible at rest, full on hover */
.scard::before{ content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; z-index:3; pointer-events:none;
  background:linear-gradient(120deg, transparent 25%, rgba(146,187,255,.55) 50%, transparent 75%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  opacity:0.25; transition:opacity .5s; }
.scard:hover{ transform:translateY(-6px); border-color:rgba(146,187,255,.35);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.16), 0 30px 60px -28px rgba(40,80,170,.55); }
.scard:hover::before{ opacity:1; }
.scard h4{ font-family:var(--display); font-size:20px; margin-bottom:8px; }
.scard p{ color:var(--muted); font-size:14px; line-height:1.55; }
.scard .viz{ position:absolute; inset:0; bottom:auto; height:55%; }
.col-3{ grid-column:span 3; } .col-2{ grid-column:span 2; } .col-6{ grid-column:span 6; }

/* service mini-vizzes */
.chat{ position:absolute; top:24px; left:24px; right:24px; display:flex; flex-direction:column; gap:8px; }
.bubble{ background:rgba(255,255,255,.06); border:1px solid var(--line); border-radius:12px;
  padding:8px 12px; font-size:13px; color:#cfd8f5; max-width:80%; opacity:0; transform:translateY(6px);
  transition:.4s; }
.scard:hover .bubble{ opacity:1; transform:none; }
.scard:hover .bubble:nth-child(2){ transition-delay:.12s; }
.scard:hover .bubble:nth-child(3){ transition-delay:.24s; align-self:flex-end; background:rgba(146,187,255,.18); }
.stat{ font-family:var(--display); font-weight:800; font-size:46px;
  background:linear-gradient(180deg,#cfe0ff,#7fa6ff); -webkit-background-clip:text; background-clip:text; color:transparent; }
.tags{ display:flex; flex-wrap:wrap; gap:8px; position:absolute; top:24px; left:24px; right:24px; }
.tag{ font-size:12px; padding:5px 10px; border-radius:100px; background:rgba(255,255,255,.05);
  border:1px solid var(--line); color:#b9c4e6; }
.fontline{ font-family:var(--display); font-size:34px; font-weight:700; color:#cfe0ff;
  transition:font-weight .5s, letter-spacing .5s; }
.scard:hover .fontline{ font-weight:400; letter-spacing:.06em; }
.scale{ display:flex; gap:6px; align-items:flex-end; height:70px; }
.scale i{ width:8px; background:linear-gradient(180deg,#8EC1FF,#427BD8); border-radius:4px;
  height:20%; transition:height .5s cubic-bezier(.16,1,.3,1); }
.scard:hover .scale i{ height:var(--h,50%); }

/* web design — static peeking fan (matches original: frames always visible) */
.webfan{ position:absolute; top:0; left:0; right:0; height:58%; display:grid; place-items:center; z-index:1; }
.frame{ position:absolute; width:172px; height:112px; border-radius:11px; overflow:hidden;
  border:1px solid rgba(255,255,255,.12); background:linear-gradient(#16203c,#101a33);
  box-shadow:0 20px 40px -20px rgba(0,0,0,.75); display:grid; place-items:center;
  transition:transform .55s cubic-bezier(.16,1,.3,1), opacity .55s; }
.vlabel{ font-size:11px; color:#90a3cf; font-family:var(--display); letter-spacing:.05em; }
/* resting: frames permanently fanned, peeking behind the centre preview */
/* resting: frames tucked behind the centre preview */
.f1{ opacity:.22; transform:translate(-30px,-6px) rotate(-3deg) scale(.86); z-index:1; }
.f2{ opacity:.22; transform:translate(30px,-6px) rotate(3deg) scale(.86); z-index:1; }
.f3{ opacity:.3;  transform:translate(-18px,4px) rotate(-2deg) scale(.92); z-index:3; }
.f4{ opacity:.3;  transform:translate(18px,4px) rotate(2deg) scale(.92); z-index:3; }
.fc{ z-index:6; border-color:rgba(146,187,255,.4);
  box-shadow:0 24px 48px -18px rgba(0,0,0,.85), 0 0 0 1px rgba(146,187,255,.15); }
/* hover: assemble — frames fan out around the centre, which lifts */
.scard:hover .f1{ opacity:.85; transform:perspective(600px) translate3d(-118px,-22px,0) rotateY(15deg) rotateZ(-12deg) scale(.9); }
.scard:hover .f2{ opacity:.85; transform:perspective(600px) translate3d(118px,-22px,0) rotateY(-15deg) rotateZ(12deg) scale(.9); }
.scard:hover .f3{ opacity:1;   transform:perspective(600px) translate3d(-150px,26px,10px) rotateY(8deg) rotateZ(-7deg) scale(.96); }
.scard:hover .f4{ opacity:1;   transform:perspective(600px) translate3d(150px,26px,10px) rotateY(-8deg) rotateZ(7deg) scale(.96); }
.scard:hover .fc{ transform:perspective(600px) translate3d(0,-6px,25px) scale(1.05); }
/* mini website preview inside the central frame */
.mini{ position:relative; width:100%; height:100%; display:flex; flex-direction:column; gap:6px;
  align-items:center; justify-content:center; padding:14px;
  background:radial-gradient(130% 90% at 50% 0%, rgba(146,187,255,.20), transparent 60%); }
.mini__bar{ position:absolute; top:9px; left:10px; display:flex; gap:4px; }
.mini__bar i{ width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.28); }
.mini__hero{ font-family:var(--display); font-weight:700; font-size:11px; line-height:1.25;
  text-align:center; color:#e3ecff; }
.mini__cta{ width:48px; height:12px; border-radius:100px; background:linear-gradient(180deg,#fff,#bcd2ff); }
@media (prefers-reduced-motion: reduce){ .frame{ transition:none } }

/* === Copywriting: notion-style task table === */
.ntable{ position:absolute; top:22px; left:22px; right:22px; border-radius:12px; overflow:hidden;
  border:1px solid rgba(255,255,255,.08); background:rgba(10,14,32,.6); backdrop-filter:blur(4px); }
.ntable__bar{ display:flex; align-items:center; gap:8px; padding:9px 12px; font-size:11px; color:#9fb0d8;
  border-bottom:1px solid rgba(255,255,255,.06); }
.ntable__bar .home{ width:14px;height:14px;border-radius:4px;background:linear-gradient(135deg,#427BD8,#92BBFF); }
.ntable__title{ font-family:var(--display); font-weight:700; font-size:14px; color:#fff; padding:10px 12px 4px; }
.nrow{ display:grid; grid-template-columns:1.4fr 1fr .8fr; gap:8px; padding:8px 12px; font-size:10.5px; color:#c3cdec;
  border-top:1px solid rgba(255,255,255,.05); align-items:center;
  opacity:0; transform:translateX(-10px); transition:opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1); }
.scard:hover .nrow{ opacity:1; transform:none; }
.scard:hover .nrow:nth-child(3){ transition-delay:.05s } .scard:hover .nrow:nth-child(4){ transition-delay:.13s }
.scard:hover .nrow:nth-child(5){ transition-delay:.21s } .scard:hover .nrow:nth-child(6){ transition-delay:.29s }
.npill{ padding:2px 7px; border-radius:5px; font-size:9.5px; white-space:nowrap; justify-self:start; }
.np-red{ background:rgba(255,99,99,.18); color:#ff9d9d } .np-blue{ background:rgba(99,150,255,.18); color:#a8c2ff }
.np-green{ background:rgba(99,220,150,.18); color:#8be7b0 } .np-amber{ background:rgba(255,196,99,.18); color:#ffd28a }
.np-gray{ background:rgba(255,255,255,.08); color:#aeb8d6 }

/* === Product design: floating phone screens === */
.phones{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:14px; }
.phone{ width:74px; height:148px; border-radius:14px; border:1px solid rgba(255,255,255,.14);
  background:linear-gradient(160deg,#1c2748,#121a30); box-shadow:0 18px 36px -16px rgba(0,0,0,.8);
  position:relative; overflow:hidden; transition:transform .55s cubic-bezier(.16,1,.3,1); }
.phone::before{ content:''; position:absolute; top:8px; left:50%; transform:translateX(-50%); width:24px; height:4px; border-radius:3px; background:rgba(255,255,255,.2); }
.phone .scr{ position:absolute; inset:14px 8px 8px; border-radius:8px; background:radial-gradient(120% 80% at 50% 0,rgba(146,187,255,.25),transparent 60%); display:flex; align-items:center; justify-content:center; font-family:var(--display); font-size:13px; font-weight:700; color:#dfeaff; }
.phone.p1{ transform:translateY(6px) rotate(-7deg); animation: floatP1 4s ease-in-out infinite; }
.phone.p2{ animation: floatP2 4.5s ease-in-out infinite; }
.phone.p3{ transform:translateY(6px) rotate(7deg); animation: floatP3 3.5s ease-in-out infinite; }
.scard:hover .phone.p1{ transform:translateY(-2px) rotate(-12deg) translateX(-10px) !important; animation: none; }
.scard:hover .phone.p2{ transform:translateY(-12px) scale(1.06) !important; animation: none; }
.scard:hover .phone.p3{ transform:translateY(-2px) rotate(12deg) translateX(10px) !important; animation: none; }

@keyframes floatP1 {
  0%, 100% { transform: translateY(6px) rotate(-7deg); }
  50% { transform: translateY(1px) rotate(-5deg); }
}
@keyframes floatP2 {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
@keyframes floatP3 {
  0%, 100% { transform: translateY(6px) rotate(7deg); }
  50% { transform: translateY(2px) rotate(5deg); }
}

/* === Development: mini code editor === */
.editor{ position:absolute; top:22px; left:22px; right:22px; border-radius:12px; overflow:hidden;
  border:1px solid rgba(255,255,255,.1); background:rgba(8,11,26,.85); }
.editor__bar{ display:flex; align-items:center; gap:6px; padding:9px 12px; border-bottom:1px solid rgba(255,255,255,.07); }
.editor__bar i{ width:9px;height:9px;border-radius:50%; }
.editor__bar i:nth-child(1){ background:#ff6058 } .editor__bar i:nth-child(2){ background:#ffbd2e } .editor__bar i:nth-child(3){ background:#28c840 }
.editor__tag{ margin-left:auto; font-size:10px; color:#9fb0d8; display:flex; align-items:center; gap:5px; }
.code{ padding:12px; font-family:ui-monospace,Menlo,monospace; font-size:11px; line-height:1.7; }
.code .ln{ display:block; white-space:nowrap; overflow:hidden; width:0; opacity:0;
  transition:width .55s steps(28), opacity .2s; }
.scard:hover .code .ln{ width:100%; opacity:1; }
.scard:hover .code .ln:nth-child(2){ transition-delay:.2s } .scard:hover .code .ln:nth-child(3){ transition-delay:.4s }
.scard:hover .code .ln:nth-child(4){ transition-delay:.6s }
.code .ln:last-child::after{ content:'▋'; color:#92BBFF; opacity:0; }
.scard:hover .code .ln:last-child::after{ opacity:1; animation:blink 1s steps(1) infinite .8s; }
@keyframes blink{ 50%{ opacity:0 } }
.code .k{ color:#92BBFF } .code .s{ color:#8be7b0 } .code .c{ color:#6f7aa3 }

/* === Branding: type + swatches === */
.brandviz{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; }
.brandviz .big{ font-family:var(--display); font-size:46px; font-weight:800; line-height:1; color:#e7eeff;
  transition:transform .5s cubic-bezier(.16,1,.3,1); }
.scard:hover .brandviz .big{ transform:scale(1.2); }
.swatches{ display:flex; gap:7px; }
.swatches i{ width:18px; height:18px; border-radius:6px; }

/* === Motion: easing track with playhead === */
.motionviz{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:26px; }
.mscale{ display:flex; gap:7px; align-items:flex-end; height:80px; }
.mscale i{ width:9px; border-radius:5px; background:linear-gradient(180deg,#C5EBFF,#427BD8); height:18%;
  animation: barWave 1.8s ease-in-out infinite; animation-delay: var(--delay, 0s); }
.mscale i:nth-child(1) { --delay: 0s; }
.mscale i:nth-child(2) { --delay: 0.1s; }
.mscale i:nth-child(3) { --delay: 0.2s; }
.mscale i:nth-child(4) { --delay: 0.3s; }
.mscale i:nth-child(5) { --delay: 0.4s; }
.mscale i:nth-child(6) { --delay: 0.5s; }
.mscale i:nth-child(7) { --delay: 0.6s; }
.mscale i:nth-child(8) { --delay: 0.7s; }
.mscale i:nth-child(9) { --delay: 0.8s; }
.mscale i:nth-child(10) { --delay: 0.9s; }
.mscale i:nth-child(11) { --delay: 1.0s; }

@keyframes barWave {
  0%, 100% { height: 18%; }
  50% { height: var(--h, 50%); }
}
.mreadout{ font-family:ui-monospace,monospace; font-size:13px; color:#9fb0d8; }
.mreadout b{ color:#C5EBFF; font-size:22px; font-family:var(--display); display:block; }

/* ---- How I Help: 4-quadrant crosshair layout ---- */
.hq__wrap {
  position: relative;
  width: 100%;
  max-width: 760px;
  margin: 60px auto 0;
  aspect-ratio: 1/1;
}

/* Quadrant text blocks */
.hq__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}
.hq__q {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 36px 28px;
  gap: 12px;
  position: relative;
}
.hq__q.tl { justify-content: flex-end; align-items: flex-end; text-align: right; padding-right: 48px; padding-bottom: 48px; }
.hq__q.tr { justify-content: flex-end; align-items: flex-start; text-align: left;  padding-left: 48px;  padding-bottom: 48px; }
.hq__q.bl { justify-content: flex-start; align-items: flex-end; text-align: right; padding-right: 48px; padding-top: 48px; }
.hq__q.br { justify-content: flex-start; align-items: flex-start; text-align: left;  padding-left: 48px;  padding-top: 48px; }

.hq__icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(146,187,255,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
}
.hq__icon svg { width: 16px; height: 16px; opacity: 0.65; }
.hq__h {
  font-family: var(--display);
  font-size: 15px;
  font-weight: 600;
  color: #d4dcf5;
  line-height: 1.3;
}
.hq__p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.55;
  max-width: 200px;
}

/* Glow on quadrant text rows (tr/bl = blue diagonal) */
.hq__q.tr::after, .hq__q.bl::after {
  content:'';
  position:absolute;
  inset:0;
  background: radial-gradient(ellipse at center, rgba(66,123,216,0.14) 0%, transparent 70%);
  pointer-events: none;
}

/* Crosshair lines */
.hq__lines {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
/* Horizontal line */
.hq__lines::before {
  content: '';
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  height: 1px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, transparent 0%, rgba(66,123,216,0.22) 20%, rgba(146,187,255,0.35) 50%, rgba(66,123,216,0.22) 80%, transparent 100%);
}
/* Vertical line */
.hq__lines::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, transparent 0%, rgba(66,123,216,0.22) 20%, rgba(146,187,255,0.35) 50%, rgba(66,123,216,0.22) 80%, transparent 100%);
}

/* Central hub */
.hq__hub {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  z-index: 5;
  width: 76px;
  height: 76px;
}

/* Concentric pulse and rotating dashboard rings */
.hq__ring {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(66,123,216,0.22);
  top: 50%; left: 50%;
  transform: translate(-50%,-50%) rotate(0deg);
  animation: ringRotate var(--r-dur, 20s) linear infinite;
  box-shadow: 0 0 15px rgba(66,123,216,0.03);
}
.hq__ring:nth-child(even) {
  border-style: dotted;
  --r-dur: 50s;
  animation-direction: reverse;
}
.hq__ring:nth-child(1) { width: 110px; height: 110px; --r-dur: 35s; }
.hq__ring:nth-child(2) { width: 170px; height: 170px; --r-dur: 50s; }
.hq__ring:nth-child(3) { width: 240px; height: 240px; --r-dur: 70s; }
.hq__ring:nth-child(4) { width: 320px; height: 320px; --r-dur: 90s; }
.hq__ring:nth-child(5) { width: 410px; height: 410px; --r-dur: 110s; }

@keyframes ringRotate {
  from { transform: translate(-50%,-50%) rotate(0deg); }
  to   { transform: translate(-50%,-50%) rotate(360deg); }
}

/* Avatar circle with breathing neon glow */
.hq__ava {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(146,187,255,0.45);
  box-shadow: 0 0 0 6px rgba(66,123,216,0.12), 0 0 30px rgba(66,123,216,0.35);
  position: relative;
  z-index: 2;
  animation: avaPulse 6s ease-in-out infinite;
}
@keyframes avaPulse {
  0%, 100% { box-shadow: 0 0 0 6px rgba(66,123,216,0.12), 0 0 30px rgba(66,123,216,0.35); }
  50% { box-shadow: 0 0 0 10px rgba(66,123,216,0.18), 0 0 45px rgba(66,123,216,0.55); }
}
.hq__ava img { width: 100%; height: 100%; object-fit: cover; }

/* Scroll-driven rays moving inward along each axis */
.hq__ray {
  position: absolute;
  z-index: 3;
  pointer-events: none;
  transition: transform 0.04s linear;
}
.hq__ray--l {
  left: 0; top: 50%;
  width: 50%; height: 2px;
  transform-origin: right center;
  background: linear-gradient(90deg, transparent, rgba(146,187,255,0.8));
  transform: translateY(-50%) translateX(calc(-1 * var(--ray-offset, 100%)));
}
.hq__ray--r {
  right: 0; top: 50%;
  width: 50%; height: 2px;
  transform-origin: left center;
  background: linear-gradient(270deg, transparent, rgba(146,187,255,0.8));
  transform: translateY(-50%) translateX(calc(var(--ray-offset, 100%)));
}
.hq__ray--t {
  top: 0; left: 50%;
  width: 2px; height: 50%;
  transform-origin: center bottom;
  background: linear-gradient(180deg, transparent, rgba(146,187,255,0.8));
  transform: translateX(-50%) translateY(calc(-1 * var(--ray-offset, 100%)));
}
.hq__ray--b {
  bottom: 0; left: 50%;
  width: 2px; height: 50%;
  transform-origin: center top;
  background: linear-gradient(0deg, transparent, rgba(146,187,255,0.8));
  transform: translateX(-50%) translateY(calc(var(--ray-offset, 100%)));
}

/* Background glow behind the whole section */
.hq__bg-glow {
  position: absolute;
  top: 50%; left: 50%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(66,123,216,0.15) 0%, transparent 70%);
  transform: translate(-50%,-50%);
  pointer-events: none;
  filter: blur(40px);
  z-index: 0;
}

@media (max-width: 640px) {
  .hq__wrap { aspect-ratio: auto; }
  .hq__grid { grid-template-columns: 1fr; grid-template-rows: auto; }
  .hq__q { align-items: center; text-align: center; padding: 24px 20px; }
  .hq__q.tl, .hq__q.tr, .hq__q.bl, .hq__q.br { padding: 24px 20px; align-items: center; text-align: center; }
  .hq__hub { display: none; }
  .hq__lines { display: none; }
  .hq__ring { display: none; }
  .hq__bg-glow { display: none; }
}

/* ---- case studies grid ---- */
.cases{ display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-top:52px; }
.case{ border-radius:18px; overflow:hidden; position:relative; aspect-ratio:4/3; isolation:isolate;
  border:1px solid rgba(255,255,255,.10); background:var(--cardBlue); cursor:pointer;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.12);
  transition:border-color .5s, box-shadow .5s, transform .5s cubic-bezier(.16,1,.3,1); }
.case:hover{ transform:translateY(-4px); border-color:rgba(146,187,255,.4);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 26px 50px -22px rgba(40,80,170,.5); }
/* crystalline glint on case cards — visible at rest, full on hover */
.case::before{ content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; z-index:4; pointer-events:none;
  background:linear-gradient(115deg, transparent 25%, rgba(197,235,255,.6) 50%, transparent 75%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude; opacity:0.25; transition:opacity .5s; }
.case:hover::before{ opacity:1; }
.case__img{ position:absolute; inset:0; z-index:1; transition:transform .6s cubic-bezier(.16,1,.3,1);
  width:100%; height:100%; object-fit:cover; object-position:center; display:block; }
.case:hover .case__img{ transform:scale(1.06); }
/* case bottom overlay with name */
.case__meta{ position:absolute; left:0; right:0; bottom:0; padding:20px; z-index:5;
  background:linear-gradient(transparent,rgba(5,7,26,.85)); display:flex; align-items:center; justify-content:space-between;
  transform:translateY(8px); opacity:.85; transition:.4s; }
.case:hover .case__meta{ transform:none; opacity:1; }
.case__meta b{ font-family:var(--display); font-size:17px; color:#fff; }
.case__view{ font-size:12px; padding:6px 12px; border-radius:100px; background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.15); color:#c7d0ee; transition:background .3s; }
.case__view:hover{ background:rgba(255,255,255,.2); }

/* ---- testimonials ---- */
.tcard{ width:380px; flex:none; background:var(--card); border:1px solid rgba(255,255,255,.09);
  border-radius:18px; padding:24px; position:relative; overflow:hidden; isolation:isolate;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10), 0 20px 40px -20px rgba(0,0,0,.6);
  transition:transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s; }
.tcard::before{ content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; z-index:1; pointer-events:none;
  background:linear-gradient(120deg, transparent 25%, rgba(146,187,255,.5) 50%, transparent 75%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  opacity:0.2; transition:opacity .5s; }
.tcard:hover{ transform:translateY(-4px); border-color:rgba(146,187,255,.3);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.16), 0 26px 50px -22px rgba(40,80,170,.45); }
.tcard:hover::before{ opacity:1; }
.tcard .stars{ color:#FFCB6B; letter-spacing:2px; margin-bottom:14px; font-size:14px; }
.tcard p{ color:#c7d0ee; font-size:14px; line-height:1.6; margin-bottom:18px; }
.tcard .who{ display:flex; align-items:center; gap:12px; }
.tcard .who div b{ font-family:var(--display); display:block; font-size:15px; }
.tcard .who div span{ color:var(--muted); font-size:13px; }
.ava{ width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,#427BD8,#C5EBFF); flex:none; overflow:hidden; }
.ava img{ width:100%; height:100%; object-fit:cover; display:block; }

/* ---- faq ---- */
.faq{ max-width:780px; margin:48px auto 0; }
.q{ border:1px solid var(--line); border-radius:14px; margin-bottom:12px; overflow:hidden;
  background:var(--card); position:relative; isolation:isolate;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
  transition:border-color .4s, box-shadow .4s; }
.q::before{ content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; z-index:1; pointer-events:none;
  background:linear-gradient(120deg, transparent 25%, rgba(146,187,255,.45) 50%, transparent 75%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  opacity:0.15; transition:opacity .5s; }
.q:hover{ border-color:rgba(146,187,255,.2); }
.q:hover::before{ opacity:0.8; }
.q.open::before{ opacity:1; }
.q__head{ width:100%; text-align:left; background:none; border:none; color:var(--txt); cursor:pointer;
  font-family:var(--display); font-size:17px; padding:20px 22px; display:flex; justify-content:space-between; align-items:center; gap:16px; }
.q__ic{ flex:none; width:26px; height:26px; display:grid; place-items:center; transition:transform .3s; }
.q.open .q__ic{ transform:rotate(45deg); }
.q__body{ max-height:0; overflow:hidden; transition:max-height .4s cubic-bezier(.16,1,.3,1); }
.q__body p{ color:var(--muted); padding:0 22px 22px; font-size:15px; line-height:1.6; }

/* ---- footer ---- */
.footer{ border-top:1px solid var(--line); padding:60px 0 40px; margin-top:40px; }
.footer__grid{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:30px; align-items:flex-start; }
.footer a{ color:var(--muted); text-decoration:none; display:block; padding:5px 0; transition:color .2s; }
.footer a:hover{ color:#fff; }
.foot-cols{ display:flex; gap:60px; flex-wrap:wrap; }

/* responsive */
@media(max-width:900px){
  .cols,.bento,.help,.cases{ grid-template-columns:1fr; }
  .col-3,.col-2,.col-6{ grid-column:span 1; }
  .nav__links{ display:none; }
}

:root {
  --liquid-glass-shadow: 0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 3px 3px 0.5px -3px rgba(0,0,0,0.9), inset -3px -3px 0.5px -3px rgba(0,0,0,0.85), inset 1px 1px 1px -0.5px rgba(0,0,0,0.6), inset -1px -1px 1px -0.5px rgba(0,0,0,0.6), inset 0 0 6px 6px rgba(0,0,0,0.12), inset 0 0 2px 2px rgba(0,0,0,0.06), 0 0 12px rgba(255,255,255,0.15);
  --liquid-glass-shadow-hover: 0 0 8px rgba(0,0,0,0.05), 0 4px 10px rgba(0,0,0,0.12), inset 3px 3px 0.5px -3px rgba(0,0,0,0.95), inset -3px -3px 0.5px -3px rgba(0,0,0,0.9), inset 1.5px 1.5px 1.5px -0.5px rgba(0,0,0,0.7), inset -1.5px -1.5px 1.5px -0.5px rgba(0,0,0,0.7), inset 0 0 8px 8px rgba(0,0,0,0.15), inset 0 0 3px 3px rgba(0,0,0,0.08), 0 0 16px rgba(255,255,255,0.25);
  --glass-bg: rgba(15, 16, 37, 0.55);
}

/* Liquid Glass Premium con relieve 3D esmerilado y distorsión SVG */
.liquid-glass {
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg) !important;
    backdrop-filter: url("#container-glass") blur(24px) saturate(190%) !important;
    -webkit-backdrop-filter: url("#container-glass") blur(24px) saturate(190%) !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    box-shadow: var(--liquid-glass-shadow) !important;
    transition: border-color 300ms cubic-bezier(.16,1,.3,1), box-shadow 300ms cubic-bezier(.16,1,.3,1), background 300ms cubic-bezier(.16,1,.3,1), transform 300ms cubic-bezier(.16,1,.3,1) !important;
}

.liquid-glass:hover {
    border-color: rgba(255, 255, 255, 0.28) !important;
    box-shadow: var(--liquid-glass-shadow-hover) !important;
}

/* Capas internas para evitar distorsión del texto y mejorar rendimiento */
.liquid-glass-inner-mode {
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: none !important;
    border: none !important;
}
.liquid-glass-inner-mode:hover {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
}

.liquid-glass-shadow-layer {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
    pointer-events: none;
    transition: box-shadow 300ms cubic-bezier(.16,1,.3,1), border-color 300ms cubic-bezier(.16,1,.3,1);
    box-shadow: var(--liquid-glass-shadow);
    border: 1px solid rgba(255, 255, 255, 0.14);
}

.liquid-glass-inner-mode:hover .liquid-glass-shadow-layer {
    box-shadow: var(--liquid-glass-shadow-hover);
    border-color: rgba(255, 255, 255, 0.28);
}

.liquid-glass-refract-layer {
    position: absolute;
    inset: 0;
    z-index: -10;
    border-radius: inherit;
    overflow: hidden;
    pointer-events: none;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg);
    backdrop-filter: url("#container-glass") blur(24px) saturate(190%);
    -webkit-backdrop-filter: url("#container-glass") blur(24px) saturate(190%);
    transform: translateZ(0px);
}

.card-glare {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
    background: radial-gradient(circle var(--glare-size, 180px) at var(--mx, 50%) var(--my, 50%), var(--glare-color, rgba(146, 187, 255, 0.12)), transparent 75%);
    mix-blend-mode: screen;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(.16,1,.3,1);
}

.liquid-glass-inner-mode:hover .card-glare {
    opacity: 1;
}

.liquid-glass, .scard, .col, .case {
    transform-style: preserve-3d;
}

.liquid-glass h3, .liquid-glass h4, .scard h4, .col h3, .case b {
    transform: translateZ(35px) !important;
}

.liquid-glass p, .scard p, .col .row, .case .case__meta {
    transform: translateZ(15px) !important;
}

/* ---- pricing section ---- */
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
@media (max-width: 900px) {
  .pricing-grid { grid-template-columns: 1fr; }
}
.pcard {
  background: var(--card);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
}
.pcard--recommended {
  border-color: rgba(146, 187, 255, 0.25) !important;
  background: var(--cardBlue) !important;
  box-shadow: 0 0 20px rgba(66, 123, 216, 0.15) !important;
}
.pcard__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--blue);
  color: #fff;
  font-family: var(--display);
  font-size: 9px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(66, 123, 216, 0.3);
}
.pcard__header {
  border-bottom: 1px solid var(--line);
  padding-bottom: 24px;
  margin-bottom: 24px;
}
.pcard__num {
  font-family: var(--display);
  font-size: 10px;
  font-weight: 600;
  color: var(--blue2);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.pcard__title {
  font-family: var(--display);
  font-size: 24px;
  font-weight: 700;
  margin-top: 4px;
  color: #fff;
}
.pcard__desc {
  font-size: 13px;
  color: var(--muted);
  margin-top: 8px;
  line-height: 1.5;
}
.pcard__price-row {
  display: flex;
  align-items: baseline;
  margin-top: 16px;
}
.pcard__price {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}
.pcard__period {
  font-size: 13px;
  color: var(--muted);
  margin-left: 8px;
}
.pcard__period-sub {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
  display: block;
}
.pcard__features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}
.pcard__feature {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 13px;
  color: #cfd8f5;
}

/* ---- about section ---- */
.about-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 48px; align-items: center; }
@media (max-width: 900px) {
  .about-layout { grid-template-columns: 1fr; gap: 32px; }
}
.about-left { display: flex; flex-direction: column; justify-content: center; text-align: left; }
.about-left .shead { text-align: left; margin: 0 0 24px 0; max-width: 100%; }
.about-left .lead { text-align: left; margin: 0 0 32px 0; max-width: 100%; }
.about-stats { display: flex; gap: 20px; margin-top: 12px; }
.about-stat {
  flex: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.about-stat__num {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 800;
  color: var(--blue2);
  display: block;
}
.about-stat__lbl {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
  display: block;
}

.about-cards { display: flex; flex-direction: column; gap: 20px; }
.about-card {
  background: var(--card);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.about-card__inner {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 20px;
  align-items: center;
  width: 100%;
}
.about-card__icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: rgba(66, 123, 216, 0.1);
  border: 1px solid rgba(146, 187, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 20px;
  color: var(--blue2);
  box-shadow: 0 4px 10px rgba(66, 123, 216, 0.15);
}
.about-card__content h4 {
  font-family: var(--display);
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}
.about-card__content p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}
.about-card .card-glare {
  background: radial-gradient(circle var(--glare-size, 180px) at var(--mx, 50%) var(--my, 50%), rgba(146, 187, 255, 0.14), transparent 75%) !important;
}
.about-card .pcard__title, .about-card h4 {
  transform: translateZ(35px) !important;
}
.about-card p {
  transform: translateZ(15px) !important;
}
`;

/* ---------- helpers ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } }),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Starfield({ active }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  const opacityRef = useRef(0);
  const animIdRef = useRef(null);
  const drawRef = useRef(null);

  useEffect(() => {
    activeRef.current = active;
    if (active && !animIdRef.current && drawRef.current) {
      animIdRef.current = requestAnimationFrame(drawRef.current);
    }
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const starCount = isReduced ? 40 : 120;
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: 0,
        baseY: 0,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.05 + 0.01,
        angle: Math.random() * Math.PI * 2,
        color: Math.random() > 0.3 ? "#8EC1FF" : "#ffffff",
      });
      stars[i].baseX = stars[i].x;
      stars[i].baseY = stars[i].y;
    }

    const draw = () => {
      const targetOpacity = activeRef.current ? 0.75 : 0;
      opacityRef.current += (targetOpacity - opacityRef.current) * 0.08;

      if (canvas) {
        canvas.style.opacity = opacityRef.current;
      }

      if (!activeRef.current && opacityRef.current < 0.005) {
        opacityRef.current = 0;
        if (canvas) canvas.style.opacity = 0;
        ctx.clearRect(0, 0, width, height);
        animIdRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < starCount; i++) {
        const s = stars[i];

        if (!isReduced) {
          s.angle += s.speed * 0.05;
          s.baseX += Math.cos(s.angle) * s.speed;
          s.baseY += Math.sin(s.angle) * s.speed;

          if (s.baseX < 0) s.baseX = width;
          if (s.baseX > width) s.baseX = 0;
          if (s.baseY < 0) s.baseY = height;
          if (s.baseY > height) s.baseY = 0;

          const dx = mouse.x - s.baseX;
          const dy = mouse.y - s.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            const rx = (dx / dist) * force * 15;
            const ry = (dy / dist) * force * 15;
            s.x += (-rx - s.x + s.baseX) * 0.1;
            s.y += (-ry - s.y + s.baseY) * 0.1;
          } else {
            s.x += (s.baseX - s.x) * 0.08;
            s.y += (s.baseY - s.y) * 0.08;
          }

          s.alpha += (Math.random() - 0.5) * 0.04;
          if (s.alpha < 0.1) s.alpha = 0.1;
          if (s.alpha > 0.8) s.alpha = 0.8;
        } else {
          s.x = s.baseX;
          s.y = s.baseY;
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!isReduced) {
        animIdRef.current = requestAnimationFrame(draw);
      }
    };

    drawRef.current = draw;

    if (activeRef.current) {
      animIdRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: -1,
        opacity: 0,
      }}
    />
  );
}

function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={"reveal " + className} style={{ transitionDelay: delay + "ms" }} {...rest}>
      {children}
    </Tag>
  );
}

function TiltCard({ children, delay = 0, className = "", style = {}, as: Tag = "div", ...rest }) {
  const ref = useReveal();
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;
    
    const maxTilt = 2.5;
    const tiltX = -(mouseY / centerY) * maxTilt;
    const tiltY = (mouseX / centerX) * maxTilt;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tiltStyle = isHovered && !isReduced
    ? {
        transform: "perspective(1000px) rotateX(" + tilt.x + "deg) rotateY(" + tilt.y + "deg) translateY(-6px)",
        transition: "transform 0.1s ease-out, border-color 0.4s, box-shadow 0.4s",
      }
    : {
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)",
        transition: "transform 0.45s ease-out, border-color 0.4s, box-shadow 0.4s",
      };

  return (
    <Tag
      ref={ref}
      className={"reveal liquid-glass liquid-glass-inner-mode " + className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transitionDelay: delay + "ms",
        ...style,
        ...tiltStyle,
        position: "relative",
        "--mx": coords.x + "%",
        "--my": coords.y + "%",
        "--hovered": isHovered ? 1 : 0,
      }}
      {...rest}
    >
      <div className="liquid-glass-shadow-layer" />
      <div className="liquid-glass-refract-layer" />
      <div className="card-glare" />
      <span className="card__sweep" />
      <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "inherit" }}>
        {children}
      </div>
    </Tag>
  );
}

function Counter({ to, suffix = "", prefix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) {
        io.unobserve(el);
        const start = performance.now(), dur = 1400;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className="stat">{prefix}{v}{suffix}</span>;
}
function Btn({ glossy = false, children, href = "#", className = "", ...rest }) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  return (
    <a
      href={href}
      className={"btn " + (glossy ? "btn--glossy" : "") + " " + className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        "--mx": coords.x + "%",
        "--my": coords.y + "%",
        "--hovered": isHovered ? 1 : 0,
      }}
      {...rest}
    >
      <span className="btn__glow" />
      <span className="btn__sweep" />
      {glossy && <span className="btn__bglow" />}
      <span className="btn__core" />
      <span className="btn__label">{children}</span>
    </a>
  );
}

/* ---------- data ---------- */
const BRANDS = ["Reactive", "Minexa.ai", "SmileJoy", "JuPay", "Designify", "OrbitX", "PowerPulse", "WireFox", "Univit", "LifeLink", "Q-Taro"];
const PROJECTS = [
  { n: "UpdateAI",     img: "/assets/shot-1.png"  },
  { n: "WireFox VPN",  img: "/assets/shot-2.png"  },
  { n: "JuPay",        img: "/assets/shot-3.png"  },
  { n: "Reset Method", img: "/assets/shot-4.png"  },
  { n: "SmileJoy",     img: "/assets/shot-5.png"  },
  { n: "Properta",     img: "/assets/shot-6.png"  },
  { n: "Kania Media",  img: "/assets/shot-7.png"  },
  { n: "Bullyproof",   img: "/assets/shot-8.png"  },
  { n: "PowerPulse",   img: "/assets/shot-9.png"  },
  { n: "Minexa.ai",    img: "/assets/shot-10.png" },
];
const CASES = [
  { n: "UpdateAI",      img: "/assets/case-updateai.jpg",    url: "#" },
  { n: "Wirefox VPN",   img: "/assets/case-wirefox.jpg",     url: "#" },
  { n: "JuPay",         img: "/assets/case-jupay.png",       url: "#" },
  { n: "Reset Method",  img: "/assets/case-reset.png",       url: "#" },
  { n: "SmileJoy",      img: "/assets/case-smilejoy.png",    url: "#" },
  { n: "Properta",      img: "/assets/case-properta.png",    url: "#" },
  { n: "Biz Launch",    img: "/assets/case-bizlaunch.png",   url: "#" },
  { n: "Kania Media",   img: "/assets/case-kania.jpg",       url: "#" },
  { n: "Bullyproof",    img: "/assets/case-bullyproof.png",  url: "#" },
  { n: "Power Pulse",   img: "/assets/case-powerpulse.png",  url: "#" },
  { n: "NAC",           img: "/assets/case-nac.png",         url: "#" },
  { n: "Minexa AI",     img: "/assets/case-minexa.png",      url: "#" },
];
const TESTI = [
  { n: "Josh Schachter", r: "Fundador y CEO, UpdateAI",    img: "/assets/testi-1.webp", t: "Convirtió mi visión en una web impresionante que superó mis expectativas. Su dominio del diseño es muy poco común." },
  { n: "Masam",          r: "Diseñadora Senior",            img: "/assets/testi-2.jpg",  t: "Transformó por completo nuestra web anticuada. Visualmente impactante y la experiencia de usuario es de otro nivel." },
  { n: "Saleh",          r: "Experto SEO",                 img: "/assets/testi-3.png",  t: "El diseño y las ventas eran nuestro punto débil — esto cubrió ese hueco. La mejora en nuestras métricas fue real." },
  { n: "Dara King",      r: "Fundadora, Reels Studio",     img: "/assets/testi-4.png",  t: "Atento, comunicativo y resultados excepcionales. No dudaría en volver a colaborar." },
  { n: "København",      r: "Tech & IT",                  img: "/assets/testi-5.png",  t: "Maestría con animaciones e interacciones complejas que dieron vida a toda la web." },
  { n: "Orange",         r: "Vendedor",                   img: "/assets/testi-6.png",  t: "Integró herramientas externas y animaciones personalizadas a la perfección. Atención al detalle impresionante." },
];
const SERVICES_HELP = [
  { k: "01", h: "Atraer, influir, convertir", p: "Estrategias que cautivan y hacen que la voz de tu marca conecte." },
  { k: "02", h: "Identificar, posicionar, visualizar", p: "Marcas memorables que reflejan tus valores y tu posición en el mercado." },
  { k: "03", h: "Innovar, cautivar, fidelizar", p: "Apps y productos diseñados para impulsar la interacción y la lealtad." },
  { k: "04", h: "Atraer, convertir, crecer", p: "Webs que atraen visitantes, los convierten y disparan tu crecimiento." },
];
const FAQS = [
  { q: "¿Qué servicios ofreces?", a: "Copywriting, identidad de marca, diseño de producto y desarrollo end-to-end — un solo partner de la idea al lanzamiento." },
  { q: "¿Cómo garantizas la calidad y la coherencia?", a: "Una sola persona al cargo de todo el proyecto: decisiones cohesivas, sistema compartido y cero pérdidas en los traspasos." },
  { q: "¿Qué te diferencia de agencias y freelancers?", a: "Craft full-stack en una sola persona: orientado a marketing, basado en investigación y enfocado en un proyecto a la vez." },
  { q: "¿Cómo gestionas plazos y presupuestos?", a: "Alcance claro desde el inicio, revisiones semanales y entregas por hitos para que nada se desvíe." },
  { q: "¿Cómo puede una persona llevar un proyecto entero?", a: "Herramientas afiladas, un sistema reutilizable y foco profundo — calidad antes que malabarear con diez clientes." },
  { q: "¿Cómo empezamos?", a: "Reserva una llamada gratuita de 30 minutos. Definimos el alcance y trazamos un plan antes de cualquier compromiso." },
];

/* ---------- page ---------- */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(1);
  const [heroHovered, setHeroHovered] = useState(false);
  const helpSectionRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      document.documentElement.style.setProperty("--gmx", e.clientX + "px");
      document.documentElement.style.setProperty("--gmy", e.clientY + "px");
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!helpSectionRef.current) return;
      const rect = helpSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      const maxDist = windowHeight / 2;
      const dist = Math.max(0, Math.min(maxDist, sectionCenter - viewportCenter));
      const progress = dist / maxDist;
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="site">
      <Starfield active={heroHovered} />
      <div className="grid-overlay" />
      <style>{CSS}</style>

      {/* NAV */}
      <nav className={"nav " + (scrolled ? "scrolled" : "")}>
        <div className="nav__inner">
          <div className="nav__brand"><span className="nav__ava"><img src="/assets/avatar.png" alt="avatar" /></span> Iqtidar Tara</div>
          <div className="nav__links">
            <a href="#work">Proyectos</a><a href="#services">Servicios</a><a href="#about">Sobre mí</a><a href="#precios">Precios</a><a href="#faq">FAQ</a>
          </div>
          <div className="nav__cta"><Btn href="#contact">Reserva una llamada</Btn></div>
        </div>
      </nav>

      {/* HERO */}
      <header
        className="hero wrap"
        id="top"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
      >
        <div className="hero__aurora" />
        <div className="hero__glow" />
        <div className="hero__interactive-glow" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>¿Tienes tiempo? ¿Tienes ideas? Vamos a construir.</span></Reveal>
          <Reveal delay={120}><h1 className="display h-grad">Ayudo a startups a diseñar y desarrollar productos y webs</h1></Reveal>
          <Reveal delay={220} className="lead" as="p">No necesitas solo un diseño bonito. Entrego visuales impactantes, copy persuasivo y desarrollo impecable — listo para llevar tu proyecto al siguiente nivel.</Reveal>
          <Reveal delay={320}><Btn glossy href="#contact">Reserva una llamada GRATIS de 30 minutos</Btn></Reveal>
        </div>
      </header>

      {/* PROJECT STRIP MARQUEE */}
      <div className="section" style={{ padding: "30px 0 60px", overflow: "visible" }} id="work">
        <div className="ambient-glow" />
        <div className="marquee" style={{ "--dur": "75s" }}>
          <div className="marquee__track">
            {[...PROJECTS, ...PROJECTS].map((p, i) => (
              <div className="shot" key={i}>
                <img className="shot__img" src={p.img} alt={p.n} loading="lazy" />
                <b>{p.n}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BRANDS */}
      <div className="section brands" style={{ padding: "40px 0" }}>
        <div className="brands__glow" />
        <Reveal className="kicker" style={{ textAlign: "center", marginBottom: 34, position: "relative" }}>Marcas que han confiado en mí</Reveal>
        <div className="marquee" style={{ "--dur": "52s", position: "relative" }}>
          <div className="marquee__track" style={{ gap: 56 }}>
            {[...BRANDS, ...BRANDS].map((b, i) => <div className="brand" key={i}>{b}</div>)}
          </div>
        </div>
      </div>

      {/* COMPARISON */}
      <section className="section wrap" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Evita estos errores comunes</span></Reveal>
          <Reveal delay={100}><h2 className="display">Problemas al contratar freelancers, agencias y equipos in-house</h2></Reveal>
          <Reveal delay={180} className="lead" as="p" style={{ margin: "0 auto" }}>Los errores típicos de cada opción — frente a trabajar con un partner dedicado.</Reveal>
        </div>
        <div className="cols">
          <TiltCard className="col col--no" delay={0}>
            <span className="glow-side" />
            <span className="glow-accent" />
            <h3>Sin mí</h3>
            {["Proyectos fragmentados por experiencia limitada y dispersa", "Poca visión de marketing que perjudica la conversión", "Coste alto y gestión compleja entre varios contratos", "Calidad irregular y plazos incumplidos", "Foco diluido entre muchos clientes", "Investigación superficial y soluciones genéricas"].map((t, i) => (
              <div className="row" key={i}><span className="ic ic--x">✕</span>{t}</div>
            ))}
          </TiltCard>
          <TiltCard className="col col--yes" delay={120}>
            <span className="glow-side" />
            <span className="glow-ambient" />
            <h3>Conmigo</h3>
            {["Copy, diseño y desarrollo en un proceso cohesivo", "Trabajo orientado a marketing que impulsa la conversión", "Servicio integral que ahorra tiempo y dinero", "Historial probado de entregas de alto impacto", "Foco total: un proyecto a la vez", "Investigación profunda y a medida, alineada con tus objetivos"].map((t, i) => (
              <div className="row" key={i} style={{ color: "#dbe4ff" }}><span className="ic ic--v">✓</span>{t}</div>
            ))}
          </TiltCard>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section wrap" id="about" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="about-layout">
          {/* Left side: Main text and stats */}
          <div className="about-left">
            <div className="shead">
              <Reveal className="eyebrow" as="div"><span className="dot" /><span>¿Quién soy?</span></Reveal>
              <Reveal delay={100}><h2 className="display h-grad">El maestro de las soluciones digitales de alto impacto</h2></Reveal>
            </div>
            <Reveal delay={150} className="lead" as="p">
              Soy copywriter, diseñador y desarrollador. Convierto ideas en experiencias digitales que convierten — para fundadores independientes, agencias y startups con inversión.
            </Reveal>
            <div className="about-stats">
              <Reveal delay={200} className="about-stat">
                <span className="about-stat__num">5+</span>
                <span className="about-stat__lbl">Años de Exp</span>
              </Reveal>
              <Reveal delay={250} className="about-stat">
                <span className="about-stat__num">100+</span>
                <span className="about-stat__lbl">Proyectos</span>
              </Reveal>
              <Reveal delay={300} className="about-stat">
                <span className="about-stat__num">15+</span>
                <span className="about-stat__lbl">Sectores</span>
              </Reveal>
            </div>
          </div>

          {/* Right side: 3 Premium cards representing the key achievements */}
          <div className="about-cards">
            {/* Card 1: Experiencia de Élite */}
            <TiltCard className="about-card" delay={100}>
              <div className="about-card__inner">
                <div className="about-card__icon-wrapper">
                  <span>⚡</span>
                </div>
                <div className="about-card__content">
                  <h4>Experiencia de Élite</h4>
                  <p>Más de 5 años diseñando y desarrollando de forma profesional. 100+ proyectos exitosos en más de 15 sectores de negocio.</p>
                </div>
              </div>
            </TiltCard>

            {/* Card 2: Conversión Garantizada */}
            <TiltCard className="about-card" delay={180}>
              <div className="about-card__inner">
                <div className="about-card__icon-wrapper">
                  <span>🎯</span>
                </div>
                <div className="about-card__content">
                  <h4>Conversión y Diseño UX/UI</h4>
                  <p>Soluciones digitales orientadas al marketing y al retorno de inversión. Estructura visual pensada para retener y vender.</p>
                </div>
              </div>
            </TiltCard>

            {/* Card 3: Servicio de Extremo a Extremo */}
            <TiltCard className="about-card" delay={260}>
              <div className="about-card__inner">
                <div className="about-card__icon-wrapper">
                  <span>💼</span>
                </div>
                <div className="about-card__content">
                  <h4>Servicio Integral (End-to-End)</h4>
                  <p>Unificamos redacción persuasiva, diseño de marca y código limpio en un solo flujo de trabajo. Ahorra tiempo mientras escalas.</p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* SERVICES BENTO */}
      <section className="section wrap" id="services" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Mis servicios</span></Reveal>
          <Reveal delay={100}><h2 className="display">Así te ayudo a hacer crecer tu marca y tu negocio</h2></Reveal>
        </div>
        <div className="bento">
          <TiltCard className="scard col-3" delay={0}>
            <div className="ntable">
              <div className="ntable__bar"><span className="home" /> Proyectos / Minexa.ai</div>
              <div className="ntable__title">Minexa.ai</div>
              <div className="nrow"><span>Copy de Landing Page</span><span className="npill np-red">Página de Venta</span><span className="npill np-blue">En Curso</span></div>
              <div className="nrow"><span>Emails de Onboarding</span><span className="npill np-gray">Copy Email</span><span className="npill np-amber">Revisión</span></div>
              <div className="nrow"><span>Campaña Google Ads</span><span className="npill np-blue">Copy PPC</span><span className="npill np-green">Listo</span></div>
              <div className="nrow"><span>Facebook Ads #25</span><span className="npill np-amber">Copy Ads</span><span className="npill np-gray">Sin Empezar</span></div>
            </div>
            <h4>Copywriting</h4><p>Narrativas convincentes que generan interacción y convierten palabras en acción.</p>
          </TiltCard>
          <TiltCard className="scard col-3" delay={80}>
            <div className="webfan">
              <div className="frame f1"><span className="vlabel">v1 · Home</span></div>
              <div className="frame f2"><span className="vlabel">v2 · Home</span></div>
              <div className="frame f3"><span className="vlabel">v3 · Home</span></div>
              <div className="frame f4"><span className="vlabel">v4 · Home</span></div>
              <div className="frame fc">
                <div className="mini">
                  <div className="mini__bar"><i /><i /><i /></div>
                  <div className="mini__hero">Diseño y desarrollo<br />a tu medida</div>
                  <div className="mini__cta" />
                </div>
              </div>
            </div>
            <h4>Diseño Web</h4><p>Webs y landing pages impresionantes y usables que convierten clics en clientes.</p>
          </TiltCard>
          <TiltCard className="scard col-2" delay={0}>
            <div className="phones">
              <div className="phone p1"><span className="scr">00:00</span></div>
              <div className="phone p2"><span className="scr">22:46</span></div>
              <div className="phone p3"><span className="scr">Live</span></div>
            </div>
            <h4>Diseño de Producto</h4><p>Productos intuitivos que conectan y elevan la retención.</p>
          </TiltCard>
          <TiltCard className="scard col-2" delay={80}>
            <div className="editor">
              <div className="editor__bar"><i /><i /><i /><span className="editor__tag">▲ Framer</span></div>
              <div className="code">
                <span className="ln"><span className="k">export default</span> Site() {"{"}</span>
                <span className="ln">&nbsp;&nbsp;<span className="k">return</span> &lt;Hero</span>
                <span className="ln">&nbsp;&nbsp;&nbsp;&nbsp;<span className="s">title</span>=<span className="s">"Listo"</span> /&gt;</span>
                <span className="ln">{"}"} <span className="c">// hecho ✦</span></span>
              </div>
            </div>
            <h4>Desarrollo</h4><p>Desarrollos robustos y escalables con el stack más moderno — entregados sin fricciones.</p>
          </TiltCard>
          <TiltCard className="scard col-2" delay={160}>
            <div className="brandviz">
              <span className="big">Aa</span>
              <div className="swatches">
                <i style={{ background: "#427BD8" }} /><i style={{ background: "#92BBFF" }} />
                <i style={{ background: "#C5EBFF" }} /><i style={{ background: "#7fe3a6" }} />
                <i style={{ background: "#ffd28a" }} />
              </div>
            </div>
            <h4>Branding</h4><p>Identidades cohesivas que vuelven tu marca inolvidable.</p>
          </TiltCard>
          <TiltCard className="scard col-6" delay={0} style={{ minHeight: 220 }}>
            <div className="motionviz">
              <div className="mscale">
                {[18, 30, 46, 64, 82, 100, 82, 64, 46, 30, 18].map((h, i) => (
                  <i key={i} style={{ "--h": h + "%" }} />
                ))}
              </div>
              <div className="mreadout">escala<b>0.0 → 1.0</b>ease-out</div>
            </div>
            <h4>Motion Design</h4><p>Animaciones dinámicas que capturan la atención en cada fotograma.</p>
          </TiltCard>
        </div>
      </section>

      {/* HOW I HELP — 4-quadrant crosshair layout */}
      <section className="section" ref={helpSectionRef} id="howhelp">
        <div className="wrap shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>En qué me especializo</span></Reveal>
          <Reveal delay={100}><h2 className="display">Así ayudo a mis clientes</h2></Reveal>
        </div>

        {/* crosshair widget */}
        <div className="hq__wrap">
          {/* ambient bg glow */}
          <div className="hq__bg-glow" />

          {/* concentric rings */}
          <div className="hq__ring" />
          <div className="hq__ring" />
          <div className="hq__ring" />
          <div className="hq__ring" />
          <div className="hq__ring" />

          {/* axis lines */}
          <div className="hq__lines" />

          {/* scroll-driven rays */}
          <div
            className="hq__ray hq__ray--l"
            style={{ "--ray-offset": (scrollProgress * 100) + "%" }}
          />
          <div
            className="hq__ray hq__ray--r"
            style={{ "--ray-offset": (scrollProgress * 100) + "%" }}
          />
          <div
            className="hq__ray hq__ray--t"
            style={{ "--ray-offset": (scrollProgress * 100) + "%" }}
          />
          <div
            className="hq__ray hq__ray--b"
            style={{ "--ray-offset": (scrollProgress * 100) + "%" }}
          />

          {/* central hub avatar */}
          <div className="hq__hub">
            <div className="hq__ava">
              <img
                src="/assets/avatar.png"
                alt="Avatar"
                loading="lazy"
              />
            </div>
          </div>

          {/* 4 quadrant text blocks */}
          <div className="hq__grid">
            {/* Top-Left */}
            <div className="hq__q tl">
              <div className="hq__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'#92BBFF'}}>
                  <circle cx="12" cy="12" r="3"/><path d="M3 12h3m12 0h3M12 3v3m0 12v3"/>
                  <path d="M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>
                </svg>
              </div>
              <div className="hq__h">Engage, Influence, Convert</div>
              <div className="hq__p">Craft strategies that captivate, ensuring your brand's voice engages.</div>
            </div>

            {/* Top-Right */}
            <div className="hq__q tr">
              <div className="hq__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'#92BBFF'}}>
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <div className="hq__h">Identify, Position, Visualize</div>
              <div className="hq__p">Build memorable brands that reflect your values and market position.</div>
            </div>

            {/* Bottom-Left */}
            <div className="hq__q bl">
              <div className="hq__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'#92BBFF'}}>
                  <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/>
                </svg>
              </div>
              <div className="hq__h">Innovate, Captivate, Engage</div>
              <div className="hq__p">Design and develop apps that drive interaction and loyalty.</div>
            </div>

            {/* Bottom-Right */}
            <div className="hq__q br">
              <div className="hq__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'#92BBFF'}}>
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <div className="hq__h">Attract, Convert, Grow</div>
              <div className="hq__p">Create websites that attract visitors, convert them, and drive growth.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="section wrap" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Casos de estudio</span></Reveal>
          <Reveal delay={100}><h2 className="display">Mis últimos proyectos</h2></Reveal>
        </div>
        <div className="cases">
          {CASES.map((c, i) => (
            <TiltCard key={i} delay={(i % 3) * 90} className="case" as="a" href={c.url} target="_blank" rel="noopener noreferrer">
              <img className="case__img" src={c.img} alt={c.n} loading="lazy" />
              <div className="case__meta"><b>{c.n}</b><span className="case__view">View</span></div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="shead wrap">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Testimonios</span></Reveal>
          <Reveal delay={100}><h2 className="display">Lo que dicen mis clientes</h2></Reveal>
        </div>
        <div className="marquee" style={{ "--dur": "75s", marginTop: 40 }}>
          <div className="marquee__track">
            {[...TESTI, ...TESTI].map((t, i) => (
              <div className="tcard" key={i}>
                <div className="stars">★★★★★</div>
                <p>"{t.t}"</p>
                <div className="who">
                  <span className="ava">
                    {t.img ? <img src={t.img} alt={t.n} loading="lazy" /> : null}
                  </span>
                  <div><b>{t.n}</b><span>{t.r}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="marquee marquee--rev" style={{ "--dur": "90s", marginTop: 20 }}>
          <div className="marquee__track">
            {[...TESTI.slice().reverse(), ...TESTI.slice().reverse()].map((t, i) => (
              <div className="tcard" key={i}>
                <div className="stars">★★★★★</div>
                <p>"{t.t}"</p>
                <div className="who">
                  <span className="ava">
                    {t.img ? <img src={t.img} alt={t.n} loading="lazy" /> : null}
                  </span>
                  <div><b>{t.n}</b><span>{t.r}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section wrap" id="precios" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Inversión Inteligente</span></Reveal>
          <Reveal delay={100}><h2 className="display h-grad">Tarifas claras, orientadas al retorno</h2></Reveal>
          <Reveal delay={180} className="lead" as="p" style={{ margin: "0 auto" }}>Sin sorpresas ni cargos ocultos. Planes diseñados para adaptarse a la fase de crecimiento de tu negocio local.</Reveal>
        </div>

        <div className="pricing-grid">
          {/* Plan 1: Diagnóstico */}
          <TiltCard className="pcard" delay={0}>
            <div>
              <div className="pcard__header">
                <span className="pcard__num">PLAN 01</span>
                <h3 className="pcard__title">Diagnóstico</h3>
                <p className="pcard__desc">100% reembolsable si contratas tu web. Analizamos velocidad, SEO local en León y fugas de clientes.</p>
                <div className="pcard__price-row">
                  <span className="pcard__price">€299</span>
                  <span className="pcard__period">/ pago único</span>
                </div>
              </div>

              <ul className="pcard__features">
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Análisis de velocidad y experiencia móvil</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Estudio de competencia en León</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Auditoría de SEO Local y Maps</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span style={{ color: "#92BBFF", fontWeight: "600" }}>Garantía de reembolso total</span>
                </li>
              </ul>
            </div>
            <Btn href="#contact" className="w-full">Reservar Auditoría</Btn>
          </TiltCard>

          {/* Plan 2: Crecimiento */}
          <TiltCard className="pcard pcard--recommended" delay={100} style={{ borderColor: "rgba(146, 187, 255, 0.3)" }}>
            <div className="pcard__badge">MÁS RECOMENDADO</div>
            <div>
              <div className="pcard__header">
                <span className="pcard__num" style={{ color: "#C5EBFF" }}>PLAN 02</span>
                <h3 className="pcard__title">Crecimiento</h3>
                <p className="pcard__desc">Tu web premium de alto rendimiento con SEO continuo. Ideal para dominar León sin gran desembolso inicial.</p>
                <div className="pcard__price-row">
                  <span className="pcard__price">€349</span>
                  <span className="pcard__period">/ mes</span>
                </div>
                <span className="pcard__period-sub">(+€999 cuota de alta)</span>
              </div>

              <ul className="pcard__features">
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Sitio web premium completo y optimizado</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Hosting ultra-veloz y soporte técnico 24/7</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>2 horas/mes de SEO Local y mantenimiento</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Actualizaciones ilimitadas de contenidos</span>
                </li>
              </ul>
            </div>
            <Btn glossy href="#contact" className="w-full">Suscribirse al Plan</Btn>
          </TiltCard>

          {/* Plan 3: Premium */}
          <TiltCard className="pcard" delay={200}>
            <div>
              <div className="pcard__header">
                <span className="pcard__num">PLAN 03</span>
                <h3 className="pcard__title">Premium</h3>
                <p className="pcard__desc">Propiedad absoluta del código desde el primer día con integraciones avanzadas y SEO de élite.</p>
                <div className="pcard__price-row">
                  <span className="pcard__period" style={{ marginLeft: 0, marginRight: 8, fontSize: 16 }}>desde</span>
                  <span className="pcard__price">€2.999</span>
                </div>
              </div>

              <ul className="pcard__features">
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Sitio web a medida y propiedad del código</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Copywriting persuasivo y estudio de marca</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Integración de reservas, citas o e-commerce</span>
                </li>
                <li className="pcard__feature">
                  <span className="ic ic--v">✓</span>
                  <span>Optimización SEO inicial exhaustiva</span>
                </li>
              </ul>
            </div>
            <Btn href="#contact" className="w-full">Adquirir Plan</Btn>
          </TiltCard>
        </div>
      </section>

      {/* FAQ */}
      <section className="section wrap" id="faq">
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>FAQ</span></Reveal>
          <Reveal delay={100}><h2 className="display">¿Tienes preguntas? Aquí están las respuestas</h2></Reveal>
        </div>
        <div className="faq">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 50} className={"q " + (open === i ? "open" : "")}>
              <button className="q__head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {f.q}<span className="q__ic">＋</span>
              </button>
              <div className="q__body" style={{ maxHeight: open === i ? 200 : 0 }}><p>{f.a}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section wrap" id="contact" style={{ textAlign: "center" }}>
        <div className="hero__glow" style={{ top: "0", opacity: .6 }} />
        <Reveal style={{ position: "relative" }}>
          <h2 className="display h-grad" style={{ fontSize: "clamp(32px,5vw,60px)", marginBottom: 20 }}>¿Tienes tiempo? ¿Tienes ideas? Vamos a construir.</h2>
          <Btn glossy href="#">Reserva una llamada GRATIS de 30 minutos</Btn>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap footer__grid">
          <div style={{ maxWidth: 280 }}>
            <div className="nav__brand" style={{ marginBottom: 12 }}><span className="nav__ava"><img src="/assets/avatar.png" alt="avatar" /></span> Iqtidar Tara</div>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Diseñador, copywriter y desarrollador. Ayudo a startups a lanzar productos impactantes.</p>
          </div>
          <div className="foot-cols">
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Menú</div>
              <a href="#work">Proyectos</a><a href="#services">Servicios</a><a href="#about">Sobre mí</a><a href="#precios">Precios</a><a href="#faq">FAQ</a>
            </div>
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Redes</div>
              <a href="#">Instagram</a><a href="#">X / Twitter</a><a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ color: "var(--muted)", fontSize: 13, marginTop: 40 }}>© {new Date().getFullYear()} Tu Nombre. Todos los derechos reservados.</div>
      </footer>
      <GlassFilter />
    </div>
  );
}

function GlassFilter() {
  return (
    <svg className="hidden" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Generate turbulent noise for distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />

          {/* Blur the turbulence pattern slightly */}
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />

          {/* Displace the source graphic with the noise */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />

          {/* Apply overall blur on the final result */}
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />

          {/* Output the result */}
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
