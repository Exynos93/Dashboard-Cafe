import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── Palette ──────────────────────────────────────────────────────────
const C = {
  cream: "#F5F0E8",
  paper: "#EDE8DC",
  espresso: "#2C1A0E",
  brown: "#6B3F1F",
  latte: "#C4956A",
  matcha: "#4A7C59",
  matchaLight: "#D4E8D8",
  rose: "#C4616A",
  roseLight: "#F2D8DA",
  gold: "#C49A3C",
  goldLight: "#F5EAC8",
  muted: "#8C7B6B",
  border: "#D9D0C0",
};

const styles = {
  root: {
    background: C.cream,
    minHeight: "100vh",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    color: C.espresso,
    padding: "0",
  },
  header: {
    background: C.espresso,
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: C.cream,
    letterSpacing: "0.02em",
    fontFamily: "'Georgia', serif",
  },
  headerSub: {
    fontSize: "12px",
    color: C.latte,
    marginTop: "2px",
    fontFamily: "system-ui, sans-serif",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  periodBtns: { display: "flex", gap: "4px" },
  periodBtn: (active) => ({
    padding: "6px 14px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "system-ui, sans-serif",
    fontWeight: "500",
    background: active ? C.latte : "transparent",
    color: active ? C.espresso : C.latte,
    transition: "all 0.15s",
  }),
  body: { padding: "24px 32px" },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: (accent) => ({
    background: "#fff",
    border: `0.5px solid ${C.border}`,
    borderRadius: "8px",
    padding: "16px 20px",
    borderTop: `3px solid ${accent}`,
  }),
  statLabel: {
    fontSize: "11px",
    fontFamily: "system-ui, sans-serif",
    color: C.muted,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "26px",
    fontWeight: "700",
    color: C.espresso,
    fontFamily: "'Georgia', serif",
    lineHeight: 1.1,
  },
  statChange: (pos) => ({
    fontSize: "12px",
    fontFamily: "system-ui, sans-serif",
    color: pos ? C.matcha : C.rose,
    marginTop: "4px",
    fontWeight: "500",
  }),
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  chartGrid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  card: {
    background: "#fff",
    border: `0.5px solid ${C.border}`,
    borderRadius: "8px",
    padding: "20px",
  },
  cardTitle: {
    fontSize: "13px",
    fontFamily: "system-ui, sans-serif",
    fontWeight: "600",
    color: C.espresso,
    marginBottom: "4px",
    letterSpacing: "0.02em",
  },
  cardSub: {
    fontSize: "11px",
    fontFamily: "system-ui, sans-serif",
    color: C.muted,
    marginBottom: "16px",
  },
  tableHead: {
    fontSize: "10px",
    fontFamily: "system-ui, sans-serif",
    color: C.muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0 0 8px",
    borderBottom: `0.5px solid ${C.border}`,
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: "12px",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: `0.5px solid ${C.paper}`,
  },
  menuName: {
    fontSize: "13px",
    fontFamily: "system-ui, sans-serif",
    color: C.espresso,
    fontWeight: "500",
  },
  menuQty: {
    fontSize: "13px",
    fontFamily: "system-ui, sans-serif",
    color: C.muted,
    textAlign: "right",
    minWidth: "40px",
  },
  menuRev: {
    fontSize: "13px",
    fontFamily: "'Georgia', serif",
    color: C.espresso,
    textAlign: "right",
    minWidth: "90px",
  },
  barLabel: {
    height: "4px",
    borderRadius: "2px",
    marginTop: "5px",
    background: C.paper,
    overflow: "hidden",
  },
  badge: (color, bg) => ({
    display: "inline-block",
    fontSize: "10px",
    fontFamily: "system-ui, sans-serif",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "99px",
    background: bg,
    color: color,
    letterSpacing: "0.04em",
  }),
};

// ── Data ──────────────────────────────────────────────────────────────
const revenueData = {
  "7H": [
    { day: "Sen", revenue: 2850000, orders: 87, avg: 32758 },
    { day: "Sel", revenue: 3120000, orders: 94, avg: 33191 },
    { day: "Rab", revenue: 2940000, orders: 89, avg: 33034 },
    { day: "Kam", revenue: 3380000, orders: 102, avg: 33137 },
    { day: "Jum", revenue: 4250000, orders: 128, avg: 33203 },
    { day: "Sab", revenue: 5180000, orders: 156, avg: 33205 },
    { day: "Min", revenue: 4920000, orders: 148, avg: 33243 },
  ],
  "30H": Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    revenue: 2500000 + Math.sin(i * 0.8) * 800000 + Math.random() * 600000 + (i % 7 >= 5 ? 1500000 : 0),
    orders: 80 + Math.floor(Math.sin(i * 0.8) * 25 + Math.random() * 20 + (i % 7 >= 5 ? 50 : 0)),
  })).map(d => ({ ...d, revenue: Math.round(d.revenue), avg: Math.round(d.revenue / d.orders) })),
};

const categoryData = [
  { name: "Minuman", value: 42, color: C.matcha },
  { name: "Makanan", value: 31, color: C.latte },
  { name: "Snack", value: 18, color: C.gold },
  { name: "Paket", value: 9, color: C.rose },
];

const hourlyData = [
  { jam: "07", orders: 12 }, { jam: "08", orders: 28 }, { jam: "09", orders: 45 },
  { jam: "10", orders: 38 }, { jam: "11", orders: 52 }, { jam: "12", orders: 89 },
  { jam: "13", orders: 94 }, { jam: "14", orders: 67 }, { jam: "15", orders: 71 },
  { jam: "16", orders: 83 }, { jam: "17", orders: 76 }, { jam: "18", orders: 68 },
  { jam: "19", orders: 55 }, { jam: "20", orders: 41 }, { jam: "21", orders: 22 },
];

const menuData = [
  { name: "Kopi Susu Gula Aren", qty: 312, revenue: 12480000, pct: 100 },
  { name: "Matcha Latte", qty: 287, revenue: 11480000, pct: 92 },
  { name: "Croissant Butter", qty: 241, revenue: 7230000, pct: 77 },
  { name: "Americano", qty: 198, revenue: 5940000, pct: 63 },
  { name: "Nasi Goreng Spesial", qty: 176, revenue: 7040000, pct: 56 },
  { name: "Es Teh Tarik", qty: 164, revenue: 4100000, pct: 52 },
  { name: "Sandwich Club", qty: 143, revenue: 5005000, pct: 46 },
];

const stokData = [
  { item: "Biji Kopi Arabika", stok: 12, min: 10, unit: "kg", status: "ok" },
  { item: "Susu Full Cream", stok: 8, min: 15, unit: "liter", status: "warning" },
  { item: "Matcha Powder", stok: 2, min: 5, unit: "kg", status: "kritis" },
  { item: "Gula Aren", stok: 25, min: 10, unit: "kg", status: "ok" },
  { item: "Tepung Terigu", stok: 4, min: 8, unit: "kg", status: "warning" },
];

