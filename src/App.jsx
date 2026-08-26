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
  position:fixed; inset:0; pointer-events:none; z-index:1;
  background-image:radial-gradient(circle, rgba(146,187,255,.035) 1.2px, transparent 1.2px);
  background-size:28px 28px;
}
.grid-overlay__spot{
  position:fixed; inset:0; pointer-events:none; z-index:1;
  background-image:radial-gradient(circle, rgba(146,187,255,.3) 1.4px, transparent 1.4px);
  background-size:28px 28px;
  -webkit-mask-image:radial-gradient(circle 260px at var(--gmx,50vw) var(--gmy,40vh), black 0%, transparent 72%);
  mask-image:radial-gradient(circle 260px at var(--gmx,50vw) var(--gmy,40vh), black 0%, transparent 72%);
}
.site-ambient{
  position:fixed; left:50%; top:0; transform:translateX(-50%);
  width:min(1400px,150vw); height:100vh;
  background:radial-gradient(ellipse 45% 35% at 50% 0%, rgba(0,90,255,.16), transparent 65%);
  filter:blur(90px); pointer-events:none; z-index:1; mix-blend-mode:screen;
}
@media(hover:none){ .grid-overlay__spot{ display:none; } }
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
  animation: textShimmer 8s linear infinite;
  filter: drop-shadow(0 4px 24px rgba(0,0,0,.55)); }
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
  box-shadow:0 0 10px #8EC1FF; animation:dotPulse 2.4s ease-in-out infinite; }
@keyframes dotPulse{
  0%,100%{ box-shadow:0 0 6px #8EC1FF; transform:scale(1); }
  50%{ box-shadow:0 0 16px #8EC1FF, 0 0 30px rgba(142,193,255,.4); transform:scale(1.2); }
}
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
.nav__ava img{ width:100%; height:100%; object-fit:cover; display:block;
  filter:grayscale(1); transition:filter .5s ease; }
@media(hover:hover){ .nav__ava:hover img{ filter:grayscale(0); } }
@media(hover:none){ .nav__ava img{ filter:grayscale(0); } }
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

/* ---- about section ---- */
.about-section{ position:relative; overflow:hidden; }
.about-section__bgwrap{
  position:absolute; inset:0; z-index:0; overflow:hidden; pointer-events:none;
  -webkit-mask-image:linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%);
  mask-image:linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%);
}
.about-section__glow{
  position:absolute; left:50%; top:-18%; transform:translateX(-50%);
  width:min(1600px,110vw); height:75%;
  background:
    radial-gradient(ellipse 55% 60% at 50% 25%, rgba(0,90,255,.5), transparent 65%),
    radial-gradient(ellipse 38% 42% at 50% 12%, rgba(146,187,255,.4), transparent 60%),
    radial-gradient(ellipse 26% 26% at 50% 4%, rgba(197,235,255,.3), transparent 55%);
  filter:blur(75px); pointer-events:none; z-index:0; mix-blend-mode:screen; opacity:.85;
}
.about-section__horizon{
  position:absolute; left:50%; bottom:-260px; transform:translateX(-50%);
  width:130vw; height:280px; border-radius:50%;
  border-top:1.5px solid rgba(146,187,255,.6);
  box-shadow:0 -22px 70px -12px rgba(66,123,216,.5), 0 -2px 14px rgba(197,235,255,.4);
  pointer-events:none; z-index:0;
}
.about-section .wrap{ position:relative; z-index:1; }
.about__inner{ display:grid; grid-template-columns:300px 1fr; gap:52px; align-items:start; text-align:left; }
.about__photo{ border-radius:22px; overflow:hidden; aspect-ratio:3/4.6; position:relative; margin-top:6px;
  border:1px solid rgba(146,187,255,.22);
  box-shadow:0 24px 70px -24px rgba(66,123,216,.4), inset 0 1px 0 rgba(255,255,255,.1);
  filter:saturate(.94) contrast(1.03); transition:box-shadow .5s ease, filter .5s ease, border-color .5s ease; }
.about__photo:hover{ filter:saturate(1.15) contrast(1.05);
  border-color:rgba(146,187,255,.55);
  box-shadow:0 0 0 3px rgba(146,187,255,.2), 0 34px 90px -20px rgba(66,123,216,.6), inset 0 1px 0 rgba(255,255,255,.14); }
.about__photo::after{ content:''; position:absolute; inset:0; z-index:2; pointer-events:none; border-radius:inherit;
  background:linear-gradient(135deg, rgba(146,187,255,.16) 0%, transparent 35%, transparent 65%, rgba(66,123,216,.14) 100%);
  opacity:0; transition:opacity .5s ease; }
.about__photo:hover::after{ opacity:1; }
.about__photo img{ width:100%; height:100%; object-fit:cover; object-position:top center;
  transition:transform .6s cubic-bezier(.16,1,.3,1); }
.about__photo:hover img{ transform:scale(1.05); }
.about__content{ text-align:left; display:flex; flex-direction:column; height:100%; }
.about__content .shead{ margin-bottom:0; text-align:left; max-width:none; }
.about__content .shead h2{ margin-bottom:0; font-size:clamp(22px,2.8vw,32px); line-height:1.15; }
.about__content .lead{ text-align:left; max-width:100%; font-size:15.5px; margin-bottom:20px !important; }
/* ---- about cards ---- */
.about__cards{ display:flex; flex-direction:column; gap:10px; max-width:100%; margin:0; text-align:left; flex:1; }
.about__card{ display:flex; align-items:flex-start; gap:14px; padding:14px 18px;
  background:rgba(255,255,255,.03);
  border:1px solid rgba(146,187,255,.13); border-left:3px solid rgba(146,187,255,.5);
  border-radius:14px; transition:border-color .3s,background .3s,box-shadow .3s; }
.about__card:hover{ background:rgba(146,187,255,.06); border-color:rgba(146,187,255,.32);
  box-shadow:0 8px 24px -14px rgba(66,123,216,.4); }
