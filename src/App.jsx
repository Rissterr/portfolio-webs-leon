import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

// respeta el subpath del hosting (ej. GitHub Pages en /portfolio-webs-leon/)
const BASE = import.meta.env.BASE_URL;
const homeHref = (hash) => `${BASE}${hash}`;

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
  --bg:#050716; --bg2:#080E28;
  --txt:#E8F0FE; --muted:#9AA6C8; --line:rgba(255,255,255,.08);
  --blue:#1A73E8; --blue2:#8AB4F8; --ice:#C5EBFF; --cyan:#00D4FF;
  --card:linear-gradient(to bottom, rgba(10,14,35,0.65), rgba(14,19,45,0.65));
  --cardBlue:linear-gradient(to bottom, rgba(20,35,75,0.65), rgba(14,24,56,0.65));
  --display:'Outfit',sans-serif; --body:'Inter',sans-serif;
}
.site{ background:var(--bg); color:var(--txt); font-family:var(--body);
  position:relative; overflow-x:hidden; min-height:100vh; }
.grid-overlay{
  position:fixed; inset:0; pointer-events:none; z-index:1;
  background-image:radial-gradient(circle, rgba(138,180,248,.025) 1px, transparent 1px);
  background-size:32px 32px;
}
.grid-overlay__spot{
  position:fixed; inset:0; pointer-events:none; z-index:1;
  background-image:radial-gradient(circle, rgba(0,212,255,.18) 1.2px, transparent 1.2px);
  background-size:32px 32px;
  -webkit-mask-image:radial-gradient(circle 240px at var(--gmx,50vw) var(--gmy,40vh), black 0%, transparent 72%);
  mask-image:radial-gradient(circle 240px at var(--gmx,50vw) var(--gmy,40vh), black 0%, transparent 72%);
}
.site-ambient{
  position:fixed; left:50%; top:0; transform:translateX(-50%);
  width:min(1400px,150vw); height:100vh;
  background:radial-gradient(ellipse 45% 35% at 50% 0%, rgba(26,115,232,.18), transparent 65%);
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
}

/* ---- typography ---- */
.display{ font-family:var(--display); font-weight:700; line-height:1.06; letter-spacing:-.02em; }
.h-grad{ color: #FFFFFF; font-weight: 700; text-shadow: 0 2px 20px rgba(0,0,0,0.5); }
.eyebrow {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(146, 187, 255, 0.2);
  background: rgba(146, 187, 255, 0.07);
  color: #92BBFF;
  margin-bottom: 12px;
  transition: all 0.25s ease;
}
.eyebrow:hover {
  border-color: rgba(146, 187, 255, 0.4);
  background: rgba(146, 187, 255, 0.12);
}
.eyebrow > span:not(.dot) {
  color: #92BBFF;
}
.dot {
  display: none;
}
.kicker{ color:var(--muted); font-size:13px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; }
.lead{ color:var(--muted); font-size:17.5px; line-height:1.65; max-width:620px; }

/* ---- botón píldora cristalino con efectos de luz ---- */
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
.btn {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-family: var(--body);
  font-weight: 600;
  font-size: 14.5px;
  color: #FFFFFF;
  padding: 13px 26px;
  border-radius: 100px;
  text-decoration: none;
  background: linear-gradient(135deg, rgba(20, 32, 75, 0.75) 0%, rgba(10, 16, 42, 0.75) 100%);
  border: 1px solid rgba(146, 187, 255, 0.28);
  overflow: hidden;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 4px 20px -4px rgba(0, 102, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.22s ease;
}
.btn:hover {
  transform: translateY(-2px) scale(1.03);
  border-color: rgba(146, 187, 255, 0.65);
  box-shadow: 0 8px 30px -4px rgba(0, 153, 255, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.btn:focus-visible {
  outline: 2px solid #8EC1FF;
  outline-offset: 3px;
}
/* Rayo de luz en barrido continuo interactivo */
.btn::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -90%;
  width: 60%;
  height: 200%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.75) 50%,
    rgba(146, 187, 255, 0.5) 70%,
    transparent 100%
  );
  transform: rotate(26deg);
  pointer-events: none;
  z-index: 2;
  animation: btnSweepAnim 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes btnSweepAnim {
  0% { left: -90%; opacity: 0; }
  10% { opacity: 1; }
  45% { left: 140%; opacity: 1; }
  46%, 100% { left: 140%; opacity: 0; }
}
/* (1) Glow detrás del botón */
.btn__glow {
  position: absolute;
  inset: -10px;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
  filter: blur(14px);
  background: radial-gradient(40% 60% at var(--mx, 50%) var(--my, 50%), rgba(0, 180, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: var(--hovered, 0);
  transition: opacity 0.3s ease;
}
/* (2) Brillo del borde */
.btn__sweep {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(30% 60% at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%);
  opacity: var(--hovered, 0);
  transition: opacity 0.3s ease;
}
/* (3) Núcleo del botón */
.btn__core {
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: transparent;
  z-index: 1;
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
/* --- Variante Glossy (Hero y Destacados) --- */
.btn--glossy {
  color: #070D24;
  font-weight: 700;
  background: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 14px 34px -8px rgba(0, 140, 255, 0.45);
}
.btn--glossy .btn__core {
  inset: 1px;
  background: linear-gradient(180deg, #FFFFFF 0%, #EAF2FF 100%);
}
.btn--glossy .btn__label {
  color: #070D24;
}

/* ---- TOP LIQUID GLASS NEWS TICKER ---- */
.top-ticker {
  position: relative;
  z-index: 60;
  width: 100%;
  background: rgba(6, 11, 32, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(146, 187, 255, 0.16);
  padding: 8px 0;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
}
.top-ticker__badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(0, 212, 255, 0.12);
  border: 1px solid rgba(0, 212, 255, 0.35);
  color: #C5EBFF;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 100px;
  margin-left: 20px;
  margin-right: 14px;
  z-index: 2;
  box-shadow: 0 0 14px rgba(0, 212, 255, 0.2);
}
.top-ticker__badge-dot {
  width: 6.5px;
  height: 6.5px;
  border-radius: 50%;
  background: #00D4FF;
  box-shadow: 0 0 8px #00D4FF, 0 0 14px rgba(0,212,255,0.8);
  animation: tickerDotPulse 1.8s ease-in-out infinite;
}
@keyframes tickerDotPulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.35); opacity: 1; }
}
.top-ticker__viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%);
}
.top-ticker__track {
  display: inline-flex;
  white-space: nowrap;
  gap: 52px;
  animation: tickerScroll 34s linear infinite;
}
.top-ticker:hover .top-ticker__track {
  animation-play-state: paused;
}
@keyframes tickerScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.top-ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #D3E0FD;
  font-weight: 500;
}
.top-ticker__item b {
  color: #FFFFFF;
}
.top-ticker__sep {
  color: rgba(146, 187, 255, 0.35);
  margin-left: 4px;
}

/* ---- nav ---- */
.nav{ position:fixed; top:36px; left:0; right:0; z-index:50; transition:all .3s ease; }
.nav::before{ content:''; position:absolute; inset:0; opacity:0; transition:opacity .3s ease;
  background:linear-gradient(to bottom, rgba(5,7,26,.9), rgba(5,7,26,.55) 70%, transparent);
  pointer-events:none; z-index:-1; }
.nav.scrolled{ top:0; }
.nav.scrolled::before{ opacity:1; }
.nav__inner{ display:flex; align-items:center; justify-content:space-between;
  max-width:1200px; margin:0 auto; padding:16px 24px; }
.nav.scrolled .nav__inner{ background:rgba(8,11,34,.8); backdrop-filter:blur(16px);
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
.hero{ padding:150px 0 85px; text-align:center; }
.hero h1{ font-size:clamp(38px,6vw,76px); margin:20px auto 22px; max-width:16ch; }
.hero .lead{ margin:0 auto 30px; text-align:center; max-width:680px; font-size:18.5px; }

/* ---- HERO SOLUTIONS CARDS (REEMPLAZO EMOJIS) ---- */
.hero__solutions-grid {
  margin-top: 36px;
  max-width: 980px;
  margin-inline: auto;
}
.hero__solutions-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 14px;
}
.hero__solution-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 18px 20px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(20, 30, 70, 0.55) 0%, rgba(10, 15, 40, 0.65) 100%);
  border: 1px solid rgba(146, 187, 255, 0.2);
  text-decoration: none;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}
.hero__solution-card:hover {
  transform: translateY(-4px);
  border-color: rgba(146, 187, 255, 0.55);
  background: linear-gradient(180deg, rgba(30, 48, 105, 0.65) 0%, rgba(14, 22, 56, 0.75) 100%);
  box-shadow: 0 16px 36px -10px rgba(0, 102, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.hero__solution-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(66, 123, 216, 0.18);
  border: 1px solid rgba(146, 187, 255, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00D4FF;
  margin-bottom: 12px;
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.2);
}
.hero__solution-icon svg {
  width: 20px;
  height: 20px;
}
.hero__solution-info strong {
  display: block;
  font-size: 14.5px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 4px;
  line-height: 1.35;
}
.hero__solution-info span {
  display: block;
  font-size: 12.5px;
  color: var(--muted);
  line-height: 1.45;
  margin-bottom: 10px;
}
.hero__solution-badge {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  color: #92BBFF;
  background: rgba(66, 123, 216, 0.15);
  border: 1px solid rgba(146, 187, 255, 0.25);
  padding: 3px 9px;
  border-radius: 100px;
}
@media(max-width:860px){
  .hero__solutions-cards { grid-template-columns: 1fr; gap: 10px; }
  .hero__solution-card { padding: 14px 16px; }
  .nav{ top:0; }
}

/* ---- proceso en 3 pasos sencillos ---- */
.process-grid{
  display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-top:46px;
}
.process-card{
  background:linear-gradient(180deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.015) 100%);
  border:1px solid rgba(146,187,255,.18); border-radius:22px;
  padding:32px 26px; position:relative;
  backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.1), 0 20px 40px -25px rgba(0,0,0,.6);
  transition:transform .35s cubic-bezier(.16,1,.3,1), border-color .35s ease, box-shadow .35s ease;
}
.process-card:hover{
  transform:translateY(-4px); border-color:rgba(146,187,255,.48);
  background:linear-gradient(180deg, rgba(146,187,255,.08) 0%, rgba(66,123,216,.02) 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 26px 60px -20px rgba(66,123,216,.45);
}
.process-header{
  display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;
}
.process-num{
  font-family:var(--display); font-size:34px; font-weight:800;
  background:linear-gradient(135deg, #00D4FF 0%, #8AB4F8 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent; line-height:1;
}
.process-icon{
  width:44px; height:44px; border-radius:12px;
  background:rgba(66,123,216,.14); border:1px solid rgba(146,187,255,.28);
  display:flex; align-items:center; justify-content:center; color:#00D4FF;
  box-shadow:0 0 16px -4px rgba(0,212,255,.3);
}
.process-icon svg{ width:22px; height:22px; }
.process-card h3{
  font-family:var(--display); font-size:20px; font-weight:700; color:#FFFFFF; margin-bottom:10px;
}
.process-card p{
  font-size:14px; color:var(--muted); line-height:1.6; margin-bottom:18px;
}
.process-tag{
  display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600;
  color:#92BBFF; background:rgba(66,123,216,.12); border:1px solid rgba(146,187,255,.22);
  padding:5px 12px; border-radius:100px;
}
@media(max-width:860px){
  .process-grid{ grid-template-columns:1fr; gap:16px; }
}

/* ---- metric badges en casos ---- */
.case__metric{
  position:absolute; top:12px; right:12px; z-index:6; font-size:11px; font-weight:700;
  padding:4px 10px; border-radius:100px; background:rgba(0,212,255,.15); backdrop-filter:blur(6px);
  border:1px solid rgba(0,212,255,.45); color:#00D4FF; box-shadow:0 0 12px rgba(0,212,255,.3);
}

/* ---- contact reassurance actions ---- */
.contact__actions{
  display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap; margin-bottom:24px;
}
.contact__whatsapp-btn{
  display:inline-flex; align-items:center; gap:8px; padding:14px 24px; border-radius:100px;
  background:rgba(37,211,102,.12); border:1px solid rgba(37,211,102,.35); color:#4EFA8B;
  font-size:15px; font-weight:600; text-decoration:none;
  backdrop-filter:blur(10px); transition:all .25s ease;
}
.contact__whatsapp-btn:hover{
  background:rgba(37,211,102,.22); border-color:rgba(37,211,102,.6);
  box-shadow:0 0 20px -4px rgba(37,211,102,.4); transform:translateY(-2px);
}
.contact__whatsapp-btn svg{ width:18px; height:18px; }
.contact__trust-badges{
  display:flex; justify-content:center; align-items:center; gap:20px; flex-wrap:wrap;
  font-size:12.5px; color:var(--muted); margin-top:8px;
}
.contact__trust-badges span{
  display:inline-flex; align-items:center; gap:6px;
}

/* ---- 1. barra de garantías de tranquilidad ---- */
.guarantees-bar {
  margin-top: 48px;
  background: linear-gradient(180deg, rgba(20, 36, 75, 0.45) 0%, rgba(10, 18, 42, 0.65) 100%);
  border: 1px solid rgba(146, 187, 255, 0.22);
  border-radius: 24px;
  padding: 24px 30px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 50px -20px rgba(0,0,0,0.6);
  backdrop-filter: blur(16px);
}
.guarantee-item {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
}
.guarantee-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 132, 255, 0.16);
  border: 1px solid rgba(0, 212, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00D4FF;
  flex-shrink: 0;
  box-shadow: 0 0 14px -2px rgba(0, 132, 255, 0.3);
}
.guarantee-icon svg { width: 20px; height: 20px; }
.guarantee-text { display: flex; flex-direction: column; gap: 2px; }
.guarantee-text b { font-family: var(--display); font-size: 14px; color: #fff; font-weight: 700; line-height: 1.2; }
.guarantee-text span { font-size: 12px; color: var(--muted); line-height: 1.3; }

@media(max-width: 900px) {
  .guarantees-bar { grid-template-columns: repeat(2, 1fr); padding: 20px; gap: 16px; }
}
@media(max-width: 580px) {
  .guarantees-bar { grid-template-columns: 1fr; }
}

/* ---- 2. widget flotante de WhatsApp ---- */
.floating-whatsapp {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 65;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px 10px 12px;
  border-radius: 100px;
  background: linear-gradient(135deg, rgba(20, 42, 30, 0.95), rgba(10, 28, 18, 0.95));
  border: 1px solid rgba(37, 211, 102, 0.45);
  color: #FFFFFF;
  text-decoration: none;
  font-family: var(--body);
  font-size: 13.5px;
  font-weight: 600;
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.8), 0 0 20px rgba(37, 211, 102, 0.35);
  backdrop-filter: blur(16px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.floating-whatsapp:hover {
  transform: translateY(-3px) scale(1.03);
  border-color: rgba(37, 211, 102, 0.75);
  box-shadow: 0 14px 40px -5px rgba(0,0,0,0.85), 0 0 28px rgba(37, 211, 102, 0.55);
}
.floating-whatsapp__icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #25D366;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #050716;
  flex-shrink: 0;
}
.floating-whatsapp__icon svg { width: 17px; height: 17px; fill: currentColor; }
.floating-whatsapp__status {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #25D366;
  box-shadow: 0 0 8px #25D366;
  margin-right: 4px;
}
@media(max-width: 768px) {
  .floating-whatsapp { bottom: 74px; right: 14px; padding: 8px 14px 8px 10px; font-size: 12px; }
  .floating-whatsapp__icon { width: 26px; height: 26px; }
}

/* ---- 3. filtros interactivos de FAQ ---- */
.faq-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 24px auto 32px;
  max-width: 600px;
}
.faq-filter-btn {
  padding: 8px 18px;
  border-radius: 100px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(146,187,255,0.18);
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--body);
  transition: all 0.25s ease;
}
.faq-filter-btn:hover {
  background: rgba(146,187,255,0.1);
  color: #FFFFFF;
}
.faq-filter-btn.active {
  background: linear-gradient(135deg, rgba(66,123,216,0.35), rgba(0,212,255,0.25));
  border-color: #00D4FF;
  color: #FFFFFF;
  font-weight: 600;
  box-shadow: 0 0 14px rgba(0,212,255,0.35);
}

/* ---- 4. para quién es / sectores ---- */
.audience-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 40px;
}
.audience-card {
  background: linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.015) 100%);
  border: 1px solid rgba(146,187,255,.16);
  border-radius: 18px;
  padding: 22px 18px;
  text-align: center;
  backdrop-filter: blur(14px);
  transition: all .3s cubic-bezier(.16,1,.3,1);
}
.audience-card:hover {
  transform: translateY(-3px);
  border-color: rgba(146,187,255,.45);
  box-shadow: 0 16px 36px -18px rgba(66,123,216,.4);
}
.audience-emoji { font-size: 30px; margin-bottom: 10px; display: block; }
.audience-card h4 { font-family: var(--display); font-size: 16px; color: #fff; margin-bottom: 6px; }
.audience-card p { font-size: 12.5px; color: var(--muted); line-height: 1.45; }

@media(max-width: 860px) {
  .audience-grid { grid-template-columns: repeat(2, 1fr); }
}
@media(max-width: 480px) {
  .audience-grid { grid-template-columns: 1fr; }
}

/* ---- 5. timeline del calculador ---- */
.calc-timeline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 10px;
  font-size: 12px;
  color: #C5EBFF;
  font-weight: 500;
}

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
  transition:box-shadow .5s ease, border-color .5s ease; }
.about__photo:hover{
  border-color:rgba(146,187,255,.55);
  box-shadow:0 0 0 3px rgba(146,187,255,.2), 0 34px 90px -20px rgba(66,123,216,.6), inset 0 1px 0 rgba(255,255,255,.14); }
.about__photo::after{ content:''; position:absolute; inset:0; z-index:2; pointer-events:none; border-radius:inherit;
  background:linear-gradient(135deg, rgba(146,187,255,.16) 0%, transparent 35%, transparent 65%, rgba(66,123,216,.14) 100%);
  opacity:0; transition:opacity .5s ease; }
.about__photo:hover::after{ opacity:1; }
.about__photo img{ width:100%; height:100%; object-fit:cover; object-position:top center;
  filter:grayscale(1) brightness(0.82);
  transition:transform .6s cubic-bezier(.16,1,.3,1), filter .6s cubic-bezier(.16,1,.3,1); }
