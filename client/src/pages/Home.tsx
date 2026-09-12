import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Bell,
  Bolt,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  CloudUpload,
  Copy,
  CreditCard,
  FileCheck2,
  FileText,
  Fingerprint,
  Gauge,
  Grid2X2,
  History,
  LayoutDashboard,
  LifeBuoy,
  ListFilter,
  LockKeyhole,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  UploadCloud,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type View = "overview" | "vehicles" | "documents" | "activity" | "verification" | "analytics" | "settings";

const vehicleImage =
  "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=85";
const secondVehicleImage =
  "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=85";

const navItems: { id: View; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "vehicles", label: "My EVs", icon: Bolt, badge: "02" },
  { id: "documents", label: "Document vault", icon: FileText, badge: "3" },
  { id: "activity", label: "Activity log", icon: Activity },
];

const adminItems: { id: View; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: "verification", label: "Verification queue", icon: ShieldCheck, badge: "08" },
  { id: "analytics", label: "Registry analytics", icon: Grid2X2 },
];

function StatusPill({ status, children }: { status: "active" | "pending" | "warning" | "verified" | "neutral"; children: React.ReactNode }) {
  return (
    <span className={`status-pill ${status}`}><span className="status-dot" />{children}</span>
  );
}

function Sidebar({ view, setView, mobileOpen, setMobileOpen }: { view: View; setView: (view: View) => void; mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  return (
    <>
      {mobileOpen && <div className="mobile-scrim" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand-wrap">
          <div className="brand-mark"><Bolt size={18} strokeWidth={2.8} /></div>
          <div><div className="brand-name">volt<span>path</span></div><div className="brand-sub">EV registry / 01</div></div>
          <button className="close-mobile" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <div className="workspace-switcher"><div className="workspace-icon">AR</div><div className="workspace-copy"><b>My workspace</b><span>Personal account</span></div><ChevronDown size={15} /></div>
        <div className="nav-heading">Workspace</div>
        <nav className="main-nav">
          {navItems.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? "selected" : ""}`} onClick={() => { setView(item.id); setMobileOpen(false); }}><item.icon size={18} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</button>)}
        </nav>
        <div className="nav-heading admin-heading">Operations</div>
        <nav className="main-nav">
          {adminItems.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? "selected" : ""}`} onClick={() => { setView(item.id); setMobileOpen(false); }}><item.icon size={18} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</button>)}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-help"><div className="help-orb"><LifeBuoy size={17} /></div><div><strong>Need a hand?</strong><span>Visit the help center</span></div><ArrowRight size={15} /></div>
        <div className="profile-card"><div className="avatar">AR</div><div className="profile-copy"><strong>Account owner</strong><span>Owner · verified</span></div><button onClick={() => toast("Profile menu is ready for your preferences.")}><MoreHorizontal size={18} /></button></div>
      </aside>
    </>
  );
}

function Topbar({ view, onMenu, onNew, onSearch }: { view: View; onMenu: () => void; onNew: () => void; onSearch: (value: string) => void }) {
  const titles: Record<View, [string, string]> = { overview: ["Overview", "Friday, 12 September 2026"], vehicles: ["My EVs", "Your electric garage"], documents: ["Document vault", "Secure, organised, always accessible"], activity: ["Activity log", "A transparent record of every change"], verification: ["Verification queue", "Review and move applications forward"], analytics: ["Registry analytics", "Signals from your EV ecosystem"], settings: ["Settings", "Manage your VoltPath workspace"] };
  return <header className="topbar"><button className="mobile-menu" onClick={onMenu}><Menu size={21} /></button><div className="page-heading"><h1>{titles[view][0]}</h1><span>{titles[view][1]}</span></div><div className="topbar-actions"><div className="global-search"><Search size={16} /><input aria-label="Search" placeholder="Search VIN, vehicle or document" onChange={(e) => onSearch(e.target.value)} /><kbd>⌘ K</kbd></div><button className="icon-button notification-button" onClick={() => toast("You're all caught up — no new notifications.")}><Bell size={19} /><i /></button><button className="add-button" onClick={onNew}><Plus size={17} /> <span>Add new EV</span></button></div></header>;
}