.about__card-icon{ width:34px; height:34px; border-radius:10px; flex-shrink:0; margin-top:1px;
  background:rgba(66,123,216,.14); border:1px solid rgba(146,187,255,.25);
  display:flex; align-items:center; justify-content:center; color:#92BBFF; }
.about__card-icon svg{ width:16px; height:16px; }
.about__card-body{ display:flex; flex-direction:column; min-width:0; gap:3px; }
.about__card-txt{ color:#dbe4ff; font-size:14.5px; line-height:1.4; text-align:left; font-weight:600; }
.about__card-detail{ color:var(--muted); font-size:13px; line-height:1.5; text-align:left; }

/* ---- pilar card tap hint (solo móvil) ---- */
.hq__tap-hint{ display:none; font-size:10px; color:rgba(146,187,255,.5); margin-top:4px; }
.hq__q--open .hq__p{ display:block !important; }

/* ---- precios ---- */
.pricing{ display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:48px; }
.pricing--4{ grid-template-columns:repeat(4,1fr); }
.price-card{ background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:28px 24px; display:flex; flex-direction:column; gap:0; position:relative; cursor:pointer; transition:border-color .3s, background .3s, box-shadow .3s; }
.price-card:hover{ border-color:rgba(146,187,255,.3); background:rgba(255,255,255,.06); }
.price-card--pro{ border-color:rgba(146,187,255,.45); background:rgba(66,123,216,.08);
  box-shadow:0 0 0 1px rgba(146,187,255,.15), 0 20px 60px -20px rgba(66,123,216,.45); }
.price-more{ font-size:11.5px; color:#92BBFF; margin-top:8px; font-weight:600; }
.ads-card{ display:flex; align-items:center; gap:24px; margin-top:24px; padding:28px 32px;
  background:rgba(255,255,255,.03); border:1px solid rgba(146,187,255,.18); border-radius:20px; }
.ads-card__icon{ width:52px; height:52px; border-radius:14px; flex-shrink:0;
  background:rgba(66,123,216,.14); border:1px solid rgba(146,187,255,.25);
  display:flex; align-items:center; justify-content:center; color:#92BBFF; }
.ads-card__icon svg{ width:24px; height:24px; }
.ads-card__body{ flex:1; }
.ads-card__body h3{ font-family:var(--display); font-size:18px; color:#fff; margin-bottom:6px; }
.ads-card__body p{ font-size:13.5px; color:var(--muted); line-height:1.5; margin-bottom:10px; max-width:560px; }
.ads-card__feats{ display:flex; flex-wrap:wrap; gap:8px 16px; }
.ads-card__feats span{ font-size:12px; color:#92BBFF; }

/* ---- servicios (resumen) ---- */
.svc-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-top:44px; }
.svc-card{ background:rgba(255,255,255,.03); border:1px solid rgba(146,187,255,.15); border-radius:18px;
  padding:26px 22px; transition:border-color .3s,background .3s,box-shadow .3s,transform .3s; }
.svc-card:hover{ border-color:rgba(146,187,255,.35); background:rgba(146,187,255,.06);
  box-shadow:0 14px 40px -18px rgba(66,123,216,.4); transform:translateY(-3px); }
.svc-card__icon{ width:44px; height:44px; border-radius:12px; margin-bottom:16px;
  background:rgba(66,123,216,.14); border:1px solid rgba(146,187,255,.25);
  display:flex; align-items:center; justify-content:center; color:#92BBFF; }
.svc-card__icon svg{ width:21px; height:21px; }
.svc-card h4{ font-family:var(--display); font-size:16px; color:#fff; margin-bottom:8px; }
.svc-card p{ font-size:13.5px; color:var(--muted); line-height:1.5; }

/* ---- calculadora ---- */
.calc-card{ margin-top:40px; display:grid; grid-template-columns:1fr 300px; gap:0;
  background:rgba(255,255,255,.03); border:1px solid rgba(146,187,255,.18); border-radius:24px;
  overflow:hidden; box-shadow:0 0 60px -25px rgba(66,123,216,.3); }
.calc-chips{ display:flex; flex-direction:column; gap:12px; padding:36px; }
.calc-chip{ display:flex; align-items:center; gap:14px; text-align:left; width:100%;
  padding:16px 20px; border-radius:14px; background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.1); color:#dbe4ff; font-size:14.5px; font-family:var(--body);
  cursor:pointer; transition:border-color .25s, background .25s; }
.calc-chip:hover{ border-color:rgba(146,187,255,.3); }
.calc-chip--on{ background:rgba(66,123,216,.14); border-color:rgba(146,187,255,.5); color:#fff; }
.calc-chip__check{ width:24px; height:24px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
  background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.15); font-size:13px; color:var(--muted); transition:.25s; }
.calc-chip--on .calc-chip__check{ background:linear-gradient(135deg,#427BD8,#92BBFF); border-color:transparent; color:#05071A; font-weight:700; }
.calc-result{ background:rgba(66,123,216,.08); border-left:1px solid rgba(146,187,255,.15);
  padding:36px 28px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
.calc-result__label{ font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; }
.calc-result__num{ font-family:var(--display); font-size:20px; color:#fff; }
.calc-result__num b{ font-size:44px; display:block; line-height:1.1; }
.calc-result__num span{ font-size:22px; color:#92BBFF; }
.calc-result__sub{ font-size:12px; color:var(--muted); margin:8px 0 20px; }
.calc-result .price-cta{ margin-top:0; width:100%; }
.price-badge{ position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:linear-gradient(90deg,#427BD8,#92BBFF); color:#fff; font-size:11px; font-weight:700; padding:4px 14px; border-radius:999px; white-space:nowrap; }
.price-label{ font-size:13px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px; }
.price-launch{ display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700;
  letter-spacing:.06em; text-transform:uppercase; padding:3px 10px; border-radius:100px;
  background:rgba(255,180,0,.12); border:1px solid rgba(255,180,0,.35); color:#FFCB6B; margin-bottom:6px; }
.price-old{ font-size:15px; color:var(--muted); text-decoration:line-through; margin-bottom:4px; }
.contact-card{ position:relative; overflow:hidden; border-radius:28px; padding:64px 48px;
  background:rgba(255,255,255,.03); border:1px solid rgba(146,187,255,.2);
  box-shadow:0 0 80px -30px rgba(66,123,216,.3), inset 0 1px 0 rgba(255,255,255,.08); }
@media(max-width:640px){ .contact-card{ padding:36px 20px; border-radius:20px; } }
.price-num{ font-family:var(--display); font-size:36px; font-weight:700; color:#fff; line-height:1; margin-bottom:6px; }
.price-num b{ font-size:44px; }
.price-num span{ font-size:22px; color:#92BBFF; }
.price-num b:before{ content:''; }
.price-sub{ font-size:12px; color:var(--muted); margin-bottom:16px; }
.price-divider{ height:1px; background:rgba(255,255,255,.08); margin-bottom:16px; }
.price-feat{ display:flex; align-items:flex-start; gap:8px; font-size:13px; color:var(--muted); padding:5px 0; line-height:1.4; }
.price-feat .ic{ width:18px; height:18px; font-size:11px; margin-top:1px; }
.price-cta{ display:block; margin-top:20px; padding:13px; border-radius:12px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:#fff; font-size:14px; font-weight:600; text-align:center; text-decoration:none; transition:background .2s; }
.price-cta:hover{ background:rgba(255,255,255,.12); }
.price-cta--pro{ background:linear-gradient(135deg,rgba(66,123,216,.7),rgba(40,90,180,.6)); border-color:rgba(146,187,255,.4); }
.price-cta--pro:hover{ background:linear-gradient(135deg,rgba(66,123,216,.9),rgba(40,90,180,.8)); }

/* strip dentro del hero (solo móvil) */
.hero__strip{ display:none; }
.hero__shot{ width:210px; height:148px; border-radius:12px; flex:none; overflow:hidden; border:1px solid rgba(255,255,255,.1); background:linear-gradient(135deg,#1b2650,#1c3060); display:flex; align-items:flex-end; padding:10px; position:relative; box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 24px 48px -20px rgba(0,0,0,.7); }
.hero__shot:nth-child(odd){ background:linear-gradient(135deg,#1a1b4b,#2d1f6e); }
.hero__shot:nth-child(even){ background:linear-gradient(135deg,#0d2b45,#1a4a7c); }
.hero__shot b{ font-size:10px; color:#fff; font-weight:600; line-height:1.2; position:relative; z-index:1; }
.hero__shot img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }

/* social proof row */
.hero__trust{ display:flex; align-items:center; justify-content:center; gap:10px; margin-top:18px; }
.hero__avatars{ display:flex; }
.hero__av{ width:28px; height:28px; border-radius:50%; border:2px solid var(--bg); background:linear-gradient(135deg,#1b2650,#427BD8); font-size:10px; font-weight:700; color:#92BBFF; display:flex; align-items:center; justify-content:center; margin-left:-8px; }
.hero__avatars .hero__av:first-child{ margin-left:0; }
.hero__trust-txt{ font-size:13px; color:var(--muted); }
.hero__trust-txt b{ color:#C5EBFF; }

/* stats bar */
.hero__stats{ display:flex; align-items:stretch; justify-content:center; gap:0; margin-top:48px; padding:28px 32px;
  border:1px solid rgba(146,187,255,.15); border-radius:22px;
  background:rgba(255,255,255,.03); backdrop-filter:blur(10px);
  max-width:600px; margin-left:auto; margin-right:auto;
  box-shadow:0 20px 60px -30px rgba(66,123,216,.35); }
.hero__stat{ flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px; padding:0 8px; transition:transform .3s ease; }
.hero__stat:hover{ transform:translateY(-3px); }
.hero__stat-icon{ width:38px; height:38px; border-radius:12px; display:flex; align-items:center; justify-content:center;
  background:rgba(66,123,216,.14); border:1px solid rgba(146,187,255,.28); color:#92BBFF; flex-shrink:0; }
.hero__stat-icon svg{ width:18px; height:18px; }
.hero__stat-n{ display:block; font-family:var(--display); font-size:30px; font-weight:700; letter-spacing:-.03em; line-height:1;
  background:linear-gradient(135deg,#fff 30%,#92BBFF); -webkit-background-clip:text; background-clip:text; color:transparent; }
.hero__stat-l{ display:block; font-size:12px; color:var(--muted); line-height:1.35; }
.hero__stat-div{ width:1px; align-self:center; height:52px; background:rgba(146,187,255,.15); flex-shrink:0; }

/* Fondo fotográfico del hero */
.hero__bg-image {
  position: absolute;
  top: -40px; left: 50%;
  transform: translateX(-50%);
  width: min(1700px, 150vw);
  height: min(950px, 78vh);
  background-image: url('/assets/hero-bg-blue.png');
  background-size: cover;
  background-position: center top;
  pointer-events: none;
  z-index: 0;
  opacity: .85;
  -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
}

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
  background:linear-gradient(135deg,#1b2650,#1c3060);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14), 0 24px 48px -20px rgba(0,0,0,.7);
  transition:transform .5s cubic-bezier(.16,1,.3,1), border-color .5s, box-shadow .5s;
}
.shot:nth-child(1),.shot:nth-child(11){ background:linear-gradient(135deg,#1a1b4b,#2d1f6e); }
.shot:nth-child(2),.shot:nth-child(12){ background:linear-gradient(135deg,#0d2b45,#1a4a7c); }
.shot:nth-child(3),.shot:nth-child(13){ background:linear-gradient(135deg,#1a2e1a,#1f5c3f); }
.shot:nth-child(4),.shot:nth-child(14){ background:linear-gradient(135deg,#3a1a2a,#6b2040); }
.shot:nth-child(5),.shot:nth-child(15){ background:linear-gradient(135deg,#1a1520,#3d2060); }
.shot:nth-child(6),.shot:nth-child(16){ background:linear-gradient(135deg,#2a1a10,#6b3a18); }
.shot:nth-child(7),.shot:nth-child(17){ background:linear-gradient(135deg,#0d2020,#1a4a4a); }
.shot:nth-child(8),.shot:nth-child(18){ background:linear-gradient(135deg,#1f2010,#4a5020); }
.shot:nth-child(9),.shot:nth-child(19){ background:linear-gradient(135deg,#20100d,#60281a); }
.shot:nth-child(10),.shot:nth-child(20){ background:linear-gradient(135deg,#1a0d20,#40186b); }
.shot__img{
  position:absolute; inset:0; z-index:1;
  width:100%; height:100%; object-fit:cover; object-position:center top;
  display:block; transition:transform .6s cubic-bezier(.16,1,.3,1);
}
.shot:hover .shot__img{ transform:scale(1.05); }
.shot:hover{ transform:translateY(-4px); border-color:rgba(146,187,255,.4);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 26px 50px -22px rgba(40,80,170,.5); }
/* mockup grid pattern */
.shot::after{ content:''; position:absolute; inset:0; z-index:2;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size:24px 24px;
  pointer-events:none;
}
/* top-glow radial */
.shot::before{ content:''; position:absolute; inset:0; z-index:3;
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
.col--no{ background:linear-gradient(180deg, #15101f 0%, #1a0e1a 100%); }
.col--no::after{ content:''; position:absolute; bottom:-2px; left:10%; right:10%; height:6px; z-index:3;
  background:linear-gradient(90deg, transparent, #ff3c8e 30%, #ff6eb4 50%, #ff3c8e 70%, transparent);
  border-radius:0 0 20px 20px;
  filter:blur(6px);
  opacity:0.7; transition:opacity .5s, filter .5s; }
.col--no:hover::after{ opacity:1; filter:blur(8px); }
/* extra magenta ambient behind the bar */
.col--no .glow-accent{ position:absolute; bottom:-20px; left:20%; right:20%; height:40px; z-index:0;
  background:radial-gradient(ellipse at 50% 100%, rgba(255,60,142,.35), transparent 70%);
  filter:blur(20px); pointer-events:none; }

/* ---- "Conmigo" column: cyan/ice-blue accent glow bar at bottom + left side vertical bar ---- */
.col--yes{ background:var(--cardBlue); }
.col--yes::after{ content:''; position:absolute; bottom:-2px; left:10%; right:10%; height:6px; z-index:3;
  background:linear-gradient(90deg, transparent, #00d4ff 30%, #7eedff 50%, #00d4ff 70%, transparent);
  border-radius:0 0 20px 20px;
  filter:blur(6px);
  opacity:0.7; transition:opacity .5s, filter .5s; }
.col--yes:hover::after{ opacity:1; filter:blur(8px); }
/* vertical blue glow bar on the left side */
.col--yes .glow-side{ position:absolute; top:10%; bottom:10%; left:-2px; width:5px; z-index:3;
  background:linear-gradient(180deg, transparent, #427BD8 25%, #92BBFF 50%, #427BD8 75%, transparent);
  border-radius:20px 0 0 20px;
  filter:blur(4px);
  opacity:0.8; transition:opacity .5s; }
.col--yes:hover .glow-side{ opacity:1; }
/* ambient glow behind the left bar */
.col--yes .glow-ambient{ position:absolute; top:15%; bottom:15%; left:-15px; width:50px; z-index:0;
  background:radial-gradient(ellipse at 0% 50%, rgba(66,123,216,.4), transparent 70%);
  filter:blur(15px); pointer-events:none; }

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
  max-width: 560px;
  margin: 36px auto 0;
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
  padding: 22px 18px;
  gap: 8px;
  position: relative;
}
.hq__q.tl { justify-content: flex-end; align-items: flex-end; text-align: right; padding-right: 32px; padding-bottom: 32px; }
.hq__q.tr { justify-content: flex-end; align-items: flex-start; text-align: left;  padding-left: 32px;  padding-bottom: 32px; }
.hq__q.bl { justify-content: flex-start; align-items: flex-end; text-align: right; padding-right: 32px; padding-top: 32px; }
.hq__q.br { justify-content: flex-start; align-items: flex-start; text-align: left;  padding-left: 32px;  padding-top: 32px; }

.hq__icon {
  width: 32px;
  height: 32px;
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
.hq__ava img { width: 100%; height: 100%; object-fit: cover;
  filter:grayscale(1); transition:filter .6s ease; }
@media(hover:hover){ .hq__ava:hover img{ filter:grayscale(0); } }
@media(hover:none){ .hq__ava img{ filter:grayscale(0); } }

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
.case__cat{ position:absolute; top:12px; left:12px; z-index:6; font-size:11px; font-weight:600;
  padding:4px 10px; border-radius:100px; background:rgba(8,11,34,.7); backdrop-filter:blur(6px);
  border:1px solid rgba(146,187,255,.3); color:#92BBFF; }

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
.ava{ width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,#427BD8,#C5EBFF); flex:none; overflow:hidden;
  border:2px solid rgba(146,187,255,.45); box-shadow:0 0 12px rgba(66,123,216,.35); }
.ava img{ width:100%; height:100%; object-fit:cover; display:block; }

/* ---- faq ---- */
.faq{ max-width:780px; margin:32px auto 0; }
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
/* ---- section divider ---- */
.section-divider{ height:1px; background:linear-gradient(90deg,transparent,rgba(146,187,255,.25) 30%,rgba(146,187,255,.5) 50%,rgba(146,187,255,.25) 70%,transparent); margin:0 auto; max-width:800px; }

.footer{ border-top:none; padding:60px 0 40px; margin-top:0;
  background:linear-gradient(to bottom,rgba(8,11,34,0) 0%,rgba(4,5,18,.8) 100%); position:relative; }
.footer::before{ content:''; display:block; height:1px;
  background:linear-gradient(90deg,transparent,rgba(146,187,255,.3) 30%,rgba(146,187,255,.6) 50%,rgba(146,187,255,.3) 70%,transparent);
  margin-bottom:60px; }
.footer__grid{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:30px; align-items:flex-start; }
.footer a{ color:var(--muted); text-decoration:none; display:block; padding:5px 0; transition:color .2s; }
.footer a:hover{ color:#fff; }
.foot-cols{ display:flex; gap:60px; flex-wrap:wrap; }

/* ---- hamburger + mobile menu + sticky CTA (base) ---- */
.nav__burger{
  display:none; flex-direction:column; gap:5px; cursor:pointer;
  padding:8px; background:none; border:none; z-index:60;
}
.nav__burger span{ display:block; width:22px; height:2px; background:#fff; border-radius:2px; }
.nav__mobile-menu{
  display:none; flex-direction:column; align-items:center; justify-content:center;
  position:fixed; inset:0; background:rgba(5,7,26,.97); z-index:55;
  padding-top:80px; gap:0;
}
.nav__mobile-menu a{
  color:#e7ecfb; font-size:22px; font-family:'Outfit',sans-serif;
  font-weight:600; text-decoration:none; padding:14px 40px; text-align:center; width:100%;
}
.nav__mobile-close{
  position:absolute; top:18px; right:18px; background:none; border:none;
  color:#fff; font-size:26px; cursor:pointer; padding:8px; z-index:56;
}
/* ---- dock de acciones (solo móvil) ---- */
.dock{ display:none; }
.dock__btn{ animation:none; }
.mobile-cta-bar{
  display:none; position:fixed; bottom:0; left:0; right:0; z-index:40;
  padding:10px 14px calc(10px + env(safe-area-inset-bottom));
  background:linear-gradient(transparent, rgba(5,7,26,1) 40%);
}
.mobile-cta-bar .btn{
  width:100%; justify-content:center; border-radius:14px;
  padding:16px; font-size:16px; font-weight:600;
  animation:ctaPulse 3s ease-in-out infinite;
}
@keyframes ctaPulse{
  0%,100%{ box-shadow:0 0 0 0 rgba(146,187,255,0); }
  50%{ box-shadow:0 0 0 8px rgba(146,187,255,.15); }
}

/* responsive — tablet */
@media(max-width:900px){
  .cols,.bento,.help{ grid-template-columns:1fr; }
  .col-3,.col-2,.col-6{ grid-column:span 1; }
  .nav__links{ display:none; }
  .cases{ grid-template-columns:1fr 1fr; gap:14px; }
  .pricing--4{ grid-template-columns:1fr 1fr; }
  .ads-card{ flex-direction:column; align-items:flex-start; text-align:left; }
  .ads-card .price-cta{ width:100%; }
  .svc-grid{ grid-template-columns:1fr 1fr; }
  .about__inner{ grid-template-columns:230px 1fr; gap:32px; }
  .about-section__bg{ background-position:center 20%; }
}

/* ============================================================
   MÓVIL — rediseño completo ≤ 640px
   ============================================================ */
@media(max-width:640px){

  /* --- OCULTAR / MOSTRAR EN MÓVIL --- */
  .hide-m{ display:none !important; }
  .show-m{ display:block !important; }
  /* strip dentro hero: rompe el wrap con margen negativo */
  .hero__strip{ margin:14px -16px 0; overflow:hidden; }
  .hero__strip .marquee{ padding:4px 0; }
  .scard p{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; font-size:12px; }
  .hq__p{ display:none !important; }
  .testi-row2{ display:none !important; }

  /* --- LAYOUT BASE --- */
  .wrap{ padding-inline:16px !important; }
  .section{ padding-block:40px !important; }
  body{ padding-bottom:76px; }

  /* --- NAV --- */
  .nav__inner{ padding:12px 16px; }
  .nav__cta{ display:none; }
  .nav__burger{ display:flex; }
  .nav__brand{ font-size:15px; }

  /* --- HERO: el más importante, limpio y directo --- */
  .hero{
    padding:72px 16px 0px !important;
    text-align:center;
  }
  .hero h1{
    font-size:clamp(28px,9vw,42px);
    margin:12px auto 14px;
    max-width:100%;
    line-height:1.1;
  }
  .lead{
    font-size:15px !important;
    line-height:1.55;
    max-width:100%;
    margin-bottom:20px !important;
  }
  .eyebrow{
    font-size:12px; padding:6px 12px;
    max-width:calc(100vw - 32px);
  }
  /* Botones hero: ancho completo */
  .hero .btn{
    width:100%; justify-content:center;
    padding:15px 20px; font-size:15px; border-radius:14px;
  }
  /* trust row en móvil */
  .hero__trust{ margin-top:14px; gap:8px; }
  .hero__av{ width:24px; height:24px; font-size:9px; }
  .hero__trust-txt{ font-size:12px; }
  /* stats bar en móvil */
  .hero__stats{ margin-top:20px; padding:18px 10px; border-radius:16px; gap:0; }
  .hero__stat{ gap:6px; }
  .hero__stat-icon{ width:30px; height:30px; border-radius:9px; }
  .hero__stat-icon svg{ width:14px; height:14px; }
  .hero__stat-n{ font-size:22px; }
  .hero__stat-l{ font-size:10.5px; }
  .hero__stat-div{ height:44px; }
  /* ocultar strip standalone en móvil (ya está arriba en el hero) */
  .strip-section{ display:none !important; }

  /* --- PROYECTO STRIP: compacto, no ocupa toda la pantalla --- */
  .shot{ width:210px; height:148px; border-radius:12px; }
  /* Ocultar marcas en móvil (poco valor, mucho espacio) */
  .brands{ display:none; }

  /* --- COMPARACIÓN: 2 col side-by-side, texto compacto --- */
  .cols{ grid-template-columns:1fr 1fr !important; gap:12px !important; }
  .shead h2{ font-size:clamp(18px,5.5vw,26px); line-height:1.15; }
  .shead .lead{ font-size:13px !important; }
  .col{ padding:14px; border-radius:14px; text-align:left; }
  .col h3{ font-size:14px; margin-bottom:10px; text-align:center; }
  .row{ font-size:11.5px; padding:6px 0; gap:5px; align-items:flex-start; line-height:1.35; }
  .ic{ width:15px; height:15px; font-size:10px; flex-shrink:0; margin-top:1px; }

  /* --- SERVICIOS BENTO: 2 col, sin ilustraciones --- */
  .bento{ grid-template-columns:1fr 1fr !important; gap:12px !important; }
  .col-3,.col-2,.col-6{ grid-column:span 1 !important; }
  .scard{ min-height:120px !important; padding:16px; justify-content:flex-end; }
  .scard h4{ font-size:14px; margin-bottom:4px; }
  .scard p{ font-size:12px; line-height:1.4; }
  /* Ocultar ilustraciones decorativas (sólo son para desktop) */
  .webfan,.phones,.editor,.ntable,.brandviz,.motionviz{ display:none !important; }

  /* --- CÓMO AYUDO --- */
  .hq__wrap{ margin-top:20px; overflow:hidden; padding:0; aspect-ratio:auto; }
  .hq__lines{ display:none; }
  .hq__hub{ position:relative; top:auto; left:auto; transform:none; margin:0 auto 24px; }
  .hq__ring{ display:none; }
  .hq__ray{ display:none; }
  .hq__bg-glow{ display:none; }
  .hq__grid{
    grid-template-columns:1fr 1fr;
    grid-template-rows:auto auto;
    gap:12px;
    padding:0;
    height:auto;
  }
  .hq__q{
    background:rgba(255,255,255,.04);
    border:1px solid rgba(146,187,255,.15);
    border-radius:14px; padding:16px 14px;
    gap:8px; align-items:flex-start; text-align:left;
  }
  .hq__q.tl,.hq__q.tr,.hq__q.bl,.hq__q.br{
    padding:16px 14px; align-items:flex-start; text-align:left;
  }
  .hq__h{ font-size:13px; line-height:1.3; }
  .hq__p{ font-size:12px; line-height:1.45; max-width:100%; }
  .hq__icon{ width:32px; height:32px; }

  /* --- CASOS --- */
  .cases{
    grid-template-columns:1fr 1fr !important;
    gap:12px !important; margin-top:28px;
  }
  .case__meta{ padding:12px; }
  .case__meta b{ font-size:13px; }
  .case__view{ display:none; }
  .case__cat{ font-size:10px; padding:3px 8px; top:8px; left:8px; }

  /* --- TESTIMONIOS --- */
  .tcard{ width:250px; padding:14px; }
  .tcard p{ font-size:13px; line-height:1.5; }
  .tcard .stars{ font-size:12px; margin-bottom:10px; }

  /* --- FAQ --- */
  .faq{ margin-top:28px; gap:10px; display:flex; flex-direction:column; }
  .q{ margin-bottom:0; }
  .q__head{ font-size:14px; padding:16px; line-height:1.4; }
  .q__body p{ font-size:13px; padding:0 16px 16px; }

  /* --- ABOUT --- */
  .about__inner{ grid-template-columns:1fr; gap:24px; }
  .about__content .shead{ text-align:center; align-items:center; }
  .about__cards{ max-width:100%; margin:16px 0 0; }
  .about__card{ padding:16px 18px; gap:14px; border-radius:14px; }
  .about__card-icon{ width:38px; height:38px; }
  .about__card-txt{ font-size:14px; }
  .about-section__bg{ background-position:center 12%; background-size:cover; }
  /* --- PILARES: tap hint visible en móvil --- */
  .hq__tap-hint{ display:block; }
  /* --- PRECIOS: una columna en móvil --- */
  .pricing{ grid-template-columns:1fr; gap:16px; margin-top:28px; }
  .pricing--4{ grid-template-columns:1fr; }
  .price-num{ font-size:28px; }
  .price-num b{ font-size:36px; }
  .price-card{ padding:22px 18px; }
  .ads-card{ padding:20px; gap:16px; margin-top:16px; }
  .ads-card__icon{ width:42px; height:42px; }
  .ads-card__icon svg{ width:20px; height:20px; }
  .ads-card__body h3{ font-size:16px; }

  /* --- SERVICIOS --- */
  .svc-grid{ grid-template-columns:1fr 1fr; gap:12px; margin-top:24px; }
  .svc-card{ padding:18px 16px; }
  .svc-card__icon{ width:36px; height:36px; margin-bottom:12px; }
  .svc-card__icon svg{ width:17px; height:17px; }
  .svc-card h4{ font-size:14px; }
  .svc-card p{ font-size:12.5px; }

  /* --- CALCULADORA --- */
  .calc-card{ grid-template-columns:1fr; margin-top:24px; border-radius:18px; }
  .calc-chips{ padding:20px; gap:10px; }
  .calc-chip{ padding:14px 16px; font-size:13.5px; }
  .calc-result{ border-left:none; border-top:1px solid rgba(146,187,255,.15); padding:24px 20px; }
  .calc-result__num b{ font-size:36px; }

  /* --- FOOTER --- */
  .footer{ padding:32px 0 20px; margin-top:20px; }
  .footer__grid{ flex-direction:column; gap:20px; }
  .foot-cols{ gap:20px; }
  .footer a{ font-size:14px; }

  /* --- NAV: no fija en móvil, se va con el scroll para no robar espacio --- */
  .nav{ position:absolute; }

  /* --- DOCK: barra de acciones fija abajo, siempre visible --- */
  .dock{
    display:grid; grid-template-columns:repeat(4,1fr);
    position:fixed; bottom:0; left:0; right:0; z-index:45;
    background:rgba(8,11,26,.9); backdrop-filter:blur(16px);
    border-top:1px solid rgba(146,187,255,.15);
    padding:8px 4px calc(8px + env(safe-area-inset-bottom));
  }
  .dock__btn{
    display:flex; flex-direction:column; align-items:center; gap:3px;
    padding:6px 2px; color:var(--muted); text-decoration:none;
    font-size:10.5px; font-weight:600; text-align:center;
    background:none; border:none; cursor:pointer; font-family:var(--body);
  }
  .dock__btn svg{ width:20px; height:20px; }
  .dock__btn--main{ color:#92BBFF; }
  .dock__btn--main svg{ color:#92BBFF; }
  body{ padding-bottom:64px; }

}

/* Pantallas muy pequeñas (<340px) */
@media(max-width:340px){
  .hero h1{ font-size:24px; }
  .hq__grid{ grid-template-columns:1fr; }
}
`;

/* ---------- helpers ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    // entrada directa por enlace con #ancla: la posición de scroll es imprevisible,
    // mejor mostrar ya sin animación que arriesgar contenido invisible
    if (window.location.hash) {
      el.classList.add("in");
      return;
    }
    // si al montar ya está a la vista, revelarlo ya
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } }),
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
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
    const isMobile = window.innerWidth < 640;
    const starCount = isReduced ? 30 : isMobile ? 50 : 260;
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      // capas de profundidad: lejos (pequeñas, tenues, lentas) -> cerca (grandes, brillantes, con glow)
      const depth = Math.random();
      const layer = depth < 0.45 ? 0 : depth < 0.78 ? 1 : 2;
      const sizeByLayer = [1, 2, 3.6];
      const alphaByLayer = [0.35, 0.6, 0.95];
      const speedByLayer = [0.01, 0.025, 0.05];
      const glowByLayer = [2, 6, 16];
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: 0,
        baseY: 0,
        layer,
        size: sizeByLayer[layer] * (0.7 + Math.random() * 0.6),
        alpha: alphaByLayer[layer] * (0.7 + Math.random() * 0.5),
        speed: speedByLayer[layer] * (0.6 + Math.random() * 0.8),
        glow: glowByLayer[layer],
        angle: Math.random() * Math.PI * 2,
        color: Math.random() > 0.3 ? "#8EC1FF" : "#ffffff",
      });
      stars[i].baseX = stars[i].x;
      stars[i].baseY = stars[i].y;
    }

    const draw = () => {
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
          const maxDist = 100 + s.layer * 40;
          const layerPush = 8 + s.layer * 12;

          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            const rx = (dx / dist) * force * layerPush;
            const ry = (dy / dist) * force * layerPush;
            s.x += (-rx - s.x + s.baseX) * 0.1;
            s.y += (-ry - s.y + s.baseY) * 0.1;
          } else {
            s.x += (s.baseX - s.x) * 0.08;
            s.y += (s.baseY - s.y) * 0.08;
          }

          s.alpha += (Math.random() - 0.5) * 0.04;
          if (s.alpha < 0.15) s.alpha = 0.15;
          if (s.alpha > 1) s.alpha = 1;
        } else {
          s.x = s.baseX;
          s.y = s.baseY;
        }

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        // shadowBlur es muy costoso en móviles reales — solo en escritorio
        if (!isMobile && s.glow > 0) {
          ctx.shadowBlur = s.glow;
          ctx.shadowColor = s.color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!isReduced) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
        opacity: 1,
      }}
    />
  );
}

function Reveal({ children, delay = 0, className = "", as: Tag = "div", ...rest }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
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
    
    const maxTilt = 8;
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
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px)`,
        transition: "transform 0.1s ease-out, border-color 0.4s, box-shadow 0.4s",
      }
    : {
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)",
        transition: "transform 0.45s ease-out, border-color 0.4s, box-shadow 0.4s",
      };

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transitionDelay: `${delay}ms`,
        ...style,
        ...tiltStyle,
        position: "relative",
        "--mx": `${coords.x}%`,
        "--my": `${coords.y}%`,
        "--hovered": isHovered ? 1 : 0,
      }}
      {...rest}
    >
      <span className="card__sweep" />
      {children}
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
function AboutCard({ svg, t, d, delay }) {
  return (
    <Reveal delay={delay} className="about__card">
      <span className="about__card-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{svg}</svg>
      </span>
      <span className="about__card-body">
        <span className="about__card-txt">{t}</span>
        <span className="about__card-detail">{d}</span>
      </span>
    </Reveal>
  );
}

function PilarCard({ pos, h, p, svg }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hq__q ${pos} ${open ? "hq__q--open" : ""}`} onClick={() => setOpen(o => !o)}>
      <div className="hq__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'#92BBFF'}}>{svg}</svg>
      </div>
      <div className="hq__h">{h}</div>
      <div className="hq__p">{p}</div>
      <div className="hq__tap-hint">toca para saber más</div>
    </div>
  );
}

function ServiceCard({ label, badge, launch, old, num, suffix, sub, feats, cta, pro, delay }) {
  const [open, setOpen] = useState(false);
  const visibleFeats = open ? feats : feats.slice(0, 3);
  return (
    <Reveal delay={delay} className={`price-card ${pro ? "price-card--pro" : ""} ${open ? "price-card--open" : ""}`}
      onClick={() => setOpen(o => !o)}>
      {badge && <div className="price-badge">{badge}</div>}
      <div className="price-label">{label}</div>
      {launch && <div className="price-launch">{launch}</div>}
      {old && <div className="price-old"><s>{old}</s></div>}
      <div className="price-num">{!suffix && "desde "}<b>{num}{suffix ? "" : <span>€</span>}</b>{suffix && <span style={{fontSize:16}}>{suffix}</span>}</div>
      <div className="price-sub">{sub}</div>
      <div className="price-divider" />
      {visibleFeats.map((f,i)=>(
        <div key={i} className="price-feat"><span className="ic ic--v" style={{flexShrink:0}}>✓</span>{f}</div>
      ))}
      {feats.length > 3 && <div className="price-more">{open ? "Ver menos ▲" : `+${feats.length-3} más — toca para ver ▼`}</div>}
      <a href="#contact" className={`price-cta ${pro ? "price-cta--pro" : ""}`} onClick={e=>e.stopPropagation()}>{cta}</a>
    </Reveal>
  );
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
      className={`btn ${glossy ? "btn--glossy" : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        "--mx": `${coords.x}%`,
        "--my": `${coords.y}%`,
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
  { n: "PowerPulse",       img: "/assets/proj-powerpulse.webp"   },
  { n: "Actualizar IA",    img: "/assets/proj-actualizaria.webp" },
  { n: "Lex León",         img: "/assets/proj-lexleon.webp"      },
  { n: "Nova Estética",    img: "/assets/proj-novaest.webp"      },
  { n: "León Properties",  img: "/assets/proj-properties.webp"  },
  { n: "León Suites",      img: "/assets/proj-hotel.webp"        },
];
const CASES = [
  { n: "PowerPulse",       img: "/assets/proj-powerpulse.webp",   url: "#", cat: "App móvil & Dashboard",      glare: "rgba(146,187,255,0.16)", sweep: "rgba(146,187,255,0.05)" },
  { n: "Actualizar IA",    img: "/assets/proj-actualizaria.webp", url: "#", cat: "Plataforma SaaS",            glare: "rgba(192,132,252,0.16)", sweep: "rgba(192,132,252,0.05)" },
  { n: "Lex León",         img: "/assets/proj-lexleon.webp",      url: "#", cat: "Web corporativa",            glare: "rgba(245,222,179,0.15)", sweep: "rgba(245,222,179,0.04)" },
  { n: "Nova Estética",    img: "/assets/proj-novaest.webp",      url: "#", cat: "Clínica & Salud",            glare: "rgba(255,182,193,0.16)", sweep: "rgba(255,182,193,0.05)" },
  { n: "León Properties",  img: "/assets/proj-properties.webp",  url: "#", cat: "Dashboard inmobiliario",     glare: "rgba(52,211,153,0.14)",  sweep: "rgba(52,211,153,0.04)"  },
  { n: "León Suites",      img: "/assets/proj-hotel.webp",        url: "#", cat: "Hotel boutique",             glare: "rgba(129,140,248,0.16)", sweep: "rgba(129,140,248,0.05)" },
];
const TESTI = [
  { n: "Josh Schachter", r: "Fundador y CEO, UpdateAI",    img: "/assets/testi-1.webp", t: "Convirtió mi visión en una web impresionante que superó mis expectativas. Su dominio del diseño es muy poco común." },
  { n: "Masam",          r: "Diseñador Senior",            img: null,                    t: "Transformó por completo nuestra web anticuada. Visualmente impactante y la experiencia de usuario es de otro nivel." },
  { n: "Saleh",          r: "Experto SEO",                  img: null,                    t: "El diseño y las ventas eran nuestro punto débil — esto cubrió ese hueco. La mejora en nuestras métricas fue real." },
  { n: "Marco King",     r: "Fundador, Reels Studio",       img: "/assets/testi-4.png",  t: "Atento, comunicativo y resultados excepcionales. No dudaría en volver a colaborar." },
  { n: "Nadia Clarke",   r: "Tech & IT",                    img: "/assets/testi-5.png",  t: "Maestría con animaciones e interacciones complejas que dieron vida a toda la web." },
  { n: "Orange",         r: "Vendedor",                     img: null,                    t: "Integró herramientas externas y animaciones personalizadas a la perfección. Atención al detalle impresionante." },
];
const SERVICES_HELP = [
  { k: "01", h: "Atraer, influir, convertir", p: "Estrategias que cautivan y hacen que la voz de tu marca conecte." },
  { k: "02", h: "Identificar, posicionar, visualizar", p: "Marcas memorables que reflejan tus valores y tu posición en el mercado." },
  { k: "03", h: "Innovar, cautivar, fidelizar", p: "Apps y productos diseñados para impulsar la interacción y la lealtad." },
  { k: "04", h: "Atraer, convertir, crecer", p: "Webs que atraen visitantes, los convierten y disparan tu crecimiento." },
];
const FAQS = [
  { q: "¿Cuánto tarda en verse un aumento en ventas?", a: "Depende del punto de partida, pero nuestros clientes suelen notar más consultas en las primeras semanas. Una web bien orientada a ventas trabaja 24h para ti." },
  { q: "¿Qué incluye exactamente el servicio?", a: "Diseño web, copy persuasivo, estructura de conversión y estrategia — todo en un solo proyecto. No necesitas contratar a 4 personas distintas." },
  { q: "¿Por qué no me vale con una web barata o un Wix?", a: "Una web bonita que no vende es dinero tirado. Nosotros diseñamos para que cada sección guíe al visitante a contactarte o comprar — eso no lo hace una plantilla." },
  { q: "¿Tengo que saber de tecnología o diseño?", a: "Para nada. Tú nos cuentas tu negocio y lo que quieres conseguir — nosotros nos encargamos de todo lo demás." },
  { q: "¿Cuánto cuesta?", a: "Depende del proyecto. Primero hablamos gratis, entendemos tu situación y te damos un presupuesto claro. Sin sorpresas." },
  { q: "¿Cómo empezamos?", a: "Escríbenos o reserva una llamada de 30 minutos — gratuita y sin compromiso. En esa llamada ya te decimos si podemos ayudarte y cómo." },
];

/* ---------- page ---------- */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcNeeds, setCalcNeeds] = useState([]);
  const helpSectionRef = useRef(null);

  const CALC_ADDERS = { reservas: 150, tienda: 750, ads: 200 };
  const CALC_BASE = 450;
  const toggleNeed = (k) => setCalcNeeds(n => n.includes(k) ? n.filter(x=>x!==k) : [...n, k]);
  const calcTotal = CALC_BASE + calcNeeds.reduce((s,k)=>s+CALC_ADDERS[k],0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      document.documentElement.style.setProperty("--gmx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--gmy", `${e.clientY}px`);
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
      <Starfield />
      <div className="site-ambient" />
      <div className="grid-overlay" />
      <div className="grid-overlay__spot" />
      <style>{CSS}</style>

      {/* NAV */}

      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav__inner">
          <div className="nav__brand">León Webs</div>
          <div className="nav__links">
            <a href="#work">Trabajos</a><a href="#services">Servicios</a><a href="#about">Nosotros</a><a href="#faq">FAQ</a>
          </div>
          <div className="nav__cta"><Btn href="#contact">Ver cómo escalamos</Btn></div>
          <button className="nav__burger" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="nav__mobile-menu">
          <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>
          <a href="#work" onClick={() => setMenuOpen(false)}>Trabajos</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Servicios</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Nosotros</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <div style={{marginTop:24, width:"80%"}}><Btn glossy href="#contact" onClick={() => setMenuOpen(false)}>Hablamos gratis</Btn></div>
        </div>
      )}

      {/* DOCK DE ACCIONES — solo móvil */}
      <div className="dock">
        <a className="dock__btn" href="tel:+34600000000">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          Llamar
        </a>
        <a className="dock__btn" href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          WhatsApp
        </a>
        <a className="dock__btn" href="#calculadora">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="12" x2="8" y2="12"/><line x1="12" y1="12" x2="12" y2="12"/><line x1="16" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="12" y1="16" x2="12" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
          Presupuesto
        </a>
        <a className="dock__btn dock__btn--main" href="#contact">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Agendar
        </a>
      </div>

      {/* HERO */}
      <header className="hero wrap" id="top">
        <div className="hero__bg-image" />
        <div className="hero__aurora" />
        <div className="hero__glow" />
        <div className="hero__interactive-glow" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Para negocios que YA venden</span></Reveal>
          {/* Strip de proyectos visible solo en móvil, dentro del hero */}
          <div className="hero__strip show-m">
            <div className="marquee" style={{ "--dur": "40s" }}>
              <div className="marquee__track">
                {[...PROJECTS, ...PROJECTS].map((p, i) => (
                  <div className="hero__shot" key={i}>
                    <img src={p.img} alt={p.n} loading="lazy" onError={e=>e.target.style.display='none'} />
                    <b>{p.n}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Reveal delay={120}><h1 className="display h-grad">Consigue 3 veces más clientes</h1></Reveal>
          <Reveal delay={220} className="lead hide-m" as="p">Webs diseñadas para negocios activos en León que quieren escalar. Barbería, clínica, asesoría, hotel — en 2 semanas tu web genera ventas nuevas.</Reveal>
          <Reveal delay={320}><Btn glossy href="#contact">Ver cómo escalamos</Btn></Reveal>
          <Reveal delay={400} className="hero__trust">
            <div className="hero__avatars">
              {["C","L","J","A","M"].map((l,i)=><span key={i} className="hero__av">{l}</span>)}
            </div>
            <span className="hero__trust-txt"><b>+12 negocios</b> en León ya confían</span>
          </Reveal>
        </div>
        <Reveal delay={500} className="hero__stats">
          {[
            { svg:<><path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.83-.83 1.24-2.29 1.5-3.5-1.21.26-2.67.67-3.5 1.5z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>, to:3, prefix:"×", label:"de clientes" },
            { svg:<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>, to:2, suffix:" sem", label:"de plazo" },
            { svg:<><line x1="4" y1="20" x2="20" y2="4"/><circle cx="6.5" cy="6.5" r="4.5"/><circle cx="17.5" cy="17.5" r="4.5"/></>, to:0, suffix:"€", label:"la llamada" },
          ].map(({svg, to, prefix, suffix, label}, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="hero__stat-div" />}
              <div className="hero__stat">
                <span className="hero__stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{svg}</svg>
                </span>
                <span className="hero__stat-n"><Counter to={to} prefix={prefix} suffix={suffix} /></span>
                <span className="hero__stat-l">{label}</span>
              </div>
            </React.Fragment>
          ))}
        </Reveal>
      </header>

      {/* PROJECT STRIP MARQUEE */}
      <div className="section strip-section" style={{ padding: "30px 0 60px", overflow: "visible" }} id="work">
        <div className="ambient-glow" />
        <div className="marquee" style={{ "--dur": "75s" }}>
          <div className="marquee__track">
            {[...PROJECTS, ...PROJECTS].map((p, i) => (
              <div className="shot" key={i}>
                <img className="shot__img" src={p.img} alt={p.n} loading="lazy" onError={e=>e.target.style.display='none'} />
                <b>{p.n}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BRANDS */}
      <div className="section brands" style={{ padding: "40px 0" }}>
        <div className="brands__glow" />
        <Reveal className="kicker" style={{ textAlign: "center", marginBottom: 34, position: "relative" }}>Negocios que ya confían en nosotros</Reveal>
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
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>¿Tienes web pero no vendes suficiente?</span></Reveal>
          <Reveal delay={100}><h2 className="display">La mayoría de webs no están hechas para vender</h2></Reveal>
          <Reveal delay={180} className="lead hide-m" as="p" style={{ margin: "0 auto" }}>La tuya sí puede estarlo. Esto es lo que cambia cuando trabajas con nosotros.</Reveal>
        </div>
        <div className="cols">
          <Reveal className="col col--no">
            <span className="glow-accent" />
            <h3>Web sin estrategia</h3>
            {["Web bonita pero que no vende ni un euro", "El visitante llega y se va sin comprar ni llamar", "Nadie sabe bien cómo explicar lo que ofreces", "Diseño genérico que no transmite confianza", "Sin CTA claros ni estructura de conversión", "Dinero invertido sin saber si está funcionando"].map((t, i) => (
              <div className="row" key={i}><span className="ic ic--x">✕</span>{t}</div>
            ))}
          </Reveal>
          <Reveal delay={120} className="col col--yes">
            <span className="glow-side" />
            <span className="glow-ambient" />
            <h3>Con León Webs</h3>
            {["Web diseñada desde el primer píxel para vender", "Cada sección guía al visitante a contactarte o comprar", "Copy que explica tu valor y convence a tu cliente ideal", "Imagen profesional que genera confianza real", "CTAs estratégicos en cada punto de la página", "Sabes exactamente qué funciona y qué mejorar"].map((t, i) => (
              <div className="row" key={i} style={{ color: "#dbe4ff" }}><span className="ic ic--v">✓</span>{t}</div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about-section" id="about">
        <div className="about-section__bgwrap">
          <div className="about-section__glow" />
          <div className="about-section__horizon" />
        </div>
        <div className="wrap">
        <div className="about__inner">
          <div className="about__photo hide-m">
            <img src="/assets/avatar-color.webp" alt="León Webs" onError={e=>{e.target.style.display='none'}} />
          </div>
          <div className="about__content">
            <div className="shead" style={{ textAlign:"left", alignItems:"flex-start" }}>
              <Reveal className="eyebrow" as="div"><span className="dot" /><span>Por qué somos diferentes</span></Reveal>
              <Reveal delay={100}><h2 className="display">Escalamos negocios que ya funcionan</h2></Reveal>
            </div>
            <Reveal delay={150} className="lead" as="p" style={{ margin: "0 0 28px" }}>
              Trabajamos con negocios que ya generan ingresos: barberías, clínicas, asesorías. Convertimos su web en una herramienta que vende. Resultado real: una barbería en León pasó de 0 a más de 40 reservas online al mes en 6 semanas.
            </Reveal>
            <div className="about__cards">
          {[
            {
              svg: <><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></>,
              t: "Auditoría de tu web actual",
              d: "Vemos qué te está frenando y por qué no convierte."
            },
            {
              svg: <><path d="M13 10V3L4 14h7v7l9-11h-7z"/></>,
              t: "Rediseño enfocado en ventas",
              d: "Cada sección tiene un propósito claro: que contactes o compres."
            },
            {
              svg: <><path d="M9 19V5m0 0L5 9m4-4l4-4"/></>,
              t: "Seguimiento tras el lanzamiento",
              d: "Ajustamos con datos reales, no con suposiciones."
            },
          ].map(({svg, t, d}, i) => (
            <AboutCard key={i} delay={i * 90} svg={svg} t={t} d={d} />
          ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* SERVICIOS — resumen real, sin relleno */}
      <section className="section wrap" id="services" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Nuestros servicios</span></Reveal>
          <Reveal delay={100}><h2 className="display">A qué nos dedicamos</h2></Reveal>
        </div>
        <div className="svc-grid">
          {[
            { svg:<><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></>, h:"Diseño web", p:"Web profesional adaptada a tu negocio, lista para vender en 1-2 semanas." },
            { svg:<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></>, h:"Tienda online", p:"Catálogo, carrito y pago online para vender tus productos 24/7." },
            { svg:<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>, h:"Por horas", p:"Cambios, ajustes o funciones sueltas sin contrato ni permanencia." },
            { svg:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>, h:"Publicidad y Google", p:"Google My Business, campañas Ads y SEO local para que te encuentren." },
          ].map(({svg,h,p}, i) => (
            <Reveal key={i} delay={i*80} className="svc-card">
              <span className="svc-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{svg}</svg>
              </span>
              <h4>{h}</h4>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW I HELP — 4-quadrant crosshair layout */}
      <section className="section" ref={helpSectionRef} id="howhelp" style={{ paddingBlock: "50px" }}>
        <div className="wrap shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Cómo hacemos que vendas más</span></Reveal>
          <Reveal delay={100}><h2 className="display">Cuatro pilares para que tu web venda</h2></Reveal>
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
            style={{ "--ray-offset": `${scrollProgress * 100}%` }}
          />
          <div
            className="hq__ray hq__ray--r"
            style={{ "--ray-offset": `${scrollProgress * 100}%` }}
          />
          <div
            className="hq__ray hq__ray--t"
            style={{ "--ray-offset": `${scrollProgress * 100}%` }}
          />
          <div
            className="hq__ray hq__ray--b"
            style={{ "--ray-offset": `${scrollProgress * 100}%` }}
          />

          {/* central hub avatar */}
          <div className="hq__hub">
            <div className="hq__ava">
              <img
                src="/assets/avatar-color.webp"
                alt="Avatar"
                loading="lazy"
              />
            </div>
          </div>

          {/* 4 quadrant text blocks */}
          <div className="hq__grid">
            {[
              { pos:"tl", h:"Web que convierte", p:"Cada sección guía al visitante hacia la venta.", svg:<><circle cx="12" cy="12" r="3"/><path d="M3 12h3m12 0h3M12 3v3m0 12v3"/><path d="M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></> },
              { pos:"tr", h:"Copy que vende", p:"Palabras que convencen a tu cliente antes de llamarte.", svg:<polygon points="5 3 19 12 5 21 5 3"/> },
              { pos:"bl", h:"Imagen de confianza", p:"Tu web transmite profesionalidad desde el primer segundo.", svg:<><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></> },
              { pos:"br", h:"Estrategia de ventas", p:"No solo la web — te decimos qué poner y cómo decirlo.", svg:<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
            ].map(({pos,h,p,svg}, i) => (
              <PilarCard key={i} pos={pos} h={h} p={p} svg={svg} />
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="section wrap" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Resultados reales</span></Reveal>
          <Reveal delay={100}><h2 className="display">Proyectos que ya generan clientes</h2></Reveal>
        </div>
        <div className="cases">
          {CASES.map((c, i) => (
            <TiltCard key={i} delay={(i % 3) * 90} className="case" as="a" href={c.url} target="_blank" rel="noopener noreferrer">
              <img className="case__img" src={c.img} alt={c.n} loading="lazy" onError={e=>e.target.style.display='none'} />
              {c.cat && <span className="case__cat">{c.cat}</span>}
              <div className="case__meta"><b>{c.n}</b><span className="case__view">Ver →</span></div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="shead wrap">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Clientes que ya venden más</span></Reveal>
          <Reveal delay={100} className="hide-m"><h2 className="display">Lo que dicen los que ya lo comprobaron</h2></Reveal>
        </div>
        <div className="marquee" style={{ "--dur": "75s", marginTop: 40 }}>
          <div className="marquee__track">
            {[...TESTI, ...TESTI].map((t, i) => (
              <div className="tcard" key={i}>
                <div className="stars">★★★★★</div>
                <p>"{t.t}"</p>
                <div className="who">
                  <span className="ava">
                    {t.img ? <img src={t.img} alt={t.n} loading="lazy" onError={e=>{e.target.style.display='none'}} /> : null}
                  </span>
                  <div><b>{t.n}</b><span>{t.r}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="marquee marquee--rev testi-row2" style={{ "--dur": "90s", marginTop: 20 }}>
          <div className="marquee__track">
            {[...TESTI.slice().reverse(), ...TESTI.slice().reverse()].map((t, i) => (
              <div className="tcard" key={i}>
                <div className="stars">★★★★★</div>
                <p>"{t.t}"</p>
                <div className="who">
                  <span className="ava">
                    {t.img ? <img src={t.img} alt={t.n} loading="lazy" onError={e=>{e.target.style.display='none'}} /> : null}
                  </span>
                  <div><b>{t.n}</b><span>{t.r}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULADORA DE PRECIO */}
      <section className="section wrap" id="calculadora">
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Calcula tu precio</span></Reveal>
          <Reveal delay={100}><h2 className="display">¿Cuánto cuesta tu web?</h2></Reveal>
          <Reveal delay={160} className="lead hide-m" as="p" style={{ margin:"0 auto" }}>Marca lo que necesitas y te decimos el precio ahora — sin llamadas, sin esperar presupuesto.</Reveal>
        </div>
        <Reveal delay={200} className="calc-card">
          <div className="calc-chips">
            {[
              { k:"reservas", label:"Reservas o citas online" },
              { k:"tienda", label:"Vender productos online" },
              { k:"ads", label:"Aparecer en Google / publicidad" },
            ].map(({k,label}) => (
              <button key={k} className={`calc-chip ${calcNeeds.includes(k) ? "calc-chip--on" : ""}`} onClick={() => toggleNeed(k)}>
                <span className="calc-chip__check">{calcNeeds.includes(k) ? "✓" : "+"}</span>{label}
              </button>
            ))}
          </div>
          <div className="calc-result">
            <div className="calc-result__label">Precio estimado</div>
            <div className="calc-result__num">desde <b>{calcTotal.toLocaleString("es-ES")}<span>€</span></b></div>
            <div className="calc-result__sub">Web base incluida · pago único</div>
            <a
              className="price-cta price-cta--pro"
              href={`mailto:hola@leonwebs.es?subject=${encodeURIComponent("Presupuesto León Webs")}&body=${encodeURIComponent(`Hola, he usado la calculadora y me interesa una web desde ${calcTotal}€.\n\nNecesito: ${calcNeeds.length ? calcNeeds.map(k=>({reservas:"Reservas online",tienda:"Tienda online",ads:"Publicidad/Google"}[k])).join(", ") : "Web básica"}.\n\nMi negocio es: `)}`}
            >
              Pedir este presupuesto →
            </a>
          </div>
        </Reveal>
      </section>

      {/* PRECIOS Y SERVICIOS */}
      <section className="section wrap" id="precios" style={{ overflow:"visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Servicios y precios</span></Reveal>
          <Reveal delay={100}><h2 className="display">Elige cómo quieres crecer</h2></Reveal>
          <Reveal delay={160} className="lead hide-m" as="p" style={{ margin:"0 auto" }}>Sin sorpresas. Toca cada tarjeta para ver el detalle completo.</Reveal>
        </div>
        <div className="pricing pricing--4">
          {[
            {
              label: "Plan Arranque", badge: null,
              launch: "Oferta de lanzamiento", old: "650€", num: "450", sub: "Pago único · lista en 1 semana",
              feats: ["Web con plantilla profesional adaptada a tu negocio","Textos, fotos y colores de tu marca","Botón directo a WhatsApp","Optimizada para móvil","Soporte 15 días"],
              cta: "Quiero arrancar", pro:false
            },
            {
              label: "Plan Crecimiento", badge: "Más elegido",
              launch: "Oferta de lanzamiento", old: "1.100€", num: "750", sub: "Pago único · lista en 2 semanas",
              feats: ["Todo lo de Plan Arranque","Sección de reservas o formulario avanzado","Testimonios y galería de trabajos","Google My Business optimizado","Seguimiento 1 mes + ajustes","SEO básico local"],
              cta: "Quiero crecer", pro:true
            },
            {
              label: "Tienda Online", badge: null,
              launch: "Oferta de lanzamiento", old: "1.800€", num: "1.200", sub: "Pago único · según catálogo",
              feats: ["Catálogo de productos con fotos","Carrito y pago online (Stripe/Bizum)","Gestión de pedidos simple","Panel para añadir productos tú mismo","Soporte 30 días"],
              cta: "Quiero mi tienda", pro:false
            },
            {
              label: "Por Horas", badge: null,
              launch: null, old: null, num: "35", suffix:"€/hora", sub: "Mínimo 2 horas · sin permanencia",
              feats: ["Cambios y mantenimiento en tu web actual","Ajustes de diseño o contenido puntuales","Nuevas secciones o funciones sueltas","Sin compromiso mensual","Facturamos solo lo trabajado"],
              cta: "Pedir presupuesto", pro:false
            },
          ].map((p, i) => (
            <ServiceCard key={i} {...p} delay={i*80} />
          ))}
        </div>

        {/* PUBLICIDAD Y GOOGLE */}
        <Reveal delay={100} className="ads-card">
          <div className="ads-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div className="ads-card__body">
            <h3>Publicidad y Google</h3>
            <p>¿Ya tienes web pero nadie te encuentra? Te configuramos Google My Business, campañas de Google Ads y SEO local para que aparezcas cuando tu cliente busque "[tu negocio] cerca de mí".</p>
            <div className="ads-card__feats">
              <span>✓ Google My Business</span>
              <span>✓ Campaña Google Ads</span>
              <span>✓ SEO local</span>
              <span>✓ Informe mensual</span>
            </div>
          </div>
          <a href="#contact" className="price-cta" style={{flexShrink:0}}>Consultar precio</a>
        </Reveal>

        <Reveal delay={200} style={{textAlign:"center",marginTop:28}}>
          <p style={{color:"var(--muted)",fontSize:13}}>¿No sabes cuál necesitas? <a href="#contact" style={{color:"#92BBFF",textDecoration:"none"}}>Cuéntanos tu caso — es gratis →</a></p>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="section wrap" id="faq">
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Dudas habituales</span></Reveal>
          <Reveal delay={100}><h2 className="display">Lo que nos preguntan antes de empezar</h2></Reveal>
        </div>
        <div className="faq">
          {FAQS.map((f, i) => (
            <Reveal key={i} delay={i * 50} className={`q ${open === i ? "open" : ""}`}>
              <button className="q__head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {f.q}<span className="q__ic">＋</span>
              </button>
              <div className="q__body" style={{ maxHeight: open === i ? 200 : 0 }}><p>{f.a}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section wrap" id="contact">
        <Reveal className="contact-card">
          <div className="hero__glow" style={{ top: "0", opacity: .5 }} />
          <div style={{ position:"relative", textAlign:"center" }}>
            <div className="eyebrow" style={{ display:"inline-flex", marginBottom:24 }}><span className="dot" /><span>Hablemos</span></div>
            <h2 className="display h-grad" style={{ fontSize:"clamp(28px,5vw,56px)", marginBottom:20 }}>Escala tu negocio en 2 semanas</h2>
            <p className="lead" style={{ margin:"0 auto 32px", maxWidth:520 }}>Llamada sin costo. Analizamos tu web y te mostramos exactamente qué te falta para pasar de 5 clientes a 15 clientes al mes.</p>
            <Btn glossy href="mailto:hola@leonwebs.es">Agendar auditoría →</Btn>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap footer__grid">
          <div style={{ maxWidth: 280 }}>
            <div className="nav__brand" style={{ marginBottom: 12 }}>León Webs</div>
            <p className="hide-m" style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Escalamos negocios activos en León. Barbería, clínica, asesor, hotel — si ya vendes offline, te ayudamos a vender 3× más online.</p>
          </div>
          <div className="foot-cols">
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Menú</div>
              <a href="#work">Trabajos</a><a href="#services">Servicios</a><a href="#about">Nosotros</a><a href="#faq">FAQ</a>
            </div>
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Contacto</div>
              <a href="mailto:hola@leonwebs.es">hola@leonwebs.es</a><a href="#">Instagram</a><a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ color: "var(--muted)", fontSize: 13, marginTop: 40 }}>© {new Date().getFullYear()} León Webs. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
