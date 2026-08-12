/* ============================================================================
   Racer UI — application module (shadcn-style component library + app)
   Provides reusable render helpers + hash-router + interactions.
   ========================================================================== */
(() => {
"use strict";

/* ============================== HELPERS ============================== */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad = n => String(n).padStart(2, "0");
const nowStamp = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
const fmtMs = v => v.toLocaleString("en-US");
const shortAgo = s => { const m = Math.max(1, Math.round(Date.now()/1000 - s)/60); return m<60 ? `${Math.round(m)}m ago` : `${Math.round(m/60)}h ago`; };

/* icon library (stroke icons, inherit currentColor) */
const I = {
  grid:`<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
  chart:`<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 14l4-4 3 3 6-6"/>`,
  rocket:`<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8-.8-.7-2-.7-3 0z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 13.8 3h4.7L16 7l2 2 4-2.5v4.7c0 .9-.3 1.9-1 2.6a22 22 0 0 1-3.9 2z"/>`,
  server:`<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>`,
  terminal:`<path d="M4 17l6-6-6-6"/><path d="M12 19h8"/>`,
  bell:`<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>`,
  gage:`<path d="M12 14l3-3"/><path d="M3.3 18a9 9 0 1 1 17.4 0"/>`,
  pulse:`<path d="M3 12h4l3 8 4-16 3 8h4"/>`,
  cpu:`<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2M8 8h8v8H8z"/>`,
  box:`<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3.3 7.3l8.7 4.7 8.7-4.7"/><path d="M12 12v9"/>`,
  clock:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>`,
  shield:`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  shieldWarn:`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4M12 15.5h.01"/>`,
  activity:`<path d="M22 12h-4l-3 8-4-16-3 8H2"/>`,
  search:`<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>`,
  sun:`<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  moon:`<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>`,
  plus:`<path d="M12 5v14M5 12h14"/>`,
  download:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>`,
  chev:`<path d="M6 9l6 6 6-6"/>`,
  check:`<path d="M20 6L9 17l-5-5"/>`,
  x:`<path d="M18 6L6 18M6 6l12 12"/>`,
  sparkle:`<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2L12 3z"/>`,
  refresh:`<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>`,
  filter:`<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z"/>`,
  key:`<path d="M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m3 3l2-2M13.5 5.5l2-2"/>`,
  globe:`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>`,
  user:`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  power:`<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>`,
  settings:`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  sliders:`<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>`,
  cloud:`<path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.5A3.5 3.5 0 0 0 7 19h10.5z"/>`,
  layers:`<path d="M12 2l10 6-10 6L2 8l10-6z"/><path d="M2 15l10 6 10-6"/>`,
  code:`<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>`,
  copy:`<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
  zap:`<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>`,
  db:`<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>`,
  layers2:`<path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>`,
  dollar:`<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  link:`<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>`,
  trash:`<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>`,
  git:`<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,
  eye:`<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>`,
  archive:`<path d="M21 8v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>`,
  warning:`<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>`,
  flag:`<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>`,
  card:`<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>`,
  lock:`<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  file:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>`,
  repeat:`<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>`,
  users:`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>`,
  globe2:`<circle cx="12" cy="12" r="9"/><path d="M2 12h20M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9z"/>`,
};
const icon = (name, size=16) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[name]||I.grid}</svg>`;

/* ============================== DESIGN TOKENS ============================== */
const T = {
  accent:"var(--accent)", info:"var(--info)", success:"var(--success)",
  warning:"var(--warning)", danger:"var(--danger)", muted:"var(--muted)"
};

/* ============================== DATA ============================== */
const state = {
  theme: localStorage.getItem("racer-theme") || "dark",
  route: location.hash.replace(/^#/, "") || "/overview",
  env: "prod",
  logLevels: new Set(["info","ok","warn","err","dbg"]),
  services: [
    { id:"api-gateway", v:"2.6.0", region:"us-east-1", status:"healthy", cpu:52, mem:"1.8G", req:8412, p95:38, err:0.01, ago:2,  icon:"rocket" },
    { id:"auth-svc",    v:"4.11.2",region:"us-east-1", status:"healthy", cpu:38, mem:"920M", req:3204, p95:44, err:0.02, ago:18, icon:"shield" },
    { id:"cache-edge",  v:"1.9.4", region:"eu-west-2", status:"degraded", cpu:81, mem:"6.1G", req:1940, p95:58, err:0.41, ago:41, icon:"zap" },
    { id:"db-primary",  v:"15.4",  region:"us-east-1", status:"healthy", cpu:66, mem:"24G", req:1204, p95:12, err:0.00, ago:60, icon:"db" },
    { id:"ingest-stream",v:"3.0.2",region:"ap-se-1", status:"healthy", cpu:47, mem:"2.2G", req:5112, p95:29, err:0.03, ago:120, icon:"cloud" },
    { id:"worker-queue",v:"3.7.0", region:"eu-west-2", status:"healthy", cpu:29, mem:"1.4G", req:812, p95:51, err:0.01, ago:180, icon:"box" },
    { id:"search-svc",  v:"1.4.1", region:"us-west-2", status:"degraded", cpu:74, mem:"3.5G", req:2890, p95:72, err:0.62, ago:240, icon:"search" },
    { id:"billing-api", v:"2.1.3", region:"us-east-1", status:"healthy", cpu:33, mem:"760M", req:431, p95:26, err:0.00, ago:300, icon:"dollar" },
    { id:"notify-svc",  v:"0.9.7", region:"eu-west-2", status:"healthy", cpu:21, mem:"410M", req:1502, p95:35, err:0.01, ago:360, icon:"bell" },
    { id:"webhook-relay",v:"5.2.0",region:"us-east-1", status:"healthy", cpu:44, mem:"1.1G", req:980, p95:41, err:0.02, ago:420, icon:"link" },
    { id:"registry",    v:"2.8.1", region:"us-west-2", status:"healthy", cpu:12, mem:"2.0G", req:210, p95:18, err:0.00, ago:480, icon:"archive" },
    { id:"edge-cdn",    v:"7.0.2", region:"global", status:"healthy", cpu:35, mem:"—", req:12480, p95:11, err:0.00, ago:600, icon:"globe" },
  ],
  incidents: [
    { id:"INC-2041", title:"Cache eviction latency in eu-west-2", sev:"major", status:"investigating", created:Date.now()/1000-2460, msg:"Elevated eviction rate on cache-edge shard 2; p95 increased 42→58ms.", progress:40, icon:"zap" },
    { id:"INC-2039", title:"Elevated 5xx on search-svc", sev:"minor", status:"monitoring", created:Date.now()/1000-8400, msg:"Canary briefly failed health checks; auto-reverted, watching recovery.", progress:75, icon:"warning" },
    { id:"INC-2035", title:"Planned maintenance: db-primary failover", sev:"none", status:"resolved", created:Date.now()/1000-36000, msg:"Routine failover completed without service impact.", progress:100, icon:"flag" },
  ],
  alerts: [
    { name:"High p95 latency", svc:"cache-edge", severity:"critical", threshold:"p95 > 55ms", window:"5m", status:"firing", since:Date.now()/1000-3600 },
    { name:"Error rate spike", svc:"search-svc", severity:"warning", threshold:"5xx > 0.5%", window:"10m", status:"firing", since:Date.now()/1000-5400 },
    { name:"Disk usage > 80%", svc:"db-primary", severity:"warning", threshold:"disk > 80%", window:"15m", status:"firing", since:Date.now()/1000-10800 },
    { name:"Instance down", svc:"worker-queue", severity:"critical", threshold:"instance unreachable", window:"1m", status:"resolved", since:Date.now()/1000-40000 },
    { name:"Memory pressure", svc:"ingest-stream", severity:"warning", threshold:"mem > 85%", window:"10m", status:"resolved", since:Date.now()/1000-90000 },
    { name:"Quota usage > 90%", svc:"workspace", severity:"info", threshold:"quota > 90%", window:"1h", status:"resolved", since:Date.now()/1000-160000 },
  ],
  deployments: [
    { id:"dep-9812", svc:"edge-gateway", v:"2.6.0", strategy:"rolling", status:"live",   sha:"a3f92c", branch:"main", ago:2,   region:"us-east-1" },
    { id:"dep-9811", svc:"auth-svc",     v:"4.11.2",strategy:"bluegreen", status:"ready", sha:"0fe7a1", branch:"release/4.x", ago:18, region:"us-east-1" },
    { id:"dep-9809", svc:"cache-edge",   v:"1.9.4", strategy:"canary", status:"rollback", sha:"b77dd0", branch:"main", ago:41, region:"eu-west-2" },
    { id:"dep-9806", svc:"ingest-stream",v:"3.0.1", strategy:"canary", status:"failed", sha:"52d1b0", branch:"main", ago:130, region:"ap-se-1" },
    { id:"dep-9802", svc:"worker-queue", v:"3.7.0", strategy:"rolling", status:"ready", sha:"19ccd3", branch:"main", ago:190, region:"eu-west-2" },
    { id:"dep-9798", svc:"db-primary",   v:"15.4",  strategy:"bluegreen", status:"ready", sha:"77be21", branch:"release/15.x", ago:300, region:"us-east-1" },
  ],
  regions: [
    { code:"us-east-1", lat:"38ms", nodes:[1,1,1,1,1,1,1,1] },
    { code:"eu-west-2", lat:"42ms", nodes:[1,1,1,1,1,1,0,1] },
    { code:"ap-se-1",   lat:"61ms", nodes:[1,1,1,1,1,1,1,1] },
    { code:"us-west-2", lat:"46ms", nodes:[1,1,0,1,1,2,1,1] },
  ],
  notifications: [
    { icon:"warning", color:"var(--warning)", b:"cache-edge degraded", p:"2 shards unstable in eu-west-2", t:"2m" },
    { icon:"rocket", color:"var(--accent)", b:"edge-gateway v2.6.0 live", p:"Rollout completed · 12/12 pods", t:"18m" },
    { icon:"check", color:"var(--success)", b:"auth-svc promoted", p:"Blue/green cutover complete", t:"41m" },
    { icon:"alert", color:"var(--danger)", b:"ingest-stream canary failed", p:"Auto-reverted to v3.0.0", t:"2h" },
  ],
  apiKeys: [
    { name:"CI/CD Deploy", key:"rk_live_9f2a•…•c31e", scope:["deploy","read"], created:Date.now()/1000-2592000, last:Date.now()/1000-1800, exp:Date.now()/1000+2592000*2, status:"active" },
    { name:"Terraform",     key:"rk_live_71bb•…•a0d2", scope:["read","write"], created:Date.now()/1000-7776000, last:Date.now()/1000-86400*3, exp:Date.now()/1000+2592000*3, status:"active" },
    { name:"Monitoring",    key:"rk_live_c44a•…•88f1", scope:["read"], created:Date.now()/1000-12960000, last:Date.now()/1000-3600, exp:Date.now()/1000+2592000, status:"active" },
    { name:"Legacy Worker", key:"rk_live_5d0b•…•44ae", scope:["deploy"], created:Date.now()/1000-15552000, last:Date.now()/1000-7776000, exp:Date.now()/1000-86400*10, status:"expiring" },
    { name:"Staging Bot",   key:"rk_test_00aa•…•1f7b", scope:["write"], created:Date.now()/1000-19008000, last:Date.now()/1000-86400*12, exp:Date.now()/1000-86400*30, status:"revoked" },
  ],
  budget: 8000,
  secret: null, /* holds one-time generated secret */
};
const LOGS = [
  {lvl:"info", msg:"<span class=\"hl\">api-gateway</span> healthy heartbeat · region us-east-1"},
  {lvl:"ok", msg:"rollout <span class=\"hl\">edge-gateway v2.6.0</span> progress 100% · 12/12"},
  {lvl:"warn", msg:"<span class=\"hl\">cache-edge</span> eviction rate above threshold · shard 2"},
  {lvl:"dbg", msg:"<span class=\"hl\">db-primary</span> checkpoint complete · wal segment 8123"},
  {lvl:"info", msg:"<span class=\"hl\">worker-queue</span> autoscaled 24 → 28 workers"},
  {lvl:"err", msg:"<span class=\"hl\">search-svc</span> canary rejected · 5xx burst"},
  {lvl:"ok", msg:"deployment <span class=\"hl\">auth-svc v4.11.2</span> promoted to production"},
  {lvl:"dbg", msg:"<span class=\"hl\">cache-edge</span> hit ratio 98.4% · miss 1.6%"},
  {lvl:"warn", msg:"latency p95 spiked to <span class=\"hl\">58ms</span> · eu-west-2"},
  {lvl:"info", msg:"<span class=\"hl\">edge-cdn</span> certificate renewed · expires +90d"},
];
state.logHistory = [...Array(6)].map(() => LOGS[Math.random()*LOGS.length|0]);

/* charts data */
const N = 80;
const hist = [];
for (let i=0;i<N;i++) hist.push({r: 9.2+Math.random()*5.4, l: 30+Math.random()*26});

/* ============================== SPARKLINE / CHART ============================== */
function sparkSVG(data, color, w=110, h=34, id){
  const min=Math.min(...data), max=Math.max(...data), span=(max-min)||1, p=3;
  const pts=data.map((v,i)=>[p+(i/(data.length-1))*(w-2*p), h-p-((v-min)/span)*(h-2*p)]);
  const line=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
  return `<svg ${id?`id="${id}"`:""} class="kpi-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${line}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/></svg>`;
}
function areaPath(data, w, h, p){
  const min=Math.min(...data), max=Math.max(...data), span=(max-min)||1;
  const xs=i=>p+(i/(data.length-1))*(w-2*p), ys=v=>h-p-((v-min)/span)*(h-2*p);
  const line=data.map((v,i)=>(i?"L":"M")+xs(i).toFixed(1)+","+ys(v).toFixed(1)).join(" ");
  return { line, area: line+` L${xs(data.length-1).toFixed(1)},${h-p} L${xs(0).toFixed(1)},${h-p} Z` };
}

