import { useState, useEffect } from "react";
import {
  SEED_STAFF, SEED_MINISTRIES, SEED_LIFE_GROUPS,
  SEED_PRAYER, SEED_EVENTS, SEED_TRANSACTIONS,
  SEED_CAMPAIGNS, SEED_ANNOUNCEMENTS, BUDGETS
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
  bg: "#0a0f1e", surface: "#111827", card: "#1a2235", border: "#1e2d47",
  accent: "#3b82f6", accent2: "#6366f1", gold: "#f59e0b", green: "#10b981",
  red: "#ef4444", purple: "#8b5cf6", pink: "#ec4899", text: "#e2e8f0",
  muted: "#64748b", dim: "#94a3b8",
};


const fmt$ = n => "$" + Number(n).toLocaleString();
const fmtPct = (a, b) => b ? Math.round((a / b) * 100) + "%" : "0%";
const today = () => new Date().toISOString().slice(0, 10);

function Badge({ label, color = C.accent }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color = C.accent }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        {sub && <span style={{ fontSize: 11, color, background: color + "22", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>{sub}</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{value}</div>
      <div style={{ fontSize: 13, color: C.muted }}>{label}</div>
    </div>
  );
}

function ProgressBar({ value, max, color = C.accent }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: C.border, borderRadius: 99, height: 8, overflow: "hidden" }}>
      <div style={{ width: pct + "%", height: "100%", background: pct > 85 ? C.red : color, borderRadius: 99, transition: "width .4s" }} />
    </div>
  );
}

function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32, width, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>}
      {children}
    </div>
  );
}

const inputStyle = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: "10px 14px", color: C.text, fontSize: 14, outline: "none", width: "100%" };

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
    <button onClick={onClick} style={{ background: danger ? C.red : outline ? "transparent" : color, border: outline ? `1px solid ${color}` : danger ? `1px solid ${C.red}` : "none", color: "#fff", borderRadius: 9, padding: small ? "6px 14px" : "10px 20px", fontWeight: 700, fontSize: small ? 12 : 14, cursor: "pointer", ...style }}>
      {children}
    </button>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ staff, ministries, transactions, events, campaigns }) {
  const income  = transactions.filter(t => t.type === "Income").reduce((s, t)  => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const upcoming = events.filter(e => e.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const recentTx = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const totalMembers = ministries.reduce((s, m) => s + m.members, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.text }}>Dashboard</h1>
        <p style={{ color: C.muted, marginTop: 4 }}>Overview of all church operations</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16 }}>
        <StatCard icon="👥" label="Ministry Members"   value={totalMembers.toLocaleString()} sub="+12 this mo" color={C.accent}  />
        <StatCard icon="👔" label="Active Staff"       value={staff.filter(s => s.status === "Active").length} color={C.purple} />
        <StatCard icon="⛪" label="Active Ministries"  value={ministries.filter(m => m.status === "Active").length} color={C.green} />
        <StatCard icon="💰" label="Monthly Income"     value={fmt$(income)}   sub="+8%"    color={C.gold}   />
        <StatCard icon="📊" label="Monthly Expenses"   value={fmt$(expense)}               color={C.red}    />
        <StatCard icon="📣" label="Active Campaigns"   value={campaigns.filter(c => c.status === "Active").length} color={C.pink} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontWeight: 800, color: C.text, marginBottom: 18, fontSize: 15 }}>Upcoming Events</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcoming.map(e => (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{e.location}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{e.date}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontWeight: 800, color: C.text, marginBottom: 18, fontSize: 15 }}>Recent Transactions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentTx.map(t => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.text, fontSize: 13 }}>{t.description}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{t.category}</div>
                </div>
                <span style={{ fontWeight: 800, color: t.type === "Income" ? C.green : C.red, fontSize: 14 }}>
                  {t.type === "Income" ? "+" : "-"}{fmt$(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontWeight: 800, color: C.text, marginBottom: 18, fontSize: 15 }}>Ministry Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {ministries.map(m => (
            <div key={m.id} style={{ padding: "14px 16px", background: C.bg, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{m.name}</span>
                <Badge label={m.status} color={C.green} />
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{m.leader} · {m.members} members · {m.volunteers} volunteers</div>
              <ProgressBar value={m.budget * 0.6} max={m.budget} />
            </div>
          ))}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 900, color: C.text }}>Administrative</h1><p style={{ color: C.muted, marginTop: 4 }}>Church calendar, events & coordination</p></div>
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
          <div key={e.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Badge label={e.type} color={typeColor[e.type] || C.accent} />
              <span style={{ fontSize: 12, color: C.muted }}>{e.date}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{e.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 13, color: C.dim }}>{e.time} · {e.location}</div>
              <div style={{ fontSize: 13, color: C.dim }}>Lead: {e.lead}</div>
              {e.attendees > 0 && <div style={{ fontSize: 13, color: C.dim }}>{e.attendees} expected</div>}
              {e.notes && <div style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>{e.notes}</div>}
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

// ── Life Groups ───────────────────────────────────────────────────────────────
function LifeGroupsView({ lifeGroups }) {
  const [selected, setSelected] = useState(lifeGroups[0]?.id || null);
  const [search, setSearch] = useState("");
  const group = lifeGroups.find(g => g.id === selected);
  const filtered = group ? group.members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const attColor = a => a >= 90 ? C.green : a >= 70 ? C.gold : C.red;
  const totalMembers = lifeGroups.reduce((s, g) => s + g.members.length, 0);
  const needFollowUp = lifeGroups.flatMap(g => g.members).filter(m => {
    const days = Math.round((new Date() - new Date(m.lastContact)) / 86400000);
    return days > 14;
  }).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 14 }}>
        <StatCard icon="⛪" label="Total Groups"    value={lifeGroups.length}    color={C.accent}  />
        <StatCard icon="👥" label="Total Members"   value={totalMembers}         color={C.green}   />
        <StatCard icon="⚠️" label="Need Follow-Up"  value={needFollowUp} sub={needFollowUp > 0 ? "14+ days" : "All current"} color={needFollowUp > 0 ? C.gold : C.green} />
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* Group list */}
        <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {lifeGroups.map(g => (
            <button key={g.id} onClick={() => { setSelected(g.id); setSearch(""); }}
              style={{ textAlign: "left", padding: "12px 14px", borderRadius: 11, border: `1px solid ${selected === g.id ? C.accent : C.border}`, background: selected === g.id ? C.accent + "22" : C.card, color: selected === g.id ? C.accent : C.text, cursor: "pointer" }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{g.name}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{g.day} · {g.time}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{g.members.length} members</div>
            </button>
          ))}
        </div>

        {/* Member list */}
        {group && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontWeight: 900, color: C.text, fontSize: 18 }}>{group.name}</h3>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                    {group.day}s at {group.time} · {group.location}
                  </div>
                  <div style={{ fontSize: 13, color: C.dim, marginTop: 2 }}>Led by {group.leader}</div>
                </div>
                <Badge label="Active" color={C.green} />
              </div>
            </div>

            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..."
              style={{ ...inputStyle, maxWidth: 320 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(m => {
                const days = Math.round((new Date() - new Date(m.lastContact)) / 86400000);
                const needsContact = days > 14;
                return (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: C.card, borderRadius: 11, border: `1px solid ${needsContact ? C.gold + "55" : C.border}` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.accent + "22", border: `2px solid ${C.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.accent, flexShrink: 0 }}>
                        {m.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{m.email} · {m.phone}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>Joined {m.joined}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      {m.role !== "Member" && <Badge label={m.role} color={C.purple} />}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: attColor(m.attendance), fontWeight: 700 }}>{m.attendance}% att.</div>
                        <div style={{ fontSize: 11, color: needsContact ? C.gold : C.muted }}>
                          {needsContact ? `⚠ ${days}d ago` : `✓ ${days}d ago`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 900, color: C.text }}>Ministry Leadership</h1><p style={{ color: C.muted, marginTop: 4 }}>Ministries, Life Groups, prayer & volunteers</p></div>
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
      {subTab === "life groups" && <LifeGroupsView lifeGroups={lifeGroups} />}
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
                <span style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{p.date}</span>
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
            <p style={{ fontSize: 13, color: C.muted }}>{m.description}</p>
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
                <span style={{ fontSize: 12, color: C.muted }}>Budget: {fmt$(m.budget)}</span>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 900, color: C.text }}>Finance</h1><p style={{ color: C.muted, marginTop: 4 }}>Budgets, giving & financial reports</p></div>
        <Btn onClick={() => setModal(true)}>+ Add Transaction</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard icon="📈" label="Total Income"   value={fmt$(income)}  sub="This period" color={C.green} />
        <StatCard icon="📉" label="Total Expenses" value={fmt$(expense)}                   color={C.red}   />
        <StatCard icon="💵" label="Net Balance"    value={fmt$(net)} sub={net >= 0 ? "Surplus" : "Deficit"} color={net >= 0 ? C.green : C.red} />
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontWeight: 800, color: C.text, marginBottom: 18 }}>Budget by Department</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {BUDGETS.map(b => (
            <div key={b.dept}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{b.dept}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{fmt$(b.spent)} / {fmt$(b.allocated)} · {fmtPct(b.spent, b.allocated)}</span>
              </div>
              <ProgressBar value={b.spent} max={b.allocated} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
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
                <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{t.description}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{t.category} · {t.account} · {t.date}</div>
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
function HR({ staff, setStaff }) {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({});
  const empty = { name:"", role:"", dept:"", email:"", phone:"", status:"Active", startDate:today(), salary:"" };
  const depts = [...new Set(staff.map(s => s.dept))];
  const deptColors = [C.accent, C.purple, C.green, C.gold, C.pink, C.accent2, C.red];
  const colorFor = d => deptColors[depts.indexOf(d) % deptColors.length] || C.accent;

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  );

  function save() {
    if (!form.name || !form.role) return;
    if (form.id) setStaff(s => s.map(x => x.id === form.id ? { ...form, salary:+form.salary||0 } : x));
    else setStaff(s => [...s, { ...form, id: Date.now(), salary:+form.salary||0 }]);
    setModal(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 900, color: C.text }}>Human Resources</h1><p style={{ color: C.muted, marginTop: 4 }}>Staff directory, roles & compensation</p></div>
        <Btn onClick={() => { setForm(empty); setModal(true); }}>+ Add Staff</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <StatCard icon="👔" label="Total Staff"       value={staff.length} color={C.accent} />
        <StatCard icon="✅" label="Active"            value={staff.filter(s => s.status === "Active").length} color={C.green} />
        <StatCard icon="🏢" label="Departments"       value={depts.length} color={C.purple} />
        <StatCard icon="💰" label="Payroll (Annual)"  value={fmt$(staff.reduce((s, x) => s + (x.salary || 0), 0))} color={C.gold} />
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." style={{ ...inputStyle, maxWidth: 400 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
        {filtered.map(s => {
          const col = colorFor(s.dept);
          return (
            <div key={s.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: col + "33", border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: col, flexShrink: 0 }}>
                    {s.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: C.text, fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{s.role}</div>
                  </div>
                </div>
                <Badge label={s.status} color={s.status === "Active" ? C.green : C.muted} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Badge label={s.dept} color={col} />
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.email}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.phone}</div>
                <div style={{ fontSize: 12, color: C.muted }}>Since {s.startDate}</div>
                {s.salary > 0 && <div style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>{fmt$(s.salary)}/yr</div>}
              </div>
              <Btn small outline color={C.accent} onClick={() => { setForm({ ...s, salary:String(s.salary||"") }); setModal(true); }}>Edit</Btn>
            </div>
          );
        })}
      </div>
      {modal && (
        <Modal title={form.id ? "Edit Staff Member" : "Add Staff Member"} onClose={() => setModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Inp label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Role / Title" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
              <Inp label="Department"   value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <Inp label="Phone"             value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Sel label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Active</option><option>On Leave</option><option>Inactive</option>
              </Sel>
              <Inp label="Start Date" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              <Inp label="Salary ($)" type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            </div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 900, color: C.text }}>PR & Communications</h1><p style={{ color: C.muted, marginTop: 4 }}>Announcements, press & church messaging</p></div>
        <Btn onClick={() => { setForm(emptyForm); setModal(true); }}>+ New Announcement</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <StatCard icon="📢" label="Announcements" value={announcements.length}                             color={C.accent} />
        <StatCard icon="✅" label="Published"     value={announcements.filter(a => a.published).length}   color={C.green}  />
        <StatCard icon="📝" label="Drafts"        value={announcements.filter(a => !a.published).length}  color={C.muted}  />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[...announcements].sort((a, b) => b.date.localeCompare(a.date)).map(a => (
          <div key={a.id} style={{ background: C.card, border: `1px solid ${a.published ? C.border : C.gold + "44"}`, borderRadius: 14, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge label={a.category} color={catColor[a.category] || C.accent} />
                <Badge label={a.published ? "Published" : "Draft"} color={a.published ? C.green : C.gold} />
                {a.channels.map(ch => <Badge key={ch} label={ch} color={C.muted} />)}
              </div>
              <span style={{ fontSize: 12, color: C.muted, flexShrink: 0 }}>{a.date}</span>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 8 }}>{a.title}</h3>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 900, color: C.text }}>Marketing & Messaging</h1><p style={{ color: C.muted, marginTop: 4 }}>Campaigns, outreach analytics & communications</p></div>
        <Btn onClick={() => { setForm(emptyForm); setModal(true); }}>+ New Campaign</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <StatCard icon="📣" label="Total Campaigns" value={campaigns.length}                                   color={C.pink}   />
        <StatCard icon="🟢" label="Active"          value={campaigns.filter(c => c.status === "Active").length} color={C.green}  />
        <StatCard icon="👁" label="Total Reach"     value={totalReach.toLocaleString()}                        color={C.accent} />
        <StatCard icon="📧" label="Avg Open Rate"   value={avgOpen + "%"}                                      color={C.gold}   />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[...campaigns].sort((a, b) => b.startDate.localeCompare(a.startDate)).map(c => (
          <div key={c.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <Badge label={c.type} color={C.accent2} />
                  <Badge label={c.status} color={statusColor[c.status] || C.muted} />
                  {c.channel.map(ch => <Badge key={ch} label={ch} color={C.muted} />)}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{c.name}</h3>
                <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{c.description}</p>
              </div>
              <div style={{ textAlign: "right", minWidth: 90 }}>
                <div style={{ fontSize: 11, color: C.muted }}>{c.startDate}</div>
                {c.endDate !== c.startDate && <div style={{ fontSize: 11, color: C.muted }}>{c.endDate}</div>}
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
      <aside style={{ width: open ? 220 : 64, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", transition: "width .22s", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg,${C.accent},${C.accent2})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✝</div>
          {open && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 900, fontSize: 14, color: C.text, whiteSpace: "nowrap" }}>ChurchOS</div>
              <div style={{ fontSize: 10, color: C.muted, whiteSpace: "nowrap" }}>Management Platform</div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", marginBottom: 4, borderRadius: 10, border: "none", cursor: "pointer", background: tab === t.id ? C.accent + "22" : "transparent", color: tab === t.id ? C.accent : C.muted, fontWeight: tab === t.id ? 700 : 500, fontSize: 14, textAlign: "left" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
              {open && <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{t.label}</span>}
              {open && tab === t.id && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.accent, flexShrink: 0 }} />}
            </button>
          ))}
        </nav>
        <button onClick={() => setOpen(o => !o)} style={{ margin: "12px 8px", padding: "10px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: open ? "flex-end" : "center" }}>
          {open ? "◀" : "▶"}
        </button>
      </aside>
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {tab === "dashboard" && <Dashboard staff={staff} ministries={ministries} transactions={transactions} events={events} campaigns={campaigns} />}
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
