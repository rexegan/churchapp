import { useState, useEffect } from "react";
import {
  SEED_STAFF, SEED_MINISTRIES, SEED_LIFE_GROUPS,
  SEED_PRAYER, SEED_EVENTS, SEED_TRANSACTIONS,
  SEED_CAMPAIGNS, SEED_ANNOUNCEMENTS, BUDGETS,
  LG_MEETINGS, LG_ATTENDANCE
} from "./data.js";

// ── Persistent storage hook ───────────────────────────────────────────────────
function useStored(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      if (window.storage) {
        const s = window.storage.getItem(key);
        return s !== null ? JSON.parse(s) : defaultValue;
      }
    } catch {}
    try {
      const s = localStorage.getItem(key);
      return s !== null ? JSON.parse(s) : defaultValue;
    } catch {}
    return defaultValue;
  });
  useEffect(() => {
    try { if (window.storage) { window.storage.setItem(key, JSON.stringify(value)); return; } } catch {}
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

const C = {
  bg: "#f0f4f8", surface: "#ffffff", card: "#ffffff", border: "#d1dce8",
  accent: "#2563eb", accent2: "#6366f1", gold: "#d97706", green: "#059669",
  red: "#dc2626", purple: "#7c3aed", pink: "#db2777", text: "#1e293b",
  muted: "#64748b", dim: "#475569",
};


const fmt$ = n => "$" + Number(n).toLocaleString();
const fmtPct = (a, b) => b ? Math.round((a / b) * 100) + "%" : "0%";
const today = () => new Date().toISOString().slice(0, 10);

function Badge({ label, color = C.accent }) {
  return (
    <span style={{ background: color + "10", color, border: `1px solid ${color}33`, borderRadius: 5, padding: "2px 10px", fontSize: 12, fontWeight: 600, letterSpacing: 0.2, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

// Professional line-style SVG icons, keyed by the emoji they replace.
// Unknown glyphs fall back to rendering the emoji itself.
const ICON_PATHS = {
  "🏠": "M3 10.5 12 3l9 7.5 M5 9.5V21h14V9.5 M9.5 21v-6h5v6",
  "📅": "M8 2v4 M16 2v4 M3 9h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  "⛪": "M12 3v4 M10 5h4 M6 21V11l6-4.5 6 4.5v10 M4 21h16 M10 21v-4.5h4V21",
  "💰": "M12 3v18 M16.5 6.5H10a2.75 2.75 0 0 0 0 5.5h4a2.75 2.75 0 0 1 0 5.5H7",
  "👔": "M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z M8.5 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2",
  "📢": "M4 10v4h3.5l5 4.5v-13L7.5 10H4z M15.5 9.5a4 4 0 0 1 0 5 M18 7a7.5 7.5 0 0 1 0 10",
  "📣": "M4 10v4h3.5l5 4.5v-13L7.5 10H4z M15.5 9.5a4 4 0 0 1 0 5 M18 7a7.5 7.5 0 0 1 0 10",
  "👥": "M16.5 21v-2a4 4 0 0 0-4-4h-6a4 4 0 0 0-4 4v2 M9.5 11a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5 M21.5 21v-2a4 4 0 0 0-3-3.87 M15 3.63a3.75 3.75 0 0 1 0 7.25",
  "✅": "M21.5 11.2V12a9.5 9.5 0 1 1-5.6-8.65 M21.5 4.5 12 14l-2.75-2.75",
  "🏖": "M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19z M12 6.5V12l3.5 3.5",
  "🙏": "M20.6 5a5.3 5.3 0 0 0-7.5 0L12 6.1 10.9 5a5.3 5.3 0 0 0-7.5 7.5l1.1 1.1L12 21l7.5-7.4 1.1-1.1a5.3 5.3 0 0 0 0-7.5z",
  "📈": "M22 7l-8.5 8.5-4.5-4.5L2 18 M16.5 7H22v5.5",
  "📉": "M22 17l-8.5-8.5-4.5 4.5L2 6 M16.5 17H22v-5.5",
  "📊": "M18 20V10 M12 20V4 M6 20v-6",
  "🏢": "M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M3 21h18 M9.5 7h1 M14 7h1 M9.5 11h1 M14 11h1 M9.5 15h1 M14 15h1",
  "📝": "M11.5 4.5H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h12.5a2 2 0 0 0 2-2v-6.5 M17.9 2.9a2.2 2.2 0 0 1 3.1 3.1L12 15l-4.2 1.1L9 12 17.9 2.9z",
  "🟢": "M21.5 12h-4l-3 8.5-5-17-3 8.5h-4",
  "👁": "M2 12s3.75-7.5 10-7.5S22 12 22 12s-3.75 7.5-10 7.5S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  "📧": "M4 4.5h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z M21.5 7 12 13.5 2.5 7",
  "🚨": "M12 9.5v4 M12 17h.01 M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  "⭐": "M12 2.5l2.9 5.9 6.6.95-4.75 4.6 1.1 6.55L12 17.4l-5.85 3.1 1.1-6.55L2.5 9.35l6.6-.95L12 2.5z",
};

function Icon({ glyph, size = 20, color = "currentColor", strokeWidth = 1.7 }) {
  const d = ICON_PATHS[glyph];
  if (!d) return <span style={{ fontSize: size, lineHeight: 1 }}>{glyph}</span>;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d={d} />
    </svg>
  );
}

function StatCard({ icon, label, value, sub, color = C.accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.card, border: `1px solid ${hov && onClick ? color : C.border}`,
        borderRadius: 10, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12,
        cursor: onClick ? "pointer" : "default",
        transform: hov && onClick ? "translateY(-2px)" : "none",
        boxShadow: hov && onClick ? "0 8px 24px rgba(15,23,42,0.10)" : "0 1px 3px rgba(15,23,42,0.05)",
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: color + "14", display: "flex", alignItems: "center", justifyContent: "center", color }}>
          <Icon glyph={icon} size={18} />
        </div>
        {sub && <span style={{ fontSize: 11.5, color, background: color + "14", padding: "3px 9px", borderRadius: 5, fontWeight: 600 }}>{sub}</span>}
      </div>
      <div>
        <div style={{ fontSize: 29, fontWeight: 700, color: C.text, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{value}</div>
        <div style={{ fontSize: 14, color: C.muted, fontWeight: 500, marginTop: 4 }}>{label}</div>
      </div>
      {onClick && <div style={{ fontSize: 13, color, fontWeight: 600, letterSpacing: "0.02em" }}>View →</div>}
    </div>
  );
}

function ProgressBar({ value, max, color = C.accent }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: C.border, borderRadius: 99, height: 12, overflow: "hidden" }}>
      <div style={{ width: pct + "%", height: "100%", background: pct > 85 ? C.red : color, borderRadius: 99, transition: "width .4s" }} />
    </div>
  );
}

function Modal({ title, onClose, children, width = 640 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, width, maxWidth: "95vw", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: C.text }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>}
      {children}
    </div>
  );
}

const inputStyle = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 13px", color: C.text, fontSize: 15, outline: "none", width: "100%" };

function Inp({ label, ...props }) {
  return <Field label={label}><input {...props} style={{ ...inputStyle, ...props.style }} /></Field>;
}

function Sel({ label, children, ...props }) {
  return <Field label={label}><select {...props} style={{ ...inputStyle, ...props.style }}>{children}</select></Field>;
}

function Txt({ label, ...props }) {
  return <Field label={label}><textarea {...props} style={{ ...inputStyle, minHeight: 90, resize: "vertical", ...props.style }} /></Field>;
}

