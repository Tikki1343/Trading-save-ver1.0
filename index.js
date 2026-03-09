import { useState, useEffect } from "react";

const STORAGE_KEY = "trading-records";
const PAIRS = ["USDJPY", "EURUSD", "GBPUSD", "AUDUSD", "XAUUSD", "その他"];

const initialForm = {
  date: "", pair: "", keyLevel: false, obFvg: false, chochBos: false,
  fibo: false, bslSsl: false, memo: "", screenshotUrl: "", result: "", pips: "",
};

function ScoreBadge({ score }) {
  const max = 5;
  const pct = (score / max) * 100;
  const color = score >= 4 ? "#22c55e" : score >= 2 ? "#f59e0b" : "#ef4444";
  const label = score >= 4 ? "エントリー推奨 ✓" : score >= 2 ? "要再確認 △" : "見送り推奨 ✗";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, fontWeight: 900, color, fontFamily: "'Courier New', monospace", lineHeight: 1, marginBottom: 4, textShadow: `0 0 30px ${color}88` }}>
        {score}<span style={{ fontSize: 22, color: "#475569" }}>/{max}</span>
      </div>
      <div style={{ display: "inline-block", background: color + "22", border: `1px solid ${color}66`, borderRadius: 4, padding: "4px 14px", fontSize: 12, color, letterSpacing: 2 }}>{label}</div>
      <div style={{ marginTop: 12, height: 6, background: "#1e2a3a", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("judge");
  const [form, setForm] = useState(initialForm);
  const [records, setRecords] = useState([]);
  const [saved, setSaved] = useState(false);

  const conditions = [
    { key: "keyLevel", label: "4H KeyLevel と一致", required: true },
    { key: "obFvg", label: "OB × FVG 重なり確認", required: true },
    { key: "chochBos", label: "CHoCH / BOS 確認", required: false },
    { key: "fibo", label: "フィボ 61.8〜79% 重なり", required: false },
    { key: "bslSsl", label: "BSL / SSL 狩り確認", required: false },
  ];

  const score = conditions.filter(c => form[c.key]).length;
  const requiredMet = conditions.filter(c => c.required).every(c => form[c.key]);

  // 起動時にlocalStorageから読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRecords(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // recordsが変わるたびに自動保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {}
  }, [records]);

  const handleSave = () => {
    if (!form.date || !form.pair) return;
    const newRecord = { ...form, score, id: Date.now() };
    setRecords(prev => [newRecord, ...prev]);
    setForm(initialForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTab("history");
  };

  const deleteRecord = (id) => setRecords(prev => prev.filter(r => r.id !== id));

  const winCount = records.filter(r => r.result === "win").length;
  const lossCount = records.filter(r => r.result === "loss").length;
  const winRate = records.length > 0 ? Math.round((winCount / records.length) * 100) : 0;

  const inputStyle = {
    width: "100%", background: "#0a0e1a", border: "1px solid #1e2a3a",
    borderRadius: 4, padding: "8px", color: "#cbd5e1",
    fontSize: 12, fontFamily: "'Courier New', monospace", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", color: "#cbd5e1", fontFamily: "'Courier New', monospace", padding: "0 0 60px" }}>
      <div style={{ background: "linear-gradient(180deg, #0d1117 0%, #07090f 100%)", borderBottom: "1px solid #1e2a3a", padding: "20px 20px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#f59e0b", marginBottom: 4 }}>SMC × CRT</div>
              <h1 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 16px", color: "#f1f5f9" }}>TRADING DASHBOARD</h1>
            </div>
            <div style={{ fontSize: 9, letterSpacing: 1, marginTop: 6, color: "#22c55e", border: "1px solid #22c55e44", borderRadius: 4, padding: "3px 8px" }}>
              💾 端末保存
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {[{ id: "judge", label: "⚡ セットアップ判定" }, { id: "history", label: `📋 バックテスト (${records.length})` }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#0f1420" : "transparent", border: "1px solid", borderColor: tab === t.id ? "#f59e0b44" : "transparent", borderBottom: tab === t.id ? "1px solid #0f1420" : "1px solid #1e2a3a", borderRadius: "6px 6px 0 0", padding: "8px 16px", fontSize: 12, color: tab === t.id ? "#f59e0b" : "#64748b", cursor: "pointer", marginBottom: -1 }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px" }}>
        {tab === "judge" && (
          <div>
            <div style={{ background: "#0f1420", border: "1px solid #1e2a3a", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#64748b", marginBottom: 16 }}>CONFLUENCE SCORE</div>
              <ScoreBadge score={score} />
              {!requiredMet && score > 0 && <div style={{ marginTop: 12, background: "#ef444415", border: "1px solid #ef444433", borderRadius: 4, padding: "8px 12px", fontSize: 11, color: "#ef4444" }}>⚠ 必須条件（KeyLevel・OB×FVG）が未確認です</div>}
            </div>

            <div style={{ background: "#0f1420", border: "1px solid #1e2a3a", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#64748b", marginBottom: 14 }}>CONDITIONS</div>
              {conditions.map(c => (
                <div key={c.key} onClick={() => setForm(f => ({ ...f, [c.key]: !f[c.key] }))} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #1a2332", cursor: "pointer" }}>
                  <div style={{ width: 22, height: 22, minWidth: 22, background: form[c.key] ? "#22c55e22" : "transparent", border: `2px solid ${form[c.key] ? "#22c55e" : "#334155"}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, transition: "all 0.15s" }}>{form[c.key] && "✓"}</div>
                  <span style={{ fontSize: 13, color: form[c.key] ? "#f1f5f9" : "#64748b", flex: 1 }}>{c.label}</span>
                  {c.required && <span style={{ fontSize: 9, letterSpacing: 1, color: "#f59e0b", border: "1px solid #f59e0b44", borderRadius: 3, padding: "2px 5px" }}>必須</span>}
                </div>
              ))}
            </div>

            <div style={{ background: "#0f1420", border: "1px solid #1e2a3a", borderRadius: 8, padding: "20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#64748b", marginBottom: 14 }}>TRADE INFO</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>DATE</div><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>PAIR</div>
                  <select value={form.pair} onChange={e => setForm(f => ({ ...f, pair: e.target.value }))} style={{ ...inputStyle, color: form.pair ? "#cbd5e1" : "#475569" }}>
                    <option value="">選択...</option>{PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>RESULT</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["win", "loss", "be"].map(r => (
                      <button key={r} onClick={() => setForm(f => ({ ...f, result: r }))} style={{ flex: 1, padding: "8px 4px", fontSize: 11, background: form.result === r ? r === "win" ? "#22c55e22" : r === "loss" ? "#ef444422" : "#64748b22" : "transparent", border: `1px solid ${form.result === r ? r === "win" ? "#22c55e" : r === "loss" ? "#ef4444" : "#64748b" : "#1e2a3a"}`, borderRadius: 4, color: form.result === r ? r === "win" ? "#22c55e" : r === "loss" ? "#ef4444" : "#94a3b8" : "#475569", cursor: "pointer", fontFamily: "'Courier New', monospace", textTransform: "uppercase" }}>{r === "be" ? "B/E" : r.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>PIPS</div><input type="number" placeholder="例: +25" value={form.pips} onChange={e => setForm(f => ({ ...f, pips: e.target.value }))} style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: 12 }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>MEMO</div><textarea placeholder="根拠メモ・気づきなど..." value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} rows={3} style={{ ...inputStyle, resize: "vertical" }} /></div>
              <div><div style={{ fontSize: 10, color: "#475569", marginBottom: 4 }}>SCREENSHOT URL</div><input type="url" placeholder="https://..." value={form.screenshotUrl} onChange={e => setForm(f => ({ ...f, screenshotUrl: e.target.value }))} style={inputStyle} /></div>
            </div>

            <button onClick={handleSave} disabled={!form.date || !form.pair} style={{ width: "100%", padding: "14px", background: (!form.date || !form.pair) ? "#1e2a3a" : "linear-gradient(135deg, #f59e0b22, #f59e0b11)", border: `1px solid ${(!form.date || !form.pair) ? "#1e2a3a" : "#f59e0b66"}`, borderRadius: 6, fontSize: 13, letterSpacing: 2, color: (!form.date || !form.pair) ? "#334155" : "#f59e0b", cursor: (!form.date || !form.pair) ? "not-allowed" : "pointer", fontFamily: "'Courier New', monospace" }}>
              {saved ? "✓ SAVED" : "SAVE TO BACKTEST LOG"}
            </button>
          </div>
        )}

        {tab === "history" && (
          <div>
            {records.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[{ label: "TOTAL", value: records.length, color: "#94a3b8" }, { label: "WIN RATE", value: `${winRate}%`, color: winRate >= 50 ? "#22c55e" : "#ef4444" }, { label: "WIN / LOSS", value: `${winCount} / ${lossCount}`, color: "#f59e0b" }].map(s => (
                  <div key={s.label} style={{ background: "#0f1420", border: "1px solid #1e2a3a", borderRadius: 8, padding: "14px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: "#475569", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            {records.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#334155", fontSize: 13 }}><div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>まだ記録がないよ<br /><span style={{ fontSize: 11 }}>判定ツールからセーブしてみて！</span></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {records.map(r => (
                  <div key={r.id} style={{ background: "#0f1420", border: `1px solid ${r.result === "win" ? "#22c55e33" : r.result === "loss" ? "#ef444433" : "#1e2a3a"}`, borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{r.pair}</span>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: r.result === "win" ? "#22c55e22" : r.result === "loss" ? "#ef444422" : "#64748b22", color: r.result === "win" ? "#22c55e" : r.result === "loss" ? "#ef4444" : "#94a3b8", border: `1px solid ${r.result === "win" ? "#22c55e44" : r.result === "loss" ? "#ef444444" : "#64748b44"}` }}>{r.result === "win" ? "WIN" : r.result === "loss" ? "LOSS" : "B/E"}</span>
                          {r.pips && <span style={{ fontSize: 11, color: parseFloat(r.pips) >= 0 ? "#22c55e" : "#ef4444" }}>{parseFloat(r.pips) >= 0 ? "+" : ""}{r.pips} pips</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{r.date}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 900, color: r.score >= 4 ? "#22c55e" : r.score >= 2 ? "#f59e0b" : "#ef4444" }}>{r.score}/5</div>
                        <button onClick={() => deleteRecord(r.id)} style={{ background: "transparent", border: "none", color: "#334155", cursor: "pointer", fontSize: 14, padding: 2 }}>✕</button>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: r.memo || r.screenshotUrl ? 8 : 0 }}>
                      {conditions.map(c => <span key={c.key} style={{ fontSize: 9, letterSpacing: 1, padding: "2px 6px", borderRadius: 3, background: r[c.key] ? "#22c55e15" : "#1a2332", color: r[c.key] ? "#22c55e" : "#334155", border: `1px solid ${r[c.key] ? "#22c55e33" : "#1e2a3a"}` }}>{c.label}</span>)}
                    </div>
                    {r.memo && <div style={{ fontSize: 11, color: "#94a3b8", background: "#0a0e1a", borderRadius: 4, padding: "8px 10px", marginTop: 8, borderLeft: "2px solid #f59e0b44" }}>{r.memo}</div>}
                    {r.screenshotUrl && <a href={r.screenshotUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 6, fontSize: 10, color: "#3b82f6", letterSpacing: 1 }}>📷 SCREENSHOT →</a>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
