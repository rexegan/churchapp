import { useState, useEffect } from "react";

// ── Persistent storage hook (window.storage API) ─────────────────────────────
function useStored(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const result = await window.storage.get(key);
        if (result && result.value != null) {
          setValue(JSON.parse(result.value));
        }
      } catch (e) {
        // not found, use default
      }
      setLoaded(true);
    }
    if (window.storage) {
      load();
    } else {
      setLoaded(true);
    }
  }, []);

  const setAndStore = (newValueOrUpdater) => {
    setValue(prev => {
      const next = typeof newValueOrUpdater === "function" ? newValueOrUpdater(prev) : newValueOrUpdater;
      if (window.storage) {
        window.storage.set(key, JSON.stringify(next)).catch(() => {});
      }
      return next;
    });
  };

  return [value, setAndStore, loaded];
}


// ── Data ──────────────────────────────────────────────────────────────────────
const blankProfile = {
  cell: "", homePhone: "", email: "", email2: "",
  address: "", city: "", state: "", zip: "",
  birthday: "", anniversary: "",
  spouse: "", spouseBirthday: "",
  children: "", familyMembers: "", notes: "",
};

const initialMembers = [
  { id: 1,  name: "Kathy Aylwin",        active: true, role: "", ...blankProfile },
  { id: 2,  name: "Richard Aylwin",      active: true, role: "", ...blankProfile },
  { id: 3,  name: "Taylor Bankston",     active: true, role: "", ...blankProfile },
  { id: 4,  name: "John Barnett",        active: true, role: "", ...blankProfile },
  { id: 5,  name: "Tracy Carroll",       active: true, role: "", ...blankProfile },
  { id: 6,  name: "Joshua Clay",         active: true, role: "", ...blankProfile },
  { id: 7,  name: "Kemarrae Clay",       active: true, role: "", ...blankProfile },
  { id: 8,  name: "Terry Culbertson",    active: true, role: "", ...blankProfile },
  { id: 9,  name: "Traci Culbertson",    active: true, role: "", ...blankProfile },
  { id: 10, name: "Paul Dentremont",     active: true, role: "", ...blankProfile },
  { id: 11, name: "Lauren Ellington",    active: true, role: "", ...blankProfile },
  { id: 12, name: "Travis Ellington",    active: true, role: "", ...blankProfile },
  { id: 13, name: "Lauren Funderburk",   active: true, role: "", ...blankProfile },
  { id: 14, name: "Becki Gourley",       active: true, role: "", ...blankProfile },
  { id: 15, name: "Chris Gourley",       active: true, role: "", ...blankProfile },
  { id: 16, name: "Ashley Hasty",        active: true, role: "", ...blankProfile },
  { id: 17, name: "Shane Hasty",         active: true, role: "", ...blankProfile },
  { id: 18, name: "Aysha Hoffman",       active: true, role: "", ...blankProfile },
  { id: 19, name: "Todd Hoffman",        active: true, role: "", ...blankProfile },
  { id: 20, name: "David Hook",          active: true, role: "", ...blankProfile },
  { id: 21, name: "Michelle Hook",       active: true, role: "", ...blankProfile },
  { id: 22, name: "Bryan Hufferd",       active: true, role: "", ...blankProfile },
  { id: 23, name: "Debra Hufferd",       active: true, role: "", ...blankProfile },
  { id: 24, name: "Ryan Kendrick",       active: true, role: "", ...blankProfile },
  { id: 25, name: "Bill Killian",        active: true, role: "", ...blankProfile },
  { id: 26, name: "Gary Killian",        active: true, role: "", ...blankProfile },
  { id: 27, name: "Ashley Klein",        active: true, role: "", ...blankProfile },
  { id: 28, name: "Robby Klein",         active: true, role: "", ...blankProfile },
  { id: 29, name: "Charles Lewis",       active: true, role: "", ...blankProfile },
  { id: 30, name: "Sherry Lewis",        active: true, role: "", ...blankProfile },
  { id: 31, name: "Jeannie McNutt",      active: true, role: "", ...blankProfile },
  { id: 32, name: "Rusti Morris",        active: true, role: "", ...blankProfile },
  { id: 33, name: "Rusti Morris Jr",     active: true, role: "", ...blankProfile },
  { id: 34, name: "CJ Newell",           active: true, role: "", ...blankProfile },
  { id: 35, name: "Jessica Newell",      active: true, role: "", ...blankProfile },
  { id: 36, name: "Thomas Palmer",       active: true, role: "", ...blankProfile },
  { id: 37, name: "Tonda Palmer",        active: true, role: "", ...blankProfile },
  { id: 38, name: "Codee Phelps",        active: true, role: "", ...blankProfile },
  { id: 39, name: "Jonathan Phelps",     active: true, role: "", ...blankProfile },
  { id: 40, name: "Chris Pidgeon",       active: true, role: "", ...blankProfile },
  { id: 41, name: "Linda Renaud",        active: true, role: "", ...blankProfile },
  { id: 42, name: "Norm Renaud",         active: true, role: "", ...blankProfile },
  { id: 43, name: "Travis Roberson",     active: true, role: "", ...blankProfile },
  { id: 44, name: "Jeanene Russell",     active: true, role: "Leader",      ...blankProfile },
  { id: 45, name: "Rex Russell",         active: true, role: "Main Leader", ...blankProfile },
  { id: 46, name: "Janet Scarbrough",    active: true, role: "", ...blankProfile },
  { id: 47, name: "Mike Scarbrough",     active: true, role: "Leader",      ...blankProfile },
  { id: 48, name: "Cody Sears",          active: true, role: "", ...blankProfile },
  { id: 49, name: "Angela Shelton",      active: true, role: "", ...blankProfile },
  { id: 50, name: "Emily Shelton",       active: true, role: "", ...blankProfile },
  { id: 51, name: "Wesley Shelton",      active: true, role: "", ...blankProfile },
  { id: 52, name: "James Stubblefield",  active: true, role: "", ...blankProfile },
  { id: 53, name: "Lorrie Stubblefield", active: true, role: "", ...blankProfile },
  { id: 54, name: "Pam Swaim",           active: true, role: "", ...blankProfile },
  { id: 55, name: "Ashley Thomas",       active: true, role: "", ...blankProfile },
  { id: 56, name: "Jacob Thomas",        active: true, role: "", ...blankProfile },
  { id: 57, name: "Austin Whitaker",     active: true, role: "", ...blankProfile },
  { id: 58, name: "Jessie Whitaker",     active: true, role: "", ...blankProfile },
  { id: 59, name: "Ken Whitaker",        active: true, role: "", ...blankProfile },
  { id: 60, name: "Wendy Whitaker",      active: true, role: "", ...blankProfile },
  { id: 61, name: "Michael Williamson",  active: true, role: "", ...blankProfile },
  { id: 62, name: "Sharon Williamson",   active: true, role: "", ...blankProfile },
  { id: 63, name: "David Young",         active: true, role: "", ...blankProfile },
];

const PRAYER_CATS = [
  { value: "general",   label: "General Prayer",    icon: "🙏", color: "#3a5c9a" },
  { value: "health",    label: "Health / Illness",  icon: "❤️", color: "#9a3a3a" },
  { value: "surgery",   label: "Surgery",           icon: "🏥", color: "#8a4a2a" },
  { value: "hospital",  label: "Hospitalization",   icon: "🛌", color: "#5a3a9a" },
  { value: "grief",     label: "Grief / Loss",      icon: "🕊️", color: "#3a3a7a" },
  { value: "family",    label: "Family",            icon: "👨‍👩‍👧", color: "#2a6a4a" },
  { value: "financial", label: "Financial",         icon: "💛", color: "#7a6a00" },
  { value: "spiritual", label: "Spiritual Growth",  icon: "📖", color: "#2a4a8a" },
  { value: "practical", label: "Practical Need",    icon: "🛠",  color: "#6a4a2a" },
  { value: "praise",    label: "Praise / Answered", icon: "✨", color: "#2a7a4a" },
];

const PRAYER_STATUSES = [
  { value: "active",   label: "Active",   color: "#1a6a3a" },
  { value: "ongoing",  label: "Ongoing",  color: "#8a6a00" },
  { value: "answered", label: "Answered", color: "#2a7a4a" },
  { value: "closed",   label: "Closed",   color: "#4a4a5a" },
];

const CONTACT_TYPES = [
  { value: "text",      label: "Text",      icon: "💬" },
  { value: "call",      label: "Phone Call", icon: "📞" },
  { value: "email",     label: "Email",     icon: "✉️" },
  { value: "breakfast", label: "Breakfast", icon: "🍳" },
  { value: "lunch",     label: "Lunch",     icon: "🥗" },
  { value: "dinner",    label: "Dinner",    icon: "🍽️" },
  { value: "in-person", label: "In Person", icon: "🤝" },
];

const EVENT_TYPES = [
  { value: "breakfast",   label: "LG Breakfast",        icon: "🍳" },
  { value: "lunch",       label: "LG Lunch",            icon: "🥗" },
  { value: "dinner",      label: "Dinner",              icon: "🍽️" },
  { value: "party",       label: "Party / Celebration", icon: "🎉" },
  { value: "cookout",     label: "Cookout / BBQ",       icon: "🔥" },
  { value: "game_night",  label: "Game Night",          icon: "🎲" },
  { value: "movie_night", label: "Movie Night",         icon: "🎬" },
  { value: "worship",     label: "Worship Night",       icon: "🎵" },
  { value: "service",     label: "Service / Outreach",  icon: "🤝" },
  { value: "holiday",     label: "Holiday Gathering",   icon: "✨" },
  { value: "mens",        label: "Men's Event",         icon: "👔" },
  { value: "womens",      label: "Women's Event",       icon: "💐" },
  { value: "couples",     label: "Couples Night",       icon: "💑" },
  { value: "kids",        label: "Kids / Family",       icon: "👨‍👩‍👧" },
  { value: "other",       label: "Other",               icon: "📅" },
];

const TABS = ["Quick View", "LG Today", "Members", "Joined Us Today", "Follow-Up", "Prayer Request", "Events", "Teaching Hub"];

const NAV = "#1a2f5e";
const CARD = "#1a2f5e";
const INPUT_BG = "#213870";
const ACCENT = "#4a90d9";
const WHITE = "#ffffff";
const LIGHT_BLUE = "#a8c8f0";

const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const fmtDate = (d) => {
  if (!d) return "";
  const p = new Date(d);
  if (isNaN(p)) return d;
  return p.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const fmtPhone = (raw) => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return "(" + digits;
  if (digits.length <= 6) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
  return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
};

const sortByLast = (arr) => [...arr].sort((a, b) => {
  const la = a.name.trim().split(" ").slice(-1)[0].toLowerCase();
  const lb = b.name.trim().split(" ").slice(-1)[0].toLowerCase();
  return la.localeCompare(lb);
});

const lastFirst = (name) => {
  const parts = name.trim().split(" ");
  return parts.slice(-1)[0] + ", " + parts.slice(0, -1).join(" ");
};

const getPrayCat  = (v) => PRAYER_CATS.find(c => c.value === v) || PRAYER_CATS[0];
const getPrayStat = (v) => PRAYER_STATUSES.find(s => s.value === v) || PRAYER_STATUSES[0];
const getEvType   = (v) => EVENT_TYPES.find(e => e.value === v) || EVENT_TYPES[EVENT_TYPES.length - 1];
const getCtType   = (v) => CONTACT_TYPES.find(c => c.value === v) || CONTACT_TYPES[0];

const roleColors = {
  "Main Leader": { bg: "#3a2a00", text: "#f0c040", border: "#8a6a00" },
  "Leader":      { bg: "#1a2a5a", text: "#6ab0d8", border: "#2d4a9a" },
};

const callAI = async (system, user) => {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "";
  } catch (e) {
    return "AI unavailable. Please check connection.";
  }
};