/* ============================== SMALL UI BUILDERS ============================== */
/* ---------- extended component helpers ---------- */
function copyText(text, label){
  const done=()=>toast("success",(label||"Copied")+" to clipboard","", "check");
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,label));
  } else fallbackCopy(text,label);
}
function fallbackCopy(text,label){
  const ta=document.createElement("textarea"); ta.value=text; ta.style.position="fixed"; ta.style.opacity="0";
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); toast("success",(label||"Copied")+" to clipboard","", "check"); }catch(e){ toast("warning","Copy failed","Select manually to copy"); }
  ta.remove();
}
function donutSVG(segments, size=150, sw=22){
  const r=(size-sw)/2, c=2*Math.PI*r, cx=size/2, cy=size/2;
  let offset=0, paths="";
  segments.forEach(s=>{
    const len=(s.value/100)*c;
    paths+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="${len} ${c-len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>`;
    offset+=len;
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="flex:none">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--panel-3)" stroke-width="${sw}"/>
    ${paths}</svg>`;
}
function donutLegend(segments){
  return `<div class="donut-legend">`+segments.map(s=>`
    <div class="row"><i style="background:${s.color}"></i>${s.label}<b>${s.value}%</b></div>`).join("")+`</div>`;
}
function progressBar(pct, cls=""){
  return `<div class="progress ${cls}"><i style="width:${pct}%"></i></div>`;
}
function skeletonBox(h, w="100%", style=""){
  return `<div class="skeleton" style="height:${h}px;width:${w};${style}"></div>`;
}

const statusBadge = s => s==="healthy" ? `<span class="status status-success">healthy</span>`
  : s==="degraded" ? `<span class="status status-warning">degraded</span>`
  : s==="down" ? `<span class="status status-danger">down</span>`
  : `<span class="status status-muted">${s}</span>`;
const depBadge = s => ({ live:`<span class="badge badge-info">live</span>`, ready:`<span class="badge badge-success">ready</span>`,
  rollback:`<span class="badge badge-warning">rollback</span>`, failed:`<span class="badge badge-danger">failed</span>` }[s]||`<span class="badge badge-outline">${s}</span>`);
const sevBadge = s => s==="critical" ? `<span class="badge badge-danger">critical</span>`
  : s==="major" ? `<span class="badge badge-warning">major</span>`
  : s==="minor" ? `<span class="badge badge-info">minor</span>`
  : s==="warning" ? `<span class="badge badge-warning">warning</span>`
  : `<span class="badge badge-outline">${s}</span>`;
const incStatus = s => s==="investigating" ? `<span class="status status-warning">investigating</span>`
  : s==="monitoring" ? `<span class="status status-info">monitoring</span>`
  : `<span class="status status-success">resolved</span>`;

/* ============================== PAGES ============================== */
function kpis(){
  const sp = s => sparkSVG(s.data, s.color);
  const cells = [
    { name:"Uptime", icon:"shield", value:`99.991<span class="unit">%</span>`, delta:`<span class="delta delta-up">${icon("chev",11)} 0.04</span>`, data:hist.slice(20).map(()=>99.99+Math.random()*0.01), color:T.success },
    { name:"p95 Latency", icon:"clock", value:`<span id="latVal">42</span><span class="unit">ms</span>`, delta:`<span class="delta delta-up">${icon("chev",11)} 8.2%</span>`, data:hist.slice(20).map(d=>d.l), color:T.accent },
    { name:"Error Rate", icon:"warning", value:`<span id="errVal">0.02</span><span class="unit">%</span>`, delta:`<span class="delta delta-down">${icon("chev",11)} 0.01</span>`, data:hist.slice(20).map(()=>0.01+Math.random()*0.04), color:T.danger },
    { name:"Requests", icon:"activity", value:`<span id="reqVal">12.4</span><span class="unit">k/s</span>`, delta:`<span class="delta delta-up">${icon("chev",11)} 12.6%</span>`, data:hist.slice(20).map(d=>d.r), color:T.info },
  ].map(c=>`
    <div class="kpi">
      <div class="kpi-top">${icon(c.icon)}${c.name}</div>
      <div class="kpi-value">${c.value}</div>
      <div class="kpi-bottom">${c.delta}${sp(c)}</div>
    </div>`).join("");
  return `<div class="kpis">${cells}</div>`;
}

function trafficChart(){
  const w=600,h=200,p=6;
  const r=hist.map(d=>d.r), l=hist.map(d=>d.l);
  const pr=areaPath(r,w,h,p), pl=areaPath(l,w,h,p);
  const tip = `<div class="chart-tip" id="chartTip"></div>`;
  return `
  <div class="card">
    <div class="card-header">
      <div class="card-title">Traffic &amp; Latency <span class="chip">24h</span></div>
      <div class="legend-items" style="padding:0">
        <span><i style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${T.accent};margin-right:5px"></i>Requests/s</span>
        <span><i style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${T.info};margin-right:5px"></i>p95 latency</span>
      </div>
    </div>
    <div class="chart-wrap">
      <div class="chart" id="chartBox">
        ${tip}
        <div class="grid-h"></div>
        <svg id="mainChart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"></svg>
      </div>
    </div>
    <div class="legend-items">
      <span>req/s <b id="mReq">12,412</b></span>
      <span>p95 <b id="mLat">42ms</b></span>
      <span>peak <b>14.8k</b></span>
      <span style="margin-left:auto">min <b>9.2k</b></span>
    </div>
  </div>`;
}

function serviceHealthCard(){
  const rows = state.services.slice(0,6).map(s=>`
    <div class="svc-row">
      <div class="svc-icon">${icon(s.icon)}</div>
      <div class="svc-name"><b>${s.id}</b><span>${s.region} · ${s.req}</span></div>
      <div class="svc-right"><div class="pct" style="${s.status==='degraded'?`color:${T.warning}`:''}">${s.status==='degraded'?'98.2%':'99.9%'}</div>${statusBadge(s.status)}</div>
    </div>`).join("");
  return `
  <div class="card">
    <div class="card-header">
      <div class="card-title">Service Health</div>
      <div class="card-desc"><span class="status status-success">${state.services.filter(s=>s.status==='healthy').length} healthy</span></div>
    </div>
    <div class="svc" style="padding:4px 8px">${rows}
      <div class="svc-row" style="border-top:1px solid var(--border);border-radius:0">
        <div class="svc-name" style="color:var(--muted)"><span class="mono">+ ${state.services.length-6} more services</span></div>
        <a class="btn btn-sm btn-ghost" data-nav="/services" style="flex:none">View all ${icon("chev",12)}</a>
      </div>
    </div>
  </div>`;
}

function deploymentsFeed(){
  const rows = state.deployments.map(d=>`
    <div class="feed-item ${d.status==='rollback'?'warn':d.status==='failed'?'err':d.status==='live'?'deploy':''}">
      <div class="rail"><i></i></div>
      <div class="feed-body">
        <b>${d.svc} <span class="mono">v${d.v}</span></b>
        <p>${d.strategy} · ${d.region} · <span class="mono">#${d.sha}</span></p>
        <div class="feed-meta"><span class="sha">${d.branch}</span><span>·</span><span>${shortAgo(d.ago*60)}</span></div>
      </div>
      ${depBadge(d.status)}
    </div>`).join("");
  return `
  <div class="card">
    <div class="card-header">
      <div class="card-title">Recent Deployments</div>
      <a class="card-desc" data-nav="/deployments" style="cursor:pointer;color:var(--accent)">view all →</a>
    </div>
    <div class="feed">${rows}</div>
  </div>`;
}

function liveLog(){
  const lvls = ["info","ok","warn","err","dbg"].map(l=>{
    const on = state.logLevels.has(l);
    return `<button class="tab ${on?'active':''}" data-logtoggle="${l}">${l}</button>`;
  }).join("");
  return `
  <div class="card">
    <div class="card-header">
      <div class="card-title">Live Event Log</div>
      <div class="card-desc"><span class="status status-success">streaming</span></div>
    </div>
    <div class="log-tools" style="padding:10px 14px 0">
      <div class="tabs">${lvls}</div>
    </div>
    <div class="log" id="logBox" style="max-height:280px"></div>
  </div>`;
}

function regionsCard(){
  const r = state.regions.map(rg=>{
    const dots = rg.nodes.map(n=>n===1?`<i class="on"></i>`:n===0?`<i class="warn"></i>`:`<i class="dn"></i>`).join("");
    const up = rg.nodes.filter(n=>n===1).length, total=rg.nodes.length;
    return `<div class="region">
      <div class="top"><b>${rg.code}</b><span class="lat">${rg.lat} · ${up}/${total}</span></div>
      <div class="nodes">${dots}</div>
    </div>`;
  }).join("");
  return `
  <div class="card">
    <div class="card-header">
      <div class="card-title">Edge Regions</div>
      <div class="card-desc">node availability</div>
    </div>
    <div class="card-content" style="padding-top:14px"><div class="regions">${r}</div></div>
  </div>`;
}

function utilizationCard(){
  const bars = [
    ["CPU","avg across nodes",54,"var(--info)"],
    ["Memory","alloc / limit",71,"var(--accent)"],
    ["Disk I/O","persistent volumes",43,"var(--warning)"],
    ["Network","ingress / egress",38,"var(--success)"],
  ].map(b=>`
    <div class="svc-row">
      <div class="svc-name"><b>${b[0]}</b><span>${b[1]}</span></div>
      <div class="mini-bar"><div class="bar"><i style="width:${b[2]}%;background:${b[3]}"></i></div><span class="num">${b[2]}%</span></div>
    </div>`).join("");
  return `
  <div class="card">
    <div class="card-header">
      <div class="card-title">Cluster Utilization</div>
      <div class="card-desc">3 nodes · k8s</div>
    </div>
    <div class="card-content" style="padding:10px 16px">${bars}</div>
    <div class="card-content" style="padding-top:0">
      <a class="btn btn-outline btn-sm" style="width:100%;justify-content:center" data-nav="/metrics">Open metrics ${icon("chev",12)}</a>
    </div>
  </div>`;
}

function servicesTable(){
  const rows = state.services.map(s=>`
    <tr>
      <td><button class="svc-open" data-svcopen="${s.id}">${s.id}</button></td>
      <td class="mono-cell">${s.v}</td>
      <td class="mono-cell muted">${s.region}</td>
      <td>${statusBadge(s.status)}</td>
      <td><div class="mini-bar"><div class="bar"><i class="b-cpu" style="width:${s.cpu}%;background:${s.cpu>75?T.danger:s.cpu>60?T.warning:T.info}"></i></div><span class="num">${s.cpu}%</span></div></td>
      <td class="mono-cell">${s.mem}</td>
      <td class="mono-cell">${fmtMs(s.req)}/s</td>
      <td class="mono-cell">${s.p95}ms</td>
      <td class="mono-cell" style="color:${s.err>0.3?T.warning:s.err>0.05?T.info:T.success}">${s.err.toFixed(2)}%</td>
      <td class="mono-cell muted">${shortAgo(s.ago*60)}</td>
    </tr>`).join("");
  return `
  <div class="card">
    <div class="card-header">
      <div class="card-title">Services <span class="chip">${state.services.length}</span></div>
      <div class="page-actions">
        <a class="btn btn-sm btn-ghost" data-nav="/services">filter ${icon("filter",12)}</a>
        <a class="btn btn-sm btn-outline" data-nav="/services">open table ${icon("chev",12)}</a>
      </div>
    </div>
    <div class="table-scroll"><table class="table">
      <thead><tr><th>Service</th><th>Version</th><th>Region</th><th>Status</th><th>CPU</th><th>Mem</th><th>Requests</th><th>p95</th><th>Errors</th><th>Deployed</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>`;
}

function overviewPage(){
  return `
    <div class="page-head">
      <div><h1>Infrastructure Overview</h1>
        <p>Last 24h · <span class="mono">us-east-1</span>, <span class="mono">eu-west-2</span>, <span class="mono">ap-se-1</span></p></div>
      <div class="page-actions">
        <button class="btn" id="exportBtn">${icon("download")}Export</button>
        <button class="btn btn-primary" id="newDeployBtn">${icon("plus")}New Deployment</button>
      </div>
    </div>
    ${kpis()}
    <div class="grid">
      ${trafficChart()}
      ${serviceHealthCard()}
    </div>
    <div class="grid">
      ${deploymentsFeed()}
      ${liveLog()}
    </div>
    <div class="grid">
      ${regionsCard()}
      ${utilizationCard()}
    </div>
    ${servicesTable()}
    ${foot()}`;
}

function incidentsPage(){
  const open = state.incidents.filter(i=>i.status!=="resolved");
  const cards = state.incidents.map(i=>`
    <div class="incident">
      <div class="inc-head">
        <span class="badge badge-outline">${i.id}</span>
        ${sevBadge(i.sev)}
        <span class="inc-title">${i.title}</span>
        ${incStatus(i.status)}
      </div>
      <p class="muted" style="margin-top:7px;font-size:12px">${i.msg}</p>
      <div class="inc-meta"><span>${icon("clock",12)} ${shortAgo(i.created)}</span><span>·</span><span>owner: on-call</span></div>
      <div class="inc-progress"><i style="width:${i.progress}%"></i></div>
    </div>`).join("");
  return `
    <div class="page-head">
      <div><h1>Incidents</h1><p>${open.length} active · 1 resolved this week</p></div>
      <div class="page-actions"><button class="btn" id="declareIncBtn">${icon("plus")}Declare</button><button class="btn btn-outline">${icon("clock")}History</button></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Active &amp; recent</div>
        <div class="card-desc">${open.length} active</div></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:10px;padding-top:14px">${cards}
        <button class="btn btn-ghost" id="ackAllBtn" style="align-self:flex-start">${icon("check")}Acknowledge all</button>
      </div>
    </div>${foot()}`;
}

function deploymentsPage(){
  const rows = state.deployments.map(d=>`
    <tr>
      <td class="mono-cell" style="color:var(--muted)">${d.id}</td>
      <td><span class="mono" style="color:var(--foreground);font-weight:600">${d.svc}</span></td>
      <td class="mono-cell">v${d.v}</td>
      <td class="mono-cell">${d.branch} · <span class="muted">#${d.sha}</span></td>
      <td><span class="badge badge-outline">${d.strategy}</span></td>
      <td>${depBadge(d.status)}</td>
      <td class="mono-cell muted">${d.region}</td>
      <td class="mono-cell muted">${shortAgo(d.ago*60)}</td>
      <td><button class="btn btn-sm btn-ghost" data-rollback="${d.id}">rollback</button></td>
    </tr>`).join("");
  return `
    <div class="page-head">
      <div><h1>Deployments</h1><p>gitflow · 24 pipeline runs today</p></div>
      <div class="page-actions"><button class="btn btn-primary" id="newDeployBtn">${icon("plus")}New Deployment</button></div>
    </div>
    <div class="page-actions" style="margin-bottom:12px">
      <div class="tabs"><button class="tab active">All</button><button class="tab">Active</button><button class="tab">Completed</button><button class="tab">Failed</button></div>
      <a class="btn btn-sm btn-ghost" data-nav="/overview">back ${icon("chev",12)}</a>
    </div>
    <div class="card">
      <div class="table-scroll"><table class="table">
        <thead><tr><th>ID</th><th>Service</th><th>Version</th><th>Ref</th><th>Strategy</th><th>Status</th><th>Region</th><th>When</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>${foot()}`;
}

function servicesPage(){
  const rows = state.services.map(s=>`
    <tr>
      <td><button class="svc-open" data-svcopen="${s.id}">${s.id}</button></td>
      <td class="mono-cell">${s.v}</td>
      <td class="mono-cell muted">${s.region}</td>
      <td>${statusBadge(s.status)}</td>
      <td><div class="mini-bar"><div class="bar"><i style="width:${s.cpu}%;background:${s.cpu>75?T.danger:s.cpu>60?T.warning:T.info}"></i></div><span class="num">${s.cpu}%</span></div></td>
      <td class="mono-cell">${s.mem}</td>
      <td class="mono-cell">${fmtMs(s.req)}/s</td>
      <td class="mono-cell">${s.p95}ms</td>
      <td class="mono-cell" style="color:${s.err>0.3?T.warning:s.err>0.05?T.info:T.success}">${s.err.toFixed(2)}%</td>
      <td><a class="btn btn-sm btn-ghost" data-nav="/logs">logs ${icon("terminal",12)}</a></td>
    </tr>`).join("");
  return `
    <div class="page-head">
      <div><h1>Services</h1><p>${state.services.length} running across 4 regions</p></div>
      <div class="page-actions">
        <div class="search" style="position:static;margin:0;max-width:240px">${icon("search")}<input id="svcSearch" class="input" style="height:28px;border:none;background:none;padding:0" placeholder="Filter services…"></div>
        <button class="btn" id="exportBtn">${icon("download")}Export</button>
      </div>
    </div>
    <div class="page-actions" style="margin-bottom:12px">
      <div class="tabs" id="statusFilter">
        <button class="tab active" data-sf="all">All</button>
        <button class="tab" data-sf="healthy">Healthy</button>
        <button class="tab" data-sf="degraded">Degraded</button>
      </div>
    </div>
    <div class="card">
      <div class="table-scroll"><table class="table" id="svcTable">
        <thead><tr><th class="sortable" data-k="id">Service</th><th>Version</th><th class="sortable" data-k="region">Region</th><th>Status</th><th class="sortable" data-k="cpu">CPU</th><th>Mem</th><th class="sortable" data-k="req">Requests</th><th class="sortable" data-k="p95">p95</th><th class="sortable" data-k="err">Errors</th><th></th></tr></thead>
        <tbody id="svcTbody">${rows}</tbody>
      </table></div>
    </div>${foot()}`;
}

function logsPage(){
  const lvls = ["all","info","ok","warn","err","dbg"].map(l=>{
    const on = l==="all"||state.logLevels.has(l);
    return `<button class="tab ${on?'active':''}" data-logtoggle="${l}">${l}</button>`;
  }).join("");
  return `
    <div class="page-head">
      <div><h1>Logs</h1><p>Streaming from all services · last 15 min</p></div>
      <div class="page-actions">
        <div class="search" style="position:static;margin:0;max-width:220px">${icon("search")}<input id="logSearch" class="input" style="height:28px;border:none;background:none;padding:0" placeholder="Filter log text…"></div>
        <button class="btn" id="pauseLogs">${icon("eye")}Pause</button>
        <button class="btn btn-outline" id="clearLogs">${icon("trash")}Clear</button>
      </div>
    </div>
    <div class="card" style="height:calc(100vh - 230px)">
      <div class="card-header">
        <div class="card-title">Event stream <span class="chip" id="logCount">0</span></div>
        <div class="log-tools"><div class="tabs">${lvls}</div></div>
      </div>
      <div class="log" id="logBox2"></div>
    </div>${foot()}`;
}

function metricsPage(){
  const series = [
    ["Requests / second", [12.4,13.1,12.8,14.2,13.6,12.9,14.8,14.1,13.3,12.4,11.8,12.2,13.9,14.4,13.8,12.6], T.accent],
    ["p95 Latency (ms)", [42,45,40,55,62,58,44,41,39,43,48,52,46,40,38,41], T.info],
    ["Error rate (%)", [0.02,0.02,0.03,0.05,0.41,0.22,0.04,0.02,0.02,0.03,0.06,0.1,0.05,0.03,0.02,0.02], T.danger],
    ["CPU utilization (%)", [52,55,49,61,66,58,54,57,51,48,53,59,62,57,55,54], T.warning],
  ];
  const charts = series.map(s=>{
    const w=400,h=120,p=6;
    const {line,area}=areaPath(s[1],w,h,p);
    return `<div class="card">
      <div class="card-header"><div class="card-title">${s[0]}</div><div class="card-desc">15m</div></div>
      <div class="chart-wrap" style="padding:14px 16px 14px">
        <div class="chart" style="height:120px">
          <div class="grid-h"></div>
          <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
            <defs><linearGradient id="mg${s[0].replace(/\W/g,'')}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${s[2]}" stop-opacity=".3"/><stop offset="100%" stop-color="${s[2]}" stop-opacity="0"/></linearGradient></defs>
            <path d="${area}" fill="url(#mg${s[0].replace(/\W/g,'')})" stroke="none"/>
            <path d="${line}" fill="none" stroke="${s[2]}" stroke-width="2"/>
          </svg>
        </div>
      </div>
    </div>`;
  }).join("");
  return `
    <div class="page-head">
      <div><h1>Metrics</h1><p>Infrastructure telemetry · auto-refresh 10s</p></div>
      <div class="page-actions">
        <div class="tabs"><button class="tab active">15m</button><button class="tab">1h</button><button class="tab">24h</button><button class="tab">7d</button></div>
      </div>
    </div>
    <div class="grid-3">${charts}</div>
    <div class="card">
      <div class="card-header"><div class="card-title">Grafana</div><div class="card-desc">linked workspace</div></div>
      <div class="card-content">
        <div class="empty">
          <div class="ic">${icon("chart")}</div>
          <b>Embed dashboards from your observability stack</b>
          <p>Connect Grafana or Datadog to render custom panels inline.</p>
          <a class="btn btn-outline btn-sm" style="margin-top:6px" data-nav="/settings">Open Integrations</a>
        </div>
      </div>
    </div>${foot()}`;
}

function alertsPage(){
  const rows = state.alerts.map(a=>`
    <tr>
      <td><span class="mono" style="color:var(--foreground);font-weight:600">${a.name}</span><div class="mono muted" style="font-size:10.5px">${a.svc}</div></td>
      <td>${sevBadge(a.severity)}</td>
      <td class="mono-cell muted">${a.threshold}</td>
      <td class="mono-cell muted">${a.window}</td>
      <td>${a.status==="firing"?`<span class="badge badge-danger">firing</span>`:`<span class="badge badge-success">resolved</span>`}</td>
      <td class="mono-cell muted">${shortAgo(a.since)}</td>
      <td><button class="btn btn-sm btn-ghost" data-alertack="${a.name}">${a.status==="firing"?"acknowledge":"mute"}</button></td>
    </tr>`).join("");
  return `
    <div class="page-head">
      <div><h1>Alerts</h1><p>${state.alerts.filter(a=>a.status==="firing").length} firing</p></div>
      <div class="page-actions"><button class="btn" id="silenceBtn">${icon("bell")}Silence all</button><a class="btn btn-outline" data-nav="/settings">${icon("settings")}Rule groups</a></div>
    </div>
    <div class="card">
      <div class="table-scroll"><table class="table">
        <thead><tr><th>Alert</th><th>Severity</th><th>Condition</th><th>Window</th><th>Status</th><th>Since</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>${foot()}`;
}

function settingsPage(){
  const rows = [
    ["Appearance", `Theme mode`, true, state.theme==="dark", ()=>toggleTheme()],
    ["Live telemetry", "Stream realtime metrics and logs", true, true, ()=>toast("info","Telemetry","Live stream is always on")],
    ["Email notifications", "Alert and incident digests", true, true, ()=>toast("success","Saved","Notification preferences updated")],
    ["Slack webhook", "Post alerts to #incidents", true, true, ()=>toast("success","Saved","Webhook delivery enabled")],
    ["Incident auto-acknowledge", "Auto-ack after 10 minutes", true, false, ()=>toast("success","Saved","Setting updated")],
  ];
  const toggles = rows.map((r,i)=>`
    <div class="setting-row">
      <div class="s-body"><b>${r[0]}</b><p>${r[1]}</p></div>
      <div class="s-ctl"><label class="switch"><input type="checkbox" data-setting="${i}" ${r[3]?"checked":""}><span class="track"></span><span class="thumb"></span></label></div>
    </div>`).join("");
  return `
    <div class="page-head">
      <div><h1>Settings</h1><p>Workspace · preferences · integrations</p></div>
    </div>
    <div class="grid">
      <div class="card">
        <div class="card-header"><div class="card-title">Preferences</div></div>
        <div class="card-content" style="padding:4px 16px">${toggles}</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Integrations</div></div>
        <div class="card-content">
          <div class="svc-row">
            <div class="svc-icon">${icon("link")}</div>
            <div class="svc-name"><b>Grafana</b><span>metrics · connected</span></div>
            <button class="btn btn-sm btn-ghost" data-int="Grafana">${icon("check")}Connected</button>
          </div>
          <div class="svc-row">
            <div class="svc-icon">${icon("bell")}</div>
            <div class="svc-name"><b>Slack</b><span>#incidents · connected</span></div>
            <button class="btn btn-sm btn-ghost" data-int="Slack">${icon("check")}Connected</button>
          </div>
          <div class="svc-row">
            <div class="svc-icon">${icon("terminal")}</div>
            <div class="svc-name"><b>PagerDuty</b><span>on-call rotation</span></div>
            <button class="btn btn-sm btn-outline" data-int="PagerDuty">Connect</button>
          </div>
          <div class="svc-row">
            <div class="svc-icon">${icon("code")}</div>
            <div class="svc-name"><b>GitHub</b><span>deploy hooks</span></div>
            <button class="btn btn-sm btn-outline" data-int="GitHub">Connect</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Danger zone</div></div>
      <div class="card-content">
        <div class="setting-row">
          <div class="s-body"><b>Delete workspace</b><p>This will remove all services, deployments and telemetry. Irreversible.</p></div>
          <button class="btn btn-danger btn-sm" id="dangerBtn">Delete workspace</button>
        </div>
      </div>
    </div>${foot()}`;
}

const foot = () => `
  <div class="foot">
    <div class="live"><span class="live-dot"></span>Telemetry connected · streaming realtime</div>
    <div id="clock">—</div>
  </div>`;

/* ============================== COMPONENTS GALLERY ============================== */
function componentsPage(){
  const btnVariants = ["btn","btn-primary","btn-outline","btn-soft","btn-ghost","btn-danger"].map(c=>
    `<button class="btn ${c}">${icon("zap",13)}${c.replace("btn","").replace(/-/," ")||"default"}</button>`).join("")+" "+
    `<button class="btn btn-sm btn-outline">sm</button> <button class="btn btn-sm btn-primary">sm primary</button> <button class="btn btn-icon btn-outline" data-tip="Icon button">${icon("download")}</button>`;
  const badges = [`<span class="badge badge-success">healthy</span>`,`<span class="badge badge-warning">degraded</span>`,`<span class="badge badge-danger">down</span>`,`<span class="badge badge-info">live</span>`,`<span class="badge badge-accent">beta</span>`,`<span class="badge badge-outline">read-only</span>`].join(" ");
  const statuses = [`<span class="status status-success">healthy</span>`,`<span class="status status-warning">degraded</span>`,`<span class="status status-danger">down</span>`,`<span class="status status-info">streaming</span>`,`<span class="status status-muted">idle</span>`].join("  ");
  const heat = Array.from({length:14*8},()=>`<i class="${["hm-0","hm-0","hm-1","hm-1","hm-2","hm-3","hm-4"][Math.random()*7|0]}"></i>`).join("");
  return `
  <div class="page-head">
    <div><h1>Components</h1><p>The Racer UI library — copy-paste design-system primitives (shadcn-style)</p></div>
    <div class="page-actions"><button class="btn btn-ghost" id="copyLib">${icon("copy")}copy palette</button></div>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-header"><div class="card-title">Buttons <span class="chip">.btn</span></div></div>
      <div class="card-content" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">${btnVariants}</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Badges &amp; Status <span class="chip">.badge .status</span></div></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${badges}</div>
        <div style="display:flex;gap:14px;flex-wrap:wrap">${statuses}</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Form controls <span class="chip">.input .select .switch</span></div></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:12px">
        <div class="form-row">
          <label class="field">Email<input class="input" placeholder="you@company.com"></label>
          <label class="field">Region<select class="select"><option>us-east-1</option><option>eu-west-2</option><option>ap-se-1</option></select></label>
        </div>
        <label class="field">Deploy note<textarea placeholder="Describe this release…"></textarea></label>
        <div class="form-row">
          <div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:12.5px;font-weight:600">Enable auto-scale</span><label class="switch"><input type="checkbox" checked><span class="track"></span><span class="thumb"></span></label></div>
          <label class="field" style="justify-content:center">Copier
            <div class="input-group"><input class="input" id="copyDemo" value="rk_live_9f2a8c" readonly><button class="btn" id="copyDemoBtn">${icon("copy")}</button></div>
          </label>
        </div>
        <label class="field">Budget slider<input type="range" id="sliderDemo" min="0" max="100" value="62" style="margin-top:2px"></label>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Feedback <span class="chip">.progress .skeleton</span></div></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;flex-direction:column;gap:6px"><span class="muted" style="font-size:11px">Determinate</span>${progressBar(72)}${progressBar(41,"")}${progressBar(88,"")}</div>
        <div style="display:flex;flex-direction:column;gap:6px"><span class="muted" style="font-size:11px">Indeterminate</span>${progressBar(50,"indeterminate")}</div>
        <div style="display:flex;flex-direction:column;gap:6px"><span class="muted" style="font-size:11px">Skeleton</span>
          <div style="display:flex;gap:10px;align-items:center">${skeletonBox(40,40,"border-radius:8px")}<div style="flex:1;display:flex;flex-direction:column;gap:7px">${skeletonBox(10,"80%")}${skeletonBox(10,"55%")}</div></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Data viz <span class="chip">.donut .heatmap</span></div></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:18px">
        <div class="donut-wrap">
          ${donutSVG([{value:68,color:"var(--success)"},{value:17,color:"var(--accent)"},{value:11,color:"var(--warning)"},{value:4,color:"var(--danger)"}])}
          ${donutLegend([{label:"Healthy",value:68,color:"var(--success)"},{label:"Degraded",value:17,color:"var(--accent)"},{label:"Warn",value:11,color:"var(--warning)"},{label:"Down",value:4,color:"var(--danger)"}])}
        </div>
        <div><span class="muted" style="font-size:11px">Activity · 14 days</span><div class="heatmap" style="margin-top:7px">${heat}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Overlays &amp; layout <span class="chip">.tabs .accordion .dialog .menu</span></div></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <div class="tabs"><button class="tab active">Overview</button><button class="tab">Metrics</button><button class="tab">Logs</button></div>
          <div class="avatar-stack"><div class="avatar">AK</div><div class="avatar" style="background:linear-gradient(135deg,#34d399,#0ea5e9)">JM</div><div class="avatar" style="background:linear-gradient(135deg,#f59e0b,#a78bfa)">RS</div><div class="avatar" style="background:var(--panel-3);color:var(--muted)">+4</div></div>
          <button class="btn btn-sm btn-outline" data-tip="Hover tooltip">tooltip ${icon("eye",12)}</button>
          <button class="btn btn-sm btn-outline" data-toastdemo>${icon("bell",12)}toast</button>
          <button class="btn btn-sm btn-outline" data-dialogdemo>${icon("rocket",12)}dialog</button>
        </div>
        <div class="accordion">
          ${["What is Racer UI?","Is it themeable?","How do I add a page?"].map((t,i)=>`
          <div class="acc-item">
            <button class="acc-trigger">${t}${icon("chev",14)}</button>
            <div class="acc-body">A lightweight, dependency-free design system with semantic tokens. Flip <code>data-theme</code> on <code>&lt;html&gt;</code> to switch dark/light. Add a route in <code>app.js</code> and a nav entry — every component is token-driven.</div>
          </div>`).join("")}
        </div>
      </div>
    </div>
  </div>${foot()}`;
}

/* ============================== SECURITY / API KEYS ============================== */
function securityPage(){
  const keys = state.apiKeys;
  const active = keys.filter(k=>k.status==="active").length;
  const expiring = keys.filter(k=>k.status==="expiring").length;
  const rows = keys.map(k=>`
    <tr>
      <td><span class="mono" style="color:var(--foreground);font-weight:600">${k.name}</span></td>
      <td><div class="input-group" style="max-width:230px"><input class="input" id="key_${esc(k.name)}" value="${k.key}" readonly><button class="btn" data-copykey="${esc(k.name)}">${icon("copy")}</button></div></td>
      <td>${k.scope.map(s=>`<span class="badge badge-outline" style="margin-right:4px">${s}</span>`).join("")}</td>
      <td class="mono-cell muted">${shortAgo(k.created)}</td>
      <td class="mono-cell muted">${shortAgo(k.last)}</td>
      <td>${k.status==="active"?"<span class=\"badge badge-success\">active</span>":k.status==="expiring"?"<span class=\"badge badge-warning\">expiring</span>":"<span class=\"badge badge-outline\">revoked</span>"}</td>
      <td><button class="btn btn-sm btn-ghost" data-revealkey="${esc(k.name)}">${icon("eye",13)}</button>
          <button class="btn btn-sm btn-ghost" data-revokekey="${esc(k.name)}" style="color:var(--danger)">${icon("trash",13)}</button></td>
    </tr>`).join("");
  return `
  <div class="page-head">
    <div><h1>Security &amp; API Keys</h1><p>Authenticate automation against the Racer control plane</p></div>
    <div class="page-actions"><button class="btn btn-primary" id="genKeyBtn">${icon("plus")}Generate key</button></div>
  </div>
  <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
    <div class="stat-tile"><div class="label">Total keys</div><div class="value">${keys.length}</div></div>
    <div class="stat-tile"><div class="label">Active</div><div class="value" style="color:var(--success)">${active}</div></div>
    <div class="stat-tile"><div class="label">Expiring ≤ 30d</div><div class="value" style="color:var(--warning)">${expiring}</div></div>
    <div class="stat-tile"><div class="label">Revoked</div><div class="value" style="color:var(--muted)">${keys.filter(k=>k.status==="revoked").length}</div></div>
  </div>
  <div class="grid" style="grid-template-columns:1fr 1fr">
    <div class="card">
      <div class="card-header"><div class="card-title">Keys</div><div class="card-desc">${active} active · rotate regularly</div></div>
      <div class="table-scroll"><table class="table">
        <thead><tr><th>Name</th><th>Key</th><th>Scopes</th><th>Created</th><th>Last used</th><th>Status</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Security posture</div></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:16px">
        ${[["MFA enrollment",92,"var(--success)"],["Secrets rotation",64,"var(--accent)"],["SSO coverage",81,"var(--info)"],["Dormant keys cleanup",45,"var(--warning)"]].map(s=>`
          <div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px"><b>${s[0]}</b><span class="mono muted">${s[1]}%</span></div>${progressBar(s[1])}</div>`).join("")}
        <div class="detail-grid">
          <div class="detail-item"><div class="k">Next rotation</div><div class="v">12 Aug 2026</div></div>
          <div class="detail-item"><div class="k">Active sessions</div><div class="v">18</div></div>
          <div class="detail-item"><div class="k">2FA</div><div class="v" style="color:var(--success)">enabled</div></div>
          <div class="detail-item"><div class="k">Trusted IPs</div><div class="v">6 / 8</div></div>
        </div>
      </div>
    </div>
  </div>${foot()}`;
}

/* ============================== COSTS / BILLING ============================== */
function costsPage(){
  const b=state.budget;
  const mtd=6240, forecast=7230;
  const pct=Math.min(100,Math.round(mtd/b*100));
  const spend = [[210,415,380,520,460,610,545,690,475,530,590,615],[12.1,12.3,12.4,12.2,12.5,12.4,12.6,12.3,12.4,12.5,12.2,12.6]];
  const w=600,h=160,p=8;
  const data=spend[0];
  const barW=(w-2*p)/data.length;
  const max=Math.max(...data);
  const bars=data.map((v,i)=>`<rect x="${p+i*barW+barW*0.18}" y="${h-p-(v/max)*(h-2*p)}" width="${barW*0.64}" height="${(v/max)*(h-2*p)}" rx="3" fill="url(#gbill)"/>`).join("");
  const bySvc = [["edge-cdn",1980],["api-gateway",1240],["db-primary",960],["ingest-stream",740],["search-svc",520],["other",800]].map(s=>{
    const wv=Math.round(s[1]/ (mtd/100)); return `
    <div class="svc-row">
      <div class="svc-name"><b>${s[0]}</b><span>${Math.round(s[1]/mtd*100)}% of spend</span></div>
      <div style="flex:1"><div class="progress" style="height:6px"><i style="width:${Math.min(100,Math.round(s[1]/1980*100))}%"></i></div></div>
      <span class="mono" style="font-size:12px;font-weight:600;flex:none">$${s[1].toLocaleString()}</span>
    </div>`;}).join("");
  return `
  <div class="page-head">
    <div><h1>Costs &amp; Billing</h1><p>August 2026 · last 12 months</p></div>
    <div class="page-actions"><button class="btn" id="invoiceBtn">${icon("download")}Download invoice</button><button class="btn btn-outline" data-nav="/settings">${icon("card")}Payment methods</button></div>
  </div>
  <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
    <div class="stat-tile"><div class="label">MTD spend</div><div class="value">$${mtd.toLocaleString()}</div></div>
    <div class="stat-tile"><div class="label">Forecast</div><div class="value">$${forecast.toLocaleString()}</div></div>
    <div class="stat-tile"><div class="label">Budget</div><div class="value">$${b.toLocaleString()}</div></div>
    <div class="stat-tile"><div class="label">Saved (commits)</div><div class="value" style="color:var(--success)">-$1,240</div></div>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-header"><div class="card-title">Spend</div><div class="card-desc">monthly · USD</div></div>
      <div class="chart-wrap" style="min-height:0">
        <div class="chart" style="height:160px">
          <div class="grid-h"></div>
          <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
            <defs><linearGradient id="gbill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${T.accent}"/><stop offset="100%" stop-color="${T.info}"/></linearGradient></defs>
            ${bars}
          </svg>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Budget tracking</div><div class="card-desc">monthly</div></div>
      <div class="card-content" style="display:flex;flex-direction:column;gap:18px">
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><b>Spent</b><span class="mono">$${mtd.toLocaleString()} / $${b.toLocaleString()} · <b style="color:${pct>90?T.danger:pct>75?T.warning:T.success}">${pct}%</b></span></div>
          ${progressBar(pct, pct>90?"":pct>75?"":"")}
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:5px"><span>remaining $${(b-mtd).toLocaleString()}</span><span>forecast ${Math.round(forecast/b*100)}%</span></div>
        </div>
        <label class="field" style="font-size:11px">Monthly budget
          <div style="display:flex;gap:12px;align-items:center">
            <input type="range" id="budgetSlider" min="4000" max="14000" step="500" value="${b}" style="flex:1">
            <input class="input" id="budgetVal" style="width:90px;text-align:center" value="$${b.toLocaleString()}">
          </div></label>
        <div class="detail-grid">
          <div class="detail-item"><div class="k">Forecast variance</div><div class="v" style="color:var(--warning)">+15.8%</div></div>
          <div class="detail-item"><div class="k">Budget alerts</div><div class="v" style="color:var(--success)">on</div></div>
        </div>
      </div>
    </div>
  </div>
  <div class="grid">
    <div class="card">
      <div class="card-header"><div class="card-title">Cost by service</div></div>
      <div class="card-content" style="padding:6px 16px">${bySvc}</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Invoices</div><div class="card-desc">4 available</div></div>
      <div class="table-scroll"><table class="table">
        <thead><tr><th>Period</th><th>Amount</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${["Jul 2026","Jun 2026","May 2026","Apr 2026"].map((p,i)=>`<tr>
            <td class="mono-cell">${p}</td><td class="mono-cell">$${i===0?6140:5870}${i===2?".50":""}</td>
            <td><span class="badge badge-success">paid</span></td>
            <td><button class="btn btn-sm btn-ghost" data-inv="${p}">${icon("download",13)}pdf</button></td>
          </tr>`).join("")}
        </tbody>
      </table></div>
    </div>
  </div>${foot()}`;
}

/* ============================== ROUTER ============================== */
const routes = {
  "/overview":{ title:"Overview", render:overviewPage, crumb:"Infrastructure / Overview" },
  "/incidents":{ title:"Incidents", render:incidentsPage, crumb:"Operations / Incidents" },
  "/deployments":{ title:"Deployments", render:deploymentsPage, crumb:"Operations / Deployments" },
  "/services":{ title:"Services", render:servicesPage, crumb:"Workspace / Services" },
  "/logs":{ title:"Logs", render:logsPage, crumb:"Observability / Logs" },
  "/metrics":{ title:"Metrics", render:metricsPage, crumb:"Observability / Metrics" },
  "/alerts":{ title:"Alerts", render:alertsPage, crumb:"Observability / Alerts" },
  "/security":{ title:"Security", render:securityPage, crumb:"Workspace / Security" },
  "/costs":{ title:"Costs", render:costsPage, crumb:"Operations / Costs" },
  "/components":{ title:"Components", render:componentsPage, crumb:"Library / Components" },
  "/settings":{ title:"Settings", render:settingsPage, crumb:"Workspace / Settings" },
};
const navMap = {
  grid:"/overview", chart:"/metrics", rocket:"/deployments", server:"/services",
  terminal:"/logs", bell:"/alerts", gage:"/metrics", pulse:"/metrics",
  sliders:"/settings", user:"/settings", cloud:"/services", layers:"/overview",
  lock:"/security", card:"/costs", box:"/components",
};

function render(){
  const route = state.route;
  const def = routes[route] || routes["/overview"];
  $("#view").innerHTML = def.render();
  $$("#nav [data-nav]").forEach(a=>a.classList.toggle("active", a.dataset.nav===route));
  $("#crumb").innerHTML = def.crumb;
  document.title = def.title + " · Racer";
  $("#sidebar").classList.remove("open");
  bindPage(route);
  setupChart();
  seedLog();
  updateClock();
  if (route==="/logs") updateLogCount();
}

function navigate(path){
  state.route = path;
  const ov=$("#loadOverlay");
  if(ov) ov.classList.add("on");
  if(location.hash!=="#"+path){ location.hash = path; } else render();
  if(ov) setTimeout(()=>ov.classList.remove("on"),220);
}

/* ============================== PAGE BINDINGS ============================== */
function bindPage(route){
  // nav
  $$("[data-nav]").forEach(a=>{ if(!a._h){ a._h=true; a.addEventListener("click",e=>{e.preventDefault();navigate(a.dataset.nav);}); }});
  // open service detail
  $$("[data-svcopen]").forEach(b=>{ if(!b._h){ b._h=true; b.addEventListener("click",()=>openServiceDetail(b.dataset.svcopen)); }});
  // global modals / buttons present on multiple pages
  const nd = $("#newDeployBtn"); if(nd && !nd._h){ nd._h=true; nd.addEventListener("click",openDeployDialog); }
  const ex = $("#exportBtn"); if(ex && !ex._h){ ex._h=true; ex.addEventListener("click",exportCSV); }

  if(route==="/overview"){ /* chart set up separately */ }
  if(route==="/services"){
    const search=$("#svcSearch"); if(search) search.addEventListener("input",()=>filterServices());
    $$("#statusFilter .tab").forEach(t=>t.addEventListener("click",()=>{
      $$("#statusFilter .tab").forEach(x=>x.classList.remove("active")); t.classList.add("active");
      filterServices();
    }));
    $$("#svcTable th.sortable").forEach(th=>th.addEventListener("click",()=>{
      const k=th.dataset.k; sortServices(k); filterServices();
    }));
  }
  if(route==="/incidents"){
    const d=$("#declareIncBtn"); if(d&&!d._h){d._h=true;d.addEventListener("click",()=>toast("info","Incident declared","New incident INC-2042 opened"))}
    const a=$("#ackAllBtn"); if(a&&!a._h){a._h=true;a.addEventListener("click",()=>{state.incidents.forEach(i=>{if(i.status!=="resolved")i.status="monitoring"});render();toast("success","Acknowledged","All open incidents acknowledged")})}
  }
  if(route==="/deployments"){
    $$("[data-rollback]").forEach(b=>b.addEventListener("click",()=>{
      const d=state.deployments.find(x=>x.id===b.dataset.rollback);
      d.status="rollback"; render(); toast("warning","Rollback","Deployment "+d.id+" rolling back");
    }));
  }
  if(route==="/alerts"){
    $$("[data-alertack]").forEach(b=>b.addEventListener("click",()=>{
      const a=state.alerts.find(x=>x.name===b.dataset.alertack);
      a.status = a.status==="firing"?"resolved":"firing"; render(); toast("success","Alert",b.dataset.alertack+" "+(a.status==="resolved"?"acknowledged":"re-armed"));
    }));
    const s=$("#silenceBtn"); if(s&&!s._h){s._h=true;s.addEventListener("click",()=>{state.alerts.forEach(a=>a.status="resolved");render();toast("success","Silenced","All firing alerts silenced for 30m")})}
  }
  if(route==="/settings"){
    $$("[data-setting]").forEach(inp=>inp.addEventListener("change",()=>toast("success","Saved","Preference updated")));
    $$("[data-int]").forEach(b=>b.addEventListener("click",()=>toast("success","Integration",b.dataset.int+" "+(b.textContent.trim()==="Connect"?"connected":"updated"))));
    const db=$("#dangerBtn"); if(db&&!db._h){db._h=true;db.addEventListener("click",()=>{ if(confirm("Delete this workspace permanently?")) toast("danger","Deleted","Workspace deleted (simulated)"); });}
  }
  if(route==="/security"){
    const gk=$("#genKeyBtn"); if(gk&&!gk._h){gk._h=true;gk.addEventListener("click",()=>{
      const full="rk_live_"+Math.random().toString(16).slice(2,14);
      const preview=full.slice(0,11)+"•…•"+full.slice(-4);
      const key={name:"New Key "+state.apiKeys.length,key:preview,scope:["read","deploy"],created:Date.now()/1000,last:Date.now()/1000,exp:Date.now()/1000+2592000*6,status:"active"};
      state.apiKeys.unshift(key); state.secret=full;
      render(); openKeyReveal(key.name, full);
    })}
    $$("[data-copykey]").forEach(b=>b.addEventListener("click",()=>{
      const key=state.apiKeys.find(k=>k.name===b.dataset.copykey);
      copyText($("#key_"+CSS.escape(key.name)).value, key.name);
    }));
    $$("[data-revealkey]").forEach(b=>b.addEventListener("click",()=>{
      const key=state.apiKeys.find(k=>k.name===b.dataset.revealkey);
      const full=key.key.replace("•…•", Math.random().toString(16).slice(0,4));
      openKeyReveal(key.name, full);
    }));
    $$("[data-revokekey]").forEach(b=>b.addEventListener("click",()=>{
      const key=state.apiKeys.find(k=>k.name===b.dataset.revokekey);
      if(confirm("Revoke API key \""+key.name+"\"? This cannot be undone.")){ key.status="revoked"; render(); toast("warning","Key revoked",key.name); }
    }));
  }
  if(route==="/costs"){
    const slider=$("#budgetSlider"), val=$("#budgetVal");
    if(slider&&!slider._h){ slider._h=true;
      const update=()=>{ state.budget=+slider.value; val.value="$"+(+slider.value).toLocaleString(); toast("info","Budget","Monthly budget set to "+val.value); };
      slider.addEventListener("input",update);
      val.addEventListener("change",()=>{ const n=parseInt(val.value.replace(/[^0-9]/g,""),10); if(n){ slider.value=Math.max(4000,Math.min(14000,n)); update(); } });
    }
    $$("[data-inv]").forEach(b=>b.addEventListener("click",()=>toast("success","Invoice",b.dataset.inv+" invoice downloaded")));
    const inv=$("#invoiceBtn"); if(inv&&!inv._h){inv._h=true;inv.addEventListener("click",()=>toast("success","Invoice","August 2026 invoice downloaded"));}
  }
  if(route==="/components"){
    const sd=$("#sliderDemo"); if(sd) sd.addEventListener("input",()=>{});
    const cd=$("#copyDemoBtn"); if(cd&&!cd._h){cd._h=true;cd.addEventListener("click",()=>copyText($("#copyDemo").value,"Copied"));}
    const cl=$("#copyLib"); if(cl&&!cl._h){cl._h=true;cl.addEventListener("click",()=>copyText(JSON.stringify(T),"Palette tokens"));}
    $$("[data-toastdemo]").forEach(b=>b.addEventListener("click",()=>toast("success","Toast component","This is a toast from the gallery")));
    $$("[data-dialogdemo]").forEach(b=>b.addEventListener("click",openDeployDialog));
    $$(".acc-trigger").forEach(t=>t.addEventListener("click",()=>{ const it=t.closest(".acc-item"); it.classList.toggle("open"); }));
  }
  // log toggles (log page + overview card)
  $$("[data-logtoggle]").forEach(b=>{
    const lvl=b.dataset.logtoggle;
    b.addEventListener("click",()=>{
      if(lvl==="all"){ state.logLevels=new Set(["info","ok","warn","err","dbg"]); }
      else if(state.logLevels.has(lvl)){ state.logLevels.delete(lvl); }
      else { state.logLevels.add(lvl); }
      render();
    });
  });
  const pause=$("#pauseLogs"); if(pause&&!pause._h){pause._h=true;pause.addEventListener("click",()=>{state.paused=!state.paused;pause.innerHTML=state.paused?icon("eye")+"Resume":icon("eye")+"Pause";toast(state.paused?"info":"info","Log stream",state.paused?"Paused":"Resumed")})}
  const clear=$("#clearLogs"); if(clear&&!clear._h){clear._h=true;clear.addEventListener("click",()=>{$("#logBox2").innerHTML="";updateLogCount()})}
  const ls=$("#logSearch"); if(ls&&!ls._h){ls._h=true;ls.addEventListener("input",()=>{state.logQ=ls.value;renderLogBox2()})}
}

/* ============================== SERVICES FILTER/SORT ============================== */
state.svcSort={k:null,dir:1}; state.svcFilter="all"; state.svcQ="";
function filterServices(){
  state.svcQ=($("#svcSearch")||{}).value||"";
  state.svcFilter=$("#statusFilter .tab.active").dataset.sf||"all";
  let list=[...state.services];
  if(state.svcFilter!=="all") list=list.filter(s=>s.status===state.svcFilter);
  const q=state.svcQ.toLowerCase(); if(q) list=list.filter(s=>s.id.includes(q)||s.region.includes(q));
  if(state.svcSort.k) list.sort((a,b)=>{const va=a[state.svcSort.k],vb=b[state.svcSort.k];return (va>vb?1:va<vb?-1:0)*state.svcSort.dir});
  $("#svcTbody").innerHTML=list.map(s=>`
    <tr>
      <td><button class="svc-open" data-svcopen="${s.id}">${s.id}</button></td>
      <td class="mono-cell">${s.v}</td>
      <td class="mono-cell muted">${s.region}</td>
      <td>${statusBadge(s.status)}</td>
      <td><div class="mini-bar"><div class="bar"><i style="width:${s.cpu}%;background:${s.cpu>75?T.danger:s.cpu>60?T.warning:T.info}"></i></div><span class="num">${s.cpu}%</span></div></td>
      <td class="mono-cell">${s.mem}</td>
      <td class="mono-cell">${fmtMs(s.req)}/s</td>
      <td class="mono-cell">${s.p95}ms</td>
      <td class="mono-cell" style="color:${s.err>0.3?T.warning:s.err>0.05?T.info:T.success}">${s.err.toFixed(2)}%</td>
      <td><a class="btn btn-sm btn-ghost" data-nav="/logs">logs ${icon("terminal",12)}</a></td>
    </tr>`).join("");
  // rebind nav
  $$("#svcTbody [data-nav]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();navigate(a.dataset.nav)}));
}
function sortServices(k){ const s=state.svcSort; if(s.k===k)s.dir*=-1; else {s.k=k;s.dir=1;} }

/* ============================== CHART / LIVE TICK ============================== */
function setupChart(){
  const svg=$("#mainChart"); if(!svg) return;
  const g=$("#chartBox .grid-h"); if(g && !g.innerHTML){ let h=""; for(let i=0;i<4;i++)h+=`<i style="top:${(i+0.5)*25}%"></i>`; g.innerHTML=h; }
  drawChart();
  // hover tooltip
  const tip=$("#chartTip"), box=$("#chartBox");
  if(box&&!box._h){ box._h=true; box.addEventListener("mousemove",e=>{
    const rect=box.getBoundingClientRect(); const x=e.clientX-rect.left;
    const idx=Math.round((x/rect.width)*(hist.length-1)); idx=Math.max(0,Math.min(hist.length-1,idx));
    tip.style.display="block"; tip.style.left=((idx/(hist.length-1))*100)+"%";
    tip.style.top="30%"; tip.innerHTML=`${idx*18}m ago · ${hist[idx].r.toFixed(1)}k/s · ${Math.round(hist[idx].l)}ms`;
  }); box.addEventListener("mouseleave",()=>tip.style.display="none"); }
}
function drawChart(){
  const svg=$("#mainChart"); if(!svg) return;
  const w=600,h=200,p=6;
  const r=hist.map(d=>d.r), l=hist.map(d=>d.l);
  const pr=areaPath(r,w,h,p), pl=areaPath(l,w,h,p);
  svg.innerHTML=`
    <defs>
      <linearGradient id="gmain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${T.accent}" stop-opacity=".3"/><stop offset="100%" stop-color="${T.accent}" stop-opacity="0"/></linearGradient>
      <linearGradient id="glat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${T.info}" stop-opacity=".16"/><stop offset="100%" stop-color="${T.info}" stop-opacity="0"/></linearGradient>
    </defs>
    <path d="${pr.area}" fill="url(#gmain)" stroke="none"/>
    <path d="${pr.line}" fill="none" stroke="${T.accent}" stroke-width="2"/>
    <path d="${pl.area}" fill="url(#glat)" stroke="none"/>
    <path d="${pl.line}" fill="none" stroke="${T.info}" stroke-width="1.5" opacity=".85"/>`;
}
function tick(){
  const last=hist[hist.length-1];
  let r=last.r+(Math.random()-.5)*0.9; r=Math.max(8.8,Math.min(15,r));
  let l=last.l+(Math.random()-.5)*3; l=Math.max(26,Math.min(70,l));
  hist.push({r,l}); hist.shift();
  drawChart();
  const lv=$("#latVal"); if(lv)lv.textContent=Math.round(l);
  const ev=$("#errVal"); if(ev)ev.textContent=(0.01+Math.random()*0.03).toFixed(2);
  const rv=$("#reqVal"); if(rv)rv.innerHTML=(r.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g,","))+'<span class="unit">k/s</span>';
  const mr=$("#mReq"); if(mr)mr.textContent=fmtMs(Math.round(r*1000));
  const ml=$("#mLat"); if(ml)ml.textContent=Math.round(l)+"ms";
  if(Math.random()<0.55 && !state.paused) pushLog();
  updateClock();
}

/* ============================== LOG ============================== */
function renderLogInto(box,filterLvl){
  let html="";
  const src = filterLvl==="logBox2" ? state.logHistory : state.logHistory.slice(-7);
  src.forEach(e=>{
    if(!state.logLevels.has(e.lvl)) return;
    if(state.logQ && !e.msg.toLowerCase().includes(state.logQ)) return;
    html+=`<div class="log-row"><span class="ts">${nowStamp()}</span><span class="lvl lvl-${e.lvl}">${e.lvl}</span><span class="msg">${e.msg}</span></div>`;
  });
  box.innerHTML=html; box.scrollTop=box.scrollHeight;
}
function pushLog(){
  const pick=LOGS[Math.random()*LOGS.length|0];
  state.logHistory.push({lvl:pick.lvl, msg:pick.msg});
  if(state.logHistory.length>200) state.logHistory.shift();
  const b1=$("#logBox"); if(b1) renderLogInto(b1,"logBox");
  if($("#logBox2")) renderLogBox2();
}
function seedLog(){
  const b1=$("#logBox"); if(b1) renderLogInto(b1,"logBox");
  if($("#logBox2")) renderLogBox2();
}
function renderLogBox2(){
  const box=$("#logBox2"); if(!box) return;
  let html="";
  state.logHistory.forEach(e=>{
    if(!state.logLevels.has(e.lvl)) return;
    if(state.logQ && !e.msg.toLowerCase().includes(state.logQ)) return;
    html+=`<div class="log-row"><span class="ts">${nowStamp()}</span><span class="lvl lvl-${e.lvl}">${e.lvl}</span><span class="msg">${e.msg}</span></div>`;
  });
  box.innerHTML=html; box.scrollTop=box.scrollHeight; updateLogCount();
}
function updateLogCount(){ const c=$("#logCount"); if(c)c.textContent=state.logHistory.filter(e=>state.logLevels.has(e.lvl)).length; }

/* ============================== CLOCK ============================== */
function updateClock(){ const el=$("#clock"); if(!el)return; const d=new Date();
  el.textContent=`UTC ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} · ${d.toISOString().slice(0,10)}`; }

/* ============================== THEME ============================== */
function applyTheme(){ document.documentElement.setAttribute("data-theme", state.theme); localStorage.setItem("racer-theme",state.theme);
  const b=$("#themeBtn"); if(b) b.innerHTML = icon(state.theme==="dark"?"sun":"moon"); }
function toggleTheme(){ state.theme = state.theme==="dark"?"light":"dark"; applyTheme(); toast("info","Theme","Switched to "+(state.theme==="dark"?"dark":"light")+" mode"); }

/* ============================== TOASTS ============================== */
function toast(type,title,msg,icName){
  const wrap=$("#toasts");
  const el=document.createElement("div"); el.className="toast "+type;
  const icMap={success:"check",info:"bell",warning:"warning",danger:"warning"};
  el.innerHTML=`<div class="ic">${icon(icName||icMap[type]||"check")}</div><div class="toast-body"><b>${esc(title)}</b><span>${esc(msg)}</span></div>`;
  wrap.appendChild(el);
  setTimeout(()=>{el.classList.add("out"); setTimeout(()=>el.remove(),300);},3400);
}

/* ============================== EXPORT CSV ============================== */
function exportCSV(){
  const header="Service,Version,Region,Status,CPU,Mem,Requests,p95,Errors";
  const rows=state.services.map(s=>[s.id,s.v,s.region,s.status,s.cpu,s.mem,s.req,s.p95,s.err].join(","));
  const csv=[header,...rows].join("\n");
  const a=document.createElement("a");
  try{ const blob=new Blob([csv],{type:"text/csv"}); a.href=URL.createObjectURL(blob); }
  catch(e){ a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv); }
  a.download="racer-services.csv"; document.body.appendChild(a); a.click(); a.remove();
  toast("success","Exported","services.csv downloaded");
}

/* ============================== DEPLOY DIALOG ============================== */
function openDeployDialog(){
  const svcOpts=state.services.map(s=>`<option value="${s.id}">${s.id}</option>`).join("");
  const html=`
  <div class="overlay" id="deployOverlay">
    <div class="dialog">
      <div class="dialog-head"><h3>New Deployment</h3><button class="btn btn-icon btn-ghost" data-close>${icon("x")}</button></div>
      <div class="dialog-body">
        <div class="form-row">
          <label class="field">Service
            <select class="select" id="depSvc">${svcOpts}</select></label>
          <label class="field">Image tag
            <input class="input" id="depTag" value="v2.7.0"></label>
        </div>
        <label class="field">Strategy
          <select class="select" id="depStrat">
            <option>rolling</option><option>bluegreen</option><option>canary</option><option>recreate</option>
          </select></label>
        <label class="field">Deployment note
          <textarea id="depNote" placeholder="e.g. reduces cache eviction, bumps concurrency…"></textarea></label>
        <label class="field">Regions
          <div class="form-row">
            ${state.regions.map((r,i)=>`<label style="display:flex;align-items:center;gap:8px;font-weight:500;color:var(--muted);font-size:12px;cursor:pointer">
              <input type="checkbox" id="depReg${i}" ${i===0?"checked":""} class="input" style="width:auto;height:auto">${r.code}</label>`).join("")}
          </div></label>
      </div>
      <div class="dialog-foot">
        <button class="btn" data-close>Cancel</button>
        <button class="btn btn-primary" id="depSubmit">${icon("rocket")}Deploy now</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend",html);
  const ov=$("#deployOverlay");
  const close=()=>ov.remove();
  $$("[data-close]",ov).forEach(b=>b.addEventListener("click",close));
  ov.addEventListener("mousedown",e=>{ if(e.target===ov) close(); });
  $("#depSubmit").addEventListener("click",()=>{
    const svc=$("#depSvc").value, tag=$("#depTag").value||"latest", strat=$("#depStrat").value;
    const regions=[...$$("input[id^=depReg]:checked")].map(x=>x.id.replace("depReg","")).map(i=>state.regions[+i].code);
    state.deployments.unshift({id:"dep-"+Math.floor(9800+Math.random()*100),svc,v:tag.replace("v",""),strategy:strat,status:"live",sha:Math.random().toString(16).slice(2,8),branch:"main",ago:0,region:regions[0]||"us-east-1"});
    close(); toast("success","Deployment started",`${svc} ${tag} → ${regions.join(", ")} (${strat})`);
    if(state.route==="/deployments") render();
  });
}