function StatCard({ label, value, detail, icon, accent, onClick }: { label: string; value: string; detail: string; icon: React.ReactNode; accent: string; onClick?: () => void }) {
  return <button className="stat-card" onClick={onClick}><div className={`stat-icon ${accent}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div><ArrowRight className="stat-arrow" size={16} /></button>;
}

function BatteryGauge({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 39;
  return <div className="battery-gauge"><svg viewBox="0 0 100 100"><circle className="gauge-track" cx="50" cy="50" r="39" /><circle className="gauge-value" cx="50" cy="50" r="39" strokeDasharray={circumference} strokeDashoffset={circumference - circumference * value / 100} /></svg><div className="gauge-copy"><strong>{value}%</strong><span>health</span></div></div>;
}

function Overview({ setView, onNew }: { setView: (view: View) => void; onNew: () => void }) {
  return <div className="page-content animate-in">
    <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> SYSTEM OPERATIONAL</div><h2>Welcome to your EV workspace<span className="accent-dot">.</span></h2><p>Your EV workspace is ready when you are. Start by adding your first vehicle.</p></div><button className="date-chip"><Clock3 size={15} /> Sep 2026 <ChevronDown size={14} /></button></div>
    <div className="stats-grid"><StatCard label="Total EVs" value="00" detail="No vehicles yet" icon={<Bolt size={19} />} accent="teal" onClick={() => setView("vehicles")} /><StatCard label="Active registrations" value="00" detail="Add your first EV" icon={<ShieldCheck size={19} />} accent="violet" /><StatCard label="In verification" value="00" detail="No pending reviews" icon={<Clock3 size={19} />} accent="amber" onClick={() => setView("verification")} /><StatCard label="Documents" value="00 / 00" detail="No documents yet" icon={<FileCheck2 size={19} />} accent="blue" onClick={() => setView("documents")} /></div>
    <div className="dashboard-grid">
      <section className="panel fleet-panel empty-panel"><div className="section-header"><div><div className="section-kicker">YOUR GARAGE</div><h3>Electric fleet <span>· nothing here yet</span></h3></div></div><div className="empty-state large"><div className="empty-orb teal"><Bolt size={24} /></div><h4>Your garage is ready for its first EV</h4><p>Register a vehicle to track its battery health, documents, insurance, and lifecycle in one place.</p><button className="primary-button" onClick={onNew}><Plus size={17} /> Register your first EV</button></div></section>
      <div className="right-rail"><section className="panel empty-side-panel"><div className="section-header"><div><div className="section-kicker">ATTENTION NEEDED</div><h3>Nothing needs attention</h3></div><span className="alert-count">0</span></div><div className="empty-state compact"><div className="empty-orb amber"><Bell size={18} /></div><p>Alerts will appear here once you add an EV and its records.</p></div></section><section className="panel empty-side-panel"><div className="section-header"><div><div className="section-kicker">RECENT ACTIVITY</div><h3>Your timeline is clear</h3></div><History size={18} className="muted-icon" /></div><div className="empty-state compact"><div className="empty-orb violet"><Activity size={18} /></div><p>Uploads, approvals, and updates will show up here.</p></div></section></div>
    </div>
    <section className="bottom-insight"><div className="insight-icon"><Sparkles size={19} /></div><div><span>VOLTPath READY</span><strong>Your EV workspace is set up for your first registration.</strong></div><p>Start with a vehicle and VoltPath will build your digital record as you go.</p><button onClick={onNew}>Register an EV <ArrowRight size={15} /></button></section>
  </div>;
}

function ActivityRow({ icon, color, title, meta }: { icon: React.ReactNode; color: string; title: string; meta: string }) { return <div className="activity-row"><div className={`activity-icon ${color}`}>{icon}</div><div><strong>{title}</strong><span>{meta}</span></div><span className="activity-check"><Check size={13} /></span></div>; }

function Vehicles({ onNew }: { setView: (view: View) => void; onNew: () => void }) { return <div className="page-content animate-in"><div className="list-toolbar"><div><h2>Your electric garage<span className="accent-dot">.</span></h2><p>Every vehicle, record and milestone in one place.</p></div><button className="primary-button" onClick={onNew}><Plus size={17} /> Register EV</button></div><section className="panel empty-page-panel"><div className="empty-state large"><div className="empty-orb teal"><Bolt size={27} /></div><h4>Your electric garage is empty</h4><p>Register your first EV to unlock battery health, documents, insurance, warranties, and service history.</p><button className="primary-button" onClick={onNew}><Plus size={17} /> Register your first EV</button></div></section></div>; }
function VehicleLarge({ name, year, status, image, range, health, registration, pending, onOpen }: { name: string; year: string; status: string; image: string; range: string; health: string; registration: string; pending?: boolean; onOpen: () => void }) { return <article className="vehicle-card"><div className="vehicle-card-image" style={{ backgroundImage: `url(${image})` }}><div className="vehicle-card-top"><StatusPill status={pending ? "pending" : "active"}>{status}</StatusPill><button className="icon-button image-more"><MoreHorizontal size={18} /></button></div><span className="year-badge">{year}</span></div><div className="vehicle-card-body"><div className="vehicle-card-name"><div><span>EV PROFILE</span><h3>{name}</h3></div><button className="circle-arrow" onClick={onOpen}><ArrowRight size={17} /></button></div><div className="card-spec-grid"><div><span>EST. RANGE</span><strong>{range}</strong></div><div><span>BATTERY</span><strong>{health}</strong></div><div><span>REGISTRATION</span><strong className={pending ? "amber-text" : ""}>{registration}</strong></div></div><button className="full-outline" onClick={onOpen}>{pending ? "Continue registration" : "View vehicle profile"} <ArrowRight size={15} /></button></div></article>; }

function Documents({ onUpload }: { onUpload: () => void }) { return <div className="page-content animate-in"><div className="list-toolbar"><div><h2>Everything in its place<span className="accent-dot">.</span></h2><p>Your secure digital vault for every EV record.</p></div><button className="primary-button" onClick={onUpload}><UploadCloud size={17} /> Upload document</button></div><div className="vault-banner"><div className="vault-shield"><LockKeyhole size={20} /></div><div><strong>Your documents are encrypted and private.</strong><span>Start by registering an EV, then upload its records here.</span></div></div><section className="panel empty-page-panel"><div className="empty-state large"><div className="empty-orb blue"><FileText size={25} /></div><h4>Your document vault is empty</h4><p>Registration certificates, insurance policies, invoices, and warranties will appear here after you add a vehicle.</p><button className="soft-action standalone" onClick={onUpload}><UploadCloud size={16} /> Upload your first document</button></div></section></div>; }

function ActivityPage() { return <div className="page-content animate-in"><div className="list-toolbar"><div><h2>A transparent record<span className="accent-dot">.</span></h2><p>Every upload, approval and update will be logged here.</p></div><button className="filter-button"><Clock3 size={15} /> Last 30 days <ChevronDown size={14} /></button></div><section className="panel empty-page-panel"><div className="empty-state large"><div className="empty-orb violet"><History size={25} /></div><h4>Your activity log is empty</h4><p>Once you register an EV or upload a document, every important change will be recorded here.</p></div></section></div>; }

function Verification({ onToast }: { onToast: (message: string) => void }) { void onToast; return <div className="page-content animate-in"><div className="queue-overview"><div><div className="eyebrow"><span className="live-dot" /> VERIFIER WORKSPACE</div><h2>Move the queue forward<span className="accent-dot">.</span></h2><p>Applications will appear here once users submit EV registrations.</p></div><div className="queue-stat"><span>PENDING APPLICATIONS</span><strong>00</strong><small>Queue is clear</small></div><div className="queue-stat"><span>APPROVAL RATE</span><strong>—</strong><small>No applications yet</small></div></div><section className="panel empty-page-panel"><div className="empty-state large"><div className="empty-orb teal"><ShieldCheck size={27} /></div><h4>No applications to review</h4><p>The verification queue is empty. Submitted registrations will appear here with their documents and review actions.</p></div></section></div>; }
function ChecklistRow({ name, done }: { name: string; done: boolean }) { return <div className="checklist-row"><div className={`check-box ${done ? "done" : ""}`}>{done ? <Check size={13} /> : <AlertCircle size={13} />}</div><span>{name}</span><small>{done ? "Verified" : "Missing"}</small><ArrowRight size={14} /></div>; }

function Analytics() { return <div className="page-content animate-in"><div className="list-toolbar"><div><h2>Signals worth watching<span className="accent-dot">.</span></h2><p>Insights will appear as the registry grows.</p></div><button className="filter-button"><Clock3 size={15} /> This quarter <ChevronDown size={14} /></button></div><section className="panel empty-page-panel"><div className="empty-state large"><div className="empty-orb violet"><Grid2X2 size={25} /></div><h4>Your analytics will grow with your registry</h4><p>Once registrations and verification activity begin, VoltPath will surface approval trends, processing time, manufacturers, and more.</p></div></section></div>; }
function MakeRow({ name, value, width, color }: { name: string; value: string; width: string; color: string }) { return <div className="make-row"><div><span className={`make-dot ${color}`} />{name}</div><b>{value}</b><div className="make-bar"><i className={color} style={{ width }} /></div></div>; }

function SettingsPage() { return <div className="page-content animate-in"><div className="list-toolbar"><div><h2>Settings<span className="accent-dot">.</span></h2><p>Your workspace, your preferences, your control.</p></div><button className="primary-button" onClick={() => toast("Preferences saved.")}><Check size={16} /> Save changes</button></div><div className="settings-grid"><section className="panel settings-nav"><button className="active"><UserRound size={17} /> Profile</button><button><Bell size={17} /> Notifications</button><button><LockKeyhole size={17} /> Security</button><button><Users size={17} /> Team access</button></section><section className="panel settings-form"><div className="section-kicker">PROFILE DETAILS</div><h3>How VoltPath knows you</h3><p className="settings-muted">This information is used to pre-fill your registration applications.</p><div className="form-grid"><label>Full name<input value="" placeholder="Your full name" /></label><label>Email address<input value="" placeholder="you@example.com" /></label><label>Phone number<input value="+91 98765 43210" readOnly /></label><label>Country / region<input value="India" readOnly /></label><label className="wide">Address<input value="24 Green Avenue, Bengaluru, Karnataka 560001" readOnly /></label></div><div className="security-callout"><div className="callout-icon"><ShieldCheck size={18} /></div><div><strong>Your identity is verified</strong><span>Verified on 28 Aug 2026 via secure identity check.</span></div><StatusPill status="verified">Verified</StatusPill></div></section></div></div>; }

function RegistrationWizard({ onClose, onDone }: { onClose: () => void; onDone: () => void }) { const [step, setStep] = useState(1); const [submitted, setSubmitted] = useState(false); const steps = ["Owner", "Vehicle", "Battery", "Documents", "Review"]; const stepDetails = [{ title: "Let's start with the owner", sub: "Confirm the person responsible for this EV." }, { title: "Tell us about your EV", sub: "A few essentials help us create its identity." }, { title: "Power under the hood", sub: "Capture the battery details that matter." }, { title: "Secure the paperwork", sub: "Upload the documents needed to verify this registration." }, { title: "Ready for liftoff", sub: "Review the details before you submit." }]; if (submitted) return <div className="modal-overlay"><div className="success-modal"><div className="success-orb"><Check size={31} /></div><div className="eyebrow"><span className="live-dot" /> REGISTRATION SUBMITTED</div><h2>You're on the <span className="teal-text">right track.</span></h2><p>Your EV registration is now in the verification queue.</p><div className="reg-id"><span>REGISTRATION ID</span><strong>Generated after verification <Copy size={15} /></strong></div><div className="success-next"><div><span>Next up</span><strong>Verification by the VoltPath team</strong></div><span>Usually within 1 business day</span></div><button className="primary-button full-width" onClick={onDone}>Return to overview <ArrowRight size={16} /></button></div></div>; return <div className="modal-overlay"><div className="wizard-modal"><div className="wizard-top"><div><div className="brand-name dark">volt<span>path</span></div><span className="wizard-label">NEW EV REGISTRATION</span></div><button className="icon-button" onClick={onClose}><X size={19} /></button></div><div className="wizard-progress">{steps.map((item, i) => <div className={`wizard-step ${step >= i + 1 ? "done" : ""} ${step === i + 1 ? "current" : ""}`} key={item}><div>{step > i + 1 ? <Check size={13} /> : i + 1}</div><span>{item}</span></div>)}</div><div className="wizard-body"><div className="wizard-copy"><span>STEP 0{step} OF 05</span><h2>{stepDetails[step - 1].title}</h2><p>{stepDetails[step - 1].sub}</p></div>{step === 1 && <div className="wizard-fields"><label>Owner name<input value="" placeholder="Your full name" /></label><label>Email address<input value="" placeholder="you@example.com" /></label><label className="wide">Registration purpose<select defaultValue="Personal vehicle"><option>Personal vehicle</option><option>Company vehicle</option><option>Fleet / commercial</option></select></label><div className="prefill-note"><Sparkles size={16} /><span>You can update these details before submitting.</span></div></div>}{step === 2 && <div className="wizard-fields"><label>Manufacturer<input placeholder="e.g. Polestar" defaultValue="" /></label><label>Model<input placeholder="e.g. Polestar 4" defaultValue="" /></label><label>Model year<select defaultValue="select-year"><option value="select-year" disabled>Select model year</option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option></select></label><label>VIN / chassis number<input placeholder="17-character VIN" defaultValue="" /></label><label className="wide">Exterior colour<input placeholder="e.g. Snow white" defaultValue="" /></label></div>}{step === 3 && <div className="wizard-fields"><label>Battery capacity<input defaultValue="" /><small>kWh</small></label><label>Usable capacity<input defaultValue="" /><small>kWh</small></label><label>Battery serial number<input defaultValue="" /></label><label>Estimated range<input defaultValue="" /><small>mi</small></label><div className="battery-preview wide"><BatteryGauge value={0} /><div><span>INITIAL BATTERY HEALTH</span><strong>Not available yet</strong><p>Based on the specifications you entered.</p></div></div></div>}{step === 4 && <div className="wizard-fields"><div className="upload-zone wide"><div className="upload-icon"><UploadCloud size={23} /></div><strong>Drop documents here, or <u>browse files</u></strong><span>PDF, JPG or PNG · up to 10 MB each</span></div><div className="upload-file wide muted-upload"><div className="doc-icon missing"><FileText size={18} /></div><div><strong>Required document</strong><span>No document uploaded yet</span></div><button onClick={() => toast("File picker opened.")}>Add file <Plus size={14} /></button></div><div className="upload-file wide muted-upload"><div className="doc-icon missing"><FileText size={18} /></div><div><strong>Identity proof</strong><span>Required before submission</span></div><button onClick={() => toast("File picker opened.")}>Add file <Plus size={14} /></button></div></div>}{step === 5 && <div className="review-summary"><ReviewSummaryRow label="Owner" value="Not entered yet" /><ReviewSummaryRow label="Vehicle" value="Not entered yet" /><ReviewSummaryRow label="Battery" value="Not entered yet" /><ReviewSummaryRow label="Documents" value="0 of 2 attached · Required documents missing" warning /></div>}</div><div className="wizard-footer"><button className="back-button" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>{step === 1 ? "Cancel" : <><ArrowLeft size={15} /> Back</>}</button><div><span className="save-copy"><Check size={14} /> Draft saved just now</span><button className="primary-button" onClick={() => step === 5 ? setSubmitted(true) : setStep(step + 1)}>{step === 5 ? "Submit for verification" : "Continue"} <ArrowRight size={16} /></button></div></div></div></div>; }
function ReviewSummaryRow({ label, value, warning }: { label: string; value: string; warning?: boolean }) { return <div className="review-summary-row"><span>{label}</span><strong className={warning ? "amber-text" : ""}>{value}</strong><button><ArrowRight size={15} /></button></div>; }

export default function Home() { const [view, setView] = useState<View>("overview"); const [wizardOpen, setWizardOpen] = useState(false); const [mobileOpen, setMobileOpen] = useState(false); const [search, setSearch] = useState(""); const showToast = (message: string) => toast(message); const content = useMemo(() => { if (search.trim()) return <SearchResults query={search} setView={setView} />; switch (view) { case "vehicles": return <Vehicles setView={setView} onNew={() => setWizardOpen(true)} />; case "documents": return <Documents onUpload={() => toast("Upload panel opened — choose a vehicle first.")} />; case "activity": return <ActivityPage />; case "verification": return <Verification onToast={showToast} />; case "analytics": return <Analytics />; case "settings": return <SettingsPage />; default: return <Overview setView={setView} onNew={() => setWizardOpen(true)} />; } }, [view, search]); return <div className="app-shell"><Sidebar view={view} setView={setView} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} /><main className="main-shell"><Topbar view={view} onMenu={() => setMobileOpen(true)} onNew={() => setWizardOpen(true)} onSearch={setSearch} />{content}</main>{wizardOpen && <RegistrationWizard onClose={() => setWizardOpen(false)} onDone={() => { setWizardOpen(false); setView("overview"); toast("Welcome back to your overview."); }} />}</div>; }

function SearchResults({ query, setView }: { query: string; setView: (view: View) => void }) { void setView; return <div className="page-content animate-in"><div className="search-result-heading"><div className="eyebrow"><Search size={14} /> SEARCH RESULTS</div><h2>No records found<span className="accent-dot">.</span></h2><p>There are no vehicles, registrations, or documents matching “{query}”.</p></div><section className="panel empty-page-panel"><div className="empty-state large"><div className="empty-orb blue"><Search size={25} /></div><h4>Your search is clear</h4><p>Once you add an EV or upload a document, matching records will appear here.</p></div></section></div>; }

// Keep a small reference to imported icons used by design tokens in future screens.
void [Settings, LogOut, CircleHelp, SlidersHorizontal];