@media(hover:hover){
  .about__photo:hover img{ filter:grayscale(0) brightness(1); transform:scale(1.04); }
}
@media(hover:none){
  .about__photo img{ filter:grayscale(0) brightness(1); }
}
.about__content{ text-align:center; display:flex; flex-direction:column; align-items:center; height:100%; }
.about__content .shead{ margin-bottom:0; text-align:center; align-items:center; max-width:none; }
.about__content .shead h2{ margin-bottom:0; font-size:clamp(22px,2.8vw,32px); line-height:1.15; }
.about__content .lead{ text-align:center; max-width:100%; font-size:15.5px; margin-bottom:20px !important; }
/* ---- about cards ---- */
.about__cards{ display:flex; flex-direction:column; align-items:stretch; align-self:stretch; gap:10px; max-width:100%; margin:0; text-align:left; flex:1; }
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
.pricing{ display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-top:48px; }
.pricing--4{ grid-template-columns:repeat(4,1fr); }
.price-card{ 
  background:linear-gradient(180deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,.02) 100%); 
  border:1px solid rgba(146,187,255,.18); 
  border-radius:22px; 
  padding:30px 24px; 
  display:flex; flex-direction:column; gap:0; 
  position:relative; cursor:pointer; 
  backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.12), 0 20px 40px -25px rgba(0,0,0,.6);
  transition:border-color .35s ease, background .35s ease, box-shadow .35s ease, transform .35s cubic-bezier(.16,1,.3,1); 
}
.price-card:hover{ 
  border-color:rgba(146,187,255,.45); 
  background:linear-gradient(180deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.03) 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 26px 60px -22px rgba(66,123,216,.45);
  transform:translateY(-4px);
}
.price-card--pro{ 
  border-color:rgba(146,187,255,.55); 
  background:linear-gradient(145deg, rgba(30,52,105,0.72) 0%, rgba(10,18,44,0.85) 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.28), inset 0 -1px 0 rgba(146,187,255,.2), 0 0 0 1px rgba(146,187,255,.3), 0 26px 70px -20px rgba(66,123,216,.75); 
}
.price-card--pro::before{
  content:''; position:absolute; top:-1px; left:20%; right:20%; height:2px;
  background:linear-gradient(90deg, transparent, rgba(146,187,255,1) 50%, transparent);
  filter:blur(1px); z-index:3; pointer-events:none;
}
.price-card--pro::after{
  content:''; position:absolute; top:-15px; left:15%; right:15%; height:30px;
  background:radial-gradient(ellipse at 50% 0%, rgba(146,187,255,.5), transparent 75%);
  filter:blur(12px); z-index:0; pointer-events:none;
}
.price-card--pro:hover{
  border-color:rgba(197,235,255,.85);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.36), 0 0 0 1px rgba(146,187,255,.5), 0 32px 85px -16px rgba(66,123,216,.9);
}
.price-more{ font-size:11.5px; color:#92BBFF; margin-top:8px; font-weight:600; }
.price-detail-link{ display:block; text-align:center; font-size:12.5px; color:#92BBFF; text-decoration:none;
  margin-top:14px; padding-top:14px; border-top:1px solid rgba(255,255,255,.08); font-weight:600; transition:color .2s; }
.price-detail-link:hover{ color:#C5EBFF; }
.ads-card{ display:flex; align-items:center; justify-content:center; gap:24px; margin-top:24px; padding:30px 34px;
  background:linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.02) 100%);
  border:1px solid rgba(146,187,255,.22); border-radius:22px;
  backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.12), 0 20px 45px -25px rgba(66,123,216,.3);
  transition:border-color .3s, box-shadow .3s; }
.ads-card:hover{ border-color:rgba(146,187,255,.45); box-shadow:inset 0 1px 0 rgba(255,255,255,.2), 0 25px 60px -20px rgba(66,123,216,.5); }
.ads-card__icon{ width:54px; height:54px; border-radius:15px; flex-shrink:0;
  background:rgba(66,123,216,.18); border:1px solid rgba(146,187,255,.35);
  box-shadow:0 0 20px -4px rgba(66,123,216,.4);
  display:flex; align-items:center; justify-content:center; color:#C5EBFF; }
.ads-card__icon svg{ width:26px; height:26px; }
.ads-card__body{ text-align:center; }
.ads-card__body h3{ font-family:var(--display); font-size:19px; color:#fff; margin-bottom:6px; }
.ads-card__body p{ font-size:13.5px; color:var(--muted); line-height:1.55; margin-bottom:12px; max-width:560px; margin-left:auto; margin-right:auto; }
.ads-card__feats{ display:flex; flex-wrap:wrap; justify-content:center; gap:8px 16px; }
.ads-card__feats span{ font-size:12.5px; color:#92BBFF; font-weight:500; }

/* ---- servicios (resumen) ---- */
.svc-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-top:44px; }
.svc-card{ background:linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.015) 100%);
  border:1px solid rgba(146,187,255,.18); border-radius:20px;
  padding:14px; overflow:hidden; 
  backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.1), 0 16px 40px -25px rgba(0,0,0,.6);
  transition:border-color .35s,background .35s,box-shadow .35s,transform .35s cubic-bezier(.16,1,.3,1); }