/* ---------- service detail dialog ---------- */
function openServiceDetail(id){
  const s=state.services.find(x=>x.id===id); if(!s) return;
  const inst=[0,1,2].map((_,i)=>{
    const ip="10.0."+(i+1)+"."+(10+i*2);
    const stable=(s.cpu<70 && s.status!=="degraded");
    return `<div class="instance-row">
      <span class="mono">pod-${i+1}</span><span class="ip">${ip}</span>
      <span class="state">${stable?`<span class="status status-success">ready</span>`:`<span class="status status-warning">restarting</span>`}</span>
    </div>`;}).join("");
  const recent=state.logHistory.slice(-4).filter(e=>state.logLevels.has(e.lvl)).map(e=>
    `<div class="log-row"><span class="ts">${nowStamp()}</span><span class="lvl lvl-${e.lvl}">${e.lvl}</span><span class="msg">${e.msg}</span></div>`).join("");
  const html=`
  <div class="overlay" id="svcDetail">
    <div class="dialog" style="max-width:640px">
      <div class="dialog-head">
        <h3><span class="mono">${s.id}</span> <span class="badge badge-outline" style="vertical-align:middle">v${s.v}</span></h3>
        <button class="btn btn-icon btn-ghost" data-close>${icon("x")}</button>
      </div>
      <div class="dialog-body">
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          ${statusBadge(s.status)}
          <span class="badge badge-accent">${s.region}</span>
          <span class="badge badge-outline">${icon("zap",11)} ${s.req.toLocaleString()}/s</span>
          <button class="btn btn-sm btn-primary" data-dep="${s.id}">${icon("rocket",13)}Deploy</button>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><div class="k">CPU</div><div class="v">${s.cpu}%</div></div>
          <div class="detail-item"><div class="k">Memory</div><div class="v">${s.mem}</div></div>
          <div class="detail-item"><div class="k">p95 latency</div><div class="v">${s.p95}ms</div></div>
          <div class="detail-item"><div class="k">Error rate</div><div class="v">${s.err.toFixed(2)}%</div></div>
          <div class="detail-item"><div class="k">Instances</div><div class="v">3 / 3</div></div>
          <div class="detail-item"><div class="k">Version</div><div class="v">${s.v}</div></div>
        </div>
        <div><b style="font-size:12px">Instances</b><div style="margin-top:7px">${inst}</div></div>
        <div><b style="font-size:12px">Recent events</b><div class="log" style="margin-top:7px;max-height:150px;font-size:11px">${recent||`<div class="log-row"><span class="msg muted">no matching events</span></div>`}</div></div>
      </div>
      <div class="dialog-foot">
        <button class="btn" data-close>Close</button>
        <a class="btn btn-outline" data-nav="/metrics">Metrics</a>
        <a class="btn btn-outline" data-nav="/logs">Live logs</a>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend",html);
  const ov=$("#svcDetail");
  const close=()=>ov.remove();
  $$("[data-close]",ov).forEach(b=>b.addEventListener("click",close));
  $$("[data-nav]",ov).forEach(a=>a.addEventListener("click",e=>{e.preventDefault();close();navigate(a.dataset.nav);}));
  $$("[data-dep]",ov).forEach(b=>b.addEventListener("click",()=>{close();openDeployDialog();}));
  ov.addEventListener("mousedown",e=>{ if(e.target===ov) close(); });
}

/* ---------- key reveal dialog ---------- */
function openKeyReveal(name, secret){
  const html=`
  <div class="overlay" id="keyReveal">
    <div class="dialog">
      <div class="dialog-head"><h3>API key · ${esc(name)}</h3><button class="btn btn-icon btn-ghost" data-close>${icon("x")}</button></div>
      <div class="dialog-body">
        <div class="input-group"><input class="input" id="revealedKey" value="${esc(secret)}" readonly><button class="btn" id="revealCopy">${icon("copy")}Copy</button></div>
        <div class="empty" style="padding:14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--panel-2)">
          <div class="ic" style="width:34px;height:34px">${icon("warning")}</div>
          <b style="color:var(--warning);font-size:12px">Store this key securely</b>
          <p style="font-size:11px">For security, this secret is only shown once and cannot be retrieved later.</p>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><div class="k">Scopes</div><div class="v" style="font-size:11px">read · deploy</div></div>
          <div class="detail-item"><div class="k">Expires</div><div class="v" style="font-size:11px">in 180 days</div></div>
        </div>
      </div>
      <div class="dialog-foot"><button class="btn" data-close>Done</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend",html);
  const ov=$("#keyReveal");
  const close=()=>ov.remove();
  $$("[data-close]",ov).forEach(b=>b.addEventListener("click",close));
  ov.addEventListener("mousedown",e=>{ if(e.target===ov) close(); });
  $("#revealCopy").addEventListener("click",()=>copyText($("#revealedKey").value,name));
}

/* ---------- keyboard shortcuts overlay ---------- */
function openShortcuts(){
  const items=[
    ["Open command palette",["⌘","K"]],
    ["New deployment",["⌘","N"]],
    ["Toggle theme",["T"]],
    ["Go to Overview",["G","O"]],
    ["Go to Services",["G","S"]],
    ["Go to Logs",["G","L"]],
    ["Show / hide shortcuts",["?"]],
    ["Close dialog / menu",["Esc"]],
  ].map(s=>`<div class="shortcut-row"><span>${s[0]}</span><div class="kbd-keys">${s[1].map(k=>`<span class="key-cap">${k}</span>`).join("")}</div></div>`).join("");
  const html=`
  <div class="overlay" id="shortcutsOverlay" style="z-index:85">
    <div class="dialog" style="max-width:420px">
      <div class="dialog-head"><h3>Keyboard shortcuts</h3><button class="btn btn-icon btn-ghost" data-close>${icon("x")}</button></div>
      <div class="dialog-body">${items}</div>
      <div class="dialog-foot"><button class="btn btn-ghost" data-close>Close</button></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend",html);
  const ov=$("#shortcutsOverlay");
  const close=()=>ov.remove();
  $$("[data-close]",ov).forEach(b=>b.addEventListener("click",close));
  ov.addEventListener("mousedown",e=>{ if(e.target===ov) close(); });
  document.addEventListener("keydown",function h(e){ if(e.key==="Escape" && ov.isConnected){ close(); document.removeEventListener("keydown",h); } });
}

/* ============================== COMMAND PALETTE ============================== */
const cmdActions=[
  {g:"Navigate", items:[["Overview","/overview","grid"],["Incidents","/incidents","bell"],["Deployments","/deployments","rocket"],["Services","/services","server"],["Logs","/logs","terminal"],["Metrics","/metrics","chart"],["Alerts","/alerts","warning"],["API Keys","/security","lock"],["Costs","/costs","card"],["Components","/components","box"],["Settings","/settings","settings"]]},
  {g:"Actions", items:[["New Deployment","__deploy","rocket"],["Toggle theme","__theme","sparkle"],["Export services CSV","__export","download"],["Acknowledge all incidents","__ack","check"],["Show shortcuts","__shortcuts","key"]]},
];
function openCommand(){
  const html=`
  <div class="cmd-overlay" id="cmdOverlay">
    <div class="cmd">
      <div class="cmd-input">${icon("search",17)}<input id="cmdInput" placeholder="Search commands or pages…" autocomplete="off"><button class="btn btn-sm btn-ghost" data-cmdclose>esc</button></div>
      <div class="cmd-list" id="cmdList"></div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML("beforeend",html);
  const ov=$("#cmdOverlay"), input=$("#cmdInput"), list=$("#cmdList");
  const renderList=()=>{
    const q=input.value.toLowerCase();
    let html=""; let firstId=null;
    cmdActions.forEach(g=>{
      const items=g.items.filter(it=>it[0].toLowerCase().includes(q));
      if(!items.length) return;
      html+=`<div class="cmd-group">${g.g}</div>`;
      items.forEach(it=>{
        const id=it[0].replace(/\W/g,"");
        if(!firstId) firstId=id;
        html+=`<button class="cmd-item" id="cmd_${id}" data-cmd="${it[1]}" data-label="${esc(it[0])}"><span class="icon">${icon(it[2])}</span>${it[0]}<span class="meta">${it[1]==="__deploy"?"↵":it[1]}</span></button>`;
      });
    });
    list.innerHTML=html||`<div class="cmd-empty">No results for “${esc(input.value)}”</div>`;
    $$("#cmdList .cmd-item").forEach(b=>b.addEventListener("click",()=>execCmd(b.dataset.cmd,b.dataset.label)));
  };
  function execCmd(cmd,label){
    ov.remove();
    if(cmd.startsWith("/")) navigate(cmd);
    else if(cmd==="__deploy") openDeployDialog();
    else if(cmd==="__theme") toggleTheme();
    else if(cmd==="__export") exportCSV();
    else if(cmd==="__ack"){ state.incidents.forEach(i=>{if(i.status!=="resolved")i.status="monitoring"}); toast("success","Acknowledged","All incidents acknowledged"); }
    else if(cmd==="__shortcuts"){ openShortcuts(); }
  }
  renderList();
  input.focus();
  input.addEventListener("input",renderList);
  $$("[data-cmdclose]",ov).forEach(b=>b.addEventListener("click",()=>ov.remove()));
  ov.addEventListener("mousedown",e=>{ if(e.target===ov) ov.remove(); });
  // keyboard nav
  input.addEventListener("keydown",e=>{
    const items=$$("#cmdList .cmd-item");
    const idx=items.findIndex(i=>i.classList.contains("sel"));
    if(e.key==="ArrowDown"){ e.preventDefault(); const n=(idx+1)%items.length; items.forEach(i=>i.classList.remove("sel")); items[n].classList.add("sel"); items[n].scrollIntoView({block:"nearest"}); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); const n=(idx-1+items.length)%items.length; items.forEach(i=>i.classList.remove("sel")); items[n].classList.add("sel"); items[n].scrollIntoView({block:"nearest"}); }
    else if(e.key==="Enter"){ if(idx>=0) items[idx].click(); }
    else if(e.key==="Escape"){ ov.remove(); }
  });
}