// ── Shared input style ────────────────────────────────────────────────────────
const IS = {
  background: INPUT_BG,
  border: "2px solid " + ACCENT,
  borderRadius: 8,
  padding: "9px 13px",
  color: WHITE,
  fontSize: 15,
  fontFamily: "Georgia, serif",
  width: "100%",
  boxSizing: "border-box",
  caretColor: WHITE,
};

const Lbl = ({ t }) => (
  <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4, marginTop: 10 }}>{t}</div>
);

const Sec = ({ t }) => (
  <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "2px solid " + ACCENT, paddingBottom: 5, marginTop: 20, marginBottom: 6 }}>{t}</div>
);

const Btn = ({ onClick, children, variant = "primary", style = {} }) => {
  const base = {
    border: "none", borderRadius: 8, padding: "9px 18px",
    cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 14,
    fontWeight: "bold", color: WHITE,
  };
  const bg = variant === "primary" ? ACCENT : variant === "danger" ? "#c0392b" : INPUT_BG;
  const border = variant === "secondary" ? "2px solid " + ACCENT : "none";
  return (
    <button onClick={onClick} style={{ ...base, background: bg, border, ...style }}>{children}</button>
  );
};

// ── Date Picker (Visual Calendar Popup) ──────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_HEADER = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function DatePicker({ value, onChange, label }) {
  const parseDate = (v) => {
    if (!v) return null;
    const s = (v + "").replace(",","");
    const parts = s.split(" ");
    const mi = MONTHS.indexOf(parts[0]);
    if (mi === -1) return null;
    const d = parseInt(parts[1]);
    const y = parseInt(parts[2]);
    if (!d) return null;
    return { month: mi, day: d, year: y || new Date().getFullYear() };
  };

  const parsed = parseDate(value);
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.month : now.getMonth());
  const [viewYear, setViewYear] = useState(parsed ? parsed.year : now.getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);

  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const selectDay = (day) => {
    const str = MONTHS[viewMonth] + " " + day + ", " + viewYear;
    onChange(str);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const totalDays = daysInMonth(viewMonth, viewYear);
  const firstDay = firstDayOfMonth(viewMonth, viewYear);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const currentYear = now.getFullYear();
  const yearRange = Array.from({ length: 101 }, (_, i) => currentYear + 5 - i);

  const displayVal = value || "Select date";

  return (
    <div style={{ position: "relative" }}>
      {label && <Lbl t={label} />}
      <div onClick={() => setOpen(!open)}
        style={{ ...IS, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", userSelect: "none" }}>
        <span style={{ color: value ? WHITE : LIGHT_BLUE }}>{displayVal}</span>
        <span style={{ fontSize: 16 }}>📅</span>
      </div>

      {open && (
        <div style={{ position: "absolute", zIndex: 9999, top: "100%", left: 0, right: 0, background: NAV, border: "2px solid " + ACCENT, borderRadius: 12, padding: 14, marginTop: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>

          {/* Month / Year header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button onClick={prevMonth} style={{ background: INPUT_BG, border: "none", color: WHITE, borderRadius: 6, padding: "4px 10px", fontSize: 16, cursor: "pointer" }}>‹</button>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <select value={viewMonth} onChange={e => setViewMonth(parseInt(e.target.value))}
                style={{ background: INPUT_BG, border: "1px solid " + ACCENT, borderRadius: 6, color: WHITE, padding: "4px 6px", fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
                {MONTHS.map((mo, i) => <option key={i} value={i}>{mo}</option>)}
              </select>
              <div onClick={() => setShowYearPicker(!showYearPicker)}
                style={{ background: INPUT_BG, border: "1px solid " + ACCENT, borderRadius: 6, color: WHITE, padding: "4px 10px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                {viewYear} ▾
              </div>
            </div>
            <button onClick={nextMonth} style={{ background: INPUT_BG, border: "none", color: WHITE, borderRadius: 6, padding: "4px 10px", fontSize: 16, cursor: "pointer" }}>›</button>
          </div>

          {/* Year picker dropdown */}
          {showYearPicker && (
            <div style={{ maxHeight: 160, overflowY: "auto", background: INPUT_BG, border: "1px solid " + ACCENT, borderRadius: 8, marginBottom: 10 }}>
              {yearRange.map(yr => (
                <div key={yr} onClick={() => { setViewYear(yr); setShowYearPicker(false); }}
                  style={{ padding: "7px 14px", color: yr === viewYear ? ACCENT : WHITE, fontWeight: yr === viewYear ? "bold" : "normal", cursor: "pointer", fontSize: 14, background: yr === viewYear ? NAV : "transparent" }}>
                  {yr}
                </div>
              ))}
            </div>
          )}

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
            {DAYS_HEADER.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, color: LIGHT_BLUE, fontWeight: "bold", padding: "2px 0" }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={"e" + i} />;
              const isSelected = parsed && parsed.day === day && parsed.month === viewMonth && parsed.year === viewYear;
              const isToday = day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
              return (
                <div key={day} onClick={() => selectDay(day)}
                  style={{ textAlign: "center", padding: "7px 3px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: isSelected ? "bold" : "normal",
                    background: isSelected ? ACCENT : isToday ? INPUT_BG : "transparent",
                    color: isSelected ? WHITE : isToday ? ACCENT : WHITE,
                    border: isToday && !isSelected ? "1px solid " + ACCENT : "1px solid transparent" }}>
                  {day}
                </div>
              );
            })}
          </div>

          {/* Clear button */}
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <button onClick={() => { onChange(""); setOpen(false); }}
              style={{ background: "transparent", border: "1px solid " + ACCENT, color: LIGHT_BLUE, borderRadius: 6, padding: "4px 16px", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Time Picker ───────────────────────────────────────────────────────────────
function TimePicker({ value, onChange, label }) {
  const parse = (v) => {
    if (!v) return { h: "12", min: "00", ampm: "PM" };
    const m = (v + "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m) return { h: m[1], min: m[2], ampm: m[3].toUpperCase() };
    return { h: "12", min: "00", ampm: "PM" };
  };
  const { h, min, ampm } = parse(value);

  const update = (nh, nmin, nampm) => {
    onChange(nh + ":" + nmin + " " + nampm);
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutes = ["00","05","10","15","20","25","30","35","40","45","50","55"];

  return (
    <div>
      {label && <Lbl t={label} />}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: 11, color: LIGHT_BLUE, textAlign: "center", marginBottom: 4 }}>HOUR</div>
          <select value={h} onChange={e => update(e.target.value, min, ampm)}
            style={{ ...IS, textAlign: "center", fontSize: 16, padding: "10px 6px" }}>
            {hours.map(hr => <option key={hr} value={hr}>{hr}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: LIGHT_BLUE, textAlign: "center", marginBottom: 4 }}>MINUTE</div>
          <select value={min} onChange={e => update(h, e.target.value, ampm)}
            style={{ ...IS, textAlign: "center", fontSize: 16, padding: "10px 6px" }}>
            {minutes.map(mn => <option key={mn} value={mn}>{mn}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: LIGHT_BLUE, textAlign: "center", marginBottom: 4 }}>AM / PM</div>
          <select value={ampm} onChange={e => update(h, min, e.target.value)}
            style={{ ...IS, textAlign: "center", fontSize: 16, padding: "10px 6px" }}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
      {value && <div style={{ fontSize: 13, color: LIGHT_BLUE, textAlign: "center", marginTop: 6 }}>Selected: {value}</div>}
    </div>
  );
}

// ── Member Modal ──────────────────────────────────────────────────────────────
function MemberModal({ m, onClose, onSave, sessions, followUps }) {
  const [form, setForm] = useState({ ...m });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const rc = roleColors[m.role];
  const attended = sessions.filter(s => s.present.includes(m.id)).length;
  const pending = followUps.filter(f => f.memberId == m.id && f.status === "pending").length;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,10,30,0.8)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px 12px", overflowY: "auto" }}>
      <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 16, width: "100%", maxWidth: 620, padding: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 46, height: 46, background: "linear-gradient(135deg, #1a2f5e, #4a90d9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: WHITE, flexShrink: 0 }}>{m.name.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              style={{ ...IS, fontSize: 18, fontWeight: "bold", background: "transparent", border: "none", borderBottom: "2px solid " + ACCENT, borderRadius: 0, padding: "2px 0" }} />
            {m.role && rc && <span style={{ fontSize: 11, background: rc.bg, color: rc.text, border: "1px solid " + rc.border, borderRadius: 4, padding: "1px 7px", marginTop: 3, display: "inline-block" }}>{m.role}</span>}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: WHITE, fontSize: 24, cursor: "pointer" }}>x</button>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <span style={{ background: INPUT_BG, color: WHITE, borderRadius: 8, padding: "3px 10px", fontSize: 13 }}>{attended} sessions</span>
          {pending > 0 && <span style={{ background: "#c0392b", color: WHITE, borderRadius: 8, padding: "3px 10px", fontSize: 13 }}>{pending} pending</span>}
        </div>

        <Sec t="Contact" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><Lbl t="Cell" /><input value={form.cell} onChange={e => set("cell", fmtPhone(e.target.value))} placeholder="(817) 555-1234" style={IS} /></div>
          <div><Lbl t="Home Phone" /><input value={form.homePhone} onChange={e => set("homePhone", fmtPhone(e.target.value))} placeholder="(817) 555-1234" style={IS} /></div>
          <div><Lbl t="Email" /><input value={form.email} onChange={e => set("email", e.target.value)} style={IS} /></div>
          <div><Lbl t="Email 2" /><input value={form.email2} onChange={e => set("email2", e.target.value)} style={IS} /></div>
        </div>

        <Sec t="Home Address" />
        <Lbl t="Street" /><input value={form.address} onChange={e => set("address", e.target.value)} style={IS} />
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
          <div><Lbl t="City" /><input value={form.city} onChange={e => set("city", e.target.value)} style={IS} /></div>
          <div><Lbl t="State" /><input value={form.state} onChange={e => set("state", e.target.value)} style={IS} /></div>
          <div><Lbl t="Zip" /><input value={form.zip} onChange={e => set("zip", e.target.value)} style={IS} /></div>
        </div>

        <Sec t="Family" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><Lbl t="Spouse" /><input value={form.spouse} onChange={e => set("spouse", e.target.value)} style={IS} /></div>
          <div><DatePicker value={form.spouseBirthday} onChange={v => set("spouseBirthday", v)} label="Spouse Birthday" /></div>
          <div><DatePicker value={form.birthday} onChange={v => set("birthday", v)} label="My Birthday" /></div>
          <div><DatePicker value={form.anniversary} onChange={v => set("anniversary", v)} label="Anniversary" /></div>
        </div>
        <Lbl t="Children" /><input value={form.children} onChange={e => set("children", e.target.value)} placeholder="" style={IS} />
        <Lbl t="Family / Household Link" /><input value={form.familyMembers} onChange={e => set("familyMembers", e.target.value)} style={IS} />

        <Sec t="Notes" />
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
          style={{ ...IS, resize: "vertical" }} />

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end", flexWrap: "wrap" }}>
          {form.cell && <a href={"sms:" + form.cell} style={{ background: INPUT_BG, color: WHITE, borderRadius: 7, padding: "8px 14px", textDecoration: "none", border: "2px solid " + ACCENT, fontSize: 13 }}>Text</a>}
          {form.cell && <a href={"tel:" + form.cell} style={{ background: INPUT_BG, color: WHITE, borderRadius: 7, padding: "8px 14px", textDecoration: "none", border: "2px solid " + ACCENT, fontSize: 13 }}>Call</a>}
          {form.email && <a href={"mailto:" + form.email} style={{ background: INPUT_BG, color: WHITE, borderRadius: 7, padding: "8px 14px", textDecoration: "none", border: "2px solid " + ACCENT, fontSize: 13 }}>Email</a>}
          <Btn onClick={onClose} variant="secondary">Cancel</Btn>
          <Btn onClick={() => { onSave(form); onClose(); }}>Save</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Prayer Modal ──────────────────────────────────────────────────────────────
function PrayerModal({ prayer, members, onClose, onSave }) {
  const [form, setForm] = useState({ ...prayer });
  const [newNote, setNewNote] = useState({ date: today(), note: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cat = getPrayCat(form.category);

  const addUpdate = () => {
    if (!newNote.note.trim()) return;
    setForm(f => ({ ...f, updates: [...(f.updates || []), { id: Date.now(), date: newNote.date, note: newNote.note }] }));
    setNewNote({ date: today(), note: "" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(5,10,30,0.8)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px 12px", overflowY: "auto" }}>
      <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 16, width: "100%", maxWidth: 640, padding: 26 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>{cat.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Prayer — {members.find(m => m.id === form.memberId) ? members.find(m => m.id === form.memberId).name : "Select member"}
            </div>
            <textarea value={form.title} onChange={e => set("title", e.target.value)} placeholder="Brief title or summary..." rows={2}
              style={{ ...IS, fontSize: 15, fontWeight: "bold", resize: "none" }} />
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: WHITE, fontSize: 24, cursor: "pointer" }}>x</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <Lbl t="Member" />
            <select value={form.memberId} onChange={e => set("memberId", parseInt(e.target.value))} style={IS}>
              <option value="">Select...</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <Lbl t="Category" />
            <select value={form.category} onChange={e => set("category", e.target.value)} style={IS}>
              {PRAYER_CATS.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div>
            <Lbl t="Status" />
            <select value={form.status} onChange={e => set("status", e.target.value)} style={IS}>
              {PRAYER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div><DatePicker value={form.dateSubmitted} onChange={v => set("dateSubmitted", v)} label="Date Submitted" /></div>
          <div><DatePicker value={form.followUpDate} onChange={v => set("followUpDate", v)} label="Follow-Up Date" /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 26 }}>
            <div onClick={() => set("confidential", !form.confidential)}
              style={{ width: 38, height: 22, borderRadius: 11, background: form.confidential ? "#c0392b" : INPUT_BG, border: "2px solid " + ACCENT, cursor: "pointer", position: "relative" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: WHITE, position: "absolute", top: 2, left: form.confidential ? 20 : 2, transition: "left 0.2s" }} />
            </div>
            <span style={{ fontSize: 13, color: WHITE }}>{form.confidential ? "Confidential" : "Share with group"}</span>
          </div>
        </div>

        <Lbl t="Full Description" />
        <textarea value={form.description} onChange={e => set("description", e.target.value)}
          placeholder="Hospital, diagnosis, surgery type, specific prayer needs..." rows={4}
          style={{ ...IS, resize: "vertical" }} />

        <Sec t="Tracking Updates" />
        {!(form.updates && form.updates.length) && (
          <div style={{ fontSize: 13, color: LIGHT_BLUE, fontStyle: "italic", marginBottom: 10 }}>No updates yet.</div>
        )}
        {(form.updates || []).map(u => (
          <div key={u.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ fontSize: 12, color: LIGHT_BLUE, background: NAV, borderRadius: 5, padding: "3px 8px", whiteSpace: "nowrap", flexShrink: 0 }}>{fmtDate(u.date)}</div>
            <div style={{ flex: 1, fontSize: 14, color: WHITE }}>{u.note}</div>
            <button onClick={() => setForm(f => ({ ...f, updates: f.updates.filter(x => x.id !== u.id) }))}
              style={{ background: "transparent", border: "none", color: LIGHT_BLUE, cursor: "pointer", fontSize: 16 }}>x</button>
          </div>
        ))}
        <div style={{ background: INPUT_BG, border: "2px dashed " + ACCENT, borderRadius: 10, padding: 14, marginTop: 6 }}>
          <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Add Update</div>
          <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 8, marginBottom: 8 }}>
            <DatePicker value={newNote.date} onChange={v => setNewNote(u => ({ ...u, date: v }))} />
            <input value={newNote.note} onChange={e => setNewNote(u => ({ ...u, note: e.target.value }))}
              placeholder=""
              onKeyDown={e => e.key === "Enter" && addUpdate()} style={IS} />
          </div>
          <Btn onClick={addUpdate} variant="secondary" style={{ fontSize: 13 }}>+ Add Update</Btn>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <Btn onClick={onClose} variant="secondary">Cancel</Btn>
          <Btn onClick={() => { onSave(form); onClose(); }}>Save</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Text Capture Modal ────────────────────────────────────────────────────────
function TextCaptureModal({ member, onClose, onSave, existingMessages }) {
  const [messages, setMessages] = useState(existingMessages || []);
  const [paste, setPaste] = useState("");
  const [aiInsights, setAiInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [subTab, setSubTab] = useState("log");

  const addPasted = async () => {
    if (!paste.trim()) return;
    const newMsgs = [...messages, { id: Date.now(), date: today(), raw: paste, source: "paste" }];
    setMessages(newMsgs);
    setPaste("");
    setLoading(true);
    const insight = await callAI(
      "You are a church life group assistant helping leaders stay current on members. Analyze the conversation and extract: 1) Key life updates 2) Prayer needs 3) Follow-up actions needed 4) Emotional tone 5) Important dates. Be concise and pastor-focused.",
      "Member: " + member.name + "\n\nConversation:\n" + paste
    );
    setAiInsights(prev => prev ? prev + "\n\n---\n\n" + insight : insight);
    setLoading(false);
  };

  const analyzeAll = async () => {
    if (!messages.length) return;
    setLoading(true);
    const allText = messages.map(m => m.raw).join("\n\n---\n\n");
    const insight = await callAI(
      "You are a church life group assistant. Analyze ALL conversation history with this member and provide a comprehensive pastoral summary including patterns, needs, spiritual journey indicators, and recommended next steps.",
      "Member: " + member.name + "\n\nFull history:\n" + allText
    );
    setAiInsights(insight);
    setLoading(false);
  };

  const subTabs = [["log", "Log"], ["paste", "Paste New"], ["insights", "AI Insights"]];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(5,10,30,0.85)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px 12px", overflowY: "auto" }}>
      <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 16, width: "100%", maxWidth: 680, padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: "bold", color: WHITE }}>Messages — {member.name}</div>
            <div style={{ fontSize: 13, color: LIGHT_BLUE }}>Paste conversations · AI extracts insights</div>
          </div>
          <button onClick={() => { onSave(messages); onClose(); }} style={{ background: "transparent", border: "none", color: WHITE, fontSize: 24, cursor: "pointer" }}>x</button>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {subTabs.map(([v, l]) => (
            <button key={v} onClick={() => setSubTab(v)}
              style={{ background: subTab === v ? ACCENT : INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 7, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>{l}</button>
          ))}
        </div>

        {subTab === "log" && (
          <div>
            {!messages.length && <p style={{ color: LIGHT_BLUE, fontStyle: "italic", fontSize: 13 }}>No messages yet. Use Paste New to add conversations.</p>}
            {messages.map(msg => (
              <div key={msg.id} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: LIGHT_BLUE, background: NAV, borderRadius: 4, padding: "2px 8px" }}>{fmtDate(msg.date)}</span>
                  <button onClick={() => setMessages(ms => ms.filter(x => x.id !== msg.id))} style={{ background: "transparent", border: "none", color: LIGHT_BLUE, cursor: "pointer" }}>x</button>
                </div>
                <pre style={{ fontSize: 13, color: WHITE, whiteSpace: "pre-wrap", margin: 0, fontFamily: "Georgia, serif", lineHeight: 1.6 }}>{msg.raw}</pre>
              </div>
            ))}
          </div>
        )}
        {subTab === "paste" && (
          <div>
            <div style={{ fontSize: 13, color: LIGHT_BLUE, marginBottom: 10 }}>Paste a text thread, email, or call notes. AI will analyze it instantly.</div>
            <textarea value={paste} onChange={e => setPaste(e.target.value)} placeholder="Paste conversation here..." rows={10}
              style={{ ...IS, resize: "vertical", marginBottom: 12, lineHeight: 1.6 }} />
            <Btn onClick={addPasted} style={{ opacity: loading || !paste.trim() ? 0.6 : 1 }}>
              {loading ? "Analyzing..." : "Save & Analyze with AI"}
            </Btn>
          </div>
        )}
        {subTab === "insights" && (
          <div>
            <Btn onClick={analyzeAll} variant="secondary" style={{ marginBottom: 14, opacity: loading || !messages.length ? 0.6 : 1 }}>
              {loading ? "Analyzing..." : "Re-analyze All History"}
            </Btn>
            {aiInsights ? (
              <div style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 10, padding: 18 }}>
                <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>AI Pastoral Summary</div>
                <pre style={{ fontSize: 14, color: WHITE, whiteSpace: "pre-wrap", margin: 0, fontFamily: "Georgia, serif", lineHeight: 1.7 }}>{aiInsights}</pre>
              </div>
            ) : (
              <p style={{ color: LIGHT_BLUE, fontStyle: "italic", fontSize: 13 }}>No insights yet. Paste a conversation first.</p>
            )}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <Btn onClick={() => { onSave(messages); onClose(); }}>Save & Close</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Member Card ───────────────────────────────────────────────────────────────
function MemberCard({ m, sessions, followUps, onEdit }) {
  const rc = roleColors[m.role];
  const attended = sessions.filter(s => s.present.includes(m.id)).length;
  const pending = followUps.filter(f => f.memberId == m.id && f.status === "pending").length;
  return (
    <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 10, padding: "12px 16px", marginBottom: 7, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1a2f5e, #4a90d9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, color: WHITE }}>{m.name.charAt(0)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 15, fontWeight: "bold", color: WHITE }}>{m.name}</span>
          {m.role && rc && <span style={{ fontSize: 10, background: rc.bg, color: rc.text, border: "1px solid " + rc.border, borderRadius: 4, padding: "1px 6px" }}>{m.role}</span>}
        </div>
        <div style={{ fontSize: 13, color: LIGHT_BLUE, marginTop: 2 }}>
          {m.cell || m.email ? [m.cell, m.email].filter(Boolean).join(" · ") : "no contact info yet"}
        </div>
      </div>
      <div style={{ textAlign: "right", fontSize: 13, color: LIGHT_BLUE, marginRight: 8, flexShrink: 0 }}>
        {attended > 0 && <div>{attended} attended</div>}
        {pending > 0 && <span style={{ background: "#c0392b", color: WHITE, borderRadius: 10, padding: "1px 8px", fontSize: 12 }}>{pending} pending</span>}
      </div>
      <Btn onClick={() => onEdit(m)} variant="secondary" style={{ fontSize: 13, padding: "5px 12px", flexShrink: 0 }}>View / Edit</Btn>
    </div>
  );
}

// ── Prayer Card ───────────────────────────────────────────────────────────────
const FOLLOWUP_ACTIONS = [
  { value: "call",       label: "📞 Phone Call" },
  { value: "text",       label: "💬 Text Message" },
  { value: "email",      label: "✉️ Email" },
  { value: "card",       label: "💌 Send a Card" },
  { value: "meal",       label: "🍽️ Organize a Meal" },
  { value: "train",      label: "🚂 Train Pass" },
  { value: "leadership", label: "⛪ Pass to Church Leadership" },
  { value: "visit",      label: "🏠 Visit in Person" },
  { value: "hospital",   label: "🏥 Hospital Visit" },
];

function PrayerCard({ pr, members, onEdit, onSave }) {
  const member = members.find(m => m.id === pr.memberId) || {};
  const cat = getPrayCat(pr.category);
  const si = getPrayStat(pr.status);
  const lastUpdate = pr.updates && pr.updates.length ? pr.updates[pr.updates.length - 1] : null;
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [fuAction, setFuAction] = useState("");
  const [fuNote, setFuNote] = useState("");
  const [fuDate, setFuDate] = useState(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));

  const logFollowUp = () => {
    if (!fuAction) return;
    const action = FOLLOWUP_ACTIONS.find(a => a.value === fuAction);
    const update = {
      id: Date.now(),
      date: fuDate,
      note: (action ? action.label : fuAction) + (fuNote ? " — " + fuNote : ""),
      type: "followup",
    };
    const updated = { ...pr, updates: [...(pr.updates || []), update] };
    onSave(updated);
    setFuAction("");
    setFuNote("");
    setShowFollowUp(false);
  };

  // Day of week + date display
  const fmtFull = (d) => {
    if (!d) return "";
    const parsed = new Date(d);
    if (isNaN(parsed)) return d;
    return parsed.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ background: CARD, borderLeft: "4px solid " + cat.color, border: "2px solid " + ACCENT, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
      
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 22 }}>{cat.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: "bold", color: WHITE }}>{member.name || "Unknown"}</span>
            <span style={{ fontSize: 12, background: cat.color + "55", color: WHITE, border: "1px solid " + cat.color, borderRadius: 4, padding: "1px 7px" }}>{cat.label}</span>
            <span style={{ fontSize: 12, background: si.color + "55", color: WHITE, border: "1px solid " + si.color, borderRadius: 4, padding: "1px 7px" }}>{si.label}</span>
            {pr.confidential && <span style={{ fontSize: 11, background: "#5a1a1a", color: WHITE, borderRadius: 4, padding: "1px 7px" }}>Confidential</span>}
          </div>
          <div style={{ fontSize: 14, color: WHITE, marginBottom: 6, lineHeight: 1.4 }}>{pr.title}</div>
          {pr.description && <div style={{ fontSize: 13, color: LIGHT_BLUE, marginBottom: 6, lineHeight: 1.5 }}>{pr.description}</div>}

          {/* Dates with day of week */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12, color: LIGHT_BLUE }}>
            {pr.dateSubmitted && <span>📅 Submitted: {fmtFull(pr.dateSubmitted)}</span>}
            {pr.followUpDate && <span>🔔 Follow-up: {fmtFull(pr.followUpDate)}</span>}
          </div>
        </div>
        <Btn onClick={() => onEdit(pr)} variant="secondary" style={{ fontSize: 13, padding: "5px 12px", flexShrink: 0 }}>Edit</Btn>
      </div>

      {/* Latest update */}
      {lastUpdate && (
        <div style={{ background: INPUT_BG, borderRadius: 8, padding: "8px 12px", marginBottom: 10, borderLeft: "3px solid " + ACCENT }}>
          <span style={{ fontSize: 11, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 8 }}>Latest Update</span>
          <span style={{ fontSize: 12, color: LIGHT_BLUE }}>{fmtDate(lastUpdate.date)}</span>
          <div style={{ fontSize: 14, color: WHITE, marginTop: 3 }}>{lastUpdate.note}</div>
        </div>
      )}

      {/* All updates count */}
      {pr.updates && pr.updates.length > 0 && (
        <div style={{ fontSize: 12, color: LIGHT_BLUE, marginBottom: 10 }}>
          {pr.updates.length} update{pr.updates.length !== 1 ? "s" : ""} logged
        </div>
      )}

      {/* Follow-Up Action Bar */}
      <div style={{ borderTop: "1px solid " + INPUT_BG, paddingTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showFollowUp ? 10 : 0 }}>
          <span style={{ fontSize: 13, color: WHITE, fontWeight: "bold" }}>Prayer Request Follow-Up</span>
          <Btn onClick={() => setShowFollowUp(!showFollowUp)} variant="secondary" style={{ fontSize: 12, padding: "5px 12px" }}>
            {showFollowUp ? "Cancel" : "+ Log Follow-Up"}
          </Btn>
        </div>

        {showFollowUp && (
          <div style={{ background: INPUT_BG, borderRadius: 10, padding: 14, marginTop: 8 }}>
            <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Action Taken</div>
            <select value={fuAction} onChange={e => setFuAction(e.target.value)}
              style={{ ...IS, marginBottom: 10, fontSize: 15 }}>
              <option value="">Select follow-up action...</option>
              {FOLLOWUP_ACTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>

            <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Date</div>
            <div style={{ marginBottom: 10 }}>
              <DatePicker value={fuDate} onChange={v => setFuDate(v)} />
            </div>

            <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Notes (optional)</div>
            <textarea value={fuNote} onChange={e => setFuNote(e.target.value)}
              placeholder="What was discussed, how they are doing..."
              rows={2} style={{ ...IS, resize: "none", marginBottom: 10 }} />

            {/* Quick contact buttons */}
            {member.cell && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <a href={"sms:" + member.cell} style={{ background: ACCENT, color: WHITE, borderRadius: 7, padding: "7px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold" }}>💬 Text {member.name ? member.name.split(" ")[0] : ""}</a>
                <a href={"tel:" + member.cell} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 7, padding: "7px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold" }}>📞 Call</a>
                {member.email && <a href={"mailto:" + member.email} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 7, padding: "7px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold" }}>✉️ Email</a>}
              </div>
            )}

            <Btn onClick={logFollowUp} style={{ width: "100%", textAlign: "center", padding: "10px" }}>Save Follow-Up</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ ev, members, onEdit, onDelete, expanded, onToggle, onToggleAttended }) {
  const et = getEvType(ev.type);
  const statusBg = { upcoming: "#1a4a8a", past: "#1a5a3a", cancelled: "#5a1a1a" };
  return (
    <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, marginBottom: 12 }}>
      <div style={{ padding: "14px 18px", cursor: "pointer" }} onClick={onToggle}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>{et.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: "bold", color: WHITE }}>{ev.title || et.label}</span>
              <span style={{ fontSize: 12, background: (statusBg[ev.status] || INPUT_BG), color: WHITE, borderRadius: 5, padding: "1px 8px", textTransform: "capitalize" }}>{ev.status}</span>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, color: LIGHT_BLUE }}>
              {ev.date && <span>📅 {ev.date}</span>}
              {ev.time && <span>🕐 {ev.time}</span>}
              {ev.location && <span>📍 {ev.location}</span>}
              {ev.host && <span>👤 {ev.host}</span>}
            </div>
            {ev.rsvpList && ev.rsvpList.length > 0 && (
              <div style={{ fontSize: 13, color: LIGHT_BLUE, marginTop: 3 }}>
                {ev.rsvpList.length} RSVP{ev.rsvpList.length !== 1 ? "s" : ""}
                {ev.attendedList && ev.attendedList.length > 0 ? " · " + ev.attendedList.length + " attended" : ""}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <Btn onClick={e => { e.stopPropagation(); onEdit(ev); }} variant="secondary" style={{ fontSize: 13, padding: "4px 12px" }}>Edit</Btn>
            <Btn onClick={e => { e.stopPropagation(); onDelete(ev.id); }} variant="danger" style={{ fontSize: 13, padding: "4px 12px" }}>Del</Btn>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "2px solid " + ACCENT, padding: "16px 18px", background: INPUT_BG }}>
          {ev.description && <div style={{ fontSize: 14, color: WHITE, marginBottom: 12, lineHeight: 1.6 }}>{ev.description}</div>}
          {ev.address && <div style={{ fontSize: 13, color: LIGHT_BLUE, marginBottom: 8 }}>📍 {ev.address}</div>}
          {ev.potluck && ev.potluckItems && (
            <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Potluck Items</div>
              <div style={{ fontSize: 14, color: WHITE }}>{ev.potluckItems}</div>
            </div>
          )}
          {ev.notes && (
            <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: 14, color: WHITE }}>{ev.notes}</div>
            </div>
          )}
          {ev.status === "past" && (
            <div>
              <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Who Attended</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 5 }}>
                {sortByLast(members).map(m => {
                  const attended = ev.attendedList && ev.attendedList.includes(m.id);
                  return (
                    <div key={m.id} onClick={() => onToggleAttended(ev, m.id)}
                      style={{ background: attended ? ACCENT : CARD, border: "2px solid " + (attended ? WHITE : ACCENT), borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: WHITE, fontWeight: attended ? "bold" : "normal" }}>
                      {attended ? "✓ " : ""}{lastFirst(m.name)}
                    </div>
                  );
                })}
              </div>
              {ev.attendedList && <div style={{ fontSize: 13, color: LIGHT_BLUE, marginTop: 6 }}>{ev.attendedList.length} attended</div>}
            </div>
          )}
          {ev.status === "upcoming" && ev.rsvpList && ev.rsvpList.length > 0 && (
            <div>
              <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>RSVPs</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {ev.rsvpList.map(id => {
                  const m = members.find(x => x.id === id);
                  return m ? <span key={id} style={{ background: ACCENT, color: WHITE, borderRadius: 6, padding: "3px 10px", fontSize: 13 }}>✓ {m.name}</span> : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Events Tab ────────────────────────────────────────────────────────────────
function EventsTab({ members, events, setEvents }) {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const blankEvent = (type) => ({
    id: Date.now(), title: "", type: type || "breakfast",
    date: today(), time: "", location: "", address: "",
    description: "", host: "", rsvpList: [], attendedList: [],
    notes: "", status: "upcoming", potluck: false, potluckItems: "",
  });

  const saveEvent = (ev) => {
    setEvents(prev => prev.some(e => e.id === ev.id) ? prev.map(e => e.id === ev.id ? ev : e) : [ev, ...prev]);
    setEditingEvent(null);
    setShowForm(false);
  };

  const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  const toggleAttended = (ev, memberId) => {
    const updated = { ...ev, attendedList: ev.attendedList.includes(memberId) ? ev.attendedList.filter(x => x !== memberId) : [...ev.attendedList, memberId] };
    setEvents(prev => prev.map(e => e.id === ev.id ? updated : e));
  };

  const filtered = events.filter(ev => {
    const matchType = filter === "all" || ev.type === filter || ev.status === filter;
    const matchSearch = !search || ev.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ color: WHITE, fontSize: 20, margin: 0 }}>Events ({events.length})</h2>
        <Btn onClick={() => { setEditingEvent(blankEvent()); setShowForm(true); }}>+ New Event</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." style={IS} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={IS}>
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <optgroup label="Type">
            {EVENT_TYPES.map(et => <option key={et.value} value={et.value}>{et.icon} {et.label}</option>)}
          </optgroup>
        </select>
      </div>

      <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Quick Create</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
          {EVENT_TYPES.map(et => (
            <button key={et.value} onClick={() => { setEditingEvent(blankEvent(et.value)); setShowForm(true); }}
              style={{ background: INPUT_BG, border: "2px solid " + ACCENT, borderRadius: 8, padding: "10px 6px", cursor: "pointer", textAlign: "center", color: WHITE, fontFamily: "Georgia, serif", fontSize: 12 }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{et.icon}</div>
              <div style={{ lineHeight: 1.2 }}>{et.label}</div>
            </button>
          ))}
        </div>
      </div>

      {showForm && editingEvent && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(5,10,30,0.8)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px 12px", overflowY: "auto" }}>
          <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 16, width: "100%", maxWidth: 640, padding: 26 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: "bold", color: WHITE }}>{getEvType(editingEvent.type).icon} {events.find(e => e.id === editingEvent.id) ? "Edit Event" : "New Event"}</div>
              <button onClick={() => { setShowForm(false); setEditingEvent(null); }} style={{ background: "transparent", border: "none", color: WHITE, fontSize: 24, cursor: "pointer" }}>x</button>
            </div>

            <Sec t="Event Details" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ gridColumn: "1/-1" }}><Lbl t="Title" /><input value={editingEvent.title} onChange={e => setEditingEvent(ev => ({ ...ev, title: e.target.value }))} placeholder="" style={IS} /></div>
              <div>
                <Lbl t="Event Type" />
                <select value={editingEvent.type} onChange={e => setEditingEvent(ev => ({ ...ev, type: e.target.value }))} style={IS}>
                  {EVENT_TYPES.map(et => <option key={et.value} value={et.value}>{et.icon} {et.label}</option>)}
                </select>
              </div>
              <div>
                <Lbl t="Status" />
                <select value={editingEvent.status} onChange={e => setEditingEvent(ev => ({ ...ev, status: e.target.value }))} style={IS}>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div><DatePicker value={editingEvent.date} onChange={v => setEditingEvent(ev => ({ ...ev, date: v }))} label="Date" /></div>
              <div><TimePicker value={editingEvent.time} onChange={v => setEditingEvent(ev => ({ ...ev, time: v }))} label="Time" /></div>
            </div>

            <Sec t="Location" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><Lbl t="Venue / Location" /><input value={editingEvent.location} onChange={e => setEditingEvent(ev => ({ ...ev, location: e.target.value }))} placeholder="" style={IS} /></div>
              <div><Lbl t="Host" /><input value={editingEvent.host} onChange={e => setEditingEvent(ev => ({ ...ev, host: e.target.value }))} placeholder="" style={IS} /></div>
              <div style={{ gridColumn: "1/-1" }}><Lbl t="Address" /><input value={editingEvent.address} onChange={e => setEditingEvent(ev => ({ ...ev, address: e.target.value }))} style={IS} /></div>
            </div>

            <Sec t="Description" />
            <textarea value={editingEvent.description} onChange={e => setEditingEvent(ev => ({ ...ev, description: e.target.value }))}
              placeholder="What are we doing? Theme, what to bring..." rows={3} style={{ ...IS, resize: "vertical" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, marginBottom: 4 }}>
              <div onClick={() => setEditingEvent(ev => ({ ...ev, potluck: !ev.potluck }))}
                style={{ width: 38, height: 22, borderRadius: 11, background: editingEvent.potluck ? ACCENT : INPUT_BG, border: "2px solid " + ACCENT, cursor: "pointer", position: "relative" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: WHITE, position: "absolute", top: 2, left: editingEvent.potluck ? 20 : 2, transition: "left 0.2s" }} />
              </div>
              <span style={{ fontSize: 14, color: WHITE }}>Potluck / Everyone Brings Something</span>
            </div>
            {editingEvent.potluck && (
              <div><Lbl t="Items / Sign-up" /><textarea value={editingEvent.potluckItems} onChange={e => setEditingEvent(ev => ({ ...ev, potluckItems: e.target.value }))} placeholder="" rows={2} style={{ ...IS, resize: "none" }} /></div>
            )}

            <Lbl t="Post-Event Notes" />
            <textarea value={editingEvent.notes} onChange={e => setEditingEvent(ev => ({ ...ev, notes: e.target.value }))} placeholder="How did it go? Highlights..." rows={3} style={{ ...IS, resize: "vertical" }} />

            <Sec t="RSVP — Who is Coming" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 6, maxHeight: 220, overflowY: "auto", marginBottom: 8 }}>
              {sortByLast(members).map(m => {
                const rsvped = editingEvent.rsvpList && editingEvent.rsvpList.includes(m.id);
                return (
                  <div key={m.id} onClick={() => setEditingEvent(ev => ({ ...ev, rsvpList: rsvped ? ev.rsvpList.filter(x => x !== m.id) : [...(ev.rsvpList || []), m.id] }))}
                    style={{ background: rsvped ? ACCENT : INPUT_BG, border: "2px solid " + (rsvped ? WHITE : ACCENT), borderRadius: 7, padding: "7px 10px", cursor: "pointer", fontSize: 13, color: WHITE, fontWeight: rsvped ? "bold" : "normal" }}>
                    {rsvped ? "✓ " : ""}{lastFirst(m.name)}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 13, color: LIGHT_BLUE, marginBottom: 16 }}>{(editingEvent.rsvpList || []).length} RSVP{(editingEvent.rsvpList || []).length !== 1 ? "s" : ""}</div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn onClick={() => { setShowForm(false); setEditingEvent(null); }} variant="secondary">Cancel</Btn>
              <Btn onClick={() => saveEvent(editingEvent)}>Save Event</Btn>
            </div>
          </div>
        </div>
      )}

      {!events.length && (
        <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 30, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
          <div style={{ fontSize: 16, color: WHITE, marginBottom: 6 }}>No events yet</div>
          <div style={{ fontSize: 14, color: LIGHT_BLUE }}>Tap a type above or + New Event to get started</div>
        </div>
      )}

      {["upcoming", "past", "cancelled"].map(status => {
        const group = filtered.filter(e => e.status === status);
        if (!group.length) return null;
        const labels = { upcoming: "Upcoming", past: "Past Events", cancelled: "Cancelled" };
        return (
          <div key={status} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, color: WHITE, textTransform: "uppercase", letterSpacing: "0.1em", borderBottom: "2px solid " + ACCENT, paddingBottom: 6, marginBottom: 14 }}>
              {labels[status]} ({group.length})
            </div>
            {group.map(ev => (
              <EventCard key={ev.id} ev={ev} members={members} onEdit={e => { setEditingEvent(e); setShowForm(true); }}
                onDelete={deleteEvent} expanded={expandedId === ev.id}
                onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                onToggleAttended={toggleAttended} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Teaching Hub ──────────────────────────────────────────────────────────────
function TeachingHub({ teachSessions, setTeachSessions, videoLinks, setVideoLinks }) {
  const [subTab, setSubTab] = useState("sessions");
  const [sessions, setSessions] = useStored("rlg_sessions", []);
  const [editSession, setEditSession] = useState(null);
  const [concordanceQuery, setConcordanceQuery] = useState("");
  const [concordanceResult, setConcordanceResult] = useState("");
  const [concordanceLoading, setConcordanceLoading] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", url: "", speaker: "", date: today(), notes: "" });
  const [showVideoForm, setShowVideoForm] = useState(false);

  const blankSession = () => ({ id: Date.now(), title: "", scripture: "", date: today(), speaker: "", outline: "", notes: "", keyVerses: "", application: "", resources: "" });

  const searchConcordance = async () => {
    if (!concordanceQuery.trim()) return;
    setConcordanceLoading(true);
    setConcordanceResult("");
    const result = await callAI(
      "You are an exhaustive Bible concordance and commentary assistant with knowledge of Strong's Concordance, Blue Letter Bible, Matthew Henry's Commentary and other major biblical reference works. When given a word, phrase, passage reference or topic, provide: 1) Original language words (Hebrew/Greek) with Strong's numbers 2) Definition and semantic range 3) Major occurrences across both Testaments 4) Cross-references and parallel passages 5) Brief commentary on theological significance 6) Teaching application points. Be thorough and pastoral.",
      concordanceQuery
    );
    setConcordanceResult(result);
    setConcordanceLoading(false);
  };

  const addVideo = () => {
    if (!newVideo.title.trim()) return;
    setVideoLinks(v => [{ ...newVideo, id: Date.now() }, ...v]);
    setNewVideo({ title: "", url: "", speaker: "", date: today(), notes: "" });
    setShowVideoForm(false);
  };

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const subTabs = [["sessions", "Sessions"], ["concordance", "Concordance"], ["videos", "Videos"], ["resources", "Resources"]];

  return (
    <div>
      <h2 style={{ color: WHITE, fontSize: 20, marginTop: 0, marginBottom: 16 }}>Teaching Hub</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {subTabs.map(([v, l]) => (
          <button key={v} onClick={() => setSubTab(v)}
            style={{ background: subTab === v ? ACCENT : INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 8, padding: "8px 16px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>{l}</button>
        ))}
      </div>

      {subTab === "sessions" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: LIGHT_BLUE, fontSize: 14 }}>{teachSessions.length} session{sessions.length !== 1 ? "s" : ""}</span>
            <Btn onClick={() => setEditSession(blankSession())}>+ New Session</Btn>
          </div>
          {editSession && (
            <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: "bold", color: WHITE, marginBottom: 14 }}>
                {sessions.find(s => s.id === editSession.id) ? "Edit Session" : "New Session"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ gridColumn: "1/-1" }}><Lbl t="Title / Series" /><input value={editSession.title} onChange={e => setEditSession(s => ({ ...s, title: e.target.value }))} placeholder="" style={IS} /></div>
                <div><Lbl t="Scripture" /><input value={editSession.scripture} onChange={e => setEditSession(s => ({ ...s, scripture: e.target.value }))} placeholder="" style={IS} /></div>
                <div><DatePicker value={editSession.date} onChange={v => setEditSession(s => ({ ...s, date: v }))} label="Date" /></div>
                <div><Lbl t="Speaker / Teacher" /><input value={editSession.speaker} onChange={e => setEditSession(s => ({ ...s, speaker: e.target.value }))} style={IS} /></div>
              </div>
              <Lbl t="Key Verses" />
              <textarea value={editSession.keyVerses} onChange={e => setEditSession(s => ({ ...s, keyVerses: e.target.value }))} rows={3} style={{ ...IS, resize: "vertical" }} />
              <Lbl t="Teaching Outline" />
              <textarea value={editSession.outline} onChange={e => setEditSession(s => ({ ...s, outline: e.target.value }))} placeholder={"I. Introduction\nII. Main Point 1\nIII. Main Point 2\nIV. Application\nV. Closing"} rows={8} style={{ ...IS, resize: "vertical", fontFamily: "monospace" }} />
              <Lbl t="Application / Discussion Questions" />
              <textarea value={editSession.application} onChange={e => setEditSession(s => ({ ...s, application: e.target.value }))} rows={4} style={{ ...IS, resize: "vertical" }} />
              <Lbl t="Notes" />
              <textarea value={editSession.notes} onChange={e => setEditSession(s => ({ ...s, notes: e.target.value }))} rows={3} style={{ ...IS, resize: "vertical" }} />
              <Lbl t="Resources / Links" />
              <input value={editSession.resources} onChange={e => setEditSession(s => ({ ...s, resources: e.target.value }))} style={IS} />
              <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
                <Btn onClick={() => setEditSession(null)} variant="secondary">Cancel</Btn>
                <Btn onClick={() => {
                  setTeachSessions(prev => prev.some(s => s.id === editSession.id) ? prev.map(s => s.id === editSession.id ? editSession : s) : [editSession, ...prev]);
                  setEditSession(null);
                }}>Save Session</Btn>
              </div>
            </div>
          )}
          {!teachSessions.length && !editSession && <p style={{ color: LIGHT_BLUE, fontStyle: "italic" }}>No sessions yet. Click New Session to start.</p>}
          {teachSessions.map(s => (
            <div key={s.id} style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: WHITE }}>{s.title || "Untitled Session"}</div>
                  <div style={{ fontSize: 13, color: LIGHT_BLUE, marginTop: 2 }}>{s.scripture}{s.date ? " · " + fmtDate(s.date) : ""}{s.speaker ? " · " + s.speaker : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn onClick={() => setEditSession(s)} variant="secondary" style={{ fontSize: 13, padding: "4px 12px" }}>Edit</Btn>
                  <Btn onClick={() => setTeachSessions(prev => prev.filter(x => x.id !== s.id))} variant="danger" style={{ fontSize: 13, padding: "4px 12px" }}>Del</Btn>
                </div>
              </div>
              {s.outline && <pre style={{ fontSize: 13, color: LIGHT_BLUE, whiteSpace: "pre-wrap", margin: "8px 0 0", fontFamily: "Georgia", lineHeight: 1.6, borderTop: "1px solid " + ACCENT, paddingTop: 8 }}>{s.outline.substring(0, 300)}{s.outline.length > 300 ? "..." : ""}</pre>}
            </div>
          ))}
        </div>
      )}

      {subTab === "concordance" && (
        <div>
          <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 18, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: "bold", color: WHITE, marginBottom: 6 }}>AI Bible Concordance</div>
            <div style={{ fontSize: 13, color: LIGHT_BLUE, marginBottom: 14 }}>Powered by Strong's, Blue Letter Bible, Matthew Henry, and major biblical references. Search any word, passage, or topic.</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <input value={concordanceQuery} onChange={e => setConcordanceQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && searchConcordance()} placeholder='Try "grace", "John 3:16", "redemption", "Holy Spirit"...' style={{ ...IS, flex: 1 }} />
              <Btn onClick={searchConcordance} style={{ flexShrink: 0, opacity: concordanceLoading ? 0.6 : 1 }}>
                {concordanceLoading ? "Searching..." : "Search"}
              </Btn>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {["grace", "faith", "love", "redemption", "covenant", "prayer", "forgiveness", "Holy Spirit"].map(term => (
                <button key={term} onClick={() => setConcordanceQuery(term)}
                  style={{ background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 6, padding: "4px 10px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>{term}</button>
              ))}
            </div>
          </div>
          {concordanceResult && (
            <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 15, fontWeight: "bold", color: WHITE }}>Results: "{concordanceQuery}"</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={"https://www.blueletterbible.org/search/search.cfm?Criteria=" + encodeURIComponent(concordanceQuery) + "&t=KJV"} target="_blank" rel="noreferrer"
                    style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 6, padding: "4px 12px", fontSize: 12, textDecoration: "none" }}>Blue Letter Bible</a>
                  <a href={"https://www.biblegateway.com/quicksearch/?quicksearch=" + encodeURIComponent(concordanceQuery) + "&qs_version=NIV"} target="_blank" rel="noreferrer"
                    style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 6, padding: "4px 12px", fontSize: 12, textDecoration: "none" }}>Bible Gateway</a>
                </div>
              </div>
              <pre style={{ fontSize: 14, color: WHITE, whiteSpace: "pre-wrap", margin: 0, fontFamily: "Georgia, serif", lineHeight: 1.8 }}>{concordanceResult}</pre>
            </div>
          )}
        </div>
      )}

      {subTab === "videos" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ color: LIGHT_BLUE, fontSize: 14 }}>{videoLinks.length} video{videoLinks.length !== 1 ? "s" : ""}</span>
            <Btn onClick={() => setShowVideoForm(!showVideoForm)}>+ Add Video</Btn>
          </div>
          {showVideoForm && (
            <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><Lbl t="Title" /><input value={newVideo.title} onChange={e => setNewVideo(v => ({ ...v, title: e.target.value }))} style={IS} /></div>
                <div><Lbl t="Speaker" /><input value={newVideo.speaker} onChange={e => setNewVideo(v => ({ ...v, speaker: e.target.value }))} style={IS} /></div>
                <div style={{ gridColumn: "1/-1" }}><Lbl t="URL" /><input value={newVideo.url} onChange={e => setNewVideo(v => ({ ...v, url: e.target.value }))} placeholder="https://youtu.be/..." style={IS} /></div>
                <div><DatePicker value={newVideo.date} onChange={val => setNewVideo(v => ({ ...v, date: val }))} label="Date" /></div>
                <div><Lbl t="Notes" /><input value={newVideo.notes} onChange={e => setNewVideo(v => ({ ...v, notes: e.target.value }))} style={IS} /></div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn onClick={() => setShowVideoForm(false)} variant="secondary">Cancel</Btn>
                <Btn onClick={addVideo}>Save</Btn>
              </div>
            </div>
          )}
          {!videoLinks.length && <p style={{ color: LIGHT_BLUE, fontStyle: "italic" }}>No videos saved yet.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {videoLinks.map(v => {
              const ytId = getYouTubeId(v.url);
              return (
                <div key={v.id} style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 10, overflow: "hidden" }}>
                  {ytId && <iframe width="100%" height="170" src={"https://www.youtube.com/embed/" + ytId} frameBorder="0" allowFullScreen style={{ display: "block" }} />}
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: WHITE, marginBottom: 3 }}>{v.title}</div>
                    <div style={{ fontSize: 13, color: LIGHT_BLUE }}>{v.speaker}{v.date ? " · " + fmtDate(v.date) : ""}</div>
                    {v.notes && <div style={{ fontSize: 12, color: LIGHT_BLUE, marginTop: 4, fontStyle: "italic" }}>{v.notes}</div>}
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      {v.url && <a href={v.url} target="_blank" rel="noreferrer" style={{ background: INPUT_BG, color: WHITE, borderRadius: 5, padding: "3px 10px", textDecoration: "none", fontSize: 12, border: "1px solid " + ACCENT }}>Open</a>}
                      <Btn onClick={() => setVideoLinks(vl => vl.filter(x => x.id !== v.id))} variant="danger" style={{ fontSize: 12, padding: "3px 10px" }}>Remove</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subTab === "resources" && (
        <div>
          <div style={{ fontSize: 15, fontWeight: "bold", color: WHITE, marginBottom: 16 }}>Biblical Reference Resources</div>
          {[
            { name: "Blue Letter Bible", desc: "Strong's concordance, Greek/Hebrew lexicons, commentaries, interlinear", url: "https://www.blueletterbible.org" },
            { name: "Bible Gateway", desc: "All major translations, parallel Bible, verse search", url: "https://www.biblegateway.com" },
            { name: "Bible Hub", desc: "Parallel commentaries, Strong's, Treasury of Scripture", url: "https://biblehub.com" },
            { name: "Got Questions", desc: "Theological Q&A, doctrine explanations, life application", url: "https://www.gotquestions.org" },
            { name: "Desiring God", desc: "John Piper sermons, articles, devotionals", url: "https://www.desiringgod.org" },
            { name: "The Gospel Coalition", desc: "Reformed theology, sermons, book reviews, discipleship", url: "https://www.thegospelcoalition.org" },
            { name: "Ligonier Ministries", desc: "R.C. Sproul teachings, Tabletalk magazine, theology", url: "https://www.ligonier.org" },
            { name: "Precept Austin", desc: "Inductive Bible study methods and commentaries", url: "https://www.preceptaustin.org" },
            { name: "Open Bible", desc: "Topical studies, daily verses, concordance", url: "https://www.openbible.info" },
          ].map(r => (
            <a key={r.name} href={r.url} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 14, background: CARD, border: "2px solid " + ACCENT, borderRadius: 10, padding: "14px 18px", marginBottom: 10, textDecoration: "none" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: "bold", color: WHITE }}>{r.name}</div>
                <div style={{ fontSize: 13, color: LIGHT_BLUE, marginTop: 2 }}>{r.desc}</div>
              </div>
              <span style={{ fontSize: 20, color: ACCENT }}>↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function LifeGroupTracker() {
  const [tab, setTab] = useState("Quick View");
  const [members, setMembers, membersLoaded] = useStored("rlg_members", initialMembers);
  const [sessions, setSessions] = useStored("rlg_sessions", []);
  const [followUps, setFollowUps] = useStored("rlg_followups", []);
  const [prayers, setPrayers] = useStored("rlg_prayers", []);
  const [memberMessages, setMemberMessages] = useStored("rlg_messages", {});
  const [events, setEvents] = useStored("rlg_events", []);
  const [teachSessions, setTeachSessions] = useStored("rlg_teach_sessions", []);
  const [videoLinks, setVideoLinks] = useStored("rlg_videos", []);
  const [toast, setToast] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingPrayer, setEditingPrayer] = useState(null);
  const [textCaptureFor, setTextCaptureFor] = useState(null);

  const [prayerFilter, setPrayerFilter] = useState("all");
  const [prayerMemberFilter, setPrayerMemberFilter] = useState("all");
  const [prayerSearch, setPrayerSearch] = useState("");

  const [sessionDate, setSessionDate] = useState(today());
  const [topic, setTopic] = useState("");
  const [attendance, setAttendance] = useState({});
  const [guests, setGuests] = useState([{ name: "", email: "", phone: "" }]);
  const [sessionNotes, setSessionNotes] = useState("");

  const [newMemberName, setNewMemberName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  const [followUpForm, setFollowUpForm] = useState({ memberId: "", type: "text", notes: "", date: today(), status: "pending" });
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);

  const showToast = (msg, color) => {
    setToast({ msg, color: color || ACCENT });
    setTimeout(() => setToast(null), 2800);
  };

  const saveMember = (u) => {
    setMembers(ms => ms.map(m => m.id === u.id ? u : m));
    showToast("✓ Profile saved for " + u.name + "!");
  };
  const savePrayer = (u) => {
    setPrayers(ps => ps.some(p => p.id === u.id) ? ps.map(p => p.id === u.id ? u : p) : [...ps, u]);
    showToast("Prayer request saved!");
  };

  const newPrayer = (memberId) => ({
    id: Date.now(), memberId: memberId || "", title: "", description: "",
    category: "general", status: "active", dateSubmitted: today(),
    followUpDate: "", confidential: false, updates: [],
  });

  const toggleAttendance = (id) => setAttendance(a => ({ ...a, [id]: !a[id] }));

  const submitSession = () => {
    if (!topic.trim()) { showToast("Please enter a topic.", "#c0392b"); return; }
    const present = members.filter(m => attendance[m.id]);
    const absent = members.filter(m => m.active && !attendance[m.id]);
    const guestList = guests.filter(g => g.name.trim());
    const session = {
      id: Date.now(), date: sessionDate, topic,
      present: present.map(m => m.id), absent: absent.map(m => m.id),
      guests: guestList, notes: sessionNotes,
    };
    setSessions(s => [session, ...s]);
    const newFUs = absent.map(m => ({
      id: Date.now() + m.id, memberId: m.id, sessionId: session.id,
      type: "text", notes: "Missed " + fmtDate(sessionDate) + " — check in",
      date: sessionDate, status: "pending", auto: true,
    }));
    setFollowUps(fu => [...newFUs, ...fu]);
    setAttendance({});
    setTopic("");
    setSessionNotes("");
    setGuests([{ name: "", email: "", phone: "" }]);
    showToast("Session saved! " + absent.length + " follow-up" + (absent.length !== 1 ? "s" : "") + " created.");
    setTab("Follow-Up");
  };

  const addMember = () => {
    if (!newMemberName.trim()) { showToast("Name required.", "#c0392b"); return; }
    const m = { id: Date.now(), active: true, role: "", ...blankProfile, name: newMemberName };
    setMembers(ms => [...ms, m]);
    setNewMemberName("");
    setShowAddMember(false);
    setEditingMember(m);
    showToast("Member added!");
  };

  const addFollowUp = () => {
    if (!followUpForm.memberId) { showToast("Select a member.", "#c0392b"); return; }
    setFollowUps(fu => [{ ...followUpForm, id: Date.now(), auto: false }, ...fu]);
    setFollowUpForm({ memberId: "", type: "text", notes: "", date: today(), status: "pending" });
    setShowFollowUp(false);
    showToast("Follow-up logged!");
  };

  const updateFollowUp = (id, status) => setFollowUps(fu => fu.map(f => f.id === id ? { ...f, status } : f));
  const updateFollowUpFull = (updated) => {
    setFollowUps(fu => fu.map(f => f.id === updated.id ? updated : f));
    setEditingFollowUp(null);
    showToast("Follow-up updated!");
  };
  const deleteFollowUp = (id) => {
    setFollowUps(fu => fu.filter(f => f.id !== id));
    showToast("Follow-up deleted.");
  };
  const getMember = (id) => members.find(m => m.id === parseInt(id)) || {};

  const pendingFUs = followUps.filter(f => f.status === "pending").length;
  const activePrayers = prayers.filter(p => p.status === "active" || p.status === "ongoing").length;
  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()));
  const filteredPrayers = prayers.filter(p => {
    const ms = prayerFilter === "all" || p.status === prayerFilter || p.category === prayerFilter;
    const mm = prayerMemberFilter === "all" || p.memberId == prayerMemberFilter;
    const mq = !prayerSearch || (p.title + p.description).toLowerCase().includes(prayerSearch.toLowerCase()) || (getMember(p.memberId).name || "").toLowerCase().includes(prayerSearch.toLowerCase());
    return ms && mm && mq;
  });

  const now = new Date();
  const ms52 = 52 * 7 * 24 * 60 * 60 * 1000;
  const ms90 = 90 * 24 * 60 * 60 * 1000;
  const calcAge = (dob) => {
    if (!dob) return null;
    const d = new Date(dob);
    if (isNaN(d)) return null;
    let a = now.getFullYear() - d.getFullYear();
    if (now.getMonth() - d.getMonth() < 0 || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) a--;
    return a;
  };

  if (!membersLoaded) {
    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#0f1d38", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>✝</div>
          <div style={{ fontSize: 18, color: "#a8c8f0" }}>Loading Russell LifeGroup...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#0f1d38", minHeight: "100vh", color: WHITE }}>

      {editingMember && <MemberModal m={editingMember} sessions={sessions} followUps={followUps} onClose={() => setEditingMember(null)} onSave={saveMember} />}
      {editingPrayer && <PrayerModal prayer={editingPrayer} members={members} onClose={() => setEditingPrayer(null)} onSave={savePrayer} />}
      {textCaptureFor && (
        <TextCaptureModal
          member={textCaptureFor}
          existingMessages={memberMessages[textCaptureFor.id] || []}
          onClose={() => setTextCaptureFor(null)}
          onSave={(msgs) => setMemberMessages(mm => ({ ...mm, [textCaptureFor.id]: msgs }))}
        />
      )}

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 3000, background: toast.color, color: WHITE, padding: "12px 20px", borderRadius: 10, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: NAV, padding: "24px 24px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: WHITE }}>Russell LifeGroup</h1>
            <p style={{ margin: 0, fontSize: 13, color: LIGHT_BLUE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {members.length} Members
              {pendingFUs > 0 && <span style={{ background: "#c0392b", color: WHITE, borderRadius: 12, padding: "1px 10px", fontSize: 12, marginLeft: 10 }}>{pendingFUs} follow-up{pendingFUs !== 1 ? "s" : ""}</span>}
              {activePrayers > 0 && <span style={{ background: "#1a4a8a", color: WHITE, borderRadius: 12, padding: "1px 10px", fontSize: 12, marginLeft: 6 }}>🙏 {activePrayers} active</span>}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, paddingBottom: 10 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ background: tab === t ? ACCENT : INPUT_BG, color: WHITE, border: "none", borderRadius: 8, padding: "11px 8px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: tab === t ? "bold" : "normal", textAlign: "center", lineHeight: 1.3 }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px" }}>

        {/* QUICK VIEW */}
        {tab === "Quick View" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ color: WHITE, fontSize: 20, margin: 0 }}>Quick View</h2>
            </div>
            <input placeholder="Search by name..." onChange={e => setMemberSearch(e.target.value)}
              style={{ ...IS, marginBottom: 14 }} />
            {filteredMembers.map(m => {
              const age = calcAge(m.birthday);
              const cutoff52 = new Date(now.getTime() - ms52);
              const cutoff90 = new Date(now.getTime() - ms90);
              const sess52 = sessions.filter(s => new Date(s.date) >= cutoff52);
              const attended = sess52.filter(s => s.present.includes(m.id)).length;
              const pct = sess52.length > 0 ? Math.round((attended / sess52.length) * 100) : null;
              const mPrayers = prayers.filter(p => p.memberId == m.id && new Date(p.dateSubmitted) >= cutoff90);
              const rc = roleColors[m.role];
              return (
                <div key={m.id} style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                  {/* Row 1: Name + Age + Role */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #1a2f5e, #4a90d9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: WHITE, flexShrink: 0, fontWeight: "bold" }}>{m.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: "bold", color: WHITE }}>{m.name.split(" ")[0]} {m.name.split(" ").slice(-1)[0]}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2, flexWrap: "wrap" }}>
                        {age !== null && <span style={{ fontSize: 13, color: LIGHT_BLUE }}>Age {age}</span>}
                        {m.role && rc && <span style={{ fontSize: 11, background: rc.bg, color: rc.text, border: "1px solid " + rc.border, borderRadius: 4, padding: "1px 6px" }}>{m.role}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Contact buttons */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    {m.cell
                      ? <>
                          <a href={"sms:" + m.cell} style={{ background: ACCENT, color: WHITE, borderRadius: 7, padding: "7px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", gap: 5 }}>💬 Text</a>
                          <a href={"tel:" + m.cell} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 7, padding: "7px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", gap: 5 }}>📞 Call</a>
                        </>
                      : <span style={{ fontSize: 13, color: LIGHT_BLUE, fontStyle: "italic" }}>No phone number yet</span>
                    }
                    {m.email && <a href={"mailto:" + m.email} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 7, padding: "7px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", gap: 5 }}>✉️ Email</a>}
                    <button onClick={() => setEditingMember(m)} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 7, padding: "7px 14px", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", marginLeft: "auto" }}>👤 Profile</button>
                  </div>

                  {/* Row 3: Attendance + Prayer summary */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 8, borderTop: "1px solid " + INPUT_BG }}>
                    <div>
                      <div style={{ fontSize: 11, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Last 52 Weeks</div>
                      {sess52.length === 0
                        ? <span style={{ fontSize: 12, color: LIGHT_BLUE, fontStyle: "italic" }}>No sessions yet</span>
                        : <>
                            <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 3 }}>
                              {sess52.sort((a, b) => new Date(a.date) - new Date(b.date)).map(s => (
                                <div key={s.id} title={fmtDate(s.date)}
                                  style={{ width: 10, height: 10, borderRadius: 2, background: s.present.includes(m.id) ? ACCENT : "#2a1a1a", border: "1px solid " + (s.present.includes(m.id) ? WHITE : "#5a3a3a") }} />
                              ))}
                            </div>
                            <div style={{ fontSize: 12, color: pct >= 75 ? "#4adf7a" : pct >= 50 ? "#f0c040" : "#c47a7a" }}>{attended}/{sess52.length} sessions · {pct}%</div>
                          </>
                      }
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Last 90 Days — Prayer</div>
                      {mPrayers.length === 0
                        ? <span style={{ fontSize: 12, color: LIGHT_BLUE, fontStyle: "italic" }}>None</span>
                        : <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            {mPrayers.map(pr => {
                              const cat = getPrayCat(pr.category);
                              const si = getPrayStat(pr.status);
                              return (
                                <div key={pr.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  <span style={{ fontSize: 13 }}>{cat.icon}</span>
                                  <span style={{ fontSize: 12, color: WHITE, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pr.title || cat.label}</span>
                                  <span style={{ fontSize: 10, background: si.color + "55", color: WHITE, borderRadius: 3, padding: "0 5px", flexShrink: 0 }}>{si.label}</span>
                                </div>
                              );
                            })}
                          </div>
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LG TODAY */}
        {tab === "LG Today" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div><DatePicker value={sessionDate} onChange={v => setSessionDate(v)} label="Date" /></div>
              <div><Lbl t="Topic / Scripture" /><input value={topic} onChange={e => setTopic(e.target.value)} placeholder="" style={IS} /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.06em" }}>Joined Us Today</div>
              <span style={{ fontSize: 13, color: LIGHT_BLUE }}>{Object.values(attendance).filter(Boolean).length} of {members.filter(m => m.active).length} present</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8, marginBottom: 20 }}>
              {sortByLast(members.filter(m => m.active)).map(m => {
                const checked = attendance[m.id];
                const rc = roleColors[m.role];
                return (
                  <div key={m.id} onClick={() => toggleAttendance(m.id)}
                    style={{ display: "flex", alignItems: "center", gap: 10, background: checked ? ACCENT : CARD, border: "2px solid " + (checked ? WHITE : ACCENT), borderRadius: 8, padding: "10px 13px", cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: checked ? WHITE : INPUT_BG, border: "2px solid " + ACCENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {checked && <span style={{ color: NAV, fontSize: 13, fontWeight: "bold" }}>✓</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, color: WHITE, fontWeight: checked ? "bold" : "normal", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lastFirst(m.name)}</div>
                      {m.role && rc && <span style={{ fontSize: 9, background: "rgba(255,255,255,0.2)", color: WHITE, borderRadius: 3, padding: "0 4px" }}>{m.role}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <Lbl t="Guests / First-Timers" />
            {guests.map((g, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr auto", gap: 8, marginBottom: 8 }}>
                <input value={g.name} onChange={e => setGuests(gs => gs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Name" style={IS} />
                <input value={g.email} onChange={e => setGuests(gs => gs.map((x, j) => j === i ? { ...x, email: e.target.value } : x))} placeholder="Email" style={IS} />
                <input value={g.phone} onChange={e => setGuests(gs => gs.map((x, j) => j === i ? { ...x, phone: fmtPhone(e.target.value) } : x))} placeholder="(817) 555-1234" style={IS} />
                <button onClick={() => setGuests(gs => gs.filter((_, j) => j !== i))} style={{ background: "#5a1a1a", border: "2px solid #c0392b", borderRadius: 8, color: WHITE, cursor: "pointer", padding: "0 12px", fontSize: 18 }}>x</button>
              </div>
            ))}
            <button onClick={() => setGuests(g => [...g, { name: "", email: "", phone: "" }])}
              style={{ background: "transparent", border: "2px dashed " + ACCENT, color: WHITE, borderRadius: 8, padding: "8px 16px", fontSize: 14, cursor: "pointer", marginBottom: 20, fontFamily: "Georgia, serif" }}>+ Add Guest</button>
            <Lbl t="Session Notes" />
            <textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)} rows={3}
              style={{ ...IS, resize: "vertical", marginBottom: 20 }} />
            <Btn onClick={submitSession} style={{ fontSize: 15, padding: "12px 32px" }}>Save Session & Generate Follow-Ups</Btn>
          </div>
        )}

        {/* MEMBERS */}
        {tab === "Members" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ color: WHITE, fontSize: 20, margin: 0 }}>Members ({members.length})</h2>
              <Btn onClick={() => setShowAddMember(!showAddMember)}>+ Add Member</Btn>
            </div>
            <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Search members..." style={{ ...IS, marginBottom: 14 }} />
            {showAddMember && (
              <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 18, marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: WHITE, marginBottom: 10 }}>New Member</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                  <input value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Full Name" style={IS} onKeyDown={e => e.key === "Enter" && addMember()} />
                  <Btn onClick={addMember}>Add</Btn>
                </div>
              </div>
            )}
            {["Main Leader", "Leader"].map(role => {
              const group = filteredMembers.filter(m => m.role === role);
              if (!group.length) return null;
              const rc = roleColors[role];
              return (
                <div key={role} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: rc.text, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, paddingLeft: 4 }}>{role}s</div>
                  {group.map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                      <div style={{ flex: 1 }}><MemberCard m={m} sessions={sessions} followUps={followUps} onEdit={setEditingMember} /></div>
                      <button onClick={() => setTextCaptureFor(m)} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", flexShrink: 0 }}>
                        💬 {(memberMessages[m.id] || []).length > 0 ? (memberMessages[m.id] || []).length + " msgs" : "Messages"}
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
            <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, paddingLeft: 4 }}>Members ({filteredMembers.filter(m => !m.role).length})</div>
            {filteredMembers.filter(m => !m.role).map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <div style={{ flex: 1 }}><MemberCard m={m} sessions={sessions} followUps={followUps} onEdit={setEditingMember} /></div>
                <button onClick={() => setTextCaptureFor(m)} style={{ background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif", flexShrink: 0 }}>
                  💬 {(memberMessages[m.id] || []).length > 0 ? (memberMessages[m.id] || []).length + " msgs" : "Messages"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* JOINED US TODAY */}
        {tab === "Joined Us Today" && (
          <div>
            <h2 style={{ color: WHITE, fontSize: 20, marginTop: 0, marginBottom: 20 }}>Joined Us Today ({sessions.length} sessions)</h2>
            {!sessions.length && <p style={{ color: LIGHT_BLUE, fontStyle: "italic" }}>No sessions recorded yet.</p>}
            {sessions.map(s => (
              <div key={s.id} style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 18, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: "bold", color: WHITE }}>{fmtDate(s.date)}</div>
                    <div style={{ fontSize: 14, color: LIGHT_BLUE, marginTop: 2 }}>{s.topic}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ background: "#1a5a3a", color: WHITE, borderRadius: 8, padding: "4px 12px", fontSize: 13 }}>{s.present.length} present</span>
                    {s.absent.length > 0 && <span style={{ background: "#5a1a1a", color: WHITE, borderRadius: 8, padding: "4px 12px", fontSize: 13 }}>{s.absent.length} absent</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {s.present.map(id => <span key={id} style={{ background: "#1a5a3a", color: WHITE, borderRadius: 6, padding: "3px 10px", fontSize: 13 }}>✓ {getMember(id).name}</span>)}
                  {s.absent.map(id => <span key={id} style={{ background: "#5a1a1a", color: WHITE, borderRadius: 6, padding: "3px 10px", fontSize: 13 }}>✗ {getMember(id).name}</span>)}
                  {s.guests.map((g, i) => <span key={i} style={{ background: "#1a2a5a", color: WHITE, borderRadius: 6, padding: "3px 10px", fontSize: 13 }}>★ {g.name} (guest)</span>)}
                </div>
                {s.notes && <div style={{ fontSize: 14, color: LIGHT_BLUE, fontStyle: "italic", borderTop: "1px solid " + ACCENT, paddingTop: 10, marginTop: 10 }}>{s.notes}</div>}
              </div>
            ))}
          </div>
        )}

        {/* FOLLOW-UP */}
        {tab === "Follow-Up" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: WHITE, fontSize: 20, margin: 0 }}>Follow-Up Log</h2>
              <Btn onClick={() => setShowFollowUp(!showFollowUp)}>+ Log Follow-Up</Btn>
            </div>
            {showFollowUp && (
              <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: 18, marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: "bold", color: WHITE, marginBottom: 14 }}>New Follow-Up</div>

                <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Member</div>
                <select value={followUpForm.memberId} onChange={e => setFollowUpForm(f => ({ ...f, memberId: e.target.value }))} style={{ ...IS, marginBottom: 12, fontSize: 16 }}>
                  <option value="">Select member...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}{m.role ? " (" + m.role + ")" : ""}</option>)}
                </select>

                <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Type of Contact</div>
                <select value={followUpForm.type} onChange={e => setFollowUpForm(f => ({ ...f, type: e.target.value }))} style={{ ...IS, marginBottom: 12, fontSize: 16 }}>
                  {CONTACT_TYPES.map(c => <option key={c.value} value={c.value}>{c.icon}  {c.label}</option>)}
                </select>

                <div style={{ marginBottom: 12 }}>
                  <DatePicker value={followUpForm.date} onChange={v => setFollowUpForm(f => ({ ...f, date: v }))} label="Date" />
                </div>

                <div style={{ fontSize: 12, color: LIGHT_BLUE, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Notes</div>
                <textarea value={followUpForm.notes} onChange={e => setFollowUpForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                  style={{ ...IS, resize: "none", marginBottom: 14 }} />

                <div style={{ display: "flex", gap: 10 }}>
                  <Btn onClick={() => setShowFollowUp(false)} variant="secondary" style={{ flex: 1, textAlign: "center" }}>Cancel</Btn>
                  <Btn onClick={addFollowUp} style={{ flex: 1, textAlign: "center" }}>Save Follow-Up</Btn>
                </div>
              </div>
            )}
            {["pending", "completed", "no-response"].map(status => {
              const group = followUps.filter(f => f.status === status);
              if (!group.length) return null;
              const colors = { pending: "#c0392b", completed: "#1a6a3a", "no-response": "#3a4a7a" };
              const labels = { pending: "Needs Follow-Up", completed: "Completed", "no-response": "No Response" };
              return (
                <div key={status} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ background: colors[status], color: WHITE, borderRadius: 6, padding: "2px 10px", fontSize: 13, fontWeight: "bold" }}>{labels[status]}</span>
                    <span style={{ fontSize: 13, color: LIGHT_BLUE }}>{group.length} item{group.length !== 1 ? "s" : ""}</span>
                  </div>
                  {group.map(f => {
                    const m = getMember(f.memberId);
                    const ct = getCtType(f.type);
                    const isEditing = editingFollowUp && editingFollowUp.id === f.id;
                    return (
                      <div key={f.id} style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 12, padding: "14px 18px", marginBottom: 10 }}>
                        {/* Card header */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                          <span style={{ fontSize: 22, marginTop: 2 }}>{ct.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, color: WHITE, fontWeight: "bold", marginBottom: 3 }}>{m.name || "Unknown"}</div>
                            <div style={{ fontSize: 14, color: LIGHT_BLUE }}>{ct.label}{f.notes ? " — " + f.notes : ""}</div>
                            <div style={{ fontSize: 13, color: LIGHT_BLUE, marginTop: 2 }}>📅 {fmtDate(f.date)}</div>
                            {f.auto && <span style={{ fontSize: 11, color: WHITE, background: INPUT_BG, borderRadius: 4, padding: "1px 6px", marginTop: 3, display: "inline-block" }}>auto-generated</span>}
                          </div>
                          <Btn onClick={() => setEditingFollowUp(isEditing ? null : { ...f })} variant="secondary" style={{ fontSize: 13, padding: "5px 14px", flexShrink: 0 }}>
                            {isEditing ? "Cancel" : "Edit"}
                          </Btn>
                        </div>

                        {/* Quick contact buttons */}
                        {(m.cell || m.email) && (
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                            {m.cell && <a href={"sms:" + m.cell} style={{ background: ACCENT, color: WHITE, borderRadius: 7, padding: "6px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold" }}>💬 Text</a>}
                            {m.cell && <a href={"tel:" + m.cell} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 7, padding: "6px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold" }}>📞 Call</a>}
                            {m.email && <a href={"mailto:" + m.email} style={{ background: INPUT_BG, color: WHITE, border: "2px solid " + ACCENT, borderRadius: 7, padding: "6px 14px", textDecoration: "none", fontSize: 14, fontWeight: "bold" }}>✉️ Email</a>}
                          </div>
                        )}

                        {/* Status buttons for pending */}
                        {status === "pending" && !isEditing && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <Btn onClick={() => updateFollowUp(f.id, "completed")} style={{ flex: 1, textAlign: "center", background: "#1a6a3a" }}>✓ Done</Btn>
                            <Btn onClick={() => updateFollowUp(f.id, "no-response")} variant="secondary" style={{ flex: 1, textAlign: "center" }}>No Response</Btn>
                          </div>
                        )}

                        {/* Inline edit form */}
                        {isEditing && (
                          <div style={{ background: INPUT_BG, borderRadius: 10, padding: 14, marginTop: 8, borderTop: "2px solid " + ACCENT }}>
                            <div style={{ fontSize: 13, color: WHITE, fontWeight: "bold", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>Edit Follow-Up</div>

                            <div style={{ fontSize: 12, color: LIGHT_BLUE, marginBottom: 5 }}>MEMBER</div>
                            <select value={editingFollowUp.memberId} onChange={e => setEditingFollowUp(ef => ({ ...ef, memberId: e.target.value }))} style={{ ...IS, marginBottom: 10 }}>
                              {members.map(m2 => <option key={m2.id} value={m2.id}>{m2.name}</option>)}
                            </select>

                            <div style={{ fontSize: 12, color: LIGHT_BLUE, marginBottom: 5 }}>TYPE OF CONTACT</div>
                            <select value={editingFollowUp.type} onChange={e => setEditingFollowUp(ef => ({ ...ef, type: e.target.value }))} style={{ ...IS, marginBottom: 10 }}>
                              {CONTACT_TYPES.map(c => <option key={c.value} value={c.value}>{c.icon}  {c.label}</option>)}
                            </select>

                            <div style={{ marginBottom: 10 }}>
                              <DatePicker value={editingFollowUp.date} onChange={v => setEditingFollowUp(ef => ({ ...ef, date: v }))} label="Date" />
                            </div>

                            <div style={{ fontSize: 12, color: LIGHT_BLUE, marginBottom: 5 }}>STATUS</div>
                            <select value={editingFollowUp.status} onChange={e => setEditingFollowUp(ef => ({ ...ef, status: e.target.value }))} style={{ ...IS, marginBottom: 10 }}>
                              <option value="pending">Needs Follow-Up</option>
                              <option value="completed">Completed</option>
                              <option value="no-response">No Response</option>
                            </select>

                            <div style={{ fontSize: 12, color: LIGHT_BLUE, marginBottom: 5 }}>NOTES</div>
                            <textarea value={editingFollowUp.notes} onChange={e => setEditingFollowUp(ef => ({ ...ef, notes: e.target.value }))} rows={3}
                              style={{ ...IS, resize: "none", marginBottom: 12 }} />

                            <div style={{ display: "flex", gap: 8 }}>
                              <Btn onClick={() => deleteFollowUp(f.id)} variant="danger" style={{ fontSize: 13, padding: "7px 14px" }}>Delete</Btn>
                              <Btn onClick={() => setEditingFollowUp(null)} variant="secondary" style={{ flex: 1, textAlign: "center" }}>Cancel</Btn>
                              <Btn onClick={() => updateFollowUpFull(editingFollowUp)} style={{ flex: 1, textAlign: "center" }}>Save Changes</Btn>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {!followUps.length && <p style={{ color: LIGHT_BLUE, fontStyle: "italic" }}>No follow-ups yet. They appear automatically when members miss a session.</p>}
          </div>
        )}

        {/* PRAYER REQUEST */}
        {tab === "Prayer Request" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ color: WHITE, fontSize: 20, margin: 0 }}>Prayer Request ({prayers.length})</h2>
              <Btn onClick={() => setEditingPrayer(newPrayer(""))}>+ New Request</Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              <input value={prayerSearch} onChange={e => setPrayerSearch(e.target.value)} placeholder="Search..." style={IS} />
              <select value={prayerMemberFilter} onChange={e => setPrayerMemberFilter(e.target.value)} style={IS}>
                <option value="all">All Members</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select value={prayerFilter} onChange={e => setPrayerFilter(e.target.value)} style={IS}>
                <option value="all">All</option>
                <optgroup label="Status">{PRAYER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</optgroup>
                <optgroup label="Category">{PRAYER_CATS.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}</optgroup>
              </select>
            </div>
            <div style={{ background: CARD, border: "2px solid " + ACCENT, borderRadius: 10, padding: "12px 16px", marginBottom: 18 }}>
              <div style={{ fontSize: 12, color: WHITE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Quick Add by Member</div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {members.map(m => (
                  <button key={m.id} onClick={() => setEditingPrayer(newPrayer(m.id))}
                    style={{ background: INPUT_BG, border: "2px solid " + ACCENT, color: WHITE, borderRadius: 6, padding: "3px 10px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                    {m.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
            {!filteredPrayers.length && <p style={{ color: LIGHT_BLUE, fontStyle: "italic" }}>No prayer requests yet.</p>}
            {["active", "ongoing", "answered", "closed"].map(status => {
              const group = filteredPrayers.filter(p => p.status === status);
              if (!group.length) return null;
              const si = getPrayStat(status);
              return (
                <div key={status} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ background: si.color, color: WHITE, borderRadius: 6, padding: "2px 12px", fontSize: 13, fontWeight: "bold" }}>{si.label}</span>
                    <span style={{ fontSize: 13, color: LIGHT_BLUE }}>{group.length}</span>
                  </div>
                  {group.map(pr => <PrayerCard key={pr.id} pr={pr} members={members} onEdit={setEditingPrayer} onSave={savePrayer} />)}
                </div>
              );
            })}
          </div>
        )}

        {/* EVENTS */}
        {tab === "Events" && <EventsTab members={members} events={events} setEvents={setEvents} />}

        {/* TEACHING HUB */}
        {tab === "Teaching Hub" && <TeachingHub teachSessions={teachSessions} setTeachSessions={setTeachSessions} videoLinks={videoLinks} setVideoLinks={setVideoLinks} />}

      </div>

      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea { font-family: Georgia, serif; caret-color: #ffffff; }
        input:focus, textarea:focus, select:focus { outline: 3px solid #ffffff; outline-offset: 1px; background: #2a4a80 !important; }
        input::placeholder, textarea::placeholder { color: #a8c8f0 !important; opacity: 1; }
        select option { background: #1a2f5e; color: #ffffff; }
      `}</style>
    </div>
  );
}