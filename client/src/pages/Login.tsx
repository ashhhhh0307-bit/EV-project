import { useEffect, useState } from "react";
import { ArrowRight, BatteryCharging, Bolt, Check, LockKeyhole, Menu, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { startLogin } from "@/const";
import { LOGIN_TRUST_POINTS } from "@shared/loginExperience";

const orbitItems = [
  { label: "Battery health", value: "94%", className: "orbit-card battery-card", icon: <BatteryCharging size={16} /> },
  { label: "Documents", value: "Encrypted", className: "orbit-card vault-card", icon: <LockKeyhole size={15} /> },
  { label: "Registry status", value: "Verified", className: "orbit-card verified-card", icon: <ShieldCheck size={15} /> },
];

export default function Login() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`login-page ${revealed ? "is-revealed" : ""}`}>
      <div className="login-noise" />
      <div className="energy-grid" />
      <div className="energy-glow glow-one" />
      <div className="energy-glow glow-two" />
      <div className="energy-glow glow-three" />
      <div className="login-particles" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}
      </div>

      <header className="login-nav">
        <a className="login-brand" href="/" aria-label="VoltPath home"><span className="login-brand-mark"><Bolt size={19} strokeWidth={2.7} /></span><span><b>volt<span>path</span></b><small>EV REGISTRY / 01</small></span></a>
        <div className="login-nav-links"><a href="#why-voltpath">Why VoltPath</a><a href="#security">Security</a><a href="#support">Support</a></div>
        <div className="login-nav-meta"><span><i className="online-dot" /> SYSTEMS OPERATIONAL</span><button className="login-menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Open menu">{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
      </header>
      {mobileOpen && <div className="login-mobile-links"><a href="#why-voltpath" onClick={() => setMobileOpen(false)}>Why VoltPath</a><a href="#security" onClick={() => setMobileOpen(false)}>Security</a><a href="#support" onClick={() => setMobileOpen(false)}>Support</a></div>}

      <main className="login-main">
        <section className="login-copy">
          <div className="login-eyebrow"><span className="eyebrow-line" /> THE IDENTITY LAYER FOR YOUR EV</div>
          <h1>Own the<br /><em>electric</em> future<span className="login-period">.</span></h1>
          <p className="login-description">One calm, intelligent place for your vehicle, its documents, and every mile ahead.</p>
          <button className="login-cta" onClick={() => startLogin()}><span>Enter your workspace</span><span className="cta-arrow"><ArrowRight size={17} /></span></button>
          <div className="login-trust">{LOGIN_TRUST_POINTS.map((point) => <span key={point}><Check size={13} /> {point}</span>)}</div>
        </section>

        <section className="login-visual" aria-label="VoltPath vehicle intelligence preview">
          <div className="visual-label label-top"><span>LIVE VEHICLE SIGNAL</span><i /></div>
          <div className="visual-ring ring-outer" /><div className="visual-ring ring-mid" /><div className="visual-ring ring-inner" />
          <div className="energy-core"><div className="core-aura" /><div className="core-bolt"><Zap size={36} fill="currentColor" /></div><div className="core-pulse pulse-one" /><div className="core-pulse pulse-two" /></div>
          <div className="orbit-line orbit-left" /><div className="orbit-line orbit-right" />
          {orbitItems.map((item, index) => <div className={`${item.className} ${index === 1 ? "delay-two" : index === 2 ? "delay-three" : ""}`} key={item.label}><div className="orbit-icon">{item.icon}</div><div><span>{item.label}</span><strong>{item.value}</strong></div></div>)}
          <div className="visual-caption"><Sparkles size={14} /><span>Everything you need to move with confidence.</span></div>
          <div className="visual-axis axis-h" /><div className="visual-axis axis-v" />
        </section>
      </main>

      <footer className="login-footer"><span>VOLTPath / 2026</span><span className="footer-center"><i /> A digital home for the electric age</span><span>Made for the journey ahead <ArrowRight size={13} /></span></footer>
      <div className="login-scroll-hint"><span>SCROLL TO EXPLORE</span><i /></div>
    </div>
  );
}