/* ============================== DROPDOWNS ============================== */
function openMenu(anchor, html){
  closeMenus();
  const el=document.createElement("div"); el.className="menu"; el.innerHTML=html;
  document.body.appendChild(el);
  const r=anchor.getBoundingClientRect();
  el.style.position="fixed";
  el.style.top=Math.min(r.bottom+6, window.innerHeight-20)+"px";
  el.style.left=Math.min(r.left, window.innerWidth-el.offsetWidth-8)+"px";
  anchor._menuEl=el;
  document.addEventListener("mousedown",e=>{ if(!el.contains(e.target)&&!anchor.contains(e.target)){el.remove();anchor._menuEl=null;} });
  return el;
}
function closeMenus(){ $$(".menu").forEach(m=>m.remove()); $$("[data-anchor]").forEach(a=>a._menuEl=null); }

/* ============================== TOOLBAR BINDINGS ============================== */
function bindToolbar(){
  $("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  $("#themeBtn").addEventListener("click",toggleTheme);
  $("#searchBtn").addEventListener("click",openCommand);
  $("#envBtn").addEventListener("click",function(){
    const menu=openMenu(this,`
      <div class="menu-head">Environment</div>
      ${["prod","staging","dev"].map(e=>`<button class="menu-check ${state.env===e?"checked":""}" data-env="${e}">${icon(e==="prod"?"zap":e==="staging"?"layers":"box",15)}<span class="mono">${e}</span>${icon("check",14)}<span class="tick"></span></button>`).join("")}
      <div class="menu-sep"></div>
      <button class="menu-item" data-envmanage>${icon("settings",15)}Manage environments</button>`);
    $$("[data-env]",menu).forEach(b=>b.addEventListener("click",()=>{state.env=b.dataset.env; $("#envBtn b").textContent=state.env; closeMenus(); toast("info","Environment","Switched to "+state.env);}));
    $$("[data-envmanage]",menu).forEach(b=>b.addEventListener("click",()=>{closeMenus();toast("info","Environments","Open environment manager")}));
  });
  $("#notifBtn").addEventListener("click",function(){
    const items=state.notifications.map(n=>`
      <div class="notif">
        <div class="nicon" style="background:color-mix(in srgb,${n.color} 14%,transparent);color:${n.color}">${icon(n.icon)}</div>
        <div style="flex:1;min-width:0"><b>${n.b}</b><p>${n.p}</p></div>
        <time>${n.t}</time>
      </div>`).join("");
    openMenu(this,`<div style="width:300px">
      <div class="notif-head"><b>Notifications</b><button class="btn btn-sm btn-ghost" data-markall>mark all read</button></div>
      <div style="max-height:280px;overflow-y:auto">${items}</div></div>`);
    const m=this._menuEl;
    $$("[data-markall]",m).forEach(b=>b.addEventListener("click",()=>{ closeMenus(); toast("success","Notifications","All marked as read"); }));
  });
  $("#profileBtn").addEventListener("click",function(){
    openMenu(this,`
      <div style="padding:9px 11px;display:flex;gap:10px;align-items:center;border-bottom:1px solid var(--border)">
        <div class="avatar">AK</div><div><b style="font-size:12.5px">Ada Kowalski</b><div class="mono muted" style="font-size:10.5px">ada@racer.dev</div></div></div>
      <button class="menu-item">${icon("user",15)}Profile</button>
      <button class="menu-item">${icon("settings",15)}Account settings</button>
      <button class="menu-item" data-theme2>${icon("sparkle",15)}Toggle theme</button>
      <div class="menu-sep"></div>
      <button class="menu-item danger">${icon("power",15)}Sign out</button>`);
    const m=this._menuEl;
    $$("[data-theme2]",m).forEach(b=>b.addEventListener("click",()=>{closeMenus();toggleTheme()}));
  });
}

/* ============================== INIT ============================== */
function init(){
  applyTheme();
  bindToolbar();
  setupTooltips();
  window.addEventListener("hashchange",()=>{ state.route=location.hash.replace(/^#/,"")||"/overview"; render(); });
  document.addEventListener("keydown",e=>{
    const k=e.key.toLowerCase();
    if((e.metaKey||e.ctrlKey)&&k==="k"){ e.preventDefault(); openCommand(); }
    else if((e.metaKey||e.ctrlKey)&&k==="n"){ e.preventDefault(); openDeployDialog(); }
    else if(e.shiftKey&&k==="?"){ e.preventDefault(); openShortcuts(); }
    else if(!e.metaKey&&!e.ctrlKey&&!e.altKey){
      if(k==="g"&&!state._g){ state._g=true; setTimeout(()=>state._g=false,900); return; }
      if(state._g){ state._g=false; const m={o:"/overview",s:"/services",l:"/logs",m:"/metrics",i:"/incidents",d:"/deployments",c:"/costs"}; if(m[k]) navigate(m[k]); }
      else if(k==="t") toggleTheme();
    }
  });
  render();
  setInterval(tick, 2200);
  setInterval(updateClock,1000);
}

/* ---------- global tooltips ([data-tip]) ---------- */
let tipEl=null;
function setupTooltips(){
  document.addEventListener("mouseover",e=>{
    const t=e.target.closest("[data-tip]"); if(!t) return;
    if(!tipEl){ tipEl=document.createElement("div"); tipEl.className="tooltip"; document.body.appendChild(tipEl); }
    tipEl.textContent=t.dataset.tip; tipEl.style.display="block";
    const r=t.getBoundingClientRect();
    tipEl.style.top=(r.top-8)+"px"; tipEl.style.left=(r.left+r.width/2)+"px";
    tipEl.style.transform="translate(-50%,-100%)";
  });
  document.addEventListener("mouseout",e=>{
    if(e.target.closest("[data-tip]") && tipEl) tipEl.style.display="none";
  });
  document.addEventListener("click",()=>{ if(tipEl) tipEl.style.display="none"; });
}

document.addEventListener("DOMContentLoaded",init);
window.Racer = { navigate, toast, toggleTheme, openCommand, state }; /* library surface */
})();