function Btn({ children, onClick, color = C.accent, outline, small, danger, style = {} }) {
  return (
    <button onClick={onClick} style={{ background: danger ? C.red : outline ? "transparent" : color, border: outline ? `2px solid ${color}` : danger ? `2px solid ${C.red}` : "none", color: outline ? color : "#fff", borderRadius: 8, padding: small ? "6px 14px" : "9px 18px", fontWeight: 600, fontSize: small ? 13.5 : 14.5, cursor: "pointer", ...style }}>
      {children}
    </button>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ staff, ministries, transactions, events, campaigns, prayerRequests, lifeGroups, setTab }) {
  const income  = transactions.filter(t => t.type === "Income").reduce((s, t)  => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const upcoming = events.filter(e => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const totalMembers = ministries.reduce((s, m) => s + m.members, 0);
  const lgMembers = lifeGroups.reduce((s, g) => s + g.members.length, 0);
  const activePrayers = prayerRequests.filter(p => p.status === "Active" || p.status === "Ongoing").length;
  const recentPrayers = [...prayerRequests].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 23, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>Dashboard</h1>
        <p style={{ color: C.muted, marginTop: 4, fontSize: 14.5 }}>People first — click any card to open that section</p>
      </div>

      {/* People stats — full width, prominent */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 12 }}>People & Community</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
          <StatCard icon="👥" label="LifeGroup Members"  value={lgMembers}                                               color={C.accent}  onClick={() => setTab("ministry")} />
          <StatCard icon="⛪" label="Active Ministries"  value={ministries.filter(m => m.status === "Active").length}   color={C.green}   onClick={() => setTab("ministry")} />
          <StatCard icon="🙏" label="Active Prayer Reqs" value={activePrayers}                                           color={C.purple}  onClick={() => setTab("ministry")} />
          <StatCard icon="👔" label="Active Staff"       value={staff.filter(s => s.status === "Active").length}        color={C.accent2} onClick={() => setTab("hr")} />
        </div>
      </div>

      {/* Upcoming events + Prayer needs — the heart of the view */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontWeight: 600, color: C.text, marginBottom: 14, fontSize: 16 }}>Upcoming Events</h3>
          {upcoming.length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>No upcoming events.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.map(e => (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{e.title}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>{e.location}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{e.date}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontWeight: 600, color: C.text, fontSize: 15, margin: 0 }}>Prayer Requests</h3>
            <button onClick={() => setTab("ministry")} style={{ fontSize: 12, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>View all →</button>
          </div>
          {recentPrayers.length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>No prayer requests yet.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentPrayers.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <span style={{ flexShrink: 0, color: C.purple, display: "flex", paddingTop: 2 }}><Icon glyph="🙏" size={17} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.member || p.name || "Member"}</div>
                  <div style={{ fontSize: 13, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.request || p.title || ""}</div>
                </div>
                <span style={{ fontSize: 11, color: p.status === "Answered" ? C.green : C.accent, background: (p.status === "Answered" ? C.green : C.accent) + "18", padding: "2px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ministry roster — people-focused, no budget bars */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 600, color: C.text, fontSize: 15, margin: 0 }}>Ministry Roster</h3>
          <button onClick={() => setTab("ministry")} style={{ fontSize: 12, color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Open Ministry →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {ministries.map(m => (
            <div key={m.id} style={{ padding: "14px 16px", background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{m.name}</span>
                <Badge label={m.status} color={C.green} />
              </div>
              <div style={{ fontSize: 13.5, color: C.muted }}>{m.leader}</div>
              <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{m.members}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Members</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>{m.volunteers}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Volunteers</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finance — present but quiet, at the bottom */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 800, color: C.text, fontSize: 14, margin: 0 }}>Financial Summary</h3>
          <button onClick={() => setTab("finance")} style={{ fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View Finance →</button>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 11.5, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Monthly Giving</div><div style={{ fontSize: 20, fontWeight: 700, color: C.green, marginTop: 2 }}>{fmt$(income)}</div></div>
          <div><div style={{ fontSize: 11.5, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Monthly Expenses</div><div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginTop: 2 }}>{fmt$(expense)}</div></div>
          <div><div style={{ fontSize: 11.5, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Net</div><div style={{ fontSize: 20, fontWeight: 700, color: income - expense >= 0 ? C.green : C.red, marginTop: 2 }}>{fmt$(income - expense)}</div></div>
        </div>
      </div>
    </div>
  );
}

// ── Administrative ────────────────────────────────────────────────────────────
function Administrative({ events, setEvents }) {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const types = ["All","Worship","Revival","Meeting","Youth","Study","Outreach"];
  const typeColor = { Worship: C.accent, Revival: C.gold, Meeting: C.purple, Youth: C.pink, Study: C.green, Outreach: C.accent2 };
  const emptyForm = { title:"", date:today(), time:"10:00 AM", location:"", type:"Worship", lead:"", attendees:"", notes:"" };
  const [form, setForm] = useState(emptyForm);

  const filtered = events
    .filter(e => (filter === "All" || e.type === filter) && e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.date.localeCompare(b.date));

  function save() {
    if (!form.title || !form.date) return;
    if (form.id) setEvents(ev => ev.map(e => e.id === form.id ? { ...form, attendees: +form.attendees || 0 } : e));
    else setEvents(ev => [...ev, { ...form, id: Date.now(), attendees: +form.attendees || 0 }]);
    setModal(false); setForm(emptyForm);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 23, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>Administrative</h1><p style={{ color: C.muted, marginTop: 4, fontSize: 14.5 }}>Church calendar, events & coordination</p></div>
        <Btn onClick={() => { setForm(emptyForm); setModal(true); }}>+ Add Event</Btn>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." style={{ ...inputStyle, flex: 1, minWidth: 200 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ background: filter === t ? C.accent : C.card, color: filter === t ? "#fff" : C.muted, border: `1px solid ${filter === t ? C.accent : C.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map(e => (
          <div key={e.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Badge label={e.type} color={typeColor[e.type] || C.accent} />
              <span style={{ fontSize: 13, color: C.muted }}>{e.date}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{e.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 13, color: C.dim }}>{e.time} · {e.location}</div>
              <div style={{ fontSize: 13, color: C.dim }}>Lead: {e.lead}</div>
              {e.attendees > 0 && <div style={{ fontSize: 13, color: C.dim }}>{e.attendees} expected</div>}
              {e.notes && <div style={{ fontSize: 13, color: C.muted, fontStyle: "italic" }}>{e.notes}</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small outline color={C.accent} onClick={() => { setForm({ ...e, attendees: String(e.attendees) }); setModal(true); }}>Edit</Btn>
              <Btn small danger onClick={() => setEvents(ev => ev.filter(x => x.id !== e.id))}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={form.id ? "Edit Event" : "New Event"} onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <Inp label="Time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="10:00 AM" />
            </div>
            <Inp label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Sel label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {["Worship","Revival","Meeting","Youth","Study","Outreach"].map(t => <option key={t}>{t}</option>)}
              </Sel>
              <Inp label="Lead" value={form.lead} onChange={e => setForm(f => ({ ...f, lead: e.target.value }))} />
            </div>
            <Inp label="Expected Attendees" type="number" value={form.attendees} onChange={e => setForm(f => ({ ...f, attendees: e.target.value }))} />
            <Txt label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn outline color={C.muted} onClick={() => setModal(false)}>Cancel</Btn>
              <Btn onClick={save}>Save Event</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Attendance dot strip ──────────────────────────────────────────────────────
function AttendanceDots({ record, size = 12, meetings }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
      {record.map((present, i) => (
        <div key={i} title={`${meetings[i]?.label}: ${present ? "Present" : "Absent"}`}
          style={{ width: size, height: size, borderRadius: "50%", background: present ? C.green : C.red, opacity: present ? 1 : 0.5, flexShrink: 0, cursor: "default" }} />
      ))}
    </div>
  );
}

// ── Member detail panel ───────────────────────────────────────────────────────
function MemberDetailPanel({ member, onClose, prayerRequests, meetings }) {
  const att = LG_ATTENDANCE[String(member.id)];
  const memberPrayers = prayerRequests.filter(p =>
    !p.private && (
      p.requester.toLowerCase().includes(member.name.split(" ")[0].toLowerCase()) ||
      p.requester.toLowerCase().includes(member.name.split(" ").slice(-1)[0].toLowerCase())
    )
  );
  const attColor = p => p >= 90 ? C.green : p >= 70 ? C.gold : C.red;
  const statusColor = { Active: C.accent, Answered: C.green, Praise: C.gold };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 1000, display: "flex", justifyContent: "flex-end" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 480, maxWidth: "95vw", background: C.surface, borderLeft: `1px solid ${C.border}`, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.accent + "22", border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: C.accent, flexShrink: 0 }}>
              {member.name.split(" ").map(n => n[0]).slice(0,2).join("")}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: C.text }}>{member.name}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{member.role} · Joined {member.joined}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
          {/* Contact */}
          <div style={{ background: C.card, borderRadius: 12, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Contact</div>
            <div style={{ fontSize: 13, color: C.dim }}>{member.email}</div>
            <div style={{ fontSize: 13, color: C.dim }}>{member.phone}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Last contact: {member.lastContact}</div>
          </div>

          {/* Attendance summary */}
          {att && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>3-Month Attendance</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[
                  ["Attended", att.attended, C.green],
                  ["Absent", att.absent, C.red],
                  ["Rate", att.pct + "%", attColor(att.pct)],
                  ["Consec. Absent", att.consecAbsent, att.consecAbsent >= 3 ? C.red : att.consecAbsent >= 1 ? C.gold : C.green],
                ].map(([l, v, color]) => (
                  <div key={l} style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", textAlign: "center", border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>{l}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color, marginTop: 4 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Week-by-week dots with labels */}
              <div style={{ background: C.card, borderRadius: 12, padding: "14px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Week by Week (May → July)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {att.record.map((present, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: present ? C.green : C.red + "bb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                        {present ? "✓" : "✗"}
                      </div>
                      <div style={{ fontSize: 9, color: C.muted, textAlign: "center", lineHeight: 1.2 }}>{meetings[i]?.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {att.consecAbsent >= 2 && (
                <div style={{ marginTop: 12, padding: "12px 16px", background: C.red + "15", border: `1px solid ${C.red}44`, borderRadius: 10 }}>
                  <div style={{ fontWeight: 700, color: C.red, fontSize: 13 }}>
                    {att.consecAbsent >= 4 ? "🚨 Urgent — " : "⚠️ Follow-Up — "}
                    {att.consecAbsent} consecutive {att.consecAbsent === 1 ? "week" : "weeks"} absent
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                    {att.consecAbsent >= 4 ? "This member has been absent for a month or more. A personal call or visit is recommended." : "Consider reaching out to check in before next meeting."}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Meeting log — which meetings they missed */}
          {att && att.absent > 0 && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Missed Meetings</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {meetings.map((m, i) => !att.record[i] ? (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", background: C.card, borderRadius: 9, border: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.dim }}>{m.date}</span>
                    <Badge label="Absent" color={C.red} />
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {/* Prayer requests */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Prayer Requests</div>
            {memberPrayers.length === 0 ? (
              <div style={{ fontSize: 13.5, color: C.muted, padding: "12px 16px", background: C.card, borderRadius: 10 }}>No prayer requests on file</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {memberPrayers.map(p => (
                  <div key={p.id} style={{ padding: "14px 16px", background: C.card, borderRadius: 12, border: `1px solid ${p.status === "Answered" ? C.green + "44" : C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <Badge label={p.category} color={C.accent} />
                      <Badge label={p.status} color={statusColor[p.status] || C.muted} />
                    </div>
                    <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.6 }}>{p.request}</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>{p.date}</div>
                    {p.followUpNote && (
                      <div style={{ marginTop: 8, padding: "8px 12px", background: C.green + "11", borderRadius: 8, fontSize: 12, color: C.dim }}>
                        <span style={{ color: C.green, fontWeight: 700 }}>Update: </span>{p.followUpNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Meeting detail modal ──────────────────────────────────────────────────────
function MeetingDetailModal({ meeting, groupMembers, onClose }) {
  const presentIds = new Set(meeting.attendees);
  const present = groupMembers.filter(m => presentIds.has(m.id));
  const absent  = groupMembers.filter(m => !presentIds.has(m.id));

  return (
    <Modal title={`Meeting: ${meeting.date}`} onClose={onClose} width={600}>
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        {[
          ["Present", present.length, C.green],
          ["Absent",  absent.length,  C.red],
          ["Rate", Math.round(present.length / groupMembers.length * 100) + "%", C.accent],
        ].map(([l, v, color]) => (
          <div key={l} style={{ flex: 1, background: C.bg, borderRadius: 10, padding: "12px 16px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11.5, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>{l}</div>
            <div style={{ fontSize: 19, fontWeight: 700, color, marginTop: 3 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Present ({present.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {present.map(m => (
              <div key={m.id} style={{ fontSize: 14, color: C.text, padding: "6px 12px", background: C.green + "11", borderRadius: 8, border: `1px solid ${C.green}33` }}>
                {m.name}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Absent ({absent.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {absent.map(m => {
              const att = LG_ATTENDANCE[String(m.id)];
              const consec = att?.consecAbsent || 0;
              return (
                <div key={m.id} style={{ fontSize: 14, color: C.text, padding: "6px 12px", background: C.red + "11", borderRadius: 8, border: `1px solid ${C.red}33`, display: "flex", justifyContent: "space-between" }}>
                  <span>{m.name}</span>
                  {consec >= 3 && <span style={{ fontSize: 11, color: C.red, fontWeight: 700 }}>⚠ {consec}wk</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── LG Quick View ────────────────────────────────────────────────────────────
function LGQuickView({ group, prayerRequests, meetings }) {
  const attData = group.members.map(m => LG_ATTENDANCE[String(m.id)]).filter(Boolean);
  const avgPct = attData.length ? Math.round(attData.reduce((s, a) => s + a.pct, 0) / attData.length) : 0;
  const atRisk = group.members.filter(m => (LG_ATTENDANCE[String(m.id)]?.consecAbsent || 0) >= 3).length;
  const perfect = group.members.filter(m => (LG_ATTENDANCE[String(m.id)]?.pct || 0) >= 90).length;
  const groupPrayers = prayerRequests.filter(p =>
    p.group === group.name ||
    group.members.some(m => p.requester.toLowerCase().includes(m.name.split(" ")[0].toLowerCase()))
  );
  const attColor = p => p >= 90 ? C.green : p >= 70 ? C.gold : C.red;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
        {[
          ["👥","Members",group.members.length,C.accent],
          ["📊","Avg Attend.",avgPct+"%",attColor(avgPct)],
          ["🚨","At Risk",atRisk,C.red],
          ["⭐","Perfect",perfect,C.gold],
          ["🙏","Prayers",groupPrayers.length,C.purple],
          ["📅","Meetings",meetings.length,C.accent2],
        ].map(([icon,label,value,color]) => (
          <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 19, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontWeight: 800, color: C.text, marginBottom: 12, fontSize: 14 }}>Recent Meetings</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...meetings].reverse().slice(0, 4).map(m => {
              const pct = Math.round(m.count / group.members.length * 100);
              return (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: C.bg, borderRadius: 9, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 14, color: C.text }}>{m.date}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: pct >= 75 ? C.green : pct >= 55 ? C.gold : C.red }}>{m.count}/{group.members.length} · {pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontWeight: 800, color: C.text, marginBottom: 12, fontSize: 14 }}>Needs Follow-Up</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {group.members
              .map(m => ({ m, att: LG_ATTENDANCE[String(m.id)] }))
              .filter(({ att }) => att && att.consecAbsent >= 2)
              .sort((a, b) => b.att.consecAbsent - a.att.consecAbsent)
              .slice(0, 5)
              .map(({ m, att }) => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: C.bg, borderRadius: 9, border: `1px solid ${att.consecAbsent >= 4 ? C.red+"55" : C.gold+"44"}` }}>
                  <span style={{ fontSize: 14, color: C.text }}>{m.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: att.consecAbsent >= 4 ? C.red : C.gold }}>{att.consecAbsent}wk out</span>
                </div>
              ))}
            {atRisk === 0 && <div style={{ fontSize: 13, color: C.green, padding: "10px 12px", background: C.green+"11", borderRadius: 9 }}>All active! 🎉</div>}
          </div>
        </div>
      </div>
      {groupPrayers.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontWeight: 800, color: C.text, marginBottom: 12, fontSize: 14 }}>Recent Prayer Requests</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {groupPrayers.slice(0, 3).map(p => (
              <div key={p.id} style={{ padding: "10px 14px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{p.requester}</span>
                  <Badge label={p.category} color={C.purple} />
                </div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{p.request.substring(0, 120)}{p.request.length > 120 ? "..." : ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── LG Today (live attendance marking) ───────────────────────────────────────
function LGTodayTab({ group }) {
  const [session, setSession] = useStored("cos2-lg-today-" + group.id, { date: today(), present: [], notes: "" });
  const [saved, setSaved] = useState(false);

  const toggle = id => { setSession(s => ({ ...s, present: s.present.includes(id) ? s.present.filter(x => x !== id) : [...s.present, id] })); setSaved(false); };
  const markAll  = () => setSession(s => ({ ...s, present: group.members.map(m => m.id) }));
  const clearAll = () => setSession(s => ({ ...s, present: [] }));
  const pct = group.members.length ? Math.round(session.present.length / group.members.length * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Meeting Date</label>
            <input type="date" value={session.date} onChange={e => setSession(s => ({ ...s, date: e.target.value }))} style={{ ...inputStyle, width: 180 }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: pct >= 75 ? C.green : pct >= 55 ? C.gold : C.red }}>{session.present.length}</div>
            <div style={{ fontSize: 13, color: C.muted }}>of {group.members.length} present · {pct}%</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn small outline color={C.green} onClick={markAll}>Mark All</Btn>
            <Btn small outline color={C.muted} onClick={clearAll}>Clear</Btn>
            <Btn small color={C.green} onClick={() => setSaved(true)}>{saved ? "✓ Saved" : "Save Session"}</Btn>
          </div>
        </div>
        {saved && <div style={{ marginTop: 10, fontSize: 13, color: C.green }}>✓ Attendance saved for {session.date}</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
        {group.members.map(m => {
          const isPresent = session.present.includes(m.id);
          return (
            <div key={m.id} onClick={() => toggle(m.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: isPresent ? C.green+"22" : C.card, borderRadius: 11, border: `2px solid ${isPresent ? C.green : C.border}`, cursor: "pointer", transition: "all .15s" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: isPresent ? C.green : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                {isPresent ? "✓" : m.name[0]}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                {m.role !== "Member" && <div style={{ fontSize: 10, color: C.purple, fontWeight: 700 }}>{m.role}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Session Notes</label>
        <textarea value={session.notes} onChange={e => setSession(s => ({ ...s, notes: e.target.value }))} placeholder="Notes about today's meeting..."
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
      </div>
    </div>
  );
}

// ── LG Joined Us Tab ──────────────────────────────────────────────────────────
function LGJoinedUsTab({ group }) {
  const [visitors, setVisitors] = useStored("cos2-lg-visitors-" + group.id, []);
  const [form, setForm] = useState({ name:"", email:"", phone:"", notes:"", date: today() });
  const [showForm, setShowForm] = useState(false);

  function save() {
    if (!form.name.trim()) return;
    setVisitors(v => [{ ...form, id: Date.now() }, ...v]);
    setForm({ name:"", email:"", phone:"", notes:"", date: today() });
    setShowForm(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, color: C.text, fontSize: 16 }}>Joined Us Today</div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 3 }}>Track guests and first-time visitors · {visitors.length} on file</div>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>+ Add Visitor</Btn>
      </div>
      {showForm && (
        <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 10, padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
            <Inp label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <Inp label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Inp label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <div style={{ gridColumn: "1/-1" }}>
              <Txt label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="How they heard about us, connections, prayer needs..." />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
            <Btn outline color={C.muted} onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Visitor</Btn>
          </div>
        </div>
      )}
      {visitors.length === 0 && !showForm ? (
        <div style={{ padding: "30px", textAlign: "center", background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, color: C.muted }}>
          <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.6 }}>👋</div>
          <div style={{ fontSize: 15, color: C.text, marginBottom: 6 }}>No visitors recorded yet</div>
          <div style={{ fontSize: 13 }}>Add guests who joined your group for the first time</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {visitors.map(v => (
            <div key={v.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{v.name}</div>
                {v.email && <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{v.email}</div>}
                {v.phone && <div style={{ fontSize: 13, color: C.muted }}>{v.phone}</div>}
                {v.notes && <div style={{ fontSize: 12, color: C.dim, marginTop: 6, fontStyle: "italic" }}>{v.notes}</div>}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                <Badge label={v.date} color={C.accent2} />
                <Btn small danger onClick={() => setVisitors(vs => vs.filter(x => x.id !== v.id))}>✕</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── LG Prayer Tab ─────────────────────────────────────────────────────────────
function LGPrayerTab({ group, prayerRequests, setPrayerRequests }) {
  const [modal, setModal] = useState(false);
  const [pform, setPform] = useState({ requester:"", request:"", category:"Health", private:false });
  const statusColor = { Active: C.accent, Answered: C.green, Praise: C.gold };

  const groupPrayers = prayerRequests.filter(p =>
    p.group === group.name ||
    group.members.some(m =>
      p.requester.toLowerCase().includes(m.name.split(" ")[0].toLowerCase()) ||
      p.requester.toLowerCase().includes(m.name.split(" ").slice(-1)[0].toLowerCase())
    )
  );

  function savePrayer() {
    if (!pform.requester || !pform.request) return;
    setPrayerRequests(p => [...p, { ...pform, id: Date.now(), date: today(), status:"Active", group: group.name }]);
    setPform({ requester:"", request:"", category:"Health", private:false });
    setModal(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, color: C.text, fontSize: 16 }}>Prayer Requests</div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 3 }}>{group.name} · {groupPrayers.length} requests</div>
        </div>
        <Btn color={C.purple} onClick={() => setModal(true)}>+ Prayer Request</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
        {[["🙏","Total",groupPrayers.length,C.purple],["✅","Answered",groupPrayers.filter(p=>p.status==="Answered").length,C.green],["⏳","Active",groupPrayers.filter(p=>p.status==="Active").length,C.accent],["🌟","Praise",groupPrayers.filter(p=>p.status==="Praise").length,C.gold]].map(([icon,label,val,color]) => (
          <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 19, fontWeight: 700, color, marginTop: 3 }}>{val}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{label}</div>
          </div>
        ))}
      </div>
      {groupPrayers.length === 0 ? (
        <div style={{ padding: "30px", textAlign: "center", background: C.card, borderRadius: 14, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.6 }}>🙏</div>
          <div style={{ fontSize: 15, color: C.text, marginBottom: 6 }}>No prayer requests yet</div>
          <div style={{ fontSize: 13.5, color: C.muted }}>Add the first prayer request for {group.name}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...groupPrayers].sort((a,b)=>b.date.localeCompare(a.date)).map(p => (
            <div key={p.id} style={{ background: C.card, border: `1px solid ${p.status==="Answered"?C.green+"44":C.border}`, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: C.text }}>{p.private ? "Anonymous" : p.requester}</span>
                  <Badge label={p.category} color={C.accent} />
                  <Badge label={p.status} color={statusColor[p.status]||C.muted} />
                </div>
                <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{p.date}</span>
              </div>
              <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, margin: 0 }}>{p.request}</p>
              {p.followUpNote && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: C.green+"11", borderRadius: 9 }}>
                  <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 4 }}>FOLLOW-UP</div>
                  <div style={{ fontSize: 12, color: C.dim }}>{p.followUpNote}</div>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {["Active","Answered","Praise"].map(s => (
                  <button key={s} onClick={() => setPrayerRequests(ps => ps.map(x => x.id === p.id ? { ...x, status: s } : x))}
                    style={{ background: p.status===s?(statusColor[s]+"22"):"transparent", border: `1px solid ${p.status===s?statusColor[s]:C.border}`, color: p.status===s?statusColor[s]:C.muted, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <Modal title="New Prayer Request" onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Name / Requester" value={pform.requester} onChange={e => setPform(f => ({ ...f, requester: e.target.value }))} />
            <Txt label="Prayer Request" value={pform.request} onChange={e => setPform(f => ({ ...f, request: e.target.value }))} />
            <Sel label="Category" value={pform.category} onChange={e => setPform(f => ({ ...f, category: e.target.value }))}>
              {["Health","Family","Career","Missions","Finances","Praise","Other"].map(c => <option key={c}>{c}</option>)}
            </Sel>
            <label style={{ display: "flex", gap: 10, alignItems: "center", color: C.dim, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={pform.private} onChange={e => setPform(f => ({ ...f, private: e.target.checked }))} />
              Keep requester anonymous
            </label>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn outline color={C.muted} onClick={() => setModal(false)}>Cancel</Btn>
              <Btn color={C.purple} onClick={savePrayer}>Submit</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── LG Events Tab ─────────────────────────────────────────────────────────────
const LG_EVENT_TYPES = [
  { value:"breakfast", icon:"🍳", label:"Breakfast" },
  { value:"dinner", icon:"🍽", label:"Dinner" },
  { value:"cookout", icon:"🔥", label:"Cookout" },
  { value:"game night", icon:"🎲", label:"Game Night" },
  { value:"study", icon:"📖", label:"Bible Study" },
  { value:"prayer", icon:"🙏", label:"Prayer Night" },
  { value:"service", icon:"🤝", label:"Service" },
  { value:"celebration", icon:"🎉", label:"Celebration" },
  { value:"retreat", icon:"⛺", label:"Retreat" },
  { value:"other", icon:"📌", label:"Other" },
];

function LGEventsTab({ group }) {
  const [lgEvents, setLGEvents] = useStored("cos2-lg-events-" + group.id, []);
  const [editingEvent, setEditingEvent] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");

  const blankEvent = type => ({ id: Date.now(), title:"", type: type||"other", date: today(), time:"", location:"", description:"", host:"", rsvpList:[], notes:"", status:"upcoming" });
  const getType = v => LG_EVENT_TYPES.find(t => t.value === v) || { icon:"📌", label:"Other" };

  const save = () => {
    if (!editingEvent?.title) return;
    setLGEvents(prev => prev.some(e => e.id === editingEvent.id) ? prev.map(e => e.id === editingEvent.id ? editingEvent : e) : [editingEvent, ...prev]);
    setEditingEvent(null);
  };

  const filtered = lgEvents.filter(e => filter === "all" || e.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, color: C.text, fontSize: 16 }}>Events</div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 3 }}>{group.name} · {lgEvents.length} event{lgEvents.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all","upcoming","past"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ background: filter===f?C.accent:C.card, color: filter===f?"#fff":C.muted, border: `1px solid ${filter===f?C.accent:C.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Quick Create */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Quick Create</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))", gap: 8 }}>
          {LG_EVENT_TYPES.map(et => (
            <button key={et.value} onClick={() => setEditingEvent(blankEvent(et.value))}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 6px", cursor: "pointer", textAlign: "center", color: C.text, fontSize: 11, fontWeight: 700 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{et.icon}</div>
              <div>{et.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Edit form */}
      {editingEvent && (
        <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 10, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{getType(editingEvent.type).icon} {lgEvents.find(e => e.id === editingEvent.id) ? "Edit Event" : "New Event"}</div>
            <button onClick={() => setEditingEvent(null)} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}><Inp label="Title" value={editingEvent.title} onChange={e => setEditingEvent(ev => ({ ...ev, title: e.target.value }))} placeholder="Event title" /></div>
            <Sel label="Type" value={editingEvent.type} onChange={e => setEditingEvent(ev => ({ ...ev, type: e.target.value }))}>
              {LG_EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
            </Sel>
            <Sel label="Status" value={editingEvent.status} onChange={e => setEditingEvent(ev => ({ ...ev, status: e.target.value }))}>
              <option value="upcoming">Upcoming</option><option value="past">Past</option><option value="cancelled">Cancelled</option>
            </Sel>
            <Inp label="Date" type="date" value={editingEvent.date} onChange={e => setEditingEvent(ev => ({ ...ev, date: e.target.value }))} />
            <Inp label="Time" value={editingEvent.time} onChange={e => setEditingEvent(ev => ({ ...ev, time: e.target.value }))} placeholder="6:30 PM" />
            <Inp label="Location" value={editingEvent.location} onChange={e => setEditingEvent(ev => ({ ...ev, location: e.target.value }))} />
            <Inp label="Host" value={editingEvent.host} onChange={e => setEditingEvent(ev => ({ ...ev, host: e.target.value }))} />
            <div style={{ gridColumn: "1/-1" }}><Txt label="Description" value={editingEvent.description} onChange={e => setEditingEvent(ev => ({ ...ev, description: e.target.value }))} placeholder="Details, what to bring, theme..." /></div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>RSVP — Who is Coming ({(editingEvent.rsvpList||[]).length})</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 6, maxHeight: 200, overflowY: "auto" }}>
              {group.members.map(m => {
                const rsvped = (editingEvent.rsvpList||[]).includes(m.id);
                return (
                  <div key={m.id} onClick={() => setEditingEvent(ev => ({ ...ev, rsvpList: rsvped ? ev.rsvpList.filter(x => x !== m.id) : [...(ev.rsvpList||[]), m.id] }))}
                    style={{ background: rsvped?C.accent+"33":C.bg, border: `1px solid ${rsvped?C.accent:C.border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 12, color: rsvped?C.accent:C.muted, fontWeight: rsvped?700:400 }}>
                    {rsvped ? "✓ " : ""}{m.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
            <Btn outline color={C.muted} onClick={() => setEditingEvent(null)}>Cancel</Btn>
            <Btn onClick={save}>Save Event</Btn>
          </div>
        </div>
      )}

      {filtered.length === 0 && !editingEvent && (
        <div style={{ padding: "30px", textAlign: "center", background: C.card, borderRadius: 14, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.6 }}>🎉</div>
          <div style={{ fontSize: 15, color: C.text, marginBottom: 6 }}>No events yet</div>
          <div style={{ fontSize: 13.5, color: C.muted }}>Use Quick Create above to schedule your first event</div>
        </div>
      )}

      {["upcoming","past","cancelled"].map(status => {
        const grp = filtered.filter(e => e.status === status);
        if (!grp.length) return null;
        const labels = { upcoming:"Upcoming", past:"Past Events", cancelled:"Cancelled" };
        return (
          <div key={status}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${C.border}`, paddingBottom: 8, marginBottom: 12 }}>{labels[status]} ({grp.length})</div>
            {grp.map(ev => (
              <div key={ev.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 10, overflow: "hidden" }}>
                <div onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                  style={{ padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>{getType(ev.type).icon}</span>
                      <span style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{ev.title || "(Untitled)"}</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.muted }}>{ev.date}{ev.time ? " · "+ev.time : ""}{ev.location ? " · "+ev.location : ""}</div>
                    {ev.rsvpList?.length > 0 && <div style={{ fontSize: 13, color: C.accent, marginTop: 2 }}>{ev.rsvpList.length} RSVP{ev.rsvpList.length !== 1 ? "s" : ""}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Btn small outline color={C.accent} onClick={e => { e.stopPropagation(); setEditingEvent(ev); }}>Edit</Btn>
                    <Btn small danger onClick={e => { e.stopPropagation(); setLGEvents(es => es.filter(x => x.id !== ev.id)); }}>✕</Btn>
                    <span style={{ color: C.muted }}>{expandedId === ev.id ? "▲" : "▼"}</span>
                  </div>
                </div>
                {expandedId === ev.id && (
                  <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 18px", background: C.bg }}>
                    {ev.description && <p style={{ fontSize: 13, color: C.dim, marginBottom: 10 }}>{ev.description}</p>}
                    {ev.host && <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 8 }}>Host: {ev.host}</div>}
                    {ev.rsvpList?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>RSVPs ({ev.rsvpList.length})</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {ev.rsvpList.map(id => {
                            const member = group.members.find(m => m.id === id);
                            return member ? <span key={id} style={{ background: C.accent+"22", color: C.accent, border: `1px solid ${C.accent}44`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{member.name}</span> : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── LG Teaching Hub ───────────────────────────────────────────────────────────
function LGTeachingTab({ group }) {
  const [teachSessions, setTeachSessions] = useStored("cos2-lg-teaching-" + group.id, []);
  const [videoLinks, setVideoLinks] = useStored("cos2-lg-videos-" + group.id, []);
  const [subTab, setSubTab] = useState("sessions");
  const [editSession, setEditSession] = useState(null);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState({ title:"", url:"", speaker:"", date: today(), notes:"" });

  const blankSession = () => ({ id: Date.now(), title:"", scripture:"", date: today(), speaker:"", outline:"", notes:"", keyVerses:"", application:"", resources:"" });

  const saveSession = () => {
    if (!editSession?.title) return;
    setTeachSessions(prev => prev.some(s => s.id === editSession.id) ? prev.map(s => s.id === editSession.id ? editSession : s) : [editSession, ...prev]);
    setEditSession(null);
  };

  const addVideo = () => {
    if (!newVideo.title.trim()) return;
    setVideoLinks(v => [{ ...newVideo, id: Date.now() }, ...v]);
    setNewVideo({ title:"", url:"", speaker:"", date: today(), notes:"" });
    setShowVideoForm(false);
  };

  const getYTId = url => { const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/); return m ? m[1] : null; };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[["sessions","Sessions"],["videos","Videos"],["resources","Resources"]].map(([v,l]) => (
          <button key={v} onClick={() => setSubTab(v)}
            style={{ background: subTab===v?C.accent:C.card, color: subTab===v?"#fff":C.muted, border: `1px solid ${subTab===v?C.accent:C.border}`, borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{l}</button>
        ))}
      </div>

      {subTab === "sessions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13.5, color: C.muted }}>{teachSessions.length} session{teachSessions.length !== 1 ? "s" : ""}</div>
            <Btn onClick={() => setEditSession(blankSession())}>+ New Session</Btn>
          </div>
          {editSession && (
            <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 10, padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1/-1" }}><Inp label="Title / Series" value={editSession.title} onChange={e => setEditSession(s => ({ ...s, title: e.target.value }))} placeholder="Teaching title or series" /></div>
                <Inp label="Scripture" value={editSession.scripture} onChange={e => setEditSession(s => ({ ...s, scripture: e.target.value }))} placeholder="John 3:16" />
                <Inp label="Date" type="date" value={editSession.date} onChange={e => setEditSession(s => ({ ...s, date: e.target.value }))} />
                <div style={{ gridColumn: "1/-1" }}><Inp label="Speaker / Teacher" value={editSession.speaker} onChange={e => setEditSession(s => ({ ...s, speaker: e.target.value }))} /></div>
              </div>
              <div style={{ marginTop: 12 }}><Txt label="Key Verses" value={editSession.keyVerses} onChange={e => setEditSession(s => ({ ...s, keyVerses: e.target.value }))} /></div>
              <div style={{ marginTop: 12 }}><Txt label="Teaching Outline" value={editSession.outline} onChange={e => setEditSession(s => ({ ...s, outline: e.target.value }))} style={{ minHeight: 140, fontFamily: "monospace" }} /></div>
              <div style={{ marginTop: 12 }}><Txt label="Application / Discussion Questions" value={editSession.application} onChange={e => setEditSession(s => ({ ...s, application: e.target.value }))} /></div>
              <div style={{ marginTop: 12 }}><Txt label="Notes" value={editSession.notes} onChange={e => setEditSession(s => ({ ...s, notes: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                <Btn outline color={C.muted} onClick={() => setEditSession(null)}>Cancel</Btn>
                <Btn onClick={saveSession}>Save Session</Btn>
              </div>
            </div>
          )}
          {!teachSessions.length && !editSession && (
            <div style={{ padding: "30px", textAlign: "center", background: C.card, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.6 }}>📖</div>
              <div style={{ fontSize: 15, color: C.text, marginBottom: 6 }}>No sessions yet</div>
              <div style={{ fontSize: 13.5, color: C.muted }}>Click New Session to log a teaching</div>
            </div>
          )}
          {teachSessions.map(s => (
            <div key={s.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{s.title || "Untitled"}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{s.scripture}{s.date ? " · "+s.date : ""}{s.speaker ? " · "+s.speaker : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small outline color={C.accent} onClick={() => setEditSession(s)}>Edit</Btn>
                  <Btn small danger onClick={() => setTeachSessions(prev => prev.filter(x => x.id !== s.id))}>✕</Btn>
                </div>
              </div>
              {s.outline && <pre style={{ fontSize: 12, color: C.dim, whiteSpace: "pre-wrap", margin: "10px 0 0", fontFamily: "monospace", lineHeight: 1.6, background: C.bg, borderRadius: 8, padding: "10px 14px" }}>{s.outline.substring(0,300)}{s.outline.length > 300 ? "..." : ""}</pre>}
              {s.application && <div style={{ marginTop: 10, padding: "10px 14px", background: C.accent+"11", borderRadius: 9, fontSize: 12, color: C.dim }}><div style={{ fontWeight: 700, color: C.accent, marginBottom: 4 }}>Discussion</div>{s.application.substring(0,200)}{s.application.length > 200 ? "..." : ""}</div>}
            </div>
          ))}
        </div>
      )}

      {subTab === "videos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13.5, color: C.muted }}>{videoLinks.length} video{videoLinks.length !== 1 ? "s" : ""}</div>
            <Btn onClick={() => setShowVideoForm(!showVideoForm)}>+ Add Video</Btn>
          </div>
          {showVideoForm && (
            <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 10, padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Inp label="Title" value={newVideo.title} onChange={e => setNewVideo(v => ({ ...v, title: e.target.value }))} />
                <Inp label="Speaker" value={newVideo.speaker} onChange={e => setNewVideo(v => ({ ...v, speaker: e.target.value }))} />
                <div style={{ gridColumn: "1/-1" }}><Inp label="YouTube URL" value={newVideo.url} onChange={e => setNewVideo(v => ({ ...v, url: e.target.value }))} placeholder="https://youtu.be/..." /></div>
                <Inp label="Date" type="date" value={newVideo.date} onChange={e => setNewVideo(v => ({ ...v, date: e.target.value }))} />
                <Inp label="Notes" value={newVideo.notes} onChange={e => setNewVideo(v => ({ ...v, notes: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
                <Btn outline color={C.muted} onClick={() => setShowVideoForm(false)}>Cancel</Btn>
                <Btn onClick={addVideo}>Save</Btn>
              </div>
            </div>
          )}
          {!videoLinks.length && !showVideoForm && (
            <div style={{ padding: "30px", textAlign: "center", background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, color: C.muted }}>
              <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.6 }}>🎬</div>
              <div style={{ fontSize: 15, color: C.text, marginBottom: 6 }}>No videos saved yet</div>
              <div style={{ fontSize: 13 }}>Save YouTube links to teaching videos for your group</div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {videoLinks.map(v => {
              const ytId = getYTId(v.url);
              return (
                <div key={v.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                  {ytId && <iframe width="100%" height="160" src={`https://www.youtube.com/embed/${ytId}`} frameBorder="0" allowFullScreen style={{ display: "block" }} />}
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 3 }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{v.speaker}{v.date ? " · "+v.date : ""}</div>
                    {v.notes && <div style={{ fontSize: 12, color: C.dim, marginTop: 4, fontStyle: "italic" }}>{v.notes}</div>}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {v.url && <a href={v.url} target="_blank" rel="noreferrer" style={{ background: C.bg, color: C.accent, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", textDecoration: "none", fontSize: 12 }}>Open ↗</a>}
                      <Btn small danger onClick={() => setVideoLinks(vl => vl.filter(x => x.id !== v.id))}>Remove</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subTab === "resources" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontWeight: 600, color: C.text, fontSize: 15, marginBottom: 6 }}>Biblical Reference Resources</div>
          {[
            { name:"Blue Letter Bible", desc:"Strong's concordance, Greek/Hebrew lexicons, commentaries, interlinear", url:"https://www.blueletterbible.org" },
            { name:"Bible Gateway", desc:"All major translations, parallel Bible, verse search", url:"https://www.biblegateway.com" },
            { name:"Bible Hub", desc:"Parallel commentaries, Strong's, Treasury of Scripture", url:"https://biblehub.com" },
            { name:"Got Questions", desc:"Theological Q&A, doctrine explanations, life application", url:"https://www.gotquestions.org" },
            { name:"Desiring God", desc:"John Piper sermons, articles, devotionals", url:"https://www.desiringgod.org" },
            { name:"The Gospel Coalition", desc:"Reformed theology, sermons, book reviews, discipleship", url:"https://www.thegospelcoalition.org" },
            { name:"Ligonier Ministries", desc:"R.C. Sproul teachings, Tabletalk magazine, theology", url:"https://www.ligonier.org" },
            { name:"Open Bible", desc:"Topical studies, daily verses, concordance", url:"https://www.openbible.info" },
          ].map(r => (
            <a key={r.name} href={r.url} target="_blank" rel="noreferrer"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, padding: "14px 18px", textDecoration: "none" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{r.name}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{r.desc}</div>
              </div>
              <span style={{ fontSize: 18, color: C.accent }}>↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Life Groups View ──────────────────────────────────────────────────────────
function LifeGroupsView({ lifeGroups, prayerRequests, setPrayerRequests }) {
  const [selectedGroup, setSelectedGroup] = useState(lifeGroups[0]?.id || null);
  const [lgTab, setLgTab] = useState("quick view");  // quick view | lg today | roster | joined us | follow-up | prayer | events | teaching | attendance | meetings
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [memberDetail, setMemberDetail] = useState(null);
  const [meetingDetail, setMeetingDetail] = useState(null);
  const [filterAbsent, setFilterAbsent] = useState("all"); // all | at-risk | perfect

  const group = lifeGroups.find(g => g.id === selectedGroup);
  // Only Russell LifeGroup (id=1) has full attendance tracking
  const hasTracking = selectedGroup === 1;

  const attColor = p => p >= 90 ? C.green : p >= 70 ? C.gold : C.red;
  const totalMembers = lifeGroups.reduce((s, g) => s + g.members.length, 0);
  const atRiskCount = group ? group.members.filter(m => {
    const att = LG_ATTENDANCE[String(m.id)];
    return att && att.consecAbsent >= 3;
  }).length : 0;

  const getMembers = () => {
    if (!group) return [];
    let ms = group.members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    if (filterAbsent === "at-risk") ms = ms.filter(m => { const a = LG_ATTENDANCE[String(m.id)]; return a && a.consecAbsent >= 2; });
    if (filterAbsent === "perfect") ms = ms.filter(m => { const a = LG_ATTENDANCE[String(m.id)]; return a && a.pct >= 90; });
    return ms.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      const aa = LG_ATTENDANCE[String(a.id)], ba = LG_ATTENDANCE[String(b.id)];
      if (sortBy === "attendance") return (ba?.pct || 0) - (aa?.pct || 0);
      if (sortBy === "absent") return (ba?.consecAbsent || 0) - (aa?.consecAbsent || 0);
      return 0;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 }}>
        <StatCard icon="⛪" label="Groups"       value={lifeGroups.length}   color={C.accent}  />
        <StatCard icon="👥" label="Total Members" value={totalMembers}         color={C.green}   />
        {hasTracking && <StatCard icon="🚨" label="At Risk (3+ wk)" value={lifeGroups.find(g=>g.id===1)?.members.filter(m => (LG_ATTENDANCE[String(m.id)]?.consecAbsent||0) >= 3).length || 0} color={C.red} />}
        {hasTracking && <StatCard icon="⭐" label="Perfect Attend." value={lifeGroups.find(g=>g.id===1)?.members.filter(m => (LG_ATTENDANCE[String(m.id)]?.pct||0) >= 90).length || 0} color={C.gold} />}
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* Group selector */}
        <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, padding: "0 4px", marginBottom: 4 }}>Groups</div>
          {lifeGroups.map(g => {
            const gAtRisk = g.members.filter(m => (LG_ATTENDANCE[String(m.id)]?.consecAbsent||0) >= 3).length;
            return (
              <button key={g.id} onClick={() => { setSelectedGroup(g.id); setSearch(""); setLgTab("roster"); }}
                style={{ textAlign: "left", padding: "12px 14px", borderRadius: 11, border: `1px solid ${selectedGroup === g.id ? C.accent : C.border}`, background: selectedGroup === g.id ? C.accent + "22" : C.card, cursor: "pointer" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: selectedGroup === g.id ? C.accent : C.text }}>{g.name}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{g.day}s · {g.time}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>{g.members.length} members</span>
                  {gAtRisk > 0 && <span style={{ fontSize: 11, color: C.red, fontWeight: 700 }}>⚠ {gAtRisk}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main panel */}
        {group && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
            {/* Group header */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: C.text, fontSize: 18, margin: 0 }}>{group.name}</h3>
                  <div style={{ fontSize: 13.5, color: C.muted, marginTop: 5 }}>{group.day}s · {group.time} · {group.location}</div>
                  <div style={{ fontSize: 13, color: C.dim, marginTop: 2 }}>Led by {group.leader}</div>
                </div>
                {hasTracking && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge label={`${LG_MEETINGS.length} meetings logged`} color={C.accent} />
                    <Badge label="Tracking Active" color={C.green} />
                  </div>
                )}
              </div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(hasTracking
                ? ["quick view","lg today","roster","joined us","follow-up","prayer","events","teaching","attendance","meetings"]
                : ["roster","events","teaching"]
              ).map(t => (
                <button key={t} onClick={() => setLgTab(t)} style={{ background: lgTab===t?C.accent:C.card, color: lgTab===t?"#fff":C.muted, border: `1px solid ${lgTab===t?C.accent:C.border}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
              ))}
            </div>

            {/* ── Quick View tab ── */}
            {lgTab === "quick view" && hasTracking && <LGQuickView group={group} prayerRequests={prayerRequests} meetings={LG_MEETINGS} />}

            {/* ── LG Today tab ── */}
            {lgTab === "lg today" && hasTracking && <LGTodayTab group={group} />}

            {/* ── Joined Us tab ── */}
            {lgTab === "joined us" && <LGJoinedUsTab group={group} />}

            {/* ── Prayer tab ── */}
            {lgTab === "prayer" && <LGPrayerTab group={group} prayerRequests={prayerRequests} setPrayerRequests={setPrayerRequests} />}

            {/* ── Events tab ── */}
            {lgTab === "events" && <LGEventsTab group={group} />}

            {/* ── Teaching tab ── */}
            {lgTab === "teaching" && <LGTeachingTab group={group} />}

            {/* ── Roster tab ── */}
            {lgTab === "roster" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
                    style={{ ...inputStyle, flex: 1, minWidth: 180 }} />
                  <Sel style={{ width: 160 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="name">Sort: Name</option>
                    <option value="attendance">Sort: Attendance %</option>
                    <option value="absent">Sort: Absent Streak</option>
                  </Sel>
                  {hasTracking && (
                    <Sel style={{ width: 160 }} value={filterAbsent} onChange={e => setFilterAbsent(e.target.value)}>
                      <option value="all">All Members</option>
                      <option value="at-risk">At Risk (2+ weeks)</option>
                      <option value="perfect">High Attendance</option>
                    </Sel>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {getMembers().map(m => {
                    const att = LG_ATTENDANCE[String(m.id)];
                    const risk = att && att.consecAbsent >= 3;
                    const warn = att && att.consecAbsent >= 1 && att.consecAbsent < 3;
                    return (
                      <div key={m.id} onClick={() => setMemberDetail(m)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: C.card, borderRadius: 11, border: `1px solid ${risk ? C.red + "55" : warn ? C.gold + "44" : C.border}`, cursor: "pointer", transition: "border-color .15s" }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: risk ? C.red + "22" : C.accent + "22", border: `2px solid ${risk ? C.red : C.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: risk ? C.red : C.accent, flexShrink: 0 }}>
                            {m.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{m.name}</div>
                            <div style={{ fontSize: 13, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                          {att && <AttendanceDots record={att.record} size={10} meetings={LG_MEETINGS} />}
                          {m.role !== "Member" && <Badge label={m.role} color={C.purple} />}
                          {att && (
                            <div style={{ textAlign: "right", minWidth: 70 }}>
                              <div style={{ fontSize: 13, color: attColor(att.pct), fontWeight: 800 }}>{att.pct}%</div>
                              {att.consecAbsent > 0 && <div style={{ fontSize: 10, color: risk ? C.red : C.gold, fontWeight: 700 }}>
                                {risk ? "🚨" : "⚠"} {att.consecAbsent}wk absent
                              </div>}
                            </div>
                          )}
                          <span style={{ color: C.muted, fontSize: 18 }}>›</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Attendance grid tab ── */}
            {lgTab === "attendance" && hasTracking && (
              <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: 800 }}>
                  {/* Header row */}
                  <div style={{ display: "grid", gridTemplateColumns: `200px repeat(${LG_MEETINGS.length}, 52px) 70px 80px`, gap: 2, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, padding: "4px 8px" }}>Member</div>
                    {LG_MEETINGS.map(m => (
                      <div key={m.id} style={{ fontSize: 10, color: C.muted, fontWeight: 700, textAlign: "center", lineHeight: 1.3, padding: "2px 0" }}>{m.label}</div>
                    ))}
                    <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, textAlign: "center" }}>Att %</div>
                    <div style={{ fontSize: 13, color: C.muted, fontWeight: 700, textAlign: "center" }}>Streak</div>
                  </div>
                  {group.members.map(m => {
                    const att = LG_ATTENDANCE[String(m.id)];
                    if (!att) return null;
                    return (
                      <div key={m.id} onClick={() => setMemberDetail(m)}
                        style={{ display: "grid", gridTemplateColumns: `200px repeat(${LG_MEETINGS.length}, 52px) 70px 80px`, gap: 2, marginBottom: 3, cursor: "pointer", borderRadius: 8, padding: "2px 0" }}>
                        <div style={{ fontSize: 14, color: C.text, padding: "6px 8px", background: C.card, borderRadius: "8px 0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                        {att.record.map((present, i) => (
                          <div key={i} style={{ background: present ? C.green + "33" : C.red + "33", border: `1px solid ${present ? C.green + "55" : C.red + "44"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, borderRadius: 4 }}>
                            {present ? "✓" : "✗"}
                          </div>
                        ))}
                        <div style={{ background: C.card, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 13, fontWeight: 800, color: attColor(att.pct) }}>{att.pct}%</div>
                        <div style={{ background: C.card, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 8px 8px 0", fontSize: 12, fontWeight: 700, color: att.consecAbsent >= 3 ? C.red : att.consecAbsent >= 1 ? C.gold : C.green }}>
                          {att.consecAbsent === 0 ? "Active" : `${att.consecAbsent}wk ✗`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Meetings tab ── */}
            {lgTab === "meetings" && hasTracking && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, color: C.dim }}>Click any meeting to see the full present/absent list</div>
                </div>
                {[...LG_MEETINGS].reverse().map(m => {
                  const pct = Math.round(m.count / group.members.length * 100);
                  return (
                    <div key={m.id} onClick={() => setMeetingDetail(m)}
                      style={{ padding: "14px 18px", background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{m.date}</div>
                        <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{m.count} of {group.members.length} present · {group.members.length - m.count} absent</div>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 120, background: C.border, borderRadius: 99, height: 8 }}>
                          <div style={{ width: pct + "%", background: pct >= 75 ? C.green : pct >= 55 ? C.gold : C.red, height: "100%", borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: pct >= 75 ? C.green : pct >= 55 ? C.gold : C.red, minWidth: 40, textAlign: "right" }}>{pct}%</span>
                        <span style={{ color: C.muted }}>›</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Follow-Up tab ── */}
            {lgTab === "follow-up" && hasTracking && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: "14px 18px", background: C.red + "11", border: `1px solid ${C.red}33`, borderRadius: 12 }}>
                  <div style={{ fontWeight: 700, color: C.red, marginBottom: 4 }}>Members needing immediate follow-up</div>
                  <div style={{ fontSize: 13.5, color: C.muted }}>Sorted by consecutive absences. Click any row to view full profile and prayer requests.</div>
                </div>
                {group.members
                  .map(m => ({ m, att: LG_ATTENDANCE[String(m.id)] }))
                  .filter(({ att }) => att && att.consecAbsent >= 1)
                  .sort((a, b) => b.att.consecAbsent - a.att.consecAbsent)
                  .map(({ m, att }) => (
                    <div key={m.id} onClick={() => setMemberDetail(m)}
                      style={{ padding: "16px 18px", background: C.card, borderRadius: 12, border: `1px solid ${att.consecAbsent >= 4 ? C.red + "77" : att.consecAbsent >= 2 ? C.gold + "55" : C.border}`, cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 600, color: C.text, fontSize: 15, marginBottom: 4 }}>{m.name}</div>
                          <div style={{ fontSize: 13, color: C.muted }}>{m.email} · {m.phone}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, fontSize: 18, color: att.consecAbsent >= 4 ? C.red : C.gold }}>{att.consecAbsent} wk</div>
                          <div style={{ fontSize: 13, color: C.muted }}>consecutive</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <AttendanceDots record={att.record} size={14} meetings={LG_MEETINGS} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <Badge label={att.pct + "% overall"} color={attColor(att.pct)} />
                          {att.consecAbsent >= 4
                            ? <Badge label="Urgent" color={C.red} />
                            : att.consecAbsent >= 2
                            ? <Badge label="Follow Up" color={C.gold} />
                            : <Badge label="Watch" color={C.muted} />
                          }
                        </div>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 12, color: att.consecAbsent >= 4 ? C.red : C.gold }}>
                        {att.consecAbsent >= 4 ? "🚨 A personal visit or phone call is strongly recommended." :
                         att.consecAbsent >= 2 ? "⚠️ Reach out before next meeting to check in." :
                         "👁 Keep an eye on attendance trend."}
                      </div>
                    </div>
                  ))}
                {group.members.filter(m => (LG_ATTENDANCE[String(m.id)]?.consecAbsent || 0) >= 1).length === 0 && (
                  <div style={{ padding: "20px", textAlign: "center", color: C.green, fontWeight: 700, background: C.card, borderRadius: 12 }}>
                    All members attended last meeting!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Member detail panel */}
      {memberDetail && (
        <MemberDetailPanel
          member={memberDetail}
          onClose={() => setMemberDetail(null)}
          prayerRequests={prayerRequests}
          meetings={LG_MEETINGS}
        />
      )}

      {/* Meeting detail modal */}
      {meetingDetail && (
        <MeetingDetailModal
          meeting={meetingDetail}
          groupMembers={group?.members || []}
          onClose={() => setMeetingDetail(null)}
        />
      )}
    </div>
  );
}

// ── Ministry Leadership ───────────────────────────────────────────────────────
function MinistryLeadership({ ministries, setMinistries, prayerRequests, setPrayerRequests, lifeGroups }) {
  const [modal, setModal] = useState(null);
  const [subTab, setSubTab] = useState("ministries");
  const [form, setForm] = useState({});
  const [pform, setPform] = useState({ requester:"", request:"", category:"Health", private:false });
  const emptyMin = { name:"", leader:"", members:"", volunteers:"", budget:"", description:"", status:"Active" };
  const statusColor = { Active: C.green, Inactive: C.muted, Answered: C.gold };

  function saveMin() {
    if (!form.name) return;
    if (form.id) setMinistries(m => m.map(x => x.id === form.id ? { ...form, members:+form.members||0, volunteers:+form.volunteers||0, budget:+form.budget||0 } : x));
    else setMinistries(m => [...m, { ...form, id: Date.now(), members:+form.members||0, volunteers:+form.volunteers||0, budget:+form.budget||0 }]);
    setModal(null);
  }

  function savePrayer() {
    if (!pform.requester || !pform.request) return;
    setPrayerRequests(p => [...p, { ...pform, id: Date.now(), date: today(), status:"Active" }]);
    setPform({ requester:"", request:"", category:"Health", private:false });
    setModal(null);
  }

  const subTabs = ["ministries","life groups","prayer"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 23, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>Ministry Leadership</h1><p style={{ color: C.muted, marginTop: 4, fontSize: 14.5 }}>Ministries, Life Groups, prayer & volunteers</p></div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn outline color={C.purple} onClick={() => setModal("prayer")}>+ Prayer Request</Btn>
          <Btn onClick={() => { setForm(emptyMin); setModal("ministry"); }}>+ Add Ministry</Btn>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {subTabs.map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{ background: subTab === t ? C.accent : C.card, color: subTab === t ? "#fff" : C.muted, border: `1px solid ${subTab === t ? C.accent : C.border}`, borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>
      {subTab === "life groups" && <LifeGroupsView lifeGroups={lifeGroups} prayerRequests={prayerRequests} setPrayerRequests={setPrayerRequests} />}
      {subTab === "prayer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 8 }}>
            <StatCard icon="🙏" label="Total Requests" value={prayerRequests.length}                                    color={C.purple} />
            <StatCard icon="✅" label="Answered"       value={prayerRequests.filter(p => p.status==="Answered").length} color={C.green}  />
            <StatCard icon="⏳" label="Active"         value={prayerRequests.filter(p => p.status==="Active").length}   color={C.accent} />
          </div>
          {[...prayerRequests].sort((a,b) => b.date.localeCompare(a.date)).map(p => (
            <div key={p.id} style={{ background: C.card, border: `1px solid ${p.status === "Answered" ? C.green + "44" : C.border}`, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: C.text }}>{p.private ? "Anonymous" : p.requester}</span>
                  {p.group && <Badge label={p.group} color={C.accent2} />}
                  <Badge label={p.category} color={C.accent} />
                  {p.private && <Badge label="Private" color={C.muted} />}
                  <Badge label={p.status} color={statusColor[p.status] || C.muted} />
                </div>
                <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{p.date}</span>
              </div>
              <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, margin: 0 }}>{p.request}</p>
              {p.followUpNote && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: C.green + "11", border: `1px solid ${C.green}33`, borderRadius: 9 }}>
                  <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 4 }}>FOLLOW-UP · {p.followUp}</div>
                  <div style={{ fontSize: 13, color: C.dim }}>{p.followUpNote}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {subTab === "ministries" && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {ministries.map(m => (
          <div key={m.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{m.name}</div>
              <Badge label={m.status} color={C.green} />
            </div>
            <p style={{ fontSize: 13.5, color: C.muted }}>{m.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[["Leader", m.leader.split(" ").slice(-1)[0]], ["Members", m.members], ["Volunteers", m.volunteers]].map(([l, v]) => (
                <div key={l} style={{ background: C.bg, borderRadius: 9, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>{l}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.muted }}>Budget: {fmt$(m.budget)}</span>
                <span style={{ fontSize: 12, color: C.accent }}>~60% used</span>
              </div>
              <ProgressBar value={m.budget * 0.6} max={m.budget} />
            </div>
            <Btn small outline color={C.accent} onClick={() => { setForm({ ...m, members:String(m.members), volunteers:String(m.volunteers), budget:String(m.budget) }); setModal("ministry"); }}>Edit Ministry</Btn>
          </div>
        ))}
      </div>}
      {modal === "ministry" && (
        <Modal title={form.id ? "Edit Ministry" : "New Ministry"} onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Ministry Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Inp label="Ministry Leader" value={form.leader} onChange={e => setForm(f => ({ ...f, leader: e.target.value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Inp label="Members" type="number" value={form.members} onChange={e => setForm(f => ({ ...f, members: e.target.value }))} />
              <Inp label="Volunteers" type="number" value={form.volunteers} onChange={e => setForm(f => ({ ...f, volunteers: e.target.value }))} />
              <Inp label="Budget ($)" type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
            </div>
            <Txt label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <Sel label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option>Active</option><option>Inactive</option>
            </Sel>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn outline color={C.muted} onClick={() => setModal(null)}>Cancel</Btn>
              <Btn onClick={saveMin}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}
      {modal === "prayer" && (
        <Modal title="New Prayer Request" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Name / Requester" value={pform.requester} onChange={e => setPform(f => ({ ...f, requester: e.target.value }))} />
            <Txt label="Prayer Request" value={pform.request} onChange={e => setPform(f => ({ ...f, request: e.target.value }))} />
            <Sel label="Category" value={pform.category} onChange={e => setPform(f => ({ ...f, category: e.target.value }))}>
              {["Health","Family","Career","Missions","Finances","Praise","Other"].map(c => <option key={c}>{c}</option>)}
            </Sel>
            <label style={{ display: "flex", gap: 10, alignItems: "center", color: C.dim, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={pform.private} onChange={e => setPform(f => ({ ...f, private: e.target.checked }))} />
              Keep requester anonymous
            </label>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn outline color={C.muted} onClick={() => setModal(null)}>Cancel</Btn>
              <Btn color={C.purple} onClick={savePrayer}>Submit</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Finance ───────────────────────────────────────────────────────────────────
function Finance({ transactions, setTransactions }) {
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ date:today(), type:"Income", category:"Tithes & Offerings", amount:"", description:"", account:"General Fund" });

  const income  = transactions.filter(t => t.type === "Income").reduce((s, t)  => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const net = income - expense;
  const filtered = transactions.filter(t => filter === "All" || t.type === filter).sort((a, b) => b.date.localeCompare(a.date));

  function save() {
    if (!form.amount || !form.description) return;
    setTransactions(t => [...t, { ...form, id: Date.now(), amount: parseFloat(form.amount) || 0 }]);
    setModal(false);
    setForm({ date:today(), type:"Income", category:"Tithes & Offerings", amount:"", description:"", account:"General Fund" });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 23, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>Finance</h1><p style={{ color: C.muted, marginTop: 4, fontSize: 14.5 }}>Budgets, giving & financial reports</p></div>
        <Btn onClick={() => setModal(true)}>+ Add Transaction</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard icon="📈" label="Total Income"   value={fmt$(income)}  sub="This period" color={C.green} />
        <StatCard icon="📉" label="Total Expenses" value={fmt$(expense)}                   color={C.red}   />
        <StatCard icon="💵" label="Net Balance"    value={fmt$(net)} sub={net >= 0 ? "Surplus" : "Deficit"} color={net >= 0 ? C.green : C.red} />
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
        <h3 style={{ fontWeight: 800, color: C.text, marginBottom: 18 }}>Budget by Department</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {BUDGETS.map(b => (
            <div key={b.dept}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{b.dept}</span>
                <span style={{ fontSize: 13.5, color: C.muted }}>{fmt$(b.spent)} / {fmt$(b.allocated)} · {fmtPct(b.spent, b.allocated)}</span>
              </div>
              <ProgressBar value={b.spent} max={b.allocated} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontWeight: 800, color: C.text }}>Transactions</h3>
          <div style={{ display: "flex", gap: 8 }}>
            {["All","Income","Expense"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? C.accent : C.bg, color: filter === f ? "#fff" : C.muted, border: `1px solid ${filter === f ? C.accent : C.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{t.description}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{t.category} · {t.account} · {t.date}</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: t.type === "Income" ? C.green : C.red }}>
                {t.type === "Income" ? "+" : "-"}{fmt$(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <Modal title="New Transaction" onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              <Sel label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Income</option><option>Expense</option>
              </Sel>
            </div>
            <Sel label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {["Tithes & Offerings","Online Giving","Events","Missions","Facilities","Staff","Ministry","Equipment","Marketing","Other"].map(c => <option key={c}>{c}</option>)}
            </Sel>
            <Inp label="Amount ($)" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
            <Inp label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <Sel label="Account" value={form.account} onChange={e => setForm(f => ({ ...f, account: e.target.value }))}>
              {["General Fund","Operations","Payroll","Children Fund","Youth Fund","Missions Fund","Marketing"].map(a => <option key={a}>{a}</option>)}
            </Sel>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn outline color={C.muted} onClick={() => setModal(false)}>Cancel</Btn>
              <Btn color={C.green} onClick={save}>Save Transaction</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── HR ────────────────────────────────────────────────────────────────────────
function HRFile({ member, onClose, onSave, onDelete, colorFor }) {
  const col = colorFor(member.dept);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...member, salary: String(member.salary || "") });
  const initials = member.name.split(" ").map(n => n[0]).slice(0, 2).join("");
  const yearsServed = member.startDate ? Math.floor((new Date() - new Date(member.startDate)) / (365.25 * 24 * 60 * 60 * 1000)) : null;

  function save() {
    if (!form.name || !form.role) return;
    onSave({ ...form, salary: +form.salary || 0 });
    setEditing(false);
  }

  const Row = ({ label, value }) => value ? (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", paddingTop: 2 }}>{label}</span>
      <span style={{ fontSize: 14, color: C.text }}>{value}</span>
    </div>
  ) : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px", overflowY: "auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, width: "100%", maxWidth: 680, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}>

        {/* Header band */}
        <div style={{ background: col + "18", borderBottom: `1px solid ${col}44`, borderRadius: "12px 12px 0 0", padding: "20px 24px", display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: col + "22", border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: col, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>{member.name}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{member.role} · {member.dept}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <Badge label={member.status} color={member.status === "Active" ? C.green : C.muted} />
              {yearsServed !== null && <Badge label={yearsServed === 0 ? "< 1 yr" : yearsServed + (yearsServed === 1 ? " yr" : " yrs")} color={C.accent} />}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", alignSelf: "flex-start" }}>×</button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {!editing ? (
            <>
              {/* Contact */}
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Contact</div>
              <Row label="Email"       value={member.email} />
              <Row label="Phone"       value={member.phone} />
              <Row label="Address"     value={member.address} />

              {/* Emergency contact */}
              {(member.emergencyName || member.emergencyPhone) && <>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 20, marginBottom: 8 }}>Emergency Contact</div>
                <Row label="Name"         value={member.emergencyName} />
                <Row label="Relationship" value={member.emergencyRel} />
                <Row label="Phone"        value={member.emergencyPhone} />
              </>}

              {/* Employment */}
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 20, marginBottom: 8 }}>Employment</div>
              <Row label="Department"  value={member.dept} />
              <Row label="Role / Title" value={member.role} />
              <Row label="Status"      value={member.status} />
              <Row label="Start Date"  value={member.startDate} />
              <Row label="Salary"      value={member.salary > 0 ? fmt$(member.salary) + " / yr" : null} />
              <Row label="Employee ID" value={member.employeeId} />

              {/* Notes */}
              {member.notes && <>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 20, marginBottom: 8 }}>HR Notes</div>
                <div style={{ fontSize: 14, color: C.text, background: C.bg, borderRadius: 10, padding: "14px 16px", lineHeight: 1.6 }}>{member.notes}</div>
              </>}

              <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end", flexWrap: "wrap" }}>
                {member.email && <a href={`mailto:${member.email}`} style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 9, padding: "8px 16px", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>✉ Email</a>}
                {member.phone && <a href={`tel:${member.phone}`}   style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 9, padding: "8px 16px", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>📞 Call</a>}
                <Btn outline color={C.red}   small onClick={() => { if (window.confirm("Remove " + member.name + "?")) { onDelete(member.id); onClose(); } }}>Remove</Btn>
                <Btn small onClick={() => setEditing(true)}>Edit File</Btn>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Basic Info</div>
              <Inp label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Inp label="Role / Title" value={form.role}  onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                <Inp label="Department"   value={form.dept}  onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} />
              </div>

              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>Contact</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Inp label="Email" type="email" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <Inp label="Phone"              value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <Inp label="Address" value={form.address || ""} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />

              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>Emergency Contact</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Inp label="Name"         value={form.emergencyName  || ""} onChange={e => setForm(f => ({ ...f, emergencyName:  e.target.value }))} />
                <Inp label="Relationship" value={form.emergencyRel   || ""} onChange={e => setForm(f => ({ ...f, emergencyRel:   e.target.value }))} />
              </div>
              <Inp label="Emergency Phone" value={form.emergencyPhone || ""} onChange={e => setForm(f => ({ ...f, emergencyPhone: e.target.value }))} />

              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>Employment</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <Sel label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Active</option><option>On Leave</option><option>Inactive</option>
                </Sel>
                <Inp label="Start Date"  type="date"   value={form.startDate   || ""} onChange={e => setForm(f => ({ ...f, startDate:   e.target.value }))} />
                <Inp label="Salary ($)"  type="number" value={form.salary      || ""} onChange={e => setForm(f => ({ ...f, salary:      e.target.value }))} />
              </div>
              <Inp label="Employee ID" value={form.employeeId || ""} onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))} />

              <div style={{ fontSize: 13, fontWeight: 800, color: C.text, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>HR Notes</div>
              <Txt label="" value={form.notes || ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Performance notes, review dates, special circumstances…" />

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <Btn outline color={C.muted} small onClick={() => setEditing(false)}>Cancel</Btn>
                <Btn small onClick={save}>Save File</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HR({ staff, setStaff }) {
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [addModal, setAddModal]     = useState(false);
  const [addForm, setAddForm]       = useState({});

  const empty = { name:"", role:"", dept:"", email:"", phone:"", address:"", status:"Active", startDate:today(), salary:"", notes:"", emergencyName:"", emergencyRel:"", emergencyPhone:"", employeeId:"" };
  const depts = [...new Set(staff.map(s => s.dept))];
  const deptColors = [C.accent, C.purple, C.green, C.gold, C.pink, C.accent2, C.red];
  const colorFor = d => deptColors[depts.indexOf(d) % deptColors.length] || C.accent;

  const totalPayroll = staff.reduce((s, x) => s + (x.salary || 0), 0);
  const selectedMember = staff.find(s => s.id === selectedId);

  const filtered = staff.filter(s => {
    const matchStatus = filterStatus === "All" || s.status === filterStatus || (filterStatus === "Depts" );
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()) || s.dept.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  function saveNew() {
    if (!addForm.name || !addForm.role) return;
    setStaff(s => [...s, { ...addForm, id: Date.now(), salary: +addForm.salary || 0 }]);
    setAddModal(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 23, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>Human Resources</h1><p style={{ color: C.muted, marginTop: 4, fontSize: 14.5 }}>Click any stat to filter · click any staff member to open their HR file</p></div>
        <Btn onClick={() => { setAddForm(empty); setAddModal(true); }}>+ Add Staff</Btn>
      </div>

      {/* Stat cards — each filters the list */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <StatCard icon="👔" label="Total Staff"      value={staff.length}                                      color={C.accent} onClick={() => setFilter("All")}      />
        <StatCard icon="✅" label="Active"           value={staff.filter(s => s.status === "Active").length}   color={C.green}  onClick={() => setFilter("Active")}   />
        <StatCard icon="🏖" label="On Leave"         value={staff.filter(s => s.status === "On Leave").length} color={C.gold}   onClick={() => setFilter("On Leave")} />
        <StatCard icon="💰" label="Payroll (Annual)" value={fmt$(totalPayroll)}                                color={C.purple} onClick={() => setFilter("All")}      />
      </div>

      {/* Active filter chip */}
      {filterStatus !== "All" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13.5, color: C.muted }}>Filtered:</span>
          <span style={{ background: C.accent + "18", color: C.accent, border: `1px solid ${C.accent}44`, borderRadius: 20, padding: "3px 12px", fontSize: 13, fontWeight: 700 }}>{filterStatus}</span>
          <button onClick={() => setFilter("All")} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Department tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["All", ...depts].map(d => (
          <button key={d} onClick={() => { setFilter("All"); setSearch(d === "All" ? "" : d); }}
            style={{ background: search === d || (d === "All" && !search && filterStatus === "All") ? C.accent : C.card, color: search === d || (d === "All" && !search && filterStatus === "All") ? "#fff" : C.muted, border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {d}
          </button>
        ))}
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role, or department…" style={{ ...inputStyle, maxWidth: 440 }} />

      {/* Staff cards — each is fully clickable */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 12 }}>
        {filtered.map(s => {
          const col = colorFor(s.dept);
          return (
            <div key={s.id}
              onClick={() => setSelectedId(s.id)}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 12, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = col; e.currentTarget.style.boxShadow = `0 4px 16px ${col}22`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: col + "18", border: `1.5px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: col, flexShrink: 0 }}>
                    {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{s.role}</div>
                  </div>
                </div>
                <Badge label={s.status} color={s.status === "Active" ? C.green : s.status === "On Leave" ? C.gold : C.muted} />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge label={s.dept} color={col} />
                {s.salary > 0 && <Badge label={fmt$(s.salary) + "/yr"} color={C.purple} />}
              </div>
              <div style={{ fontSize: 13, color: C.muted }}>{s.email}</div>
              {s.startDate && <div style={{ fontSize: 13, color: C.muted }}>Since {s.startDate}</div>}
              <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginTop: 2 }}>Open HR File →</div>
            </div>
          );
        })}
      </div>

      {/* HR File panel */}
      {selectedMember && (
        <HRFile
          member={selectedMember}
          colorFor={colorFor}
          onClose={() => setSelectedId(null)}
          onSave={updated => { setStaff(s => s.map(x => x.id === updated.id ? updated : x)); }}
          onDelete={id => setStaff(s => s.filter(x => x.id !== id))}
        />
      )}

      {/* Add staff modal */}
      {addModal && (
        <Modal title="Add Staff Member" onClose={() => setAddModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Full Name" value={addForm.name || ""} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Role / Title" value={addForm.role || ""} onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))} />
              <Inp label="Department"   value={addForm.dept || ""} onChange={e => setAddForm(f => ({ ...f, dept: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Email" type="email" value={addForm.email || ""} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
              <Inp label="Phone"              value={addForm.phone || ""} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Sel label="Status" value={addForm.status || "Active"} onChange={e => setAddForm(f => ({ ...f, status: e.target.value }))}>
                <option>Active</option><option>On Leave</option><option>Inactive</option>
              </Sel>
              <Inp label="Start Date" type="date"   value={addForm.startDate || ""} onChange={e => setAddForm(f => ({ ...f, startDate: e.target.value }))} />
              <Inp label="Salary ($)" type="number" value={addForm.salary    || ""} onChange={e => setAddForm(f => ({ ...f, salary:    e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn outline color={C.muted} onClick={() => setAddModal(false)}>Cancel</Btn>
              <Btn onClick={saveNew}>Add Staff Member</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── PR & Communications ───────────────────────────────────────────────────────
function PRComms({ announcements, setAnnouncements }) {
  const [modal, setModal] = useState(false);
  const emptyForm = { title:"", body:"", category:"General", published:false, date:today(), channels:[] };
  const [form, setForm] = useState(emptyForm);
  const cats = ["General","Event","Outreach","Ministry","Finance","Emergency"];
  const allChannels = ["Bulletin","Website","Social","Email","SMS"];
  const catColor = { General:C.accent, Event:C.gold, Outreach:C.green, Ministry:C.purple, Finance:C.accent2, Emergency:C.red };

  function toggleCh(ch) { setForm(f => ({ ...f, channels: f.channels.includes(ch) ? f.channels.filter(c => c !== ch) : [...f.channels, ch] })); }

  function save() {
    if (!form.title || !form.body) return;
    if (form.id) setAnnouncements(a => a.map(x => x.id === form.id ? form : x));
    else setAnnouncements(a => [...a, { ...form, id: Date.now() }]);
    setModal(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 23, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>PR & Communications</h1><p style={{ color: C.muted, marginTop: 4, fontSize: 14.5 }}>Announcements, press & church messaging</p></div>
        <Btn onClick={() => { setForm(emptyForm); setModal(true); }}>+ New Announcement</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <StatCard icon="📢" label="Announcements" value={announcements.length}                             color={C.accent} />
        <StatCard icon="✅" label="Published"     value={announcements.filter(a => a.published).length}   color={C.green}  />
        <StatCard icon="📝" label="Drafts"        value={announcements.filter(a => !a.published).length}  color={C.muted}  />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[...announcements].sort((a, b) => b.date.localeCompare(a.date)).map(a => (
          <div key={a.id} style={{ background: C.card, border: `1px solid ${a.published ? C.border : C.gold + "44"}`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge label={a.category} color={catColor[a.category] || C.accent} />
                <Badge label={a.published ? "Published" : "Draft"} color={a.published ? C.green : C.gold} />
                {a.channels.map(ch => <Badge key={ch} label={ch} color={C.muted} />)}
              </div>
              <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>{a.date}</span>
            </div>
            <h3 style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 8 }}>{a.title}</h3>
            <p style={{ fontSize: 14, color: C.dim, lineHeight: 1.6 }}>{a.body}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Btn small outline color={C.accent} onClick={() => { setForm(a); setModal(true); }}>Edit</Btn>
              <Btn small outline color={a.published ? C.muted : C.green} onClick={() => setAnnouncements(arr => arr.map(x => x.id === a.id ? { ...x, published: !x.published } : x))}>
                {a.published ? "Unpublish" : "Publish"}
              </Btn>
              <Btn small danger onClick={() => setAnnouncements(arr => arr.filter(x => x.id !== a.id))}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={form.id ? "Edit Announcement" : "New Announcement"} onClose={() => setModal(false)} width={620}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Txt label="Body / Message" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} style={{ minHeight: 120 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Sel label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </Sel>
              <Inp label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <Field label="Distribution Channels">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {allChannels.map(ch => (
                  <button key={ch} onClick={() => toggleCh(ch)} style={{ background: form.channels.includes(ch) ? C.accent : C.bg, color: form.channels.includes(ch) ? "#fff" : C.muted, border: `1px solid ${form.channels.includes(ch) ? C.accent : C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{ch}</button>
                ))}
              </div>
            </Field>
            <label style={{ display: "flex", gap: 10, alignItems: "center", color: C.dim, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
              Publish immediately
            </label>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn outline color={C.muted} onClick={() => setModal(false)}>Cancel</Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Marketing & Messaging ─────────────────────────────────────────────────────
function Marketing({ campaigns, setCampaigns }) {
  const [modal, setModal] = useState(false);
  const emptyForm = { name:"", type:"Event", status:"Draft", channel:[], reach:0, opens:0, startDate:today(), endDate:today(), description:"" };
  const [form, setForm] = useState(emptyForm);
  const allChannels = ["Email","Social","SMS","Website","Print"];
  const statusColor = { Active:C.green, Draft:C.gold, Completed:C.muted, Planned:C.accent };

  function toggleCh(ch) { setForm(f => ({ ...f, channel: f.channel.includes(ch) ? f.channel.filter(c => c !== ch) : [...f.channel, ch] })); }

  function save() {
    if (!form.name) return;
    if (form.id) setCampaigns(c => c.map(x => x.id === form.id ? form : x));
    else setCampaigns(c => [...c, { ...form, id: Date.now() }]);
    setModal(false);
  }

  const totalReach = campaigns.reduce((s, c) => s + (c.reach || 0), 0);
  const withReach = campaigns.filter(c => c.reach > 0);
  const avgOpen = withReach.length ? Math.round(withReach.reduce((s, c) => s + c.opens, 0) / withReach.length) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 23, fontWeight: 700, color: C.text, letterSpacing: "-0.01em" }}>Marketing & Messaging</h1><p style={{ color: C.muted, marginTop: 4, fontSize: 14.5 }}>Campaigns, outreach analytics & communications</p></div>
        <Btn onClick={() => { setForm(emptyForm); setModal(true); }}>+ New Campaign</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <StatCard icon="📣" label="Total Campaigns" value={campaigns.length}                                   color={C.pink}   />
        <StatCard icon="🟢" label="Active"          value={campaigns.filter(c => c.status === "Active").length} color={C.green}  />
        <StatCard icon="👁" label="Total Reach"     value={totalReach.toLocaleString()}                        color={C.accent} />
        <StatCard icon="📧" label="Avg Open Rate"   value={avgOpen + "%"}                                      color={C.gold}   />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[...campaigns].sort((a, b) => b.startDate.localeCompare(a.startDate)).map(c => (
          <div key={c.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <Badge label={c.type} color={C.accent2} />
                  <Badge label={c.status} color={statusColor[c.status] || C.muted} />
                  {c.channel.map(ch => <Badge key={ch} label={ch} color={C.muted} />)}
                </div>
                <h3 style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{c.name}</h3>
                <p style={{ fontSize: 13.5, color: C.muted, marginTop: 4 }}>{c.description}</p>
              </div>
              <div style={{ textAlign: "right", minWidth: 90 }}>
                <div style={{ fontSize: 13, color: C.muted }}>{c.startDate}</div>
                {c.endDate !== c.startDate && <div style={{ fontSize: 13, color: C.muted }}>{c.endDate}</div>}
              </div>
            </div>
            {c.reach > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                {[["Reach", c.reach.toLocaleString()], ["Open Rate", c.opens + "%"], ["Engagement", Math.round(c.opens * 0.4) + "%"]].map(([l, v]) => (
                  <div key={l} style={{ background: C.bg, borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", fontWeight: 700 }}>{l}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginTop: 4 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small outline color={C.accent} onClick={() => { setForm(c); setModal(true); }}>Edit</Btn>
              {c.status === "Draft" && <Btn small color={C.green} onClick={() => setCampaigns(cs => cs.map(x => x.id === c.id ? { ...x, status:"Active" } : x))}>Launch</Btn>}
              {c.status === "Active" && <Btn small outline color={C.muted} onClick={() => setCampaigns(cs => cs.map(x => x.id === c.id ? { ...x, status:"Completed" } : x))}>Mark Complete</Btn>}
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={form.id ? "Edit Campaign" : "New Campaign"} onClose={() => setModal(false)} width={600}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Campaign Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Txt label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Sel label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {["Event","Outreach","Finance","Ministry","General"].map(t => <option key={t}>{t}</option>)}
              </Sel>
              <Sel label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {["Draft","Planned","Active","Completed"].map(s => <option key={s}>{s}</option>)}
              </Sel>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Start Date" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              <Inp label="End Date"   type="date" value={form.endDate}   onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
            <Field label="Channels">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {allChannels.map(ch => (
                  <button key={ch} onClick={() => toggleCh(ch)} style={{ background: form.channel.includes(ch) ? C.pink : C.bg, color: form.channel.includes(ch) ? "#fff" : C.muted, border: `1px solid ${form.channel.includes(ch) ? C.pink : C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{ch}</button>
                ))}
              </div>
            </Field>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn outline color={C.muted} onClick={() => setModal(false)}>Cancel</Btn>
              <Btn color={C.pink} onClick={save}>Save Campaign</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
const TABS = [
  { id:"dashboard", label:"Dashboard",      icon:"🏠" },
  { id:"admin",     label:"Administrative", icon:"📅" },
  { id:"ministry",  label:"Ministry",       icon:"⛪" },
  { id:"finance",   label:"Finance",        icon:"💰" },
  { id:"hr",        label:"HR",             icon:"👔" },
  { id:"pr",        label:"PR & Comms",     icon:"📢" },
  { id:"marketing", label:"Marketing",      icon:"📣" },
];

// ── Root ──────────────────────────────────────────────────────────────────────
export default function ChurchOS() {
  const [tab,           setTab]           = useStored("cos2-tab",           "dashboard");
  const [staff,         setStaff]         = useStored("cos2-staff",         SEED_STAFF);
  const [ministries,    setMinistries]    = useStored("cos2-ministries",    SEED_MINISTRIES);
  const [lifeGroups,    setLifeGroups]    = useStored("cos2-lifegroups",    SEED_LIFE_GROUPS);
  const [transactions,  setTransactions]  = useStored("cos2-transactions",  SEED_TRANSACTIONS);
  const [campaigns,     setCampaigns]     = useStored("cos2-campaigns",     SEED_CAMPAIGNS);
  const [announcements, setAnnouncements] = useStored("cos2-announcements", SEED_ANNOUNCEMENTS);
  const [prayerRequests,setPrayerRequests]= useStored("cos2-prayer",        SEED_PRAYER);
  const [events,        setEvents]        = useStored("cos2-events",        SEED_EVENTS);
  const [open,          setOpen]          = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <aside style={{ width: open ? 240 : 64, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "width .22s", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ padding: "18px 16px", borderBottom: `1px solid ${C.border}`, minHeight: 54 }}>
          {open && <div style={{ fontSize: 17, fontWeight: 700, color: C.text, padding: "0 4px", letterSpacing: "-0.01em" }}>ChurchOS</div>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "8px 11px", marginBottom: 2, borderRadius: 7, border: "none", cursor: "pointer", background: tab === t.id ? C.accent + "12" : "transparent", color: tab === t.id ? C.accent : C.dim, fontWeight: tab === t.id ? 600 : 500, fontSize: 14.5, textAlign: "left" }}>
              <span style={{ flexShrink: 0, display: "flex" }}><Icon glyph={t.icon} size={19} /></span>
              {open && <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{t.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => setOpen(o => !o)} style={{ margin: "10px 8px", padding: "8px 11px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.muted, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: open ? "flex-end" : "center" }}>
          {open ? "◀" : "▶"}
        </button>
      </aside>
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {tab === "dashboard" && <Dashboard staff={staff} ministries={ministries} transactions={transactions} events={events} campaigns={campaigns} prayerRequests={prayerRequests} lifeGroups={lifeGroups} setTab={setTab} />}
        {tab === "admin"     && <Administrative events={events} setEvents={setEvents} />}
        {tab === "ministry"  && <MinistryLeadership ministries={ministries} setMinistries={setMinistries} prayerRequests={prayerRequests} setPrayerRequests={setPrayerRequests} lifeGroups={lifeGroups} />}
        {tab === "finance"   && <Finance transactions={transactions} setTransactions={setTransactions} />}
        {tab === "hr"        && <HR staff={staff} setStaff={setStaff} />}
        {tab === "pr"        && <PRComms announcements={announcements} setAnnouncements={setAnnouncements} />}
        {tab === "marketing" && <Marketing campaigns={campaigns} setCampaigns={setCampaigns} />}
      </main>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${C.bg}; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1); }
        input, select, textarea { color-scheme: dark; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
        button:hover { opacity: .88; }
      `}</style>
    </div>
  );
}