// ── Helpers ───────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const fmtK = (n) => n >= 1000000 ? `Rp ${(n / 1000000).toFixed(1)}jt` : `Rp ${(n / 1000).toFixed(0)}rb`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.espresso, padding: "10px 14px", borderRadius: "6px", border: "none" }}>
      <div style={{ color: C.latte, fontSize: "11px", fontFamily: "system-ui", marginBottom: "4px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: C.cream, fontSize: "13px", fontFamily: "'Georgia', serif" }}>
          {p.name === "revenue" ? fmtK(p.value) : `${p.value} pesanan`}
        </div>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────
export default function DashboardKafe() {
  const [period, setPeriod] = useState("7H");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => { setAnimKey(k => k + 1); }, [period]);

  const data = revenueData[period];
  const totalRev = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const avgOrder = Math.round(totalRev / totalOrders);
  const bestDay = data.reduce((a, b) => b.revenue > a.revenue ? b : a);

  const stats = [
    { label: "Total Pendapatan", value: fmtK(totalRev), change: "+12.4% vs periode lalu", pos: true, accent: C.matcha },
    { label: "Total Pesanan", value: totalOrders.toLocaleString("id-ID"), change: "+8.7% vs periode lalu", pos: true, accent: C.latte },
    { label: "Rata-rata per Pesanan", value: fmt(avgOrder), change: "+3.2% vs periode lalu", pos: true, accent: C.gold },
    { label: "Hari Terbaik", value: bestDay.day, change: fmtK(bestDay.revenue), pos: true, accent: C.rose },
  ];

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.headerTitle}>Warung Kopi Nusantara</div>
          <div style={styles.headerSub}>Dashboard Analitik — April 2026</div>
        </div>
        <div style={styles.periodBtns}>
          {["7H", "30H"].map(p => (
            <button key={p} style={styles.periodBtn(period === p)} onClick={() => setPeriod(p)}>
              {p === "7H" ? "7 Hari" : "30 Hari"}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.body}>
        {/* Stat Cards */}
        <div style={styles.statGrid}>
          {stats.map((s, i) => (
            <div key={i} style={styles.statCard(s.accent)}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statChange(s.pos)}>
                {s.pos ? "▲" : "▼"} {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart + Pie */}
        <div style={styles.chartGrid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Tren Pendapatan & Pesanan</div>
            <div style={styles.cardSub}>Harian selama {period === "7H" ? "7 hari" : "30 hari"} terakhir</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart key={animKey} data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.matcha} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.matcha} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.paper} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.muted, fontFamily: "system-ui" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => fmtK(v)} tick={{ fontSize: 10, fill: C.muted, fontFamily: "system-ui" }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke={C.matcha} strokeWidth={2} fill="url(#gradRev)" dot={false} activeDot={{ r: 4, fill: C.matcha }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Komposisi Kategori</div>
            <div style={styles.cardSub}>Berdasarkan jumlah pesanan</div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={3}>
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: C.espresso, border: "none", borderRadius: "6px", color: C.cream, fontSize: "12px", fontFamily: "system-ui" }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
              {categoryData.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", fontFamily: "system-ui", color: C.espresso }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: "12px", fontFamily: "'Georgia', serif", fontWeight: "600", color: C.muted }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly + Menu */}
        <div style={styles.chartGrid2}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Jam Tersibuk</div>
            <div style={styles.cardSub}>Rata-rata pesanan per jam (hari kerja)</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hourlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.paper} vertical={false} />
                <XAxis dataKey="jam" tick={{ fontSize: 10, fill: C.muted, fontFamily: "system-ui" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.muted, fontFamily: "system-ui" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: C.espresso, border: "none", borderRadius: "6px", color: C.cream, fontSize: "12px", fontFamily: "system-ui" }} />
                <Bar dataKey="orders" name="Pesanan" radius={[3, 3, 0, 0]}>
                  {hourlyData.map((entry, i) => (
                    <Cell key={i} fill={entry.orders >= 80 ? C.latte : entry.orders >= 50 ? C.matcha : C.matchaLight} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stok Alert */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Peringatan Stok</div>
            <div style={styles.cardSub}>Item mendekati atau di bawah minimum</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {stokData.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < stokData.length - 1 ? `0.5px solid ${C.paper}` : "none" }}>
                  <div>
                    <div style={{ fontSize: "12px", fontFamily: "system-ui", fontWeight: "500", color: C.espresso }}>{s.item}</div>
                    <div style={{ fontSize: "11px", fontFamily: "system-ui", color: C.muted, marginTop: "1px" }}>
                      Stok: {s.stok} {s.unit} · Min: {s.min} {s.unit}
                    </div>
                  </div>
                  <span style={styles.badge(
                    s.status === "kritis" ? C.rose : s.status === "warning" ? C.gold : C.matcha,
                    s.status === "kritis" ? C.roseLight : s.status === "warning" ? C.goldLight : C.matchaLight
                  )}>
                    {s.status === "kritis" ? "KRITIS" : s.status === "warning" ? "HAMPIR HABIS" : "AMAN"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Terlaris */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Menu Terlaris</div>
          <div style={styles.cardSub}>Berdasarkan jumlah terjual periode ini</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "12px", ...styles.tableHead }}>
            <span>Nama Menu</span><span style={{ textAlign: "right" }}>Terjual</span><span style={{ textAlign: "right" }}>Pendapatan</span>
          </div>
          {menuData.map((m, i) => (
            <div key={i} style={styles.tableRow}>
              <div>
                <div style={styles.menuName}>{m.name}</div>
                <div style={styles.barLabel}>
                  <div style={{ height: "100%", width: `${m.pct}%`, background: i === 0 ? C.matcha : i === 1 ? C.latte : C.gold, borderRadius: "2px", transition: "width 0.6s ease" }} />
                </div>
              </div>
              <div style={styles.menuQty}>{m.qty.toLocaleString("id-ID")}</div>
              <div style={styles.menuRev}>{fmtK(m.revenue)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
