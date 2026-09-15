import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BatteryCharging, Bolt, Check, CircleHelp, LockKeyhole, UserRound, Zap } from "lucide-react";
import { startLogin } from "@/const";
import { LOGIN_TRUST_POINTS } from "@shared/loginExperience";

type LoginStep = "choice" | "register" | "help";

export default function Login() {
  const [step, setStep] = useState<LoginStep>("choice");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`route-login-page ${ready ? "is-ready" : ""}`}>
      <section className="route-hero">
        <div className="route-brand"><span className="route-brand-mark"><Bolt size={14} /></span><span>Volt Route</span></div>
        <div className="route-map" aria-hidden="true">
          <svg viewBox="0 0 900 640" preserveAspectRatio="xMidYMax slice"><path className="route-path" d="M -40 340 C 120 260, 160 420, 300 360 S 520 220, 620 300 S 760 460, 900 380" /><g className="route-node"><circle cx="10" cy="330" r="5" /></g><g className="route-node charged"><circle cx="300" cy="360" r="5.5" /></g><g className="route-node"><circle cx="470" cy="255" r="5" /></g><g className="route-node charged"><circle cx="620" cy="300" r="5.5" /></g><g className="route-node"><circle cx="790" cy="430" r="5" /></g><circle className="route-pulse" r="3.4" /></svg>
        </div>
        <div className="route-hero-copy"><h1>One registration.<br />Every charging bay on your route.</h1><p>Volt Route links your driver profile to the charging network — plan stops, verify your identity at the bay, and get moving again without paperwork.</p><div className="route-stats"><div><strong>2,300+</strong><span>charging bays live</span></div><div><strong>4 min</strong><span>average sign-up</span></div><div><strong>24/7</strong><span>help desk coverage</span></div></div></div>
      </section>

      <section className="route-stage"><div className="route-card">
        {step !== "choice" && <button className="route-back" onClick={() => setStep("choice")}><ArrowLeft size={14} /> Back</button>}
        {step === "choice" && <><p className="route-eyebrow">Driver access</p><h2>How can we help you today?</h2><p className="route-sub">Pick the option that matches where you are in the process.</p><div className="route-choices"><button className="route-choice" onClick={() => setStep("register")}><span className="route-choice-icon"><UserRound size={19} /></span><span><strong>New Login</strong><small>Register your details for the first time</small></span><ArrowRight size={17} /></button><button className="route-choice" onClick={() => setStep("help")}><span className="route-choice-icon"><CircleHelp size={19} /></span><span><strong>Request Help</strong><small>Already registered — verify and continue</small></span><ArrowRight size={17} /></button></div></>}
        {step === "register" && <AccessStep eyebrow="New Login" title="Set up your registration" sub="Create your secure VoltPath profile and continue to the EV workspace." icon={<UserRound size={21} />} action="Continue with secure sign-in" onAction={startLogin} />}
        {step === "help" && <AccessStep eyebrow="Request Help" title="Your linked help project goes here" sub="This entry is reserved for the separate project you want to connect. No AutoSwap request, rental, or sign-in operation is attached to it now." icon={<LockKeyhole size={21} />} action="Awaiting linked project" onAction={() => undefined} disabled />}
      </div><div className="route-footer"><span>Secure access powered by VoltPath</span><span>{LOGIN_TRUST_POINTS.join(" · ")}</span></div></section>
    </div>
  );
}

function AccessStep({ eyebrow, title, sub, icon, action, onAction, disabled }: { eyebrow: string; title: string; sub: string; icon: React.ReactNode; action: string; onAction: () => void; disabled?: boolean }) {
  return <div className="route-access"><div className="route-access-icon">{icon}</div><p className="route-eyebrow">{eyebrow}</p><h2>{title}</h2><p className="route-sub">{sub}</p><div className="route-secure-note"><span><Check size={14} /></span><div><strong>Integration slot cleared</strong><small>No AutoSwap request, rental, or authentication action runs from this option.</small></div></div><button className="route-primary" onClick={onAction} disabled={disabled}>{action}<ArrowRight size={16} /></button></div>;
}