.svc-card:hover{ border-color:rgba(146,187,255,.45); background:linear-gradient(180deg, rgba(146,187,255,.08) 0%, rgba(66,123,216,.03) 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.18), 0 22px 50px -20px rgba(66,123,216,.5); transform:translateY(-4px); }
.svc-card__image{ display:block; width:100%; height:126px; object-fit:cover; object-position:center; border-radius:13px;
  border:1px solid rgba(146,187,255,.18); background:#070b1c; filter:saturate(.9) contrast(1.04); transition:filter .35s ease,transform .45s cubic-bezier(.16,1,.3,1); }
.svc-card:hover .svc-card__image{ filter:saturate(1.12) contrast(1.08) brightness(1.06); transform:scale(1.03); }
.svc-card__body{ padding:16px 8px 8px; }
.svc-card h4{ font-family:var(--display); font-size:17px; color:#fff; margin-bottom:8px; }
.svc-card p{ font-size:13.5px; color:var(--muted); line-height:1.55; }

/* ---- calculadora ---- */
.calc-card{ margin-top:40px; display:grid; grid-template-columns:1fr 310px; gap:0;
  background:linear-gradient(135deg, rgba(255,255,255,.04) 0%, rgba(15,22,46,.5) 100%); 
  border:1px solid rgba(146,187,255,.24); border-radius:26px;
  backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
  overflow:hidden; box-shadow:inset 0 1px 0 rgba(255,255,255,.15), 0 0 70px -20px rgba(66,123,216,.38); min-height:400px; }
.calc-chips{ display:flex; flex-direction:column; gap:14px; padding:38px; }
.calc-chip{ display:flex; align-items:center; gap:16px; text-align:left; width:100%;
  padding:16px 22px; border-radius:16px; background:rgba(255,255,255,.03);
  border:1px solid rgba(255,255,255,.1); color:#dbe4ff; font-size:15px; font-family:var(--body);
  cursor:pointer; transition:border-color .25s ease, background .25s ease, transform .2s ease, box-shadow .25s ease; }
.calc-chip:hover{ border-color:rgba(146,187,255,.4); background:rgba(255,255,255,.06); transform:translateX(3px); }
.calc-chip--on{ 
  background:linear-gradient(90deg, rgba(66,123,216,.24) 0%, rgba(146,187,255,.12) 100%); 
  border-color:rgba(146,187,255,.6); color:#fff; 
  box-shadow:0 0 24px -6px rgba(66,123,216,.45), inset 0 1px 0 rgba(255,255,255,.2); 
}
.calc-chip__check{ width:26px; height:26px; border-radius:9px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
  background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.18); font-size:14px; color:var(--muted); transition:.25s; }
.calc-chip--on .calc-chip__check{ 
  background:linear-gradient(135deg,#427BD8,#92BBFF); 
  border-color:transparent; color:#05071A; font-weight:800;
  box-shadow:0 0 12px rgba(146,187,255,.6);
}
.calc-result{ 
  background:linear-gradient(180deg, rgba(66,123,216,.14) 0%, rgba(30,55,115,.22) 100%); 
  border-left:1px solid rgba(146,187,255,.22);
  padding:38px 30px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; height:100%;
  position:relative;
}
.calc-result::before{
  content:''; position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(circle at 50% 40%, rgba(146,187,255,.18), transparent 70%);
}
.calc-result__label{ font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px; font-weight:600; }
.calc-result__num{ font-family:var(--display); font-size:20px; color:#fff; filter:drop-shadow(0 2px 16px rgba(146,187,255,.35)); }
.calc-result__num b{ font-size:46px; display:block; line-height:1.1; font-weight:800; }
.calc-result__num span{ font-size:24px; color:#92BBFF; }
.calc-result__sub{ font-size:12.5px; color:var(--muted); margin:10px 0 24px; }
.calc-result .price-cta{ margin-top:0; width:100%; }
.ads-card .price-cta{ margin-top:0; }
.price-badge{ position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:linear-gradient(90deg,#3574e8,#82b4ff); color:#fff; font-size:11px; font-weight:700; padding:5px 16px; border-radius:999px; white-space:nowrap; box-shadow:0 4px 16px rgba(53,116,232,.5), inset 0 1px 0 rgba(255,255,255,.4); }
.price-label{ font-size:13.5px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px; }
.price-launch{ display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:700;
  letter-spacing:.06em; text-transform:uppercase; padding:4px 12px; border-radius:100px;
  background:rgba(255,180,0,.14); border:1px solid rgba(255,180,0,.4); color:#FFCB6B; margin-bottom:8px; }
.price-old{ font-size:15px; color:var(--muted); text-decoration:line-through; margin-bottom:4px; }
.contact-card{ position:relative; overflow:hidden; border-radius:30px; padding:68px 52px;
  background:linear-gradient(135deg, rgba(255,255,255,.05) 0%, rgba(20,28,62,.65) 100%); 
  border:1px solid rgba(146,187,255,.26);
  backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
  box-shadow:0 0 90px -25px rgba(66,123,216,.4), inset 0 1px 0 rgba(255,255,255,.16); }
@media(max-width:640px){ .contact-card{ padding:38px 22px; border-radius:22px; } }
.price-num{ font-family:var(--display); font-size:36px; font-weight:700; color:#fff; line-height:1; margin-bottom:6px; }
.price-num b{ font-size:46px; font-weight:800; }
.price-num span{ font-size:24px; color:#92BBFF; }
.price-num b:before{ content:''; }
.price-sub{ font-size:12.5px; color:var(--muted); margin-bottom:18px; }
.price-divider{ height:1px; background:linear-gradient(90deg, transparent, rgba(146,187,255,.25), transparent); margin-bottom:18px; }
.price-feat{ display:flex; align-items:flex-start; gap:9px; font-size:13.5px; color:var(--muted); padding:6px 0; line-height:1.45; }
.price-feat .ic{ width:19px; height:19px; font-size:11px; margin-top:1px; }
.price-cta{ display:block; margin-top:auto; padding:14px; border-radius:14px; 
  background:linear-gradient(180deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.03) 100%); 
  border:1px solid rgba(146,187,255,.22); color:#fff; font-size:14.5px; font-weight:600; text-align:center; text-decoration:none; 
  box-shadow:inset 0 1px 0 rgba(255,255,255,.15);
  transition:all .25s ease; }
.price-cta:hover{ 
  background:linear-gradient(180deg, rgba(146,187,255,.22) 0%, rgba(66,123,216,.18) 100%); 
  border-color:rgba(146,187,255,.55);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.25), 0 10px 25px -8px rgba(66,123,216,.5);
  transform:translateY(-2px);
}
.price-cta--pro{ 
  background:linear-gradient(135deg, rgba(66,123,216,.85) 0%, rgba(35,80,175,.75) 100%); 
  border-color:rgba(197,235,255,.6);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35), 0 14px 30px -10px rgba(66,123,216,.6);
}
.price-cta--pro:hover{ 
  background:linear-gradient(135deg, rgba(82,142,242,.95) 0%, rgba(45,95,200,.9) 100%); 
  box-shadow:inset 0 1px 0 rgba(255,255,255,.45), 0 18px 40px -8px rgba(66,123,216,.75);
}

/* strip dentro del hero (solo móvil) */
.hero__strip{ display:none; }
.hero__shot{ width:230px; height:129px; border-radius:12px; flex:none; overflow:hidden; border:1px solid rgba(255,255,255,.1); background:linear-gradient(135deg,#1b2650,#1c3060); display:flex; align-items:flex-end; padding:10px; position:relative; box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 24px 48px -20px rgba(0,0,0,.7); }
.hero__shot:nth-child(odd){ background:linear-gradient(135deg,#1a1b4b,#2d1f6e); }
.hero__shot:nth-child(even){ background:linear-gradient(135deg,#0d2b45,#1a4a7c); }
.hero__shot::after{ content:''; position:absolute; inset:0; z-index:0; background:linear-gradient(transparent 45%, rgba(5,7,26,.85)); pointer-events:none; }
.hero__shot b{ font-size:10px; color:#fff; font-weight:600; line-height:1.2; position:relative; z-index:1; }
.hero__shot img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; }

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
  background-image: url('assets/hero-bg-blue.webp');
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
.marquee__track{ display:flex; gap:22px; width:max-content;
  animation:marquee var(--dur,38s) linear infinite;
  will-change:transform; }
.marquee--rev .marquee__track, .marquee--right .marquee__track{ 
  animation:marqueeRight var(--dur,45s) linear infinite; 
  will-change:transform;
}
@keyframes marquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
@keyframes marqueeRight{ from{ transform:translateX(-50%); } to{ transform:translateX(0); } }

/* project strip cards */
.shot{
  width:320px; height:195px; border-radius:16px; flex:none; overflow:hidden;
  border:1px solid rgba(146,187,255,0.22); position:relative; isolation:isolate;
  background:rgba(10,14,35,0.85);
  display:flex; align-items:flex-end; padding:14px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.15), 0 20px 45px -18px rgba(0,0,0,0.8);
  transition:transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s;
}
.shot:hover{
  transform:translateY(-4px);
  border-color:rgba(146,187,255,0.55);
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.25), 0 26px 50px -18px rgba(66,123,216,0.45);
}
.shot__img{
  position:absolute; inset:0; z-index:1;
  width:100%; height:100%; object-fit:cover; object-position:center top;
  display:block; opacity:0.88;
  transition:opacity .4s ease, transform .6s cubic-bezier(.16,1,.3,1);
}
.shot:hover .shot__img{ opacity:1; transform:scale(1.05); }
.shot b{
  position:relative; z-index:2; font-size:13px; font-family:var(--display);
  color:#FFFFFF; font-weight:600;
  background:rgba(6, 9, 28, 0.82);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  padding:6px 14px;
  border-radius:100px;
  border:1px solid rgba(146, 187, 255, 0.4);
  box-shadow:0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18);
  letter-spacing:0.02em;
  transition:border-color .35s ease, transform .35s ease, background .35s ease;
}
.shot:hover b{
  border-color:rgba(197, 235, 255, 0.75);
  background:rgba(8, 12, 36, 0.95);
  transform:translateY(-2px);
}

/* brands */
.brand{ font-family:var(--display); font-weight:700; font-size:22px; color:#7E8BB5;
  white-space:nowrap; opacity:.8; transition:opacity .3s,color .3s; flex:none; }
.brands{ position:relative; }
.brands__glow{ position:absolute; inset:0; background:radial-gradient(ellipse at 50% 50%,rgba(40,72,140,.35),transparent 60%); pointer-events:none; }

/* ---- comparison ---- */
.cols{ display:grid; grid-template-columns:1fr 1fr; gap:26px; margin-top:48px; position:relative; }
.col{ border-radius:24px; padding:36px; border:1px solid rgba(146,187,255,.14);
  position:relative; overflow:hidden; isolation:isolate;
  background:rgba(10,14,34,.7);
  backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.12), 0 24px 50px -25px rgba(0,0,0,.6);
  transition:transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s; }
.col:hover{ transform:translateY(-4px); border-color:rgba(146,187,255,.3);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.18), 0 30px 60px -20px rgba(0,0,0,.7); }

/* ---- "Sin mí" column ---- */
.col--no{ 
  background:linear-gradient(180deg, rgba(22,14,30,0.65) 0%, rgba(12,8,20,0.85) 100%); 
  border-color:rgba(255,80,120,.18);
}
.col--no::after{ content:''; position:absolute; bottom:0; left:15%; right:15%; height:2px; z-index:3;
  background:linear-gradient(90deg, transparent, #ff3c8e 50%, transparent);
  box-shadow:0 0 16px 2px rgba(255,60,142,.6);
  pointer-events:none; }

/* ---- "Conmigo" column ---- */
.col--yes{ 
  background:linear-gradient(180deg, rgba(16,28,64,0.7) 0%, rgba(8,14,36,0.85) 100%); 
  border-color:rgba(146,187,255,.28);
  box-shadow:inset 0 1px 0 rgba(146,187,255,.25), 0 24px 60px -20px rgba(0,102,255,.3);
}
.col--yes::after{ content:''; position:absolute; bottom:0; left:15%; right:15%; height:2px; z-index:3;
  background:linear-gradient(90deg, transparent, #00D4FF 50%, transparent);
  box-shadow:0 0 16px 2px rgba(0,212,255,.6);
  pointer-events:none; }
/* vertical blue glow bar on the left side */
.col--yes .glow-side{ 
  position:absolute; top:12%; bottom:12%; left:0; width:3px; z-index:3;
  background:linear-gradient(180deg, transparent, #00D4FF 50%, transparent);
  box-shadow:0 0 12px 1px rgba(0,212,255,.8);
  pointer-events:none; }

.col h3{ font-family:var(--display); font-size:21px; margin-bottom:24px; font-weight:700; letter-spacing:-.01em; color:#fff; }
.row{ display:flex; gap:14px; align-items:flex-start; padding:14px 0; border-top:1px solid rgba(255,255,255,.07); color:var(--muted); font-size:15px; line-height:1.5; }
.ic{ width:24px;height:24px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:12px;font-weight:800; }
.ic--x{ background:rgba(255,70,90,.14); border:1px solid rgba(255,70,90,.3); color:#ff94a2; }
.ic--v{ background:rgba(0,212,255,.14); border:1px solid rgba(0,212,255,.45); color:#00D4FF; box-shadow:0 0 10px rgba(0,212,255,.35); }

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
  z-index: 11;
  background: radial-gradient(350px circle at var(--mx, 50%) var(--my, 50%), var(--sweep-color, rgba(142, 193, 255, 0.10)), transparent 70%);
  opacity: var(--hovered, 0);
  transition: opacity 0.5s ease;
}
.card-glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 12;
  background: radial-gradient(circle var(--glare-size, 280px) at var(--mx, 50%) var(--my, 50%), var(--glare-color, rgba(146, 187, 255, 0.22)), transparent 70%);
  mix-blend-mode: screen;
  border-radius: inherit;
  opacity: var(--hovered, 0);
  transition: opacity 0.3s cubic-bezier(.16,1,.3,1);
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
  max-width: 812px;
  margin: 52px auto 0;
  aspect-ratio: 1/1;
  overflow: hidden;
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
  padding: 32px 26px;
  gap: 12px;
  position: relative;
}
.hq__q.tl { justify-content: flex-end; align-items: flex-end; text-align: right; padding-right: 56px; padding-bottom: 56px; }
.hq__q.tr { justify-content: flex-end; align-items: flex-start; text-align: left;  padding-left: 56px;  padding-bottom: 56px; }
.hq__q.bl { justify-content: flex-start; align-items: flex-end; text-align: right; padding-right: 56px; padding-top: 56px; }
.hq__q.br { justify-content: flex-start; align-items: flex-start; text-align: left;  padding-left: 56px;  padding-top: 56px; }

.hq__icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(146,187,255,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
}
.hq__icon svg { width: 23px; height: 23px; opacity: 0.65; }
.hq__h {
  font-family: var(--display);
  font-size: 22px;
  font-weight: 600;
  color: #d4dcf5;
  line-height: 1.3;
}
.hq__p {
  font-size: 19px;
  color: var(--muted);
  line-height: 1.55;
  max-width: 290px;
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
  width: 175px;
  height: 175px;
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
.hq__ring:nth-child(1) { width: 235px; height: 235px; --r-dur: 35s; }
.hq__ring:nth-child(2) { width: 330px; height: 330px; --r-dur: 50s; }
.hq__ring:nth-child(3) { width: 445px; height: 445px; --r-dur: 70s; }
.hq__ring:nth-child(4) { width: 575px; height: 575px; --r-dur: 90s; }
.hq__ring:nth-child(5) { width: 715px; height: 715px; --r-dur: 110s; }

@keyframes ringRotate {
  from { transform: translate(-50%,-50%) rotate(0deg); }
  to   { transform: translate(-50%,-50%) rotate(360deg); }
}

/* Avatar circle with breathing neon glow */
.hq__ava {
  width: 175px;
  height: 175px;
  border-radius: 50%;
  overflow: hidden;
  border: 2.5px solid rgba(146,187,255,0.6);
  box-shadow: 0 0 0 12px rgba(66,123,216,0.15), 0 0 60px rgba(66,123,216,0.45);
  position: relative;
  z-index: 2;
  animation: avaPulse 6s ease-in-out infinite;
}
@keyframes avaPulse {
  0%, 100% { box-shadow: 0 0 0 12px rgba(66,123,216,0.15), 0 0 50px rgba(66,123,216,0.45); }
  50% { box-shadow: 0 0 0 18px rgba(66,123,216,0.22), 0 0 75px rgba(66,123,216,0.65); }
}
.hq__ava img { width: 100%; height: 100%; object-fit: cover;
  filter:grayscale(1) brightness(0.85);
  transition:filter .6s ease, transform .6s cubic-bezier(.16,1,.3,1); }
@media(hover:hover){ .hq__ava:hover img{ filter:grayscale(0) brightness(1); transform:scale(1.05); } }
@media(hover:none){ .hq__ava img{ filter:grayscale(0) brightness(1); } }

/* Scroll-driven rays moving inward along each axis */
.hq__ray {
  position: absolute;
  z-index: 1;
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
.case{ border-radius:18px; overflow:hidden; position:relative; aspect-ratio:16/9; isolation:isolate;
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
.q__ic{ flex:none; width:26px; height:26px; display:grid; place-items:center; transition:transform .3s, color .3s; }
.q.open .q__ic{ color:#92BBFF; transform:scale(1.1); }
.q__body p{ color:var(--muted); padding:0 22px 22px; font-size:15px; line-height:1.6; margin:0; }
.faq__cta{ text-align:center; margin-top:28px; color:var(--muted); font-size:15px; }
.faq__cta a{ color:#92BBFF; text-decoration:none; border-bottom:1px solid rgba(146,187,255,.4); transition:color .2s, border-color .2s; }
.faq__cta a:hover{ color:#fff; border-color:#fff; }

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

  /* --- COMPARACIÓN: apilada en 1 col, más legible --- */
  .cols{ grid-template-columns:1fr !important; gap:16px !important; }
  .shead h2{ font-size:clamp(18px,5.5vw,26px); line-height:1.15; }
  .shead .lead{ font-size:13px !important; }
  .col{ padding:20px; border-radius:16px; text-align:left; }
  .col h3{ font-size:17px; margin-bottom:14px; text-align:left; }
  .row{ font-size:14px; padding:9px 0; gap:8px; align-items:flex-start; line-height:1.4; }
  .ic{ width:20px; height:20px; font-size:12px; flex-shrink:0; margin-top:1px; }

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
    border-radius:14px; padding:18px 16px;
    gap:9px; align-items:flex-start; text-align:left;
  }
  .hq__q.tl,.hq__q.tr,.hq__q.bl,.hq__q.br{
    padding:18px 16px; align-items:flex-start; text-align:left;
  }
  .hq__h{ font-size:15px; line-height:1.3; }
  .hq__p{ font-size:13.5px; line-height:1.45; max-width:100%; }
  .hq__icon{ width:38px; height:38px; }
  .hq__icon svg{ width:19px; height:19px; }

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
  .svc-card{ padding:10px; }
  .svc-card__image{ height:84px; border-radius:10px; }
  .svc-card__body{ padding:12px 6px 8px; }
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
    background:rgba(6,9,26,.88); 
    backdrop-filter:blur(24px) saturate(160%); -webkit-backdrop-filter:blur(24px) saturate(160%);
    border-top:1px solid rgba(146,187,255,.24);
    box-shadow:0 -10px 30px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.12);
    padding:8px 4px calc(8px + env(safe-area-inset-bottom));
  }
  .dock::before{
    content:''; position:absolute; top:-1px; left:10%; right:10%; height:2px;
    background:linear-gradient(90deg, transparent, rgba(146,187,255,.95) 50%, transparent);
    filter:blur(0.5px);
    box-shadow:0 -2px 12px rgba(146,187,255,0.45);
    animation:dockGlow 3s ease-in-out infinite alternate;
    pointer-events:none;
  }
  @keyframes dockGlow{
    0% { opacity:0.6; transform:scaleX(0.85); }
    100% { opacity:1; transform:scaleX(1.1); }
  }
  .dock__btn{
    display:flex; flex-direction:column; align-items:center; gap:3px;
    padding:6px 2px; color:var(--muted); text-decoration:none;
    font-size:10.5px; font-weight:600; text-align:center;
    background:none; border:none; cursor:pointer; font-family:var(--body);
    transition:transform .15s ease, color .2s ease;
  }
  .dock__btn:active{ transform:scale(0.92); }
  .dock__btn svg{ width:20px; height:20px; transition:transform .2s ease; }
  .dock__btn:active svg{ transform:scale(1.1); }
  .dock__btn--main{ color:#92BBFF; }
  .dock__btn--main svg{ color:#92BBFF; filter:drop-shadow(0 0 6px rgba(146,187,255,.5)); }
  body{ padding-bottom:64px; }

}

/* Pantallas muy pequeñas (<340px) */
@media(max-width:340px){
  .hero h1{ font-size:24px; }
  .hq__grid{ grid-template-columns:1fr; }
}

/* ---- páginas de detalle de plan ---- */
.plan-page .nav{ position:sticky; top:0; }
.plan-main{ position:relative; z-index:2; padding:56px 24px 100px; display:flex; flex-direction:column; gap:90px; }
.plan-hero{ display:flex; gap:56px; align-items:center; flex-wrap:wrap; }
.plan-hero__text{ flex:1; min-width:320px; display:flex; flex-direction:column; gap:22px; }
.plan-hero__text .eyebrow{ width:fit-content; }
.plan-hero__text h1{ font-size:clamp(34px,5vw,52px); margin:0; }
.plan-hero__shot{ position:relative; flex:1; min-width:320px; border-radius:20px; overflow:hidden;
  border:1px solid rgba(255,255,255,.09); aspect-ratio:4/3;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.1), 0 24px 50px -30px rgba(0,0,0,.8);
  animation:float 6s ease-in-out infinite; }
.plan-hero__shot img{ width:100%; height:100%; object-fit:cover; object-position:top center; display:block; }
.plan-hero__shot::after{ content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(5,7,26,.85), transparent 55%); pointer-events:none; }
.plan-hero__shot-badge{ position:absolute; left:24px; bottom:24px; z-index:2; display:inline-flex; align-items:center; gap:10px;
  background:rgba(0,0,0,.5); backdrop-filter:blur(20px); padding:12px 20px; border-radius:999px;
  border:1px solid rgba(255,255,255,.1); color:#fff; font-size:14px; font-weight:600; }
.plan-hero__shot-badge .plan-feat-icon{ width:28px; height:28px; margin:0; background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.2); }
.plan-hero__shot-badge .plan-feat-icon svg{ width:14px; height:14px; }
@keyframes float{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-10px); } }

.plan-card{ position:relative; isolation:isolate; overflow:hidden; border-radius:20px; border:1px solid rgba(183,213,255,.16);
  background:linear-gradient(135deg,rgba(31,42,76,.6) 0%,rgba(12,18,42,.72) 48%,rgba(19,35,73,.52) 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(68,124,235,.09),0 18px 38px -26px rgba(0,0,0,.95),0 0 0 1px rgba(5,8,26,.36);
  backdrop-filter:blur(20px) saturate(135%); -webkit-backdrop-filter:blur(20px) saturate(135%);
  transform:perspective(900px) translateY(calc(var(--hovered,0) * -5px)) rotateX(var(--tilt-x,0deg)) rotateY(var(--tilt-y,0deg)); transform-style:preserve-3d;
  will-change:transform; transition:background .5s ease,border-color .5s ease,box-shadow .5s ease,transform .24s cubic-bezier(.16,1,.3,1); padding:32px; }
.plan-card::before{ content:''; position:absolute; z-index:0; inset:-45%; pointer-events:none; opacity:.78;
  background:radial-gradient(circle at 30% 28%,rgba(144,199,255,.19),transparent 17%),radial-gradient(circle at 71% 68%,rgba(66,118,255,.17),transparent 21%),radial-gradient(circle at 53% 45%,rgba(255,255,255,.08),transparent 13%);
  filter:blur(14px); transform:scale(1.04); transition:opacity .55s ease; }
.plan-card::after{ content:''; position:absolute; z-index:0; left:-12%; top:0; width:124%; height:48%; pointer-events:none;
  background:linear-gradient(118deg,transparent 11%,rgba(255,255,255,.13) 36%,rgba(205,235,255,.035) 51%,transparent 69%); opacity:.52; transform:translateY(-26%) skewX(-18deg); }
.plan-card:hover{ background:linear-gradient(135deg,rgba(45,73,131,.67),rgba(14,25,58,.8) 54%,rgba(34,70,139,.58));
  border-color:rgba(174,213,255,.48); box-shadow:inset 0 1px 0 rgba(255,255,255,.26),inset 0 -1px 0 rgba(99,160,255,.17),0 30px 65px -30px rgba(31,91,211,.78),0 0 38px -16px rgba(102,174,255,.52); }
.plan-card__glow{ position:absolute; inset:0; pointer-events:none; z-index:1;
  background:radial-gradient(340px circle at var(--mx,50%) var(--my,50%),rgba(194,226,255,.27),rgba(93,160,255,.12) 25%,transparent 66%);
  mix-blend-mode:screen; opacity:var(--hovered,0); transition:opacity .35s ease; }
.plan-card__border{ position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none; z-index:1;
  background:linear-gradient(120deg,transparent 25%,rgba(146,187,255,.55) 50%,transparent 75%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude;
  opacity:var(--hovered,.25); transition:opacity .5s; }
.plan-card__inner{ position:relative; z-index:2; display:block; transform:translateZ(18px); }
.plan-card h3{ font-family:var(--display); font-size:21px; font-weight:600; color:#fff; margin:0 0 10px; }
.plan-card h4{ font-family:var(--display); font-size:17px; font-weight:600; color:#E7ECFB; margin:0 0 8px; }
.plan-card p{ color:var(--muted); line-height:1.6; margin:0; font-size:15px; }
.plan-card--with-image{ padding:12px; }
.plan-card__image{ display:block; width:100%; height:152px; object-fit:cover; object-position:center; border-radius:12px;
  border:1px solid rgba(174,213,255,.16); background:#070b1c; filter:saturate(.82) contrast(1.03); transition:filter .4s ease,transform .5s cubic-bezier(.16,1,.3,1); }
.plan-card--with-image:hover .plan-card__image{ filter:saturate(1.04) contrast(1.06) brightness(1.05); transform:scale(1.018); }
.plan-card__content{ padding:22px 20px 18px; }
.plan-card__content h3{ margin-bottom:9px; }
.plan-card--template .plan-card__image{ height:auto; aspect-ratio:2.46/1; }
.plan-card--brand .plan-card__image{ height:auto; aspect-ratio:1.38/1; }
.plan-card--content .plan-card__image{ height:auto; aspect-ratio:1.54/1; }
.plan-card--contact .plan-card__image{ height:auto; aspect-ratio:2.15/1; }

.plan-feat-icon{ width:48px; height:48px; border-radius:13px; background:rgba(66,123,216,.14); border:1px solid rgba(146,187,255,.25);
  display:flex; align-items:center; justify-content:center; color:#92BBFF; margin-bottom:18px; flex-shrink:0; }
.plan-feat-icon svg{ width:20px; height:20px; }

.plan-price-pill .plan-card__inner{ display:flex; align-items:flex-end; gap:18px; }
.plan-price-pill{ padding:22px; }
.plan-price-pill__num{ font-family:var(--display); font-size:38px; font-weight:800; color:#fff; line-height:1; }
.plan-price-pill__num span{ font-size:20px; }
.plan-price-pill__meta{ display:flex; flex-direction:column; gap:3px; font-size:13px; color:var(--muted); }
.plan-price-pill__meta span:first-child{ color:#92BBFF; font-weight:600; }
.plan-price-pill--pro{ border-color:rgba(146,187,255,.32); background:linear-gradient(132deg,rgba(53,86,154,.64),rgba(13,23,55,.82) 52%,rgba(34,66,135,.62)); box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 22px 46px -28px rgba(58,124,255,.78),0 0 32px -18px rgba(110,183,255,.7); }
.plan-price-pill--pro .plan-price-pill__num{ font-size:44px; text-shadow:0 2px 20px rgba(186,220,255,.34); }

/* ---- NUEVO SHOWCASE HERO PLAN CRECIMIENTO ---- */
.growth-showcase-wrap {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  overflow: visible;
}
.growth-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 24px;
  border-bottom: 1px solid rgba(146, 187, 255, 0.12);
  margin-bottom: 36px;
}
.growth-top-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--display);
}
.growth-top-logo {
  font-weight: 800;
  font-size: 18px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}
.growth-top-logo span.badge-lw {
  background: linear-gradient(135deg, #0084FF, #00D4FF);
  color: #05071a;
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 900;
}
.growth-top-slogan {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-left: 1px solid rgba(146, 187, 255, 0.2);
  padding-left: 12px;
}
.growth-top-steps {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.growth-top-steps span.active-step {
  color: #C5EBFF;
  background: rgba(0, 132, 255, 0.16);
  border: 1px solid rgba(0, 212, 255, 0.4);
  padding: 4px 10px;
  border-radius: 6px;
  box-shadow: 0 0 14px rgba(0, 212, 255, 0.35);
}

.growth-grid {
  display: grid;
  grid-template-columns: 1.15fr 1.35fr 0.75fr;
  gap: 36px;
  align-items: center;
  position: relative;
}

/* Columna Izquierda */
.growth-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}
.growth-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #C5EBFF;
  background: rgba(66, 123, 216, 0.14);
  border: 1px solid rgba(146, 187, 255, 0.32);
  padding: 6px 14px;
  border-radius: 100px;
  width: fit-content;
  box-shadow: 0 0 16px -4px rgba(66, 123, 216, 0.35);
}
.growth-title {
  font-family: var(--display);
  font-size: clamp(38px, 4.4vw, 56px);
  font-weight: 800;
  line-height: 1.05;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  margin: 0;
}
.growth-subtitle {
  font-size: 19px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.35;
  margin: 0;
}
.growth-desc {
  font-size: 15px;
  color: var(--muted);
  line-height: 1.6;
  margin: 0 0 6px;
}
.growth-meta-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 8px 0;
}
.growth-meta-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: linear-gradient(180deg, rgba(20, 36, 75, 0.65) 0%, rgba(10, 18, 42, 0.8) 100%);
  border: 1px solid rgba(146, 187, 255, 0.24);
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 28px -10px rgba(0,0,0,0.5);
  backdrop-filter: blur(14px);
}
.growth-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.growth-meta-badge {
  font-size: 11px;
  font-weight: 700;
  color: #C5EBFF;
  background: rgba(66, 123, 216, 0.32);
  border: 1px solid rgba(146, 187, 255, 0.35);
  padding: 3px 8px;
  border-radius: 6px;
}
.growth-meta-icon-mini {
  color: #92BBFF;
  opacity: 0.85;
}
.growth-meta-icon-mini svg { width: 16px; height: 16px; }
.growth-meta-body { display: flex; flex-direction: column; gap: 3px; }
.growth-meta-body b { font-family: var(--display); font-size: 22px; color: #FFFFFF; line-height: 1.15; font-weight: 800; }
.growth-meta-body span.sub { font-size: 12px; color: var(--muted); line-height: 1.4; }

.growth-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #0077FF 0%, #0052E0 100%);
  color: #FFFFFF;
  font-family: var(--body);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 16px 32px;
  border-radius: 100px;
  border: 1px solid rgba(146, 215, 255, 0.55);
  box-shadow: 0 12px 32px -6px rgba(0, 102, 255, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease, filter 0.2s;
  cursor: pointer;
}
.growth-cta-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 18px 40px -4px rgba(0, 102, 255, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  filter: brightness(1.08);
}
.growth-trust-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.growth-trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--txt);
  font-weight: 500;
}
.growth-trust-item span.ic-chk {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 132, 255, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.5);
  color: #38BDF8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10.5px;
  font-weight: 900;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
}

/* Columna Central - Mockups */
.growth-center {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
}
.growth-note-top {
  position: absolute;
  top: -36px;
  right: 20%;
  font-family: 'Caveat', 'Comic Sans MS', cursive, sans-serif;
  font-style: italic;
  font-size: 19px;
  color: #38BDF8;
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: none;
  z-index: 10;
  text-shadow: 0 0 12px rgba(0, 212, 255, 0.4);
}
.growth-note-top svg { width: 24px; height: 24px; color: #38BDF8; }

.growth-mockup-stage {
  position: relative;
  width: 100%;
  perspective: 1200px;
}
.growth-tablet {
  width: 92%;
  background: #090d20;
  border: 3px solid #1c264a;
  border-radius: 24px;
  box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.85), 0 0 50px -10px rgba(0, 102, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.2);
  overflow: hidden;
  position: relative;
  transform: rotateY(-6deg) rotateX(4deg);
  transition: transform 0.5s cubic-bezier(.16,1,.3,1);
}
.growth-tablet:hover {
  transform: rotateY(-2deg) rotateX(2deg) translateY(-4px);
}
.tablet-screen {
  background: linear-gradient(180deg, #0e152f 0%, #080c1e 100%);
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tablet-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.tablet-logo { font-size: 12px; font-weight: 800; color: #fff; font-family: var(--display); }
.tablet-links { display: flex; gap: 10px; font-size: 9px; color: var(--muted); }
.tablet-cta { font-size: 9px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 3px 8px; color: #fff; }

.tablet-hero-box {
  background: radial-gradient(circle at 50% 30%, rgba(30, 60, 130, 0.35), transparent 70%), rgba(255,255,255,0.02);
  border: 1px solid rgba(146, 187, 255, 0.15);
  border-radius: 14px;
  padding: 20px 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tablet-pill {
  align-self: flex-start;
  font-size: 9px;
  font-weight: 700;
  color: #92BBFF;
  background: rgba(66, 123, 216, 0.2);
  border: 1px solid rgba(146, 187, 255, 0.3);
  padding: 2px 8px;
  border-radius: 100px;
}
.tablet-hero-box h4 { font-family: var(--display); font-size: 18px; color: #fff; margin: 0; font-weight: 700; line-height: 1.2; }
.tablet-hero-box p { font-size: 11px; color: var(--muted); margin: 0; line-height: 1.4; max-width: 240px; }
.tablet-btn-small {
  align-self: flex-start;
  font-size: 10px;
  font-weight: 600;
  background: #0084FF;
  color: #fff;
  border: none;
  border-radius: 100px;
  padding: 6px 14px;
  margin-top: 4px;
}
.tablet-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.tablet-metric-item { display: flex; flex-direction: column; gap: 2px; }
.tablet-metric-item b { font-size: 12px; color: #fff; font-family: var(--display); }
.tablet-metric-item span { font-size: 8.5px; color: var(--muted); }

/* Phone Mockup */
.growth-phone {
  position: absolute;
  right: -10px;
  bottom: -24px;
  width: 215px;
  background: #050716;
  border: 3.5px solid #25335e;
  border-radius: 28px;
  box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 40px -5px rgba(0, 132, 255, 0.45);
  overflow: hidden;
  z-index: 5;
  transform: rotateY(-3deg) rotateX(2deg);
  transition: transform 0.4s cubic-bezier(.16,1,.3,1);
}
.growth-phone:hover {
  transform: translateY(-6px) scale(1.03);
}
.phone-screen {
  padding: 14px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(180deg, #0c1228 0%, #050816 100%);
}
.phone-header {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  font-family: var(--display);
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding-bottom: 6px;
}
.phone-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(146, 187, 255, 0.2);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.phone-card-title { font-size: 11px; font-weight: 700; color: #fff; }
.phone-card-sub { font-size: 9px; color: var(--muted); line-height: 1.3; }
.phone-days {
  display: flex;
  gap: 3px;
  justify-content: space-between;
  margin: 4px 0;
}
.phone-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 8px;
  color: var(--muted);
  padding: 3px 2px;
  border-radius: 6px;
  flex: 1;
}
.phone-day b { font-size: 9px; color: #dbe4ff; }
.phone-day.active {
  background: #0084FF;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 132, 255, 0.6);
}
.phone-day.active b { color: #fff; }
.phone-times {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}
.phone-time {
  font-size: 8px;
  color: #C5EBFF;
  background: rgba(255,255,255,0.05);
  border: 0.5px solid rgba(255,255,255,0.12);
  border-radius: 5px;
  padding: 3px;
  text-align: center;
}
.phone-time:first-child { border-color: rgba(0, 132, 255, 0.5); background: rgba(0, 132, 255, 0.15); }
.phone-btn {
  background: #0084FF;
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  border: none;
  border-radius: 100px;
  padding: 7px;
  width: 100%;
  box-shadow: 0 4px 14px rgba(0, 132, 255, 0.5);
  cursor: pointer;
}
.phone-secure { font-size: 7.5px; color: var(--muted); text-align: center; }

/* Columna Derecha - Tarjetas de métricas */
.growth-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  align-items: stretch;
}
.growth-arrow-svg {
  position: absolute;
  right: -20px;
  top: -40px;
  width: 160px;
  height: 240px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.85;
}
.growth-stat-card {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: linear-gradient(135deg, rgba(16, 32, 70, 0.75) 0%, rgba(8, 16, 40, 0.88) 100%);
  border: 1px solid rgba(146, 187, 255, 0.22);
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 16px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px -8px rgba(0, 132, 255, 0.25), inset 0 1px 0 rgba(255,255,255,0.14);
  backdrop-filter: blur(16px);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.growth-stat-card:hover {
  transform: translateX(4px) translateY(-2px);
  border-color: rgba(146, 187, 255, 0.5);
  box-shadow: 0 20px 50px -12px rgba(0, 132, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.25);
}
.growth-stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.growth-stat-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--txt);
}
.growth-stat-icon-mini {
  color: #92BBFF;
  opacity: 0.85;
}
.growth-stat-icon-mini svg { width: 16px; height: 16px; }
.growth-stat-num {
  font-family: var(--display);
  font-size: 26px;
  font-weight: 800;
  color: #38BDF8;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.growth-stat-desc {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.3;
}

.growth-note-bot {
  font-family: 'Caveat', 'Comic Sans MS', cursive, sans-serif;
  font-style: italic;
  font-size: 18px;
  color: #38BDF8;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  align-self: flex-start;
  text-shadow: 0 0 12px rgba(0, 212, 255, 0.35);
}
.growth-note-bot svg { width: 22px; height: 22px; color: #38BDF8; }

/* Barra de 5 Pilares Inferior */
.growth-pillars-bar {
  margin-top: 48px;
  background: linear-gradient(180deg, rgba(20, 36, 75, 0.55) 0%, rgba(10, 18, 42, 0.75) 100%);
  border: 1px solid rgba(146, 187, 255, 0.25);
  border-radius: 24px;
  padding: 24px 30px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 50px -20px rgba(0,0,0,0.6);
  backdrop-filter: blur(16px);
}
.growth-pillar-item {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
}
.growth-pillar-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 132, 255, 0.18);
  border: 1px solid rgba(0, 212, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00D4FF;
  flex-shrink: 0;
  box-shadow: 0 0 14px -2px rgba(0, 132, 255, 0.35);
}
.growth-pillar-icon svg { width: 20px; height: 20px; }
.growth-pillar-text { display: flex; flex-direction: column; gap: 2px; }
.growth-pillar-text b { font-family: var(--display); font-size: 14.5px; color: #fff; font-weight: 700; line-height: 1.2; }
.growth-pillar-text span { font-size: 11.5px; color: var(--muted); line-height: 1.3; }

/* Responsive adjustments */
@media(max-width: 1024px) {
  .growth-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .growth-pillars-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media(max-width: 640px) {
  .growth-meta-row {
    grid-template-columns: 1fr;
  }
  .growth-pillars-bar {
    grid-template-columns: 1fr;
    padding: 20px 16px;
    gap: 16px;
  }
  .growth-top-steps {
    display: none;
  }
  .growth-tablet {
    width: 100%;
    transform: none;
  }
  .growth-phone {
    position: relative;
    right: auto;
    bottom: auto;
    width: 100%;
    max-width: 260px;
    margin: 16px auto 0;
    transform: none;
  }
}

.plan-cta-row{ display:flex; gap:16px; flex-wrap:wrap; align-items:center; }
.plan-btn-ghost{ display:inline-flex; align-items:center; gap:10px; text-decoration:none; color:#E7ECFB; font-weight:500;
  padding:16px 30px; border-radius:100px; background:rgba(255,255,255,.05); border:.5px solid rgba(255,255,255,.08);
  transition:transform .2s,background .2s; }
.plan-btn-ghost:hover{ transform:scale(1.02); background:rgba(255,255,255,.08); }
.plan-btn-ghost .plan-feat-icon{ width:24px; height:24px; margin:0; background:none; border:none; }
.plan-btn-ghost .plan-feat-icon svg{ width:16px; height:16px; }

/* ---- Bento & Feature Enhancements for Plan Crecimiento ---- */
.growth-feat-hero-inner {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 32px;
  align-items: center;
}
.growth-feat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.growth-feat-icon-glow {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(0, 132, 255, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00D4FF;
  flex-shrink: 0;
  box-shadow: 0 0 18px rgba(0, 132, 255, 0.4);
}
.growth-feat-icon-glow svg { width: 24px; height: 24px; }
.growth-feat-badge {
  font-size: 11px;
  font-weight: 700;
  color: #C5EBFF;
  background: rgba(66, 123, 216, 0.28);
  border: 1px solid rgba(146, 187, 255, 0.35);
  padding: 3px 10px;
  border-radius: 100px;
}
.growth-feat-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}
.growth-feat-pill {
  font-size: 11.5px;
  font-weight: 600;
  color: #C5EBFF;
  background: rgba(146, 187, 255, 0.08);
  border: 1px solid rgba(146, 187, 255, 0.2);
  padding: 5px 12px;
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.growth-mini-widget {
  background: linear-gradient(180deg, rgba(14, 24, 56, 0.8) 0%, rgba(6, 11, 28, 0.95) 100%);
  border: 1px solid rgba(146, 187, 255, 0.28);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
.growth-mini-widget-title {
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.growth-mini-cal-row {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}
.growth-mini-cal-day {
  flex: 1;
  text-align: center;
  padding: 6px 2px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-size: 10px;
  color: var(--muted);
}
.growth-mini-cal-day.active {
  background: #0077FF;
  border-color: #00D4FF;
  color: #FFFFFF;
  box-shadow: 0 0 12px rgba(0, 119, 255, 0.6);
}
.growth-mini-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.growth-mini-slot {
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  padding: 6px 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(146, 187, 255, 0.16);
  border-radius: 6px;
  color: #C5EBFF;
}
.growth-mini-slot.active {
  background: rgba(0, 212, 255, 0.2);
  border-color: #00D4FF;
  color: #FFFFFF;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
}

.growth-feature-card {
  padding: 32px;
}
.growth-feature-card h3 {
  font-size: 21px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 14px 0 8px;
}
.growth-feature-card p {
  font-size: 14.5px;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}
.growth-card-preview-bar {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Checklist de Esenciales */
.growth-essentials-wrap {
  margin-top: 40px;
  background: linear-gradient(180deg, rgba(16, 28, 62, 0.65) 0%, rgba(8, 14, 36, 0.85) 100%);
  border: 1px solid rgba(146, 187, 255, 0.24);
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 20px 50px -20px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
}
.growth-essentials-title {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 24px;
}
.growth-essentials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.growth-essential-card {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(146, 187, 255, 0.16);
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #E7ECFB;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.growth-essential-card:hover {
  transform: translateY(-2px);
  border-color: rgba(146, 187, 255, 0.45);
  background: rgba(255, 255, 255, 0.065);
}
.growth-essential-card span.chk {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 132, 255, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.45);
  color: #00D4FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.35);
}

/* CTA Final Plan Crecimiento */
.growth-final-box {
  margin-top: 48px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(24, 48, 105, 0.75) 0%, rgba(10, 20, 52, 0.95) 100%);
  border: 1px solid rgba(146, 187, 255, 0.4);
  border-radius: 28px;
  padding: 56px 28px;
  text-align: center;
  box-shadow: 0 30px 80px -25px rgba(0, 102, 255, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
}
.growth-final-box::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00D4FF 50%, transparent);
  filter: blur(1px);
  pointer-events: none;
}
.growth-final-title {
  font-family: var(--display);
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: -0.01em;
  margin-bottom: 14px;
}
.growth-final-desc {
  font-size: 17px;
  color: var(--muted);
  max-width: 580px;
  margin: 0 auto 32px;
  line-height: 1.6;
}
.growth-final-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 24px;
  font-size: 13px;
  color: #C5EBFF;
}
.growth-final-trust span { display: inline-flex; align-items: center; gap: 6px; }

@media(max-width: 768px) {
  .growth-feat-hero-inner { grid-template-columns: 1fr; }
  .growth-essentials-grid { grid-template-columns: 1fr; }
  .growth-essentials-wrap { padding: 24px 18px; }
  .growth-final-box { padding: 40px 20px; }
}

.plan-grid{ display:grid; grid-template-columns:repeat(12,1fr); gap:20px; margin-top:16px; }
.plan-span-4{ grid-column:span 4; } .plan-span-5{ grid-column:span 5; } .plan-span-6{ grid-column:span 6; }
.plan-span-7{ grid-column:span 7; } .plan-span-8{ grid-column:span 8; } .plan-span-12{ grid-column:span 12; }

.plan-included-box{ background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); border-radius:20px; padding:36px; }
.plan-included-box h4{ font-size:13px; font-weight:600; color:var(--muted); margin:0 0 24px; text-align:center;
  font-family:var(--display); letter-spacing:.06em; text-transform:uppercase; }
.plan-included-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
.plan-included-grid div{ display:flex; align-items:center; gap:10px; color:var(--muted); font-size:14px; font-weight:500; }
.plan-included-grid span{ width:24px; height:24px; border-radius:50%; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
  display:flex; align-items:center; justify-content:center; color:#92BBFF; font-weight:700; flex-shrink:0; }

.plan-highlight-card{ grid-column:span 5; position:relative; overflow:hidden;
  background:linear-gradient(135deg,rgba(66,123,216,.85),rgba(40,90,180,.85)); border:1px solid rgba(146,187,255,.3);
  border-radius:20px; padding:36px; display:flex; flex-direction:column; align-items:center; text-align:center; justify-content:center;
  box-shadow:0 0 60px -25px rgba(66,123,216,.5); }
.plan-highlight-card .plan-feat-icon{ background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.2); color:#fff; width:60px; height:60px; }
.plan-highlight-card h3{ color:#fff; }
.plan-highlight-card p{ color:rgba(255,255,255,.9); margin-bottom:20px; }
.plan-highlight-cta{ text-decoration:none; width:100%; color:#050505; font-weight:600; background:linear-gradient(180deg,#fff,#F5F9FF);
  padding:14px; border-radius:100px; display:block; transition:transform .2s; }
.plan-highlight-cta:hover{ transform:scale(1.02); }

.plan-pill-row{ display:flex; gap:8px; flex-wrap:wrap; margin-top:14px; }
.plan-pill-row span{ background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.15); padding:6px 12px; border-radius:10px; font-size:12px; }

.plan-price-table .plan-card__inner{ display:block; }
.plan-price-table__row{ display:flex; justify-content:space-between; padding-bottom:18px; border-bottom:1px solid rgba(255,255,255,.1); margin-bottom:18px; }
.plan-price-table__row div{ display:flex; flex-direction:column; gap:5px; }
.plan-price-table__row span{ color:var(--muted); font-size:11px; text-transform:uppercase; font-weight:600; }
.plan-price-table__row b{ color:#E7ECFB; font-size:16px; }
.plan-price-table__amt{ font-size:24px; color:#fff; }

@media(max-width:768px){
  .plan-main{ padding:40px 16px 70px; gap:56px; }
  .plan-hero{ gap:28px; }
  .plan-grid{ gap:12px; }
  .plan-span-4,.plan-span-5,.plan-span-6,.plan-span-7,.plan-span-8,.plan-span-12{ grid-column:span 12; }
  .plan-highlight-card{ grid-column:span 12; }
  .plan-included-grid{ grid-template-columns:1fr 1fr; }
  .plan-card{ padding:24px; }
  .plan-card--with-image{ padding:10px; }
  .plan-card__image{ height:126px; border-radius:11px; }
  .plan-card--template .plan-card__image,.plan-card--brand .plan-card__image,.plan-card--content .plan-card__image,.plan-card--contact .plan-card__image{ height:126px; aspect-ratio:auto; }
  .plan-card__content{ padding:18px 14px 14px; }
}

/* ---- páginas legales ---- */
.legal-page{ max-width:760px; margin:0 auto; text-align:center; }
.legal-page__body{ text-align:left; }
.legal-page__body h3{ font-family:var(--display); font-size:19px; color:#fff; margin:32px 0 12px; }
.legal-page__body h3:first-child{ margin-top:0; }
.legal-page__body p{ color:var(--muted); line-height:1.7; font-size:15px; margin-bottom:14px; }
.legal-page__body ul{ color:var(--muted); line-height:1.7; font-size:15px; margin:0 0 14px 20px; }
.legal-page__body li{ margin-bottom:6px; }
.legal-page__body strong{ color:#dbe4ff; }
.legal-page__body a{ color:#92BBFF; }

/* ---- aviso de cookies ---- */
.cookie-banner{ position:fixed; left:16px; right:16px; bottom:16px; z-index:70; max-width:560px; margin:0 auto;
  display:flex; align-items:center; gap:16px; flex-wrap:wrap;
  background:rgba(10,13,36,.95); backdrop-filter:blur(16px); border:1px solid rgba(146,187,255,.2);
  border-radius:16px; padding:18px 20px; box-shadow:0 20px 50px -20px rgba(0,0,0,.7); }
.cookie-banner p{ flex:1; min-width:200px; font-size:13px; color:var(--muted); line-height:1.5; margin:0; }
.cookie-banner p a{ color:#92BBFF; text-decoration:underline; }
.cookie-banner__btn{ flex-shrink:0; background:linear-gradient(180deg,#fff,#F5F9FF); color:#050505; font-weight:600;
  font-size:13px; padding:10px 20px; border-radius:100px; border:none; cursor:pointer; }
@media(max-width:640px){
  .cookie-banner{ left:10px; right:10px; bottom:80px; padding:14px 16px; flex-direction:column; align-items:stretch; text-align:left; }
  .cookie-banner__btn{ width:100%; }
/* ---- 10 MEJORAS VISUALES Y ESTRUCTURALES ---- */
/* 1. Barra de Garantías y Tranquilidad */
.guarantees-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(146,187,255,0.03) 100%);
  border: 1px solid rgba(146,187,255,0.22);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 16px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
}
.guarantee-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.guarantee-icon {
  font-size: 24px;
  background: rgba(146,187,255,0.12);
  border: 1px solid rgba(146,187,255,0.25);
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.guarantee-item strong {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 4px;
}
.guarantee-item p {
  font-size: 12.5px;
  color: var(--muted);
  line-height: 1.45;
  margin: 0;
}
@media(max-width:960px){
  .guarantees-bar { grid-template-columns: repeat(2, 1fr); padding: 20px; }
}
@media(max-width:580px){
  .guarantees-bar { grid-template-columns: 1fr; gap: 18px; padding: 18px; }
}

/* 2. Grid de Sectores y Audiencia */
.audience-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 36px;
}
.audience-card {
  position: relative;
  background: linear-gradient(180deg, rgba(14,22,52,0.6) 0%, rgba(8,12,32,0.6) 100%);
  border: 1px solid rgba(146,187,255,0.14);
  border-radius: 18px;
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.audience-card:hover {
  transform: translateY(-4px);
  border-color: rgba(146,187,255,0.35);
  box-shadow: 0 14px 30px -10px rgba(26,115,232,0.25);
}
.audience-card__icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: inline-block;
}
.audience-card h3 {
  font-size: 17px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 10px;
}
.audience-card p {
  font-size: 13.5px;
  color: var(--muted);
  line-height: 1.55;
  flex: 1;
  margin-bottom: 16px;
}
.audience-card__tag {
  align-self: flex-start;
  font-size: 11.5px;
  font-weight: 600;
  color: #92BBFF;
  background: rgba(66,123,216,0.16);
  border: 1px solid rgba(146,187,255,0.25);
  padding: 4px 10px;
  border-radius: 100px;
}
@media(max-width:960px){
  .audience-grid { grid-template-columns: repeat(2, 1fr); }
}
@media(max-width:580px){
  .audience-grid { grid-template-columns: 1fr; }
}

/* 3. Filtros interactivos de FAQ */
.faq-filters {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.faq-filter-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(146,187,255,0.15);
  color: var(--muted);
  font-size: 13.5px;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.faq-filter-btn:hover {
  color: #FFFFFF;
  background: rgba(255,255,255,0.1);
  border-color: rgba(146,187,255,0.3);
}
.faq-filter-btn--active {
  background: linear-gradient(135deg, rgba(66,123,216,0.4) 0%, rgba(146,187,255,0.2) 100%);
  border-color: #92BBFF;
  color: #FFFFFF;
  box-shadow: 0 0 16px rgba(66,123,216,0.3);
}

/* 4. Timeline y detalles de la calculadora */
.calc-result__timeline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.25);
  color: #C5EBFF;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 12px;
}

/* 5. Botón Flotante WhatsApp */
.floating-whatsapp {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 60;
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  box-shadow: 0 10px 25px rgba(37,211,102,0.4);
  text-decoration: none;
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
}
.floating-whatsapp:hover {
  transform: scale(1.1);
  box-shadow: 0 14px 32px rgba(37,211,102,0.6);
}
.floating-whatsapp__pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid #25D366;
  opacity: 0.6;
  animation: waPulse 2s ease-out infinite;
  pointer-events: none;
}
@keyframes waPulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}
.floating-whatsapp__tooltip {
  position: absolute;
  right: 64px;
  white-space: nowrap;
  background: rgba(10,14,35,0.95);
  color: #FFFFFF;
  font-size: 12.5px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(146,187,255,0.2);
  pointer-events: none;
  opacity: 0;
  transform: translateX(10px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.floating-whatsapp:hover .floating-whatsapp__tooltip {
  opacity: 1;
  transform: translateX(0);
}
/* 6. Fusión de Sectores y Proyectos Reales */
.sector-nav-tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 28px;
  margin-bottom: 34px;
}
.sector-tab-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(146, 187, 255, 0.16);
  color: var(--muted);
  font-size: 13.5px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
}
.sector-tab-btn:hover {
  color: #FFFFFF;
  background: rgba(146, 187, 255, 0.12);
  border-color: rgba(146, 187, 255, 0.35);
}
.sector-tab-btn--active {
  background: linear-gradient(135deg, rgba(66, 123, 216, 0.45) 0%, rgba(0, 212, 255, 0.2) 100%);
  border-color: #92BBFF;
  color: #FFFFFF;
  box-shadow: 0 0 20px rgba(66, 123, 216, 0.35);
}
.sector-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.sector-project-card {
  background: linear-gradient(180deg, rgba(16, 24, 60, 0.7) 0%, rgba(8, 12, 32, 0.8) 100%);
  border: 1px solid rgba(146, 187, 255, 0.18);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 16px 36px -15px rgba(0, 0, 0, 0.6);
}
.sector-project-card:hover {
  transform: translateY(-6px);
  border-color: rgba(146, 187, 255, 0.45);
  box-shadow: 0 22px 50px -15px rgba(0, 102, 255, 0.35);
}
.sector-project-card__media {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: #030616;
}
.sector-project-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}
.sector-project-card:hover .sector-project-card__media img {
  transform: scale(1.04);
}
.sector-project-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(6, 10, 28, 0.85);
  border: 1px solid rgba(146, 187, 255, 0.3);
  color: #C5EBFF;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 100px;
  backdrop-filter: blur(8px);
}
.sector-project-card__body {
  padding: 22px 20px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.sector-project-card__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}
.sector-project-card__header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}
.sector-project-card__location {
  font-size: 12px;
  color: var(--muted);
}
.sector-project-card__desc {
  font-size: 13.5px;
  color: var(--muted);
  line-height: 1.55;
  margin-bottom: 16px;
  flex: 1;
}
.sector-project-card__result {
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.22);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.sector-project-card__metric {
  font-size: 14px;
  font-weight: 800;
  color: #00D4FF;
}
.sector-project-card__time {
  font-size: 11.5px;
  color: #C5EBFF;
}
.sector-project-card__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 11px 16px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(146, 187, 255, 0.22);
  color: #FFFFFF;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
}
.sector-project-card__cta:hover {
  background: linear-gradient(135deg, rgba(66, 123, 216, 0.4) 0%, rgba(0, 212, 255, 0.2) 100%);
  border-color: #92BBFF;
}
@media(max-width:960px){
  .sector-grid { grid-template-columns: repeat(2, 1fr); }
}
@media(max-width:640px){
  .sector-grid { grid-template-columns: 1fr; }
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
  return null;
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
      <span className="card-glare" />
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

function ServiceCard({ label, badge, launch, old, num, suffix, sub, feats, cta, pro, delay, detailHref }) {
  return (
    <Reveal delay={delay} className={`price-card ${pro ? "price-card--pro" : ""}`}>
      {badge && <div className="price-badge">{badge}</div>}
      <div className="price-label">{label}</div>
      {launch && <div className="price-launch">{launch}</div>}
      {old && <div className="price-old"><s>{old}</s></div>}
      <div className="price-num">{!suffix && "desde "}<b>{num}{suffix ? "" : <span>€</span>}</b>{suffix && <span style={{fontSize:16}}>{suffix}</span>}</div>
      <div className="price-sub">{sub}</div>
      <div className="price-divider" />
      {feats.map((f,i)=>(
        <div key={i} className="price-feat"><span className="ic ic--v" style={{flexShrink:0}}>✓</span>{f}</div>
      ))}
      {detailHref ? (
        <Link to={detailHref} className={`price-cta ${pro ? "price-cta--pro" : ""}`}>{cta}</Link>
      ) : (
        <a href={homeHref("#contact")} className={`price-cta ${pro ? "price-cta--pro" : ""}`}>{cta}</a>
      )}
    </Reveal>
  );
}

function Btn({ glossy = false, children, href = "#", to = null, className = "", ...rest }) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const Tag = to ? Link : "a";
  const navProp = to ? { to } : { href };

  return (
    <Tag
      {...navProp}
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
    </Tag>
  );
}

/* ---------- data ---------- */
const BRANDS = ["Barberías & Estética", "Clínicas de Salud", "Fisioterapia", "Despachos & Asesorías", "Hoteles Rurales", "Restaurantes", "Comercio Local", "Talleres & Reformas"];
const PROJECTS = [
  { n: "Barbería El Cid",       img: "assets/proj-hotel.webp"        },
  { n: "Clínica San Marcos",    img: "assets/proj-properties.webp"   },
  { n: "Lex Asesores León",     img: "assets/proj-novaest.webp"      },
  { n: "Nova Estética",         img: "assets/proj-lexleon.webp"      },
  { n: "Inmobiliaria Leonesa",  img: "assets/proj-actualizaria.webp" },
  { n: "Casona El Curueño",     img: "assets/proj-powerpulse.webp"   },
];
const CASES = [
  { 
    id: "barberia",
    n: "VIP Barber Shop",   
    sector: "Barbería & Estética",
    loc: "León centro",
    img: "assets/proj-hotel.webp",         
    url: "#contact", 
    tag: "Reservas 24/7 · Bizum",
    desc: "Agenda online sincronizada con Google Calendar y pagos integrados. Los clientes reservan en 30 segundos sin llamadas.",
    metric: "+40 reservas/mes",        
    time: "Entregada en 10 días",
    cta: "Quiero una web para mi barbería →",
    glare: "rgba(146,187,255,0.16)", 
    sweep: "rgba(146,187,255,0.05)" 
  },
  { 
    id: "clinica",
    n: "Clínica Dental Nova",      
    sector: "Clínicas & Fisioterapia",
    loc: "Ponferrada",
    img: "assets/proj-lexleon.webp",       
    url: "#contact", 
    tag: "Citas + Confianza médica",
    desc: "Presentación de especialidades médicas, cuadro de doctores y botón de cita directa por WhatsApp con ficha de paciente.",
    metric: "100% citas canalizadas",        
    time: "Entregada en 12 días",
    cta: "Quiero una web para mi clínica →",
    glare: "rgba(255,182,193,0.16)", 
    sweep: "rgba(255,182,193,0.05)" 
  },
  { 
    id: "hotel",
    n: "Hotel Rural Casona Real", 
    sector: "Hoteles & Restaurantes",
    loc: "Astorga",
    img: "assets/proj-powerpulse.webp", 
    url: "#contact", 
    tag: "Venta directa sin comisiones",
    desc: "Motor de reservas directas con pasarela segura, galería fotográfica inmersiva y carta digital para el restaurante.",
    metric: "+65% reservas directas",  
    time: "Entregada en 14 días",
    cta: "Quiero una web para mi hotel/restaurante →",
    glare: "rgba(129,140,248,0.16)", 
    sweep: "rgba(129,140,248,0.05)" 
  },
  { 
    id: "asesoria",
    n: "Lex Asesores León",      
    sector: "Despachos & Asesorías",
    loc: "León",
    img: "assets/proj-novaest.webp",       
    url: "#contact", 
    tag: "Autoridad B2B & Captación",
    desc: "Portal corporativo con calculadora de presupuestos para autónomos y empresas, optimizado para posicionamiento local.",
    metric: "Top 3 en Google León",           
    time: "Entregada en 9 días",
    cta: "Quiero una web para mi despacho →",
    glare: "rgba(245,222,179,0.15)", 
    sweep: "rgba(245,222,179,0.04)" 
  },
  { 
    id: "inmobiliaria",
    n: "Inmobiliaria Leonesa", 
    sector: "Inmobiliarias & Comercios",
    loc: "León y provincia",
    img: "assets/proj-actualizaria.webp", 
    url: "#contact", 
    tag: "Catálogo interactivo",
    desc: "Buscador de inmuebles con filtros avanzados, ficha técnica descargable y botón directo de visita por WhatsApp.",
    metric: "+120 contactos/mes",      
    time: "Entregada en 14 días",
    cta: "Quiero una web para mi negocio →",
    glare: "rgba(52,211,153,0.14)",  
    sweep: "rgba(52,211,153,0.04)"  
  },
  { 
    id: "clinica",
    n: "Centro Fisioterapia & Salud", 
    sector: "Clínicas & Fisioterapia",
    loc: "León",
    img: "assets/proj-properties.webp",  
    url: "#contact", 
    tag: "Agenda 24/7 + Bonos",
    desc: "Venta de bonos de sesiones online y reserva de citas con recordatorio automático por SMS para reducir ausencias.",
    metric: "Citas 24/7 sin llamadas",              
    time: "Entregada en 8 días",
    cta: "Quiero una web para mi centro →",
    glare: "rgba(192,132,252,0.16)", 
    sweep: "rgba(192,132,252,0.05)" 
  },
];
const TESTI = [
  { n: "Carlos Morales", r: "Barbería El Cid · León centro", img: "assets/testi-1.webp", t: "Pasamos de apuntar las citas a mano a tener más de 40 reservas automáticas al mes por la web. El trato fue directo y en dos semanas estaba lista." },
  { n: "Dra. Laura Fernández", r: "Clínica Dental · Ponferrada", img: "assets/testi-4.webp", t: "Nuestra web anterior estaba anticuada. Ahora los pacientes nos encuentran en Google y piden cita por WhatsApp directamente sin complicaciones." },
  { n: "Javier Vega", r: "Asesoría Vega & Asoc. · León", img: null, t: "Lo mejor fue la claridad: precio cerrado desde el primer día, sin mensualidades obligatorias ni sorpresas técnicas. Muy recomendables." },
  { n: "Marta Álvarez", r: "Casona Rural El Curueño · Astorga", img: "assets/testi-5.webp", t: "Las reservas directas desde la web nos ahorran un dineral en comisiones de portales. Ha sido la mejor inversión para el negocio." },
];
const SERVICES_HELP = [
  { k: "01", h: "Diseño claro y profesional", p: "Estructuramos tu web para que quien entre entienda en 5 segundos qué haces." },
  { k: "02", h: "Textos que generan confianza", p: "Redactamos el contenido de tu web para que convenza y transmita solvencia." },
  { k: "03", h: "Reservas y contacto directo", p: "Botones a WhatsApp, llamadas directas o sistema de citas automático 24/7." },
  { k: "04", h: "Posicionamiento en tu zona", p: "Optimizada para aparecer en Google Maps y búsquedas locales de León." },
];
const FAQS = [
  { cat: "precios", q: "¿Cuánto cuesta exactamente una web y hay costes ocultos?", a: "Nuestros proyectos parten desde 450 € (Plan Arranque) y 750 € (Plan Crecimiento con reservas). El presupuesto que te damos es 100% cerrado: no hay cuotas sorpresa, mensualidades obligatorias ni letras pequeñas." },
  { cat: "tiempos", q: "¿Cuánto tiempo tardáis en entregar la web lista para funcionar?", a: "Una web corporativa o con reservas suele estar terminada en 1 a 2 semanas. Nos encargamos de la estructura, redacción persuasiva y optimización técnica para que tú no tengas que perder horas ni agobiarte." },
  { cat: "proceso", q: "¿Qué necesito tener preparado antes de empezar?", a: "Casi nada. Solo necesitamos saber a qué te dedicas, tus servicios principales y tus datos de contacto. Nosotros redactamos los textos de venta, preparamos las imágenes y estructuramos todo para que venda." },
  { cat: "proceso", q: "¿La web será mía o dependo de vosotros para siempre?", a: "La web es 100% tuya. Te entregamos acceso total como propietario y todos los archivos, sin contratos trampa ni ataduras. Tú decides libremente cómo gestionarla." },
  { cat: "tecnico", q: "¿Qué incluye el alojamiento (hosting) y dominio?", a: "Incluimos 1 año gratis de dominio personalizado (.es o .com), hosting ultrarrápido en discos NVMe, certificado de seguridad SSL y cuentas de correo corporativo." },
  { cat: "tecnico", q: "¿Qué pasa si necesito cambios o ayuda después del lanzamiento?", a: "Dispones de 30 días de garantía y soporte directo por WhatsApp. Además con nuestro servicio de Soporte & Mantenimiento (35 €/h o bolsa mensual) puedes pedirnos cualquier cambio o actualización cuando lo necesites." },
];

/* ---------- page ---------- */
function HomePage() {
  const [selectedSector, setSelectedSector] = useState("all");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(0);
  const [faqCategory, setFaqCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [calcNeeds, setCalcNeeds] = useState([]);
  const helpSectionRef = useRef(null);
  const rayLRef = useRef(null);
  const rayRRef = useRef(null);
  const rayTRRef = useRef(null);
  const rayBRef = useRef(null);

  const CALC_ADDERS = { reservas: 150, tienda: 750, ads: 200 };
  const CALC_BASE = 450;
  const toggleNeed = (k) => setCalcNeeds(n => n.includes(k) ? n.filter(x=>x!==k) : [...n, k]);
  const calcTotal = CALC_BASE + calcNeeds.reduce((s,k)=>s+CALC_ADDERS[k],0);

  useEffect(() => {
    let lastScrolled = false;
    const onScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
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
      const offset = `${progress * 100}%`;

      if (rayLRef.current) rayLRef.current.style.setProperty("--ray-offset", offset);
      if (rayRRef.current) rayRRef.current.style.setProperty("--ray-offset", offset);
      if (rayTRRef.current) rayTRRef.current.style.setProperty("--ray-offset", offset);
      if (rayBRef.current) rayBRef.current.style.setProperty("--ray-offset", offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
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

      {/* 0. BARRERA DE NOTICIAS / TOP TICKER LIQUID GLASS */}
      <div className="top-ticker">
        <div className="top-ticker__inner">
          <div className="top-ticker__badge">
            <span className="top-ticker__badge-dot" />
            <span>EN DIRECTO</span>
          </div>
          <div className="top-ticker__track">
            <span>✨ Webs y captación para negocios de León · 🔒 Presupuesto 100% cerrado sin costes sorpresa · ⚡ Entrega en 1–2 semanas · 🛡️ 30 días de garantía y soporte directo · 📍 León, Ponferrada, Astorga y provincia · 💬 Trato directo por WhatsApp</span>
            <span>✨ Webs y captación para negocios de León · 🔒 Presupuesto 100% cerrado sin costes sorpresa · ⚡ Entrega en 1–2 semanas · 🛡️ 30 días de garantía y soporte directo · 📍 León, Ponferrada, Astorga y provincia · 💬 Trato directo por WhatsApp</span>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav__inner">
          <div className="nav__brand">León Webs</div>
          <div className="nav__links">
            <a href="#proyectos">Sectores & Casos</a><a href="#services">Soluciones</a><a href="#proceso">Cómo trabajamos</a><a href="#precios">Planes</a><a href="#faq">FAQ</a>
          </div>
          <div className="nav__cta"><Btn href="#contact">Hablemos gratis</Btn></div>
          <button className="nav__burger" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="nav__mobile-menu">
          <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">✕</button>
          <a href="#proyectos" onClick={() => setMenuOpen(false)}>Sectores & Casos</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Soluciones</a>
          <a href="#proceso" onClick={() => setMenuOpen(false)}>Cómo trabajamos</a>
          <a href="#precios" onClick={() => setMenuOpen(false)}>Planes y Precios</a>
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
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Diseño Web & Captación Digital para Negocios de León</span></Reveal>
          {/* Strip de proyectos visible solo en móvil, dentro del hero */}
          <div className="hero__strip show-m">
            <div className="marquee" style={{ "--dur": "28s" }}>
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
          <Reveal delay={120}><h1 className="display h-grad">Diseño web y captación para negocios que quieren más clientes</h1></Reveal>
          <Reveal delay={220} className="lead hide-m" as="p">
            Creamos tu página web, tienda online o sistema de reservas listo para vender. Precios cerrados, sin cuotas sorpresa y entregado en 1–2 semanas.
          </Reveal>
          <Reveal delay={320} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Btn glossy href="#contact">Pedir propuesta sin compromiso →</Btn>
            <span className="hero__security-note">🔒 Precio cerrado garantizado · ⚡ Respuesta en menos de 24h · 📍 Especialistas en León</span>
          </Reveal>

          {/* SELECTOR RÁPIDO DE NECESIDAD / SOLUCIONES VISUALES */}
          <Reveal delay={380} className="hero__solutions-cards">
            <a href="#proyectos" onClick={() => setSelectedSector("all")} className="hero__solution-card">
              <div className="hero__solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              </div>
              <div className="hero__solution-info">
                <h4>Web Corporativa</h4>
                <span>Para clínicas, despachos y negocios que buscan imagen y llamadas</span>
                <span className="hero__solution-badge">Desde 450€ · Ver ejemplos</span>
              </div>
            </a>
            <a href="#proyectos" onClick={() => setSelectedSector("barberia")} className="hero__solution-card">
              <div className="hero__solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>
              </div>
              <div className="hero__solution-info">
                <h4>Reservas & Citas 24/7</h4>
                <span>Para barberías, centros de estética y hoteles con agenda online</span>
                <span className="hero__solution-badge">Desde 750€ · Ver casos</span>
              </div>
            </a>
            <a href="#ads" className="hero__solution-card">
              <div className="hero__solution-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><polyline points="11 8 11 11 14 11"/></svg>
              </div>
              <div className="hero__solution-info">
                <h4>Google & SEO Local</h4>
                <span>Para salir el primero cuando busquen tus servicios en León</span>
                <span className="hero__solution-badge">Captación directa · Info</span>
              </div>
            </a>
          </Reveal>

          <Reveal delay={440} className="hero__trust">
            <div className="hero__avatars">
              {["C","L","J","A","M"].map((l,i)=><span key={i} className="hero__av">{l}</span>)}
            </div>
            <span className="hero__trust-txt"><b>+12 negocios</b> en León ya confían</span>
          </Reveal>
        </div>
        <Reveal delay={500} className="hero__stats">
          {[
            { svg:<><path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.83-.83 1.24-2.29 1.5-3.5-1.21.26-2.67.67-3.5 1.5z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>, to:3, prefix:"×", label:"más ventas" },
            { svg:<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>, to:2, suffix:" sem", label:"de entrega" },
            { svg:<><line x1="4" y1="20" x2="20" y2="4"/><circle cx="6.5" cy="6.5" r="4.5"/><circle cx="17.5" cy="17.5" r="4.5"/></>, to:0, suffix:"€", label:"asesoría inicial" },
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

      {/* 1. BARRA DE GARANTÍAS Y TRANQUILIDAD */}
      <section className="wrap" style={{ marginTop: "-20px", marginBottom: "40px", position: "relative", zIndex: 10 }}>
        <div className="guarantees-bar">
          <div className="guarantee-item">
            <span className="guarantee-icon">⚡</span>
            <div>
              <strong>Entrega en 1–2 semanas</strong>
              <p>Tu web lista y funcionando sin demoras ni meses de espera.</p>
            </div>
          </div>
          <div className="guarantee-item">
            <span className="guarantee-icon">🔒</span>
            <div>
              <strong>Precio 100% cerrado</strong>
              <p>Sin mensualidades obligatorias ni sorpresas en la factura.</p>
            </div>
          </div>
          <div className="guarantee-item">
            <span className="guarantee-icon">🛡️</span>
            <div>
              <strong>Garantía de 30 días</strong>
              <p>Ajustes, retoques y soporte post-lanzamiento incluidos.</p>
            </div>
          </div>
          <div className="guarantee-item">
            <span className="guarantee-icon">📍</span>
            <div>
              <strong>Negocios de León</strong>
              <p>Trato directo de persona a persona, sin intermediarios.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT STRIP MARQUEE */}
      <div className="section strip-section" style={{ padding: "30px 0 60px", overflow: "visible" }} id="work">
        <div className="ambient-glow" />
        <div className="marquee marquee--right" style={{ "--dur": "38s" }}>
          <div className="marquee__track">
            {[...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS].map((p, i) => (
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
        <div className="marquee" style={{ "--dur": "34s", position: "relative" }}>
          <div className="marquee__track" style={{ gap: 56 }}>
            {[...BRANDS, ...BRANDS].map((b, i) => <div className="brand" key={i}>{b}</div>)}
          </div>
        </div>
      </div>

      {/* SECTORES + PROYECTOS FUSIONADOS */}
      <section className="section wrap" id="proyectos" style={{ overflow: "visible" }}>
        <div id="sectores" style={{ position: "relative", top: "-90px" }} />
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Sectores que impulsamos & Proyectos reales</span></Reveal>
          <Reveal delay={100}><h2 className="display">Webs hechas a la medida de tu sector</h2></Reveal>
          <Reveal delay={160} className="lead hide-m" as="p" style={{ margin: "0 auto" }}>
            Elige tu tipo de negocio para ver proyectos reales, resultados comprobados y cómo conseguimos que vendas más en León.
          </Reveal>
        </div>

        {/* Filter Tabs */}
        <div className="sector-nav-tabs">
          {[
            { id: "all", label: "✨ Todos los sectores" },
            { id: "barberia", label: "💈 Barberías & Estética" },
            { id: "clinica", label: "🩺 Clínicas & Salud" },
            { id: "asesoria", label: "⚖️ Despachos & Asesorías" },
            { id: "hotel", label: "🏨 Hoteles & Restauración" },
            { id: "inmobiliaria", label: "🏢 Inmobiliarias & Comercio" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`sector-tab-btn ${selectedSector === tab.id ? "active" : ""}`}
              onClick={() => setSelectedSector(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filtered Grid */}
        <div className="sector-grid">
          {CASES
            .filter((c) => selectedSector === "all" || c.id === selectedSector)
            .map((c, i) => (
              <TiltCard
                key={i}
                delay={(i % 3) * 80}
                className="sector-project-card"
                style={{ "--glare-color": c.glare, "--sweep-color": c.sweep }}
              >
                <div className="sector-project-card__img-wrap">
                  <img className="sector-project-card__img" src={c.img} alt={c.n} loading="lazy" onError={e=>e.target.style.display='none'} />
                  <span className="sector-project-card__tag">{c.tag}</span>
                  <span className="sector-project-card__sector-pill">{c.sector}</span>
                </div>
                <div className="sector-project-card__body">
                  <div className="sector-project-card__header">
                    <h3>{c.n}</h3>
                    <span className="sector-project-card__location">📍 {c.loc}</span>
                  </div>
                  <p className="sector-project-card__desc">{c.desc}</p>
                  <div className="sector-project-card__result">
                    <div>
                      <span style={{ fontSize: 11, color: "var(--muted)", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resultado clave</span>
                      <span className="sector-project-card__metric">{c.metric}</span>
                    </div>
                    <span className="sector-project-card__time">⚡ {c.time}</span>
                  </div>
                  <a href={`https://wa.me/34600000000?text=Hola!%20He%20visto%20el%20proyecto%20de%20${encodeURIComponent(c.n)}%20y%20me%20gustar%C3%ADa%20hacer%20algo%20parecido%20para%20mi%20negocio.`} target="_blank" rel="noopener noreferrer" className="sector-project-card__cta">
                    {c.cta}
                  </a>
                </div>
              </TiltCard>
            ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section wrap" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>No diseñamos webs para rellenar internet</span></Reveal>
          <Reveal delay={100}><h2 className="display">La mayoría de webs no están hechas para vender</h2></Reveal>
          <Reveal delay={180} className="lead hide-m" as="p" style={{ margin: "0 auto" }}>La tuya sí puede estarlo. Esto es lo que cambia cuando trabajas con estrategia e ingeniería real.</Reveal>
        </div>
        <div className="cols">
          <Reveal className="col col--no">
            <h3>Web tradicional sin estrategia</h3>
            {["Web bonita pero que no genera ni una llamada", "El visitante entra y se va sin comprar ni reservar", "Textos genéricos que nadie lee ni entiende", "Plantillas pesadas que tardan más de 4s en cargar", "Sin llamadas a la acción claras ni embudo de ventas", "Inversión a ciegas sin saber qué está funcionando"].map((t, i) => (
              <div className="row" key={i}><span className="ic ic--x">✕</span>{t}</div>
            ))}
          </Reveal>
          <Reveal delay={120} className="col col--yes">
            <span className="glow-side" />
            <h3>Con León Webs (Estrategia + Conversión)</h3>
            {["Arquitectura pensada desde el primer píxel para vender", "Cada sección guía al cliente a contactarte o reservar", "Copywriting persuasivo que transmite autoridad inmediata", "Velocidad ultrarrápida (<1s) y estética Liquid Glass 3D", "Optimización SEO Local y adaptación a búsquedas con IA", "Acompañamiento proactivo para seguir creciendo"].map((t, i) => (
              <div className="row" key={i} style={{ color: "#FFFFFF", fontWeight: 500 }}><span className="ic ic--v">✓</span>{t}</div>
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
            <img src="assets/avatar-color.webp" alt="León Webs" onError={e=>{e.target.style.display='none'}} />
          </div>
          <div className="about__content">
            <div className="shead" style={{ textAlign:"center", alignItems:"center" }}>
              <Reveal className="eyebrow" as="div"><span className="dot" /><span>Por qué somos diferentes</span></Reveal>
              <Reveal delay={100}><h2 className="display">Escalamos negocios que ya funcionan</h2></Reveal>
            </div>
            <Reveal delay={150} className="lead" as="p" style={{ margin: "0 0 28px" }}>
              Trabajamos con negocios que ya generan ingresos: barberías, clínicas, asesorías y comercios locales. Convertimos su web en una herramienta que vende. Resultado real: una barbería en León pasó de 0 a más de 40 reservas online al mes en 6 semanas.
            </Reveal>
            <div className="about__cards">
          {[
            {
              svg: <><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></>,
              t: "Auditoría estratégica",
              d: "Detectamos exactamente qué frena tu captación de clientes."
            },
            {
              svg: <><path d="M13 10V3L4 14h7v7l9-11h-7z"/></>,
              t: "Ingeniería orientada a ventas",
              d: "Cada estructura, sección y botón tiene un propósito comercial."
            },
            {
              svg: <><path d="M9 19V5m0 0L5 9m4-4l4-4"/></>,
              t: "Acompañamiento Always On",
              d: "Ajustes y optimización continua basada en datos reales."
            },
          ].map(({svg, t, d}, i) => (
            <AboutCard key={i} delay={i * 90} svg={svg} t={t} d={d} />
          ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* SERVICIOS — 3 SOLUCIONES CLARAS */}
      <section className="section wrap" id="services" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Soluciones a tu medida</span></Reveal>
          <Reveal delay={100}><h2 className="display">Lo que ofrecemos para tu negocio</h2></Reveal>
          <Reveal delay={160} className="lead hide-m" as="p" style={{ margin: "0 auto" }}>
            Todo lo necesario para conseguir clientes sin complicaciones técnicas.
          </Reveal>
        </div>
        <div className="svc-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { 
              image: "assets/service-web-design.webp", 
              alt: "Portátil mostrando una página web profesional", 
              h: "Web Corporativa & Autoridad", 
              p: "Para profesionales, clínicas, despachos y comercios que necesitan proyectar solvencia inmediata, transmitir máxima confianza y captar contactos por formulario o WhatsApp." 
            },
            { 
              image: "assets/service-ecommerce.webp", 
              alt: "Móvil y producto para una tienda online", 
              h: "Tienda Online & Reservas 24/7", 
              p: "Para negocios que venden productos o servicios con agenda de citas automatizada (Stripe / Bizum / Apple Pay) sin necesidad de atender llamadas a mano." 
            },
            { 
              image: "assets/service-local-visibility.webp", 
              alt: "Negocio local visible en mapas y buscadores", 
              h: "SEO Local & Orbit Care (Always On)", 
              p: "Para aparecer en los primeros puestos de Google Maps cuando busquen tus servicios en tu zona y mantener tu web rápida, segura y actualizada todos los meses." 
            },
          ].map(({image,alt,h,p}, i) => (
            <Reveal key={i} delay={i*80} className="svc-card">
              <img className="svc-card__image" src={image} alt={alt} loading="lazy" />
              <div className="svc-card__body"><h4>{h}</h4><p>{p}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CÓMO TRABAJAMOS — PROCESO EN 3 PASOS */}
      <section className="section wrap" id="proceso" style={{ overflow: "visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Proceso predecible y sin agobios</span></Reveal>
          <Reveal delay={100}><h2 className="display">Cómo trabajamos contigo paso a paso</h2></Reveal>
          <Reveal delay={160} className="lead hide-m" as="p" style={{ margin: "0 auto" }}>
            Sin complicaciones técnicas ni sorpresas. Nos encargamos de todo de principio a fin para que tú te centres en tu negocio.
          </Reveal>
        </div>
        <div className="process-grid">
          {[
            {
              num: "01",
              title: "Hablamos y definimos",
              desc: "Analizamos tu negocio, tus clientes y tus objetivos. Te entregamos una propuesta clara con precio cerrado y calendario exacto. Sin letra pequeña.",
              tag: "Día 1 · Planificación clara",
              icon: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>
            },
            {
              num: "02",
              title: "Diseñamos y construimos",
              desc: "Redactamos los textos persuasivos, preparamos las imágenes y programamos tu web con diseño prémium y máxima velocidad. Tú solo revisas y das el visto bueno.",
              tag: "1–2 Semanas · Desarrollo ágil",
              icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>
            },
            {
              num: "03",
              title: "Lanzamiento y clientes",
              desc: "Publicamos tu web con dominio, SSL, Google Maps configurado y lista para captar visitas y ventas. Y nos tienes a 1 WhatsApp de distancia para lo que necesites.",
              tag: "Entrega · Resultados",
              icon: <><path d="M4.5 16.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.83-.83 1.24-2.29 1.5-3.5-1.21.26-2.67.67-3.5 1.5z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></>
            }
          ].map((item, i) => (
            <Reveal key={i} delay={i * 90} className="process-card">
              <div className="process-header">
                <span className="process-num">{item.num}</span>
                <span className="process-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                </span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="process-tag">{item.tag}</span>
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
            ref={rayLRef}
            className="hq__ray hq__ray--l"
          />
          <div
            ref={rayRRef}
            className="hq__ray hq__ray--r"
          />
          <div
            ref={rayTRRef}
            className="hq__ray hq__ray--t"
          />
          <div
            ref={rayBRef}
            className="hq__ray hq__ray--b"
          />

          {/* central hub avatar */}
          <div className="hq__hub">
            <div className="hq__ava">
              <img
                src="assets/avatar-color.webp"
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
              { pos:"br", h:"Estrategia de ventas", p:"No solo la web, también te decimos qué poner y cómo decirlo.", svg:<><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></> },
            ].map(({pos,h,p,svg}, i) => (
              <PilarCard key={i} pos={pos} h={h} p={p} svg={svg} />
            ))}
          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="section">
        <div className="shead wrap">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Clientes que ya venden más</span></Reveal>
          <Reveal delay={100} className="hide-m"><h2 className="display">Lo que dicen los que ya lo comprobaron</h2></Reveal>
        </div>
        <div className="marquee" style={{ "--dur": "42s", marginTop: 40 }}>
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
        <div className="marquee marquee--rev testi-row2" style={{ "--dur": "48s", marginTop: 20 }}>
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

      {/* PRECIOS Y SERVICIOS */}
      <section className="section wrap" id="precios" style={{ overflow:"visible" }}>
        <div className="ambient-glow" />
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Servicios y planes</span></Reveal>
          <Reveal delay={100}><h2 className="display">Elige cómo quieres crecer</h2></Reveal>
          <Reveal delay={160} className="lead hide-m" as="p" style={{ margin:"0 auto" }}>Precios transparentes y cerrados. Toca cada tarjeta para ver el desglose completo.</Reveal>
        </div>
        <div className="pricing pricing--4">
          {[
            {
              label: "Plan Arranque", badge: "Presencia Inmediata",
              launch: "Oferta de lanzamiento", old: "650€", num: "450", sub: "Pago único · lista en 1 semana",
              feats: [
                "Web corporativa a medida de alta velocidad (<1s)",
                "Textos claros orientados a captar clientes",
                "Optimización SEO Local & Google Maps",
                "Botón directo a WhatsApp y formulario de contacto",
                "Hosting NVMe + Dominio y SSL 1 año gratis"
              ],
              cta: "Quiero arrancar →", pro:false, detailHref: "/plan-arranque"
            },
            {
              label: "Plan Crecimiento", badge: "⭐ MÁS RECOMENDADO",
              launch: "Máxima Conversión", old: "1.100€", num: "750", sub: "Pago único · lista en 2 semanas",
              feats: [
                "Todo lo de Plan Arranque",
                "Hasta 8-10 páginas y secciones de servicios",
                "Sistema de reservas / citas online automatizado",
                "Diseño visual prémium adaptado a móvil y PC",
                "Estadísticas y seguimiento de visitas",
                "30 días de ajustes y soporte incluidos"
              ],
              cta: "Quiero crecer →", pro:true, detailHref: "/plan-crecimiento"
            },
            {
              label: "Tienda Online", badge: "Venta Automatizada",
              launch: "Comercio Electrónico", old: "1.800€", num: "1.200", sub: "Pago único · según catálogo",
              feats: [
                "Catálogo de productos con filtros claros",
                "Pasarelas seguras (Stripe, Bizum, Tarjeta)",
                "Avisos automáticos de pedido y stock",
                "Cálculo de envíos y facturación automática",
                "Panel de control fácil de usar + formación"
              ],
              cta: "Quiero mi tienda →", pro:false, detailHref: "/tienda-online"
            },
            {
              label: "Soporte & Horas", badge: "Sin Permanencia",
              launch: "Mantenimiento Web", old: null, num: "35", suffix:"€/hora", sub: "Flexibilidad total · según lo que uses",
              feats: [
                "Mantenimiento técnico y copias de seguridad",
                "Modificación de textos, fotos y nuevos banners",
                "Revisión de velocidad y seguridad mensual",
                "Mejoras de posicionamiento en Google",
                "Facturación transparente solo por lo trabajado"
              ],
              cta: "Ver soporte →", pro:false, detailHref: "/por-horas"
            },
          ].map((p, i) => (
            <ServiceCard key={i} {...p} delay={i*80} />
          ))}
        </div>

        {/* PUBLICIDAD Y GOOGLE */}
        <Reveal delay={100} className="ads-card" id="ads">
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
          <p style={{color:"var(--muted)",fontSize:13}}>¿No sabes cuál necesitas? <a href="#contact" style={{color:"#92BBFF",textDecoration:"none"}}>Cuéntanos tu caso, es gratis →</a></p>
        </Reveal>
      </section>

      {/* CALCULADORA DE PRECIO */}
      <section className="section wrap" id="calculadora">
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Calcula tu precio</span></Reveal>
          <Reveal delay={100}><h2 className="display">¿Cuánto cuesta tu web?</h2></Reveal>
          <Reveal delay={160} className="lead hide-m" as="p" style={{ margin:"0 auto" }}>Marca lo que necesitas y te decimos el precio ahora, sin llamadas, sin esperar presupuesto.</Reveal>
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
            <div className="calc-result__sub">Web base incluida · pago único sin cuotas</div>
            <div className="calc-result__timeline">
              ⏱️ <b>Tiempo estimado:</b> {calcNeeds.includes("tienda") ? "2 a 3 semanas" : "7 a 14 días"}
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "12px", width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                className="price-cta price-cta--pro"
                style={{ flex: 1, minWidth: 200 }}
                href={`mailto:hola@leonwebs.es?subject=${encodeURIComponent("Presupuesto León Webs")}&body=${encodeURIComponent(`Hola León Webs, he usado la calculadora y me interesa una web desde ${calcTotal}€.\n\nNecesito: ${calcNeeds.length ? calcNeeds.map(k=>({reservas:"Reservas online",tienda:"Tienda online",ads:"Publicidad/Google"}[k])).join(", ") : "Web básica"}.\n\nMi negocio es: `)}`}
              >
                Pedir por Email →
              </a>
              <a
                className="price-cta"
                style={{ flex: 1, minWidth: 200, background: "rgba(37, 211, 102, 0.15)", borderColor: "rgba(37, 211, 102, 0.4)", color: "#25D366" }}
                href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola León Webs! He calculado mi web en vuestra página (Total: ${calcTotal}€ con ${calcNeeds.length ? calcNeeds.map(k=>({reservas:"Reservas",tienda:"Tienda",ads:"Google/SEO"}[k])).join(", ") : "Plan Base"}). Me gustaría hablar de mi proyecto.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Pedir por WhatsApp →
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ CON FILTROS */}
      <section className="section wrap" id="faq">
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Dudas habituales</span></Reveal>
          <Reveal delay={100}><h2 className="display">Lo que nos preguntan antes de empezar</h2></Reveal>
        </div>
        <div className="faq-filters">
          {[
            { id: "all", label: "Todas las preguntas" },
            { id: "precios", label: "Precios & Pagos" },
            { id: "tiempos", label: "Plazos & Entrega" },
            { id: "proceso", label: "Cómo trabajamos" },
            { id: "tecnico", label: "Hosting & Soporte" },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`faq-filter-btn ${faqCategory === cat.id ? "faq-filter-btn--active" : ""}`}
              onClick={() => { setFaqCategory(cat.id); setOpen(-1); }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="faq">
          {FAQS.filter(f => faqCategory === "all" || f.cat === faqCategory).map((f, i) => (
            <Reveal key={i} delay={i * 50} className={`q ${open === i ? "open" : ""}`}>
              <button className="q__head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                {f.q}<span className="q__ic">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <div className="q__body"><p>{f.a}</p></div>}
            </Reveal>
          ))}
        </div>
        <p className="faq__cta">¿Tienes otra pregunta? <a href="#contact">Hablemos de tu proyecto</a></p>
      </section>

      {/* CONTACT CTA */}
      <section className="section wrap" id="contact">
        <Reveal className="contact-card">
          <div className="hero__glow" style={{ top: "0", opacity: .5 }} />
          <div style={{ position:"relative", textAlign:"center" }}>
            <div className="eyebrow" style={{ display:"inline-flex", marginBottom:24 }}><span className="dot" /><span>Hablemos sin compromiso</span></div>
            <h2 className="display h-grad" style={{ fontSize:"clamp(28px,5vw,56px)", marginBottom:20 }}>Escala tu negocio en 1–2 semanas</h2>
            <p className="lead" style={{ margin:"0 auto 32px", maxWidth:560 }}>
              Cuéntanos tu proyecto en una llamada de 15 minutos o por WhatsApp. Analizamos tu caso gratis y te damos un presupuesto cerrado sin sorpresas.
            </p>
            <div className="contact__actions">
              <Btn glossy href="mailto:hola@leonwebs.es?subject=Presupuesto%20Web%20Leon">📅 Agendar llamada gratis →</Btn>
              <a className="contact__whatsapp-btn" href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                💬 Hablar por WhatsApp
              </a>
            </div>
            <div className="contact__trust-badges">
              <span>🔒 Presupuesto cerrado garantizado</span>
              <span>⚡ Respuesta en menos de 24h</span>
              <span>☕ 100% Sin compromiso</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap footer__grid">
          <div style={{ maxWidth: 280 }}>
            <div className="nav__brand" style={{ marginBottom: 12 }}>León Webs</div>
            <p className="hide-m" style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Escalamos negocios activos en León. Barbería, clínica, asesor, hotel; si ya vendes offline, te ayudamos a vender tres veces más online.</p>
          </div>
          <div className="foot-cols">
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Menú</div>
              <a href="#work">Trabajos</a><a href="#sectores">Sectores</a><a href="#services">Soluciones</a><a href="#proceso">Cómo trabajamos</a><a href="#precios">Planes</a><a href="#faq">FAQ</a>
            </div>
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Contacto</div>
              <a href="mailto:hola@leonwebs.es">hola@leonwebs.es</a><a href="https://wa.me/34600000000">WhatsApp</a><a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ color: "var(--muted)", fontSize: 13, marginTop: 40, display:"flex", gap:20, flexWrap:"wrap", justifyContent:"space-between", alignItems:"center" }}><span>© {new Date().getFullYear()} León Webs. Todos los derechos reservados.</span><span style={{display:"flex",gap:16}}><Link to="/aviso-legal" style={{color:"var(--muted)"}}>Aviso legal</Link><Link to="/privacidad" style={{color:"var(--muted)"}}>Privacidad</Link><Link to="/cookies" style={{color:"var(--muted)"}}>Cookies</Link></span></div>
      </footer>

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <a
        href="https://wa.me/34600000000?text=Hola%20Le%C3%B3n%20Webs%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20una%20web%20para%20mi%20negocio."
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="Hablar por WhatsApp con León Webs"
      >
        <span className="floating-whatsapp__pulse" />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        <span className="floating-whatsapp__tooltip">¿Hablamos? Estamos online ⚡</span>
      </a>
    </div>
  );
}

/* ---------- páginas de detalle de plan ---------- */
function PlanCard({ children, style = {}, className = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  const [vars, setVars] = useState({ "--mx": "50%", "--my": "50%", "--hovered": 0 });
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setVars({
      "--mx": `${((e.clientX - rect.left) / rect.width) * 100}%`,
      "--my": `${((e.clientY - rect.top) / rect.height) * 100}%`,
      "--tilt-x": `${((rect.height / 2 - (e.clientY - rect.top)) / rect.height) * 1.6}deg`,
      "--tilt-y": `${(((e.clientX - rect.left) - rect.width / 2) / rect.width) * 1.6}deg`,
      "--hovered": 1,
    });
  };
  const handleLeave = () => setVars(v => ({ ...v, "--hovered": 0, "--tilt-x": "0deg", "--tilt-y": "0deg" }));
  return (
    <Tag ref={ref} className={`plan-card ${className}`} style={{ ...style, ...vars }}
      onMouseMove={handleMove} onMouseLeave={handleLeave} {...rest}>
      <span className="plan-card__glow" />
      <span className="plan-card__border" />
      <span className="plan-card__inner">{children}</span>
    </Tag>
  );
}

function PlanShell({ eyebrow, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="site plan-page">
      <Starfield />
      <div className="site-ambient" />
      <div className="grid-overlay" />
      <div className="grid-overlay__spot" />
      <style>{CSS}</style>

      <nav className="nav scrolled">
        <div className="nav__inner">
          <div className="nav__brand"><Link to="/" style={{ color: "inherit", textDecoration: "none" }}>León Webs</Link></div>
          <div className="nav__links">
            <a href={homeHref("#work")}>Trabajos</a><a href={homeHref("#services")}>Soluciones</a><a href={homeHref("#proceso")}>Cómo trabajamos</a><a href={homeHref("#precios")}>Planes</a><a href={homeHref("#faq")}>FAQ</a>
          </div>
          <div className="nav__cta"><Btn href={homeHref("#contact")}>Hablemos gratis</Btn></div>
          <button className="nav__burger" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><span/><span/><span/></button>
        </div>
      </nav>
      {menuOpen && (
        <div className="nav__mobile-menu">
          <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">✕</button>
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <a href={homeHref("#services")} onClick={() => setMenuOpen(false)}>Soluciones</a>
          <a href={homeHref("#proceso")} onClick={() => setMenuOpen(false)}>Cómo trabajamos</a>
          <a href={homeHref("#precios")} onClick={() => setMenuOpen(false)}>Planes y Precios</a>
          <a href={homeHref("#faq")} onClick={() => setMenuOpen(false)}>FAQ</a>
          <div style={{marginTop:24, width:"80%"}}><Btn glossy href={homeHref("#contact")} onClick={() => setMenuOpen(false)}>Hablamos gratis</Btn></div>
        </div>
      )}

      <main className="plan-main wrap">{children}</main>

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
        <a className="dock__btn" href={homeHref("#calculadora")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="12" x2="8" y2="12"/><line x1="12" y1="12" x2="12" y2="12"/><line x1="16" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="12" y1="16" x2="12" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
          Presupuesto
        </a>
        <a className="dock__btn dock__btn--main" href={homeHref("#contact")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Agendar
        </a>
      </div>

      <footer className="footer">
        <div className="wrap footer__grid">
          <div style={{ maxWidth: 280 }}>
            <div className="nav__brand" style={{ marginBottom: 12 }}>León Webs</div>
          </div>
          <div className="foot-cols">
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Menú</div>
              <a href={homeHref("#work")}>Trabajos</a><a href={homeHref("#precios")}>Servicios</a><a href={homeHref("#about")}>Nosotros</a><a href={homeHref("#faq")}>FAQ</a>
            </div>
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>Contacto</div>
              <a href="mailto:hola@leonwebs.es">hola@leonwebs.es</a><a href="#">Instagram</a><a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="wrap" style={{ color: "var(--muted)", fontSize: 13, marginTop: 40, display:"flex", gap:20, flexWrap:"wrap", justifyContent:"space-between", alignItems:"center" }}><span>© {new Date().getFullYear()} León Webs. Todos los derechos reservados.</span><span style={{display:"flex",gap:16}}><Link to="/aviso-legal" style={{color:"var(--muted)"}}>Aviso legal</Link><Link to="/privacidad" style={{color:"var(--muted)"}}>Privacidad</Link><Link to="/cookies" style={{color:"var(--muted)"}}>Cookies</Link></span></div>
      </footer>
    </div>
  );
}

function PlanFeatureIcon({ children }) {
  return (
    <span className="plan-feat-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
    </span>
  );
}

function PlanArranque() {
  return (
    <PlanShell>
      <section className="plan-hero">
        <div className="plan-hero__text">
          <div className="eyebrow"><span className="dot" /><span>Ideal para empezar</span></div>
          <h1 className="display h-grad">Plan Arranque</h1>
          <p className="lead">Lanza tu presencia digital en una semana. Una solución completa, profesional y optimizada para convertir visitantes en clientes, sin complicaciones técnicas.</p>
          <PlanCard className="plan-price-pill" style={{ width: "fit-content" }}>
            <div className="plan-price-pill__num">450<span>€</span></div>
            <div className="plan-price-pill__meta"><span>✓ Pago único</span><span>Sin suscripciones</span></div>
          </PlanCard>
          <div className="plan-cta-row">
            <Btn glossy href={homeHref("#contact")}>Contratar ahora →</Btn>
            <a className="plan-btn-ghost" href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer">
              <PlanFeatureIcon><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></PlanFeatureIcon>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
        <div className="plan-hero__shot">
          <img src="assets/plan-arranque-ejemplo.webp" alt="Ejemplo de web entregada — VIP Barber Shop León" loading="lazy" />
          <div className="plan-hero__shot-badge">
            <PlanFeatureIcon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></PlanFeatureIcon>
            <span>Entrega en 1 semana</span>
          </div>
        </div>
      </section>

      <section>
        <div className="shead"><h2 className="display">¿Qué incluye el Plan Arranque?</h2><p className="lead" style={{margin:"0 auto"}}>Todo lo necesario para una presencia digital impecable y orientada a resultados.</p></div>
        <div className="plan-grid">
          <PlanCard className="plan-span-8 plan-card--with-image plan-card--template">
            <img className="plan-card__image" src="assets/plan-arranque-template.webp" alt="Portátil con una página web profesional" loading="lazy" />
            <div className="plan-card__content"><h3>Plantilla Profesional Adaptada</h3><p>Seleccionamos y adaptamos una estructura de alta conversión que se alinea con la identidad y objetivos de tu negocio. Diseño responsive garantizado.</p></div>
          </PlanCard>
          <PlanCard className="plan-span-4 plan-card--with-image plan-card--brand">
            <img className="plan-card__image" src="assets/plan-arranque-brand-colours.webp" alt="Muestrario de colores de marca" loading="lazy" />
            <div className="plan-card__content"><h3>Colores de Marca</h3><p>Implementación exacta de tu paleta corporativa para una identidad visual cohesiva.</p></div>
          </PlanCard>
          <PlanCard className="plan-span-5 plan-card--with-image plan-card--content">
            <img className="plan-card__image" src="assets/plan-arranque-content.webp" alt="Cuaderno, cámara y fotografías para crear contenidos" loading="lazy" />
            <div className="plan-card__content"><h3>Textos y Fotos</h3><p>Integración de tu contenido optimizado para web, junto con imágenes de alta calidad.</p></div>
          </PlanCard>
          <PlanCard className="plan-span-7 plan-card--with-image plan-card--contact">
            <img className="plan-card__image" src="assets/plan-arranque-contact.webp" alt="Móvil con una notificación de mensaje" loading="lazy" />
            <div className="plan-card__content"><h3>Botón Directo a WhatsApp</h3><p>Facilita el contacto inmediato. Un botón flotante estratégico que conecta a tus visitantes con tu atención al cliente.</p></div>
          </PlanCard>
        </div>
      </section>
    </PlanShell>
  );
}

function PlanCrecimiento() {
  return (
    <PlanShell>
      <div className="growth-showcase-wrap">
        {/* Micro-Nav Superior */}
        <div className="growth-top-bar">
          <div className="growth-top-brand">
            <div className="growth-top-logo">
              <span className="badge-lw">LW</span>
              <span>León Webs</span>
            </div>
            <span className="growth-top-slogan">Webs que hacen crecer negocios</span>
          </div>
          <div className="growth-top-steps">
            <span>IDEAS</span>
            <span>|</span>
            <span>PLAN</span>
            <span>|</span>
            <span>ACCIÓN</span>
            <span>|</span>
            <span className="active-step">RESULTADOS</span>
          </div>
        </div>

        {/* Hero Principal en 3 Columnas */}
        <div className="growth-grid">
          {/* COLUMNA IZQUIERDA */}
          <div className="growth-left">
            <span className="growth-kicker">Más visibilidad. Más clientes. Más crecimiento.</span>
            <h1 className="growth-title">Plan <span className="h-grad">Crecimiento</span></h1>
            <p className="growth-subtitle">Convierte tu web en una herramienta real de crecimiento para tu negocio.</p>
            <p className="growth-desc">Diseñada para atraer clientes, generar confianza y automatizar procesos clave como reservas, formularios o captación de leads.</p>

            <div className="growth-meta-row">
              <div className="growth-meta-card">
                <div className="growth-meta-top">
                  <span className="growth-meta-badge">Pago único</span>
                  <div className="growth-meta-icon-mini">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                      <line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                  </div>
                </div>
                <div className="growth-meta-body">
                  <b>750 €</b>
                  <span className="sub">Sin sorpresas ni mensualidades obligatorias.</span>
                </div>
              </div>

              <div className="growth-meta-card">
                <div className="growth-meta-top">
                  <span className="growth-meta-badge">Fast Track</span>
                  <div className="growth-meta-icon-mini">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                </div>
                <div className="growth-meta-body">
                  <b>Entrega en 2 semanas</b>
                  <span className="sub">Tu negocio online, más rápido y listo para vender.</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, marginBottom: 12 }}>
              <Btn glossy href={homeHref("#contact")} style={{ width: "100%", justifyContent: "center", fontSize: 15.5, padding: "16px 28px", fontWeight: 700 }}>
                Empezar proyecto ahora →
              </Btn>
            </div>

            <div className="growth-trust-row">
              <div className="growth-trust-item">
                <span className="ic-chk">✓</span>
                <span>Sin cuotas ocultas</span>
              </div>
              <div className="growth-trust-item">
                <span className="ic-chk">✓</span>
                <span>Trato directo 1 a 1</span>
              </div>
              <div className="growth-trust-item">
                <span className="ic-chk">✓</span>
                <span>Resultados medibles</span>
              </div>
            </div>
          </div>

          {/* COLUMNA CENTRAL: MOCKUPS */}
          <div className="growth-center">
            <div className="growth-note-top">
              <span>Una web que trabaja para ti</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>

            <div className="growth-mockup-stage">
              {/* TABLET */}
              <div className="growth-tablet">
                <div className="tablet-screen">
                  <div className="tablet-nav">
                    <div className="tablet-logo">LW León Webs</div>
                    <div className="tablet-links hide-m">
                      <span>Inicio</span>
                      <span>Servicios</span>
                      <span>Proyectos</span>
                      <span>Contacto</span>
                    </div>
                    <span className="tablet-cta">Solicitar presupuesto</span>
                  </div>

                  <div className="tablet-hero-box">
                    <span className="tablet-pill">✦ TU NEGOCIO ONLINE</span>
                    <h4>Convierte visitantes en clientes</h4>
                    <p>Páginas web que atraen, convierten y hacen crecer tu negocio.</p>
                    <button className="tablet-btn-small">Solicitar presupuesto →</button>
                  </div>

                  <div className="tablet-metrics">
                    <div className="tablet-metric-item">
                      <b>+120</b>
                      <span>Proyectos realizados</span>
                    </div>
                    <div className="tablet-metric-item">
                      <b>98%</b>
                      <span>Clientes satisfechos</span>
                    </div>
                    <div className="tablet-metric-item">
                      <b>+3 años</b>
                      <span>Impulsando negocios</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PHONE MOCKUP EN PRIMER PLANO */}
              <div className="growth-phone">
                <div className="phone-screen">
                  <div className="phone-header">LW León Webs</div>
                  <div className="phone-card">
                    <div className="phone-card-title">Reserva tu cita</div>
                    <div className="phone-card-sub">Elige la fecha y hora que mejor te venga.</div>
                    <div className="phone-days">
                      <div className="phone-day"><span>Lun</span><b>10</b></div>
                      <div className="phone-day"><span>Mar</span><b>11</b></div>
                      <div className="phone-day"><span>Mié</span><b>12</b></div>
                      <div className="phone-day active"><span>Jue</span><b>13</b></div>
                      <div className="phone-day"><span>Vie</span><b>14</b></div>
                    </div>
                    <div className="phone-times">
                      <div className="phone-time">09:00</div>
                      <div className="phone-time">10:30</div>
                      <div className="phone-time">12:00</div>
                      <div className="phone-time">16:00</div>
                      <div className="phone-time">17:30</div>
                      <div className="phone-time">19:00</div>
                    </div>
                    <button className="phone-btn">Reservar ahora</button>
                    <span className="phone-secure">🔒 Proceso seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: MÉTRICAS Y GRÁFICO */}
          <div className="growth-right">
            <svg className="growth-arrow-svg" viewBox="0 0 100 160" fill="none">
              <path d="M10 140 Q 40 80 85 20" stroke="url(#growthGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M65 15 L 90 18 L 85 45" fill="none" stroke="#00D4FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="growthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(0, 132, 255, 0.2)" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
              </defs>
            </svg>

            <div className="growth-stat-card">
              <div className="growth-stat-header">
                <span className="growth-stat-title">Tráfico cualificado</span>
                <div className="growth-stat-icon-mini">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
              </div>
              <span className="growth-stat-num">+120%</span>
              <span className="growth-stat-desc">Más visitas cualificadas</span>
            </div>

            <div className="growth-stat-card">
              <div className="growth-stat-header">
                <span className="growth-stat-title">Conversión de clientes</span>
                <div className="growth-stat-icon-mini">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              </div>
              <span className="growth-stat-num">+70%</span>
              <span className="growth-stat-desc">Más clientes potenciales</span>
            </div>

            <div className="growth-stat-card">
              <div className="growth-stat-header">
                <span className="growth-stat-title">Eficiencia operativa</span>
                <div className="growth-stat-icon-mini">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </div>
              <span className="growth-stat-num">+45%</span>
              <span className="growth-stat-desc">Más reservas automáticas</span>
            </div>

            <div className="growth-note-bot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
              <span>Tu negocio también puede crecer así</span>
            </div>
          </div>
        </div>

        {/* FRANJA DE 5 PILARES INFERIOR */}
        <div className="growth-pillars-bar">
          <div className="growth-pillar-item">
            <div className="growth-pillar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div className="growth-pillar-text">
              <b>Diseño profesional</b>
              <span>A medida de tu marca</span>
            </div>
          </div>

          <div className="growth-pillar-item">
            <div className="growth-pillar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <div className="growth-pillar-text">
              <b>Captura de leads</b>
              <span>Convierte visitantes en clientes</span>
            </div>
          </div>

          <div className="growth-pillar-item">
            <div className="growth-pillar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="growth-pillar-text">
              <b>Sistema de reservas</b>
              <span>Automatiza tu negocio</span>
            </div>
          </div>

          <div className="growth-pillar-item">
            <div className="growth-pillar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <div className="growth-pillar-text">
              <b>SEO incluido</b>
              <span>Más visibilidad en Google</span>
            </div>
          </div>

          <div className="growth-pillar-item">
            <div className="growth-pillar-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <div className="growth-pillar-text">
              <b>Soporte técnico</b>
              <span>Siempre a tu lado</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DETALLADA DE CARACTERÍSTICAS */}
      <section style={{ marginTop: 70 }}>
        <div className="shead">
          <Reveal className="eyebrow" as="div"><span className="dot" /><span>Funcionalidades Clave</span></Reveal>
          <Reveal delay={100}><h2 className="display" style={{ marginTop: 14 }}>Todo lo necesario para que tu negocio <span className="h-grad">facture más</span></h2></Reveal>
          <Reveal delay={180} className="lead" as="p" style={{ margin: "0 auto" }}>Diseñado específicamente para automatizar procesos y generar confianza inmediata en tus visitantes.</Reveal>
        </div>

        <div className="plan-grid">
          {/* Bento 1: Reservas & Automatización (Span 12) */}
          <PlanCard className="plan-span-12 growth-feature-card">
            <div className="growth-feat-hero-inner">
              <div>
                <div className="growth-feat-header">
                  <div className="growth-feat-icon-glow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <span className="growth-feat-badge">✦ Automatización 24/7</span>
                </div>
                <h3>Sistema de Reservas y Formularios Multi-Paso</h3>
                <p>Permite que tus clientes elijan servicio, fecha y hora directamente desde el móvil. Sincronización automática con Google Calendar y aviso instantáneo por WhatsApp o correo electrónico.</p>
                <div className="growth-feat-pills">
                  <span className="growth-feat-pill"><span>📅</span> Sincronización con Google Calendar</span>
                  <span className="growth-feat-pill"><span>💬</span> Notificación instantánea WhatsApp</span>
                  <span className="growth-feat-pill"><span>⚡</span> Sin fricción ni llamadas manuales</span>
                </div>
              </div>

              <div className="growth-mini-widget">
                <div className="growth-mini-widget-title">
                  <span>AGENDA ONLINE</span>
                  <span style={{ color: "#00D4FF", fontSize: 10 }}>● Activo</span>
                </div>
                <div className="growth-mini-cal-row">
                  <div className="growth-mini-cal-day">Lun <b>10</b></div>
                  <div className="growth-mini-cal-day">Mar <b>11</b></div>
                  <div className="growth-mini-cal-day">Mié <b>12</b></div>
                  <div className="growth-mini-cal-day active">Jue <b>13</b></div>
                  <div className="growth-mini-cal-day">Vie <b>14</b></div>
                </div>
                <div className="growth-mini-slots">
                  <div className="growth-mini-slot">09:30</div>
                  <div className="growth-mini-slot active">11:00</div>
                  <div className="growth-mini-slot">12:30</div>
                  <div className="growth-mini-slot">16:00</div>
                  <div className="growth-mini-slot">17:30</div>
                  <div className="growth-mini-slot">19:00</div>
                </div>
              </div>
            </div>
          </PlanCard>

          {/* Bento 2: Galería de Trabajos (Span 6) */}
          <PlanCard className="plan-span-6 growth-feature-card">
            <div className="growth-feat-header">
              <div className="growth-feat-icon-glow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <span className="growth-feat-badge">✦ Impacto Visual</span>
            </div>
            <h3>Galería de Trabajos & Casos Reales</h3>
            <p>Muestra tu portafolio con un diseño asimétrico tipo Liquid Glass que resalta tus mejores resultados y genera autoridad inmediata.</p>
            <div className="growth-card-preview-bar">
              <span style={{ fontSize: 12, color: "#92BBFF", fontWeight: 600 }}>✦ Filtros por categoría</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>Carga WebP ultrarrápida</span>
            </div>
          </PlanCard>

          {/* Bento 3: Testimonios y Reseñas (Span 6) */}
          <PlanCard className="plan-span-6 growth-feature-card">
            <div className="growth-feat-header">
              <div className="growth-feat-icon-glow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <span className="growth-feat-badge">✦ Prueba Social</span>
            </div>
            <h3>Testimonios y Reseñas de Confianza</h3>
            <p>Aumenta la tasa de cierre con pruebas sociales verificadas de clientes de León, logrando que el visitante sienta tranquilidad antes de contactar.</p>
            <div className="growth-card-preview-bar">
              <span style={{ fontSize: 13, color: "#38BDF8", fontWeight: 700 }}>★★★★★ 5.0 en Google</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>Valoraciones verificadas</span>
            </div>
          </PlanCard>
        </div>

        {/* Bloque Checklist de Esenciales */}
        <div className="growth-essentials-wrap">
          <h3 className="growth-essentials-title">También incluye todo lo esencial para vender desde el día 1</h3>
          <div className="growth-essentials-grid">
            {[
              { t: "Diseño 100% Responsive", d: "Optimizado al milímetro para móviles" },
              { t: "SEO Local en Google", d: "Aparece cuando busquen tu servicio en León" },
              { t: "Dominio y Hosting (1 año)", d: "Máxima velocidad NVMe incluida" },
              { t: "Integración de WhatsApp", d: "Contacto directo a un clic" },
              { t: "Optimización WebP", d: "Carga instantánea sin esperas" },
              { t: "Textos y Copy de Venta", d: "Mensajes persuasivos orientados a cierre" }
            ].map((item, i) => (
              <div key={i} className="growth-essential-card">
                <span className="chk">✓</span>
                <div>
                  <b style={{ display: "block", color: "#FFFFFF", fontSize: 13.5 }}>{item.t}</b>
                  <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{item.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LLAMADA A LA ACCIÓN FINAL */}
      <section>
        <div className="growth-final-box">
          <h3 className="growth-final-title">¿Listo para dar el salto con el <span className="h-grad">Plan Crecimiento</span>?</h3>
          <p className="growth-final-desc">En 2 semanas tu web estará lista para recibir visitas, transmitir autoridad y convertirlas en clientes.</p>
          <div style={{ display: "inline-block", margin: "0 auto" }}>
            <Btn glossy href={homeHref("#contact")} style={{ fontSize: 16.5, padding: "18px 38px", fontWeight: 700 }}>
              Solicitar Plan Crecimiento (750€) →
            </Btn>
          </div>
          <div className="growth-final-trust">
            <span>✓ Pago único sin cuotas ocultas</span>
            <span>✦ Trato directo 1 a 1</span>
            <span>⚡ Entrega estimada en 2 semanas</span>
          </div>
        </div>
      </section>
    </PlanShell>
  );
}

function PorHoras() {
  return (
    <PlanShell>
      <section className="shead">
        <div className="eyebrow" style={{ margin: "0 auto 22px" }}><span className="dot" /><span>Agilidad y Precisión</span></div>
        <h1 className="display" style={{ fontSize: "clamp(30px,4.5vw,46px)" }}>Servicio <span className="h-grad">Por Horas</span></h1>
        <p className="lead" style={{ margin: "0 auto" }}>Flexibilidad total para proyectos dinámicos. Sin compromisos a largo plazo, solo resultados rápidos y eficientes.</p>
      </section>

      <div className="plan-grid">
        <PlanCard className="plan-span-7">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <PlanFeatureIcon><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></PlanFeatureIcon>
            <h2 style={{ margin: 0 }}>Tarifa Flexible</h2>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 26 }}>
            <span style={{ fontFamily: "var(--display)", fontSize: 48, fontWeight: 800, color: "#fff" }}>35€</span>
            <span style={{ color: "var(--muted)" }}>/ hora</span>
          </div>
          <div className="plan-included-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {["Mínimo 2 horas","Sin permanencia","Estimaciones previas","Entrega acelerada"].map((t,i)=>(
              <div key={i} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 10, padding: 12 }}><span style={{color:"#92BBFF",fontWeight:700,marginRight:8}}>✓</span>{t}</div>
            ))}
          </div>
        </PlanCard>
        <div className="plan-span-5 plan-highlight-card">
          <PlanFeatureIcon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></PlanFeatureIcon>
          <h3>¿Necesitas un cambio rápido?</h3>
          <p>Cuéntanos qué necesitas y nos ponemos manos a la obra.</p>
          <Btn glossy href={homeHref("#contact")} style={{ width: "100%", justifyContent: "center" }}>
            Solicitar Presupuesto →
          </Btn>
        </div>
        <PlanCard className="plan-span-4">
          <PlanFeatureIcon><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/></PlanFeatureIcon>
          <h4>Mantenimiento</h4>
          <p>Actualizaciones de CMS, resolución de bugs, optimización de velocidad y ajustes técnicos.</p>
        </PlanCard>
        <PlanCard className="plan-span-4">
          <PlanFeatureIcon><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></PlanFeatureIcon>
          <h4>Diseño y Contenido</h4>
          <p>Modificaciones visuales puntuales, copy, rediseño de componentes y nuevos assets.</p>
        </PlanCard>
        <PlanCard className="plan-span-4">
          <PlanFeatureIcon><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></PlanFeatureIcon>
          <h4>Nuevas Funciones</h4>
          <p>Nuevas secciones, integración de APIs ligeras, formularios avanzados o landing pages.</p>
        </PlanCard>
      </div>
    </PlanShell>
  );
}

function TiendaOnline() {
  return (
    <PlanShell>
      <section className="shead" style={{ maxWidth: 780 }}>
        <div className="eyebrow" style={{ margin: "0 auto 20px" }}><span className="dot" /><span>Plan E-commerce</span></div>
        <h1 className="display h-grad" style={{ fontSize: "clamp(28px,4vw,42px)" }}>Expande tus fronteras con una Tienda Online de alto rendimiento</h1>
        <p className="lead" style={{ margin: "0 auto 24px" }}>Diseñada para escalar. Catálogos visuales impactantes, pagos seguros e integrados, y una gestión de pedidos que simplifica tu día a día.</p>
        <div className="plan-cta-row" style={{ justifyContent: "center" }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "block", fontFamily: "var(--display)", fontSize: 26, fontWeight: 800, color: "#fff" }}>Desde 1.200€</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>El precio final se ajusta al volumen de tu catálogo</span>
          </div>
          <Btn glossy href={homeHref("#contact")}>Configurar mi tienda →</Btn>
        </div>
      </section>

      <section>
        <div className="shead" style={{ textAlign: "left", margin: "0 0 32px" }}><h2 className="display" style={{fontSize:28}}>Arquitectura de Conversión</h2><p className="lead">Funcionalidades core diseñadas para maximizar ventas y minimizar fricción.</p></div>
        <div className="plan-grid">
          <PlanCard className="plan-span-8">
            <PlanFeatureIcon><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></PlanFeatureIcon>
            <h3>Catálogo Visual Dinámico</h3>
            <p>Galerías de productos optimizadas para velocidad de carga y visualización en alta resolución.</p>
          </PlanCard>
          <PlanCard className="plan-span-4">
            <PlanFeatureIcon><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></PlanFeatureIcon>
            <h3>Pagos Sin Fricción</h3>
            <p>Integración nativa con las pasarelas más fiables.</p>
            <div className="plan-pill-row"><span>Stripe</span><span>Bizum</span><span>Transf.</span></div>
          </PlanCard>
          <PlanCard className="plan-span-4">
            <PlanFeatureIcon><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></PlanFeatureIcon>
            <h3>Gestión Centralizada</h3>
            <p>Panel de control para administrar stock, envíos y comunicación con el cliente.</p>
          </PlanCard>
          <PlanCard className="plan-span-8">
            <PlanFeatureIcon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></PlanFeatureIcon>
            <h3>Experiencia de Carrito Fluida</h3>
            <p>Evitamos el abandono de carritos con un flujo de compra lógico y adaptado a móviles.</p>
          </PlanCard>
        </div>
      </section>

      <section style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 56 }}>
        <div style={{ display: "flex", gap: 48, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 className="display" style={{ fontSize: 28, marginBottom: 16 }}>Arquitectura que escala con tu inventario</h2>
            <p className="lead" style={{ marginBottom: 20 }}>El precio base de 1.200€ incluye una estructura robusta preparada para ventas. La inversión final se adapta a la complejidad y volumen de tu catálogo.</p>
            {["Carga masiva de productos (CSV/API)","Optimización automática de imágenes","Estructura SEO técnica integrada"].map((t,i)=>(
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, color: "#E7ECFB", fontWeight: 500 }}><span style={{color:"#92BBFF"}}>✓</span>{t}</div>
            ))}
          </div>
          <PlanCard className="plan-price-table" style={{ flex: 1, minWidth: 300 }}>
            <div className="plan-price-table__row"><div><span>Base Tecnológica</span><b>Core Tienda Online</b></div><b className="plan-price-table__amt">1.200€</b></div>
            <div className="plan-price-table__row" style={{opacity:.75}}><div><span>Variable</span><b>Volumen de Catálogo</b></div><span>A presupuestar</span></div>
            <div className="plan-price-table__row" style={{opacity:.75, borderBottom:"none"}}><div><span>Opcional</span><b>Migración de datos</b></div><span>Consultar</span></div>
          </PlanCard>
        </div>
      </section>
    </PlanShell>
  );
}

/* ---------- páginas legales ---------- */
function LegalPage({ title, updated, children }) {
  return (
    <PlanShell>
      <section className="legal-page">
        <Reveal className="eyebrow" as="div"><span className="dot" /><span>Información legal</span></Reveal>
        <Reveal delay={80}><h1 className="display" style={{ fontSize: "clamp(28px,4vw,42px)", margin: "18px 0 8px" }}>{title}</h1></Reveal>
        <Reveal delay={140}><p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 40 }}>Última actualización: {updated}</p></Reveal>
        <Reveal delay={200}>
          <PlanCard className="legal-page__card">
            <div className="legal-page__body">{children}</div>
          </PlanCard>
        </Reveal>
      </section>
    </PlanShell>
  );
}

function AvisoLegal() {
  return (
    <LegalPage title="Aviso Legal" updated="30 de agosto de 2026">
      <p><strong>Aviso:</strong> este apartado contiene datos de ejemplo (marcados entre corchetes) que León Webs debe sustituir por los datos reales del negocio antes de publicar la web a clientes.</p>
      <h3>1. Datos del titular</h3>
      <p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa:</p>
      <ul>
        <li>Titular: [Nombre completo o razón social]</li>
        <li>NIF/CIF: [Número de identificación fiscal]</li>
        <li>Domicilio: [Dirección completa, León, España]</li>
        <li>Correo electrónico: hola@leonwebs.es</li>
      </ul>
      <h3>2. Objeto</h3>
      <p>Este sitio web tiene como finalidad presentar los servicios de diseño y desarrollo web ofrecidos por León Webs a negocios de León y alrededores.</p>
      <h3>3. Condiciones de uso</h3>
      <p>El acceso a este sitio web es gratuito y no requiere registro previo. El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para fines ilícitos.</p>
      <h3>4. Propiedad intelectual</h3>
      <p>Los textos, imágenes y diseños de esta web son propiedad de León Webs o de sus clientes (en el caso de las capturas de proyectos mostradas a modo de ejemplo), salvo que se indique lo contrario. Queda prohibida su reproducción sin autorización.</p>
      <h3>5. Legislación aplicable</h3>
      <p>Las presentes condiciones se rigen por la legislación española.</p>
    </LegalPage>
  );
}

function Privacidad() {
  return (
    <LegalPage title="Política de Privacidad" updated="30 de agosto de 2026">
      <h3>1. Responsable del tratamiento</h3>
      <p>León Webs es el responsable del tratamiento de los datos que puedas facilitarnos a través de este sitio web. Puedes contactar en hola@leonwebs.es.</p>
      <h3>2. Qué datos tratamos</h3>
      <p>Esta web <strong>no tiene formularios que envíen datos a un servidor propio</strong>. Los botones de contacto (calculadora de precio, "Agendar", "Ver cómo escalamos", etc.) abren tu programa de correo o WhatsApp con un mensaje ya redactado — los datos que decidas escribir ahí se envían directamente a nuestra bandeja de correo o WhatsApp personal, no se almacenan en ninguna base de datos de León Webs.</p>
      <p>Si nos escribes por correo o WhatsApp, trataremos los datos que nos facilites (nombre, negocio, teléfono, email) únicamente para responder a tu consulta y, si sigues adelante, para gestionar el proyecto contratado.</p>
      <h3>3. Finalidad y legitimación</h3>
      <p>Tratamos tus datos de contacto en base al consentimiento que nos das al escribirnos voluntariamente, con la finalidad de atender tu consulta o gestionar el servicio contratado.</p>
      <h3>4. Conservación</h3>
      <p>Conservamos los datos de contacto mientras dure la relación comercial y, posteriormente, durante los plazos legalmente exigibles.</p>
      <h3>5. Tus derechos</h3>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a hola@leonwebs.es.</p>
      <h3>6. Servicios de terceros</h3>
      <p>Esta web carga las tipografías Outfit e Inter desde Google Fonts, lo que implica una conexión a servidores de Google al visitar la página (puede registrar tu dirección IP). No usamos cookies propias de seguimiento ni herramientas de analítica en este momento.</p>
    </LegalPage>
  );
}

function Cookies() {
  return (
    <LegalPage title="Política de Cookies" updated="30 de agosto de 2026">
      <h3>¿Qué son las cookies?</h3>
      <p>Las cookies son pequeños archivos que algunas webs guardan en tu navegador para recordar información sobre tu visita.</p>
      <h3>Cookies que usa esta web</h3>
      <p><strong>Esta web no instala cookies propias de seguimiento ni de analítica.</strong> Únicamente se produce lo siguiente:</p>
      <ul>
        <li><strong>Google Fonts:</strong> al cargar la página se solicitan las tipografías Outfit e Inter directamente desde los servidores de Google, lo que puede implicar una conexión con Google y el registro técnico de tu IP por su parte, sin que León Webs tenga acceso a esos datos.</li>
      </ul>
      <h3>Cómo desactivar las cookies</h3>
      <p>Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento desde su apartado de ajustes de privacidad. Bloquear la carga de Google Fonts no afecta al funcionamiento de la web, solo puede cambiar ligeramente el aspecto de las letras.</p>
      <h3>Actualizaciones</h3>
      <p>Si en el futuro incorporamos herramientas de analítica o publicidad que sí usen cookies, actualizaremos esta página y solicitaremos tu consentimiento antes de activarlas.</p>
    </LegalPage>
  );
}

function NotFound() {
  return (
    <PlanShell eyebrow="Error 404">
      <Reveal>
        <PlanCard className="notfound-card" style={{ textAlign: "center", padding: "56px 32px" }}>
          <div className="eyebrow" style={{ margin: "0 auto 18px" }}><span className="dot" /><span>Error 404</span></div>
          <h1 style={{ fontSize: "clamp(32px,6vw,48px)", marginBottom: 12 }}>Página no encontrada</h1>
          <p style={{ color: "var(--muted)", fontSize: 18, marginBottom: 32, maxWidth: 460, marginInline: "auto" }}>
            Parece que este enlace no lleva a ningún sitio. Puede que la página se haya movido o que la dirección tenga un error.
          </p>
          <Btn glossy href={homeHref("")}>Volver al inicio</Btn>
        </PlanCard>
      </Reveal>
    </PlanShell>
  );
}

function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("lw_cookies_ok")) setVisible(true);
    } catch (e) { setVisible(true); }
  }, []);
  const accept = () => {
    try { localStorage.setItem("lw_cookies_ok", "1"); } catch (e) {}
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <div className="cookie-banner">
      <p>Usamos únicamente las tipografías de Google Fonts para mostrar la web correctamente — no hay cookies de seguimiento ni analítica. Más info en nuestra <Link to="/cookies">Política de Cookies</Link>.</p>
      <button className="cookie-banner__btn" onClick={accept}>Entendido</button>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan-arranque" element={<PlanArranque />} />
        <Route path="/plan-crecimiento" element={<PlanCrecimiento />} />
        <Route path="/por-horas" element={<PorHoras />} />
        <Route path="/tienda-online" element={<TiendaOnline />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
