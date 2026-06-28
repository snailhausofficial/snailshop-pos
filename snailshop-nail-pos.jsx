import { useState } from "react";

const SERVICES = [
  { id: 1,  name: "สีพื้น",          price: 149, emoji: "💅" },
  { id: 2,  name: "สีลูกแก้ว",       price: 250, emoji: "🫧" },
  { id: 3,  name: "สีแฟลช",          price: 200, emoji: "⚡" },
  { id: 4,  name: "ออมเบ้ / ขัดผง",  price: 200, emoji: "🌈" },
  { id: 5,  name: "เฟร้นเนล",        price: 200, emoji: "🤍" },
  { id: 6,  name: "ลาย",             price: 20,  rangeMax: 80, emoji: "🌸" },
  { id: 7,  name: "ต่อเล็บชิดโคน",  price: 150, emoji: "✨" },
  { id: 8,  name: "ต่อเล็บเว้นโคน", price: 250, emoji: "🌟" },
  { id: 9,  name: "ต่อโพลี่เจล",    price: 690, emoji: "💎" },
  { id: 10, name: "ถอดสี",           price: 100, emoji: "🧴" },
  { id: 11, name: "ถอดสี PVC",       price: 150, emoji: "🧼" },
  { id: 12, name: "เสริมหน้าเล็บ",  price: 100, emoji: "🔧" },
  { id: 13, name: "Overlay",         price: 200, emoji: "💫" },
  { id: 14, name: "ออกแบบลาย",      price: 200, emoji: "🎨" },
  { id: 15, name: "อื่นๆ",           price: 0,   custom: true, emoji: "📝" },
];

const Pink = "#e91e63";
const PinkLight = "#fce4ec";
const PinkDark = "#c2185b";
const PinkMid = "#f48fb1";

function generateOrderId() {
  const now = new Date();
  const d = `${String(now.getDate()).padStart(2,"0")}${String(now.getMonth()+1).padStart(2,"0")}${now.getFullYear()}`;
  const rand = String(Math.floor(Math.random() * 99999)).padStart(5,"0");
  return `${d}-${rand}`;
}

export default function SnailShopPOS() {
  const [screen, setScreen] = useState("order");
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [larnPrice, setLarnPrice] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [note, setNote] = useState("");
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [orderTime] = useState(new Date());
  const [orderId] = useState(generateOrderId());

  const isSelected = (id) => !!selectedItems.find((i) => i.id === id);

  const toggleService = (svc) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.id === svc.id)
        ? prev.filter((i) => i.id !== svc.id)
        : [...prev, { ...svc, qty: 1 }]
    );
  };

  const getItemPrice = (svc) =>
    svc.rangeMax ? (parseInt(larnPrice) || 0) :
    svc.custom   ? (parseInt(customPrice) || 0) :
    svc.price;

  const total = selectedItems.reduce((sum, i) => sum + getItemPrice(i), 0);

  // ─── SUMMARY CARD ───────────────────────────────────────────────
  if (screen === "summary") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fce4ec,#fff0f6,#fff)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "28px 16px 40px", fontFamily: "'Segoe UI',sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(233,30,99,0.13)" }}>

            {/* Header */}
            <div style={{ background: `linear-gradient(135deg,#f06292,${Pink})`, padding: "22px 24px 18px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 32 }}>🐌</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 1 }}>Snail Shop</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 1 }}>062-989-9419 / 065-429-5646 · Line: @402fdhvy</div>
                </div>
              </div>
              {/* Zigzag */}
              <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 12, background: "#fff", clipPath: "polygon(0% 100%,2.5% 0%,5% 100%,7.5% 0%,10% 100%,12.5% 0%,15% 100%,17.5% 0%,20% 100%,22.5% 0%,25% 100%,27.5% 0%,30% 100%,32.5% 0%,35% 100%,37.5% 0%,40% 100%,42.5% 0%,45% 100%,47.5% 0%,50% 100%,52.5% 0%,55% 100%,57.5% 0%,60% 100%,62.5% 0%,65% 100%,67.5% 0%,70% 100%,72.5% 0%,75% 100%,77.5% 0%,80% 100%,82.5% 0%,85% 100%,87.5% 0%,90% 100%,92.5% 0%,95% 100%,97.5% 0%,100% 100%)" }} />
            </div>

            <div style={{ padding: "16px 20px 20px" }}>

              {/* Customer + date */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#bbb" }}>ลูกค้า</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: PinkDark }}>{customerName || "—"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#bbb" }}>วันที่</div>
                  <div style={{ fontSize: 12, color: "#777" }}>{orderTime.toLocaleDateString("th-TH")}</div>
                  <div style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>{orderId}</div>
                </div>
              </div>

              {/* Appt (if filled) */}
              {(apptDate || apptTime) && (
                <div style={{ background: PinkLight, borderRadius: 12, padding: "8px 14px", marginBottom: 14, display: "flex", gap: 14 }}>
                  {apptDate && <span style={{ fontSize: 13, color: PinkDark, fontWeight: 700 }}>📅 {new Date(apptDate).toLocaleDateString("th-TH", { day:"numeric", month:"long" })}</span>}
                  {apptTime && <span style={{ fontSize: 13, color: PinkDark, fontWeight: 700 }}>⏰ {apptTime} น.</span>}
                </div>
              )}

              {/* Services */}
              <div style={{ borderTop: `1.5px dashed #f8bbd0`, paddingTop: 12, marginBottom: 12 }}>
                {selectedItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{item.emoji}</span>
                      <span style={{ fontSize: 14, color: "#444" }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: Pink }}>{getItemPrice(item).toLocaleString()} ฿</span>
                  </div>
                ))}
              </div>

              {/* Note */}
              {note && (
                <div style={{ background: "#fafafa", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#777" }}>
                  💬 {note}
                </div>
              )}

              {/* Total */}
              <div style={{ background: `linear-gradient(135deg,#f06292,${Pink})`, borderRadius: 16, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>รวมทั้งหมด</span>
                <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{total.toLocaleString()} ฿</span>
              </div>

              {/* Late notice (only if appt) */}
              {(apptDate || apptTime) && (
                <div style={{ background: "#fff8f0", border: "1px solid #ffe0cc", borderRadius: 10, padding: "8px 14px", marginBottom: 14, fontSize: 12, color: "#e65100" }}>
                  ⚠️ <b>สายเกิน 15 นาที</b> ทางร้านขอสงวนสิทธิ์<b>ยึดมัดจำ</b>นะคะ
                </div>
              )}

              <div style={{ textAlign: "center", fontSize: 11, color: "#ccc", marginBottom: 16 }}>
                🐌 ขอบคุณที่ใช้บริการ Snail Shop นะคะ
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setScreen("order")}
                  style={{ flex: 1, padding: "12px", borderRadius: 14, border: `2px solid ${Pink}`, background: "#fff", color: Pink, fontWeight: 800, cursor: "pointer", fontSize: 14 }}>
                  ← แก้ไข
                </button>
                <button onClick={() => { alert("กด Screenshot / Share เพื่อเซฟรูปได้เลยค่า 🐌") }}
                  style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", background: `linear-gradient(135deg,#f06292,${Pink})`, color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>
                  📸 เซฟรูป
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── ORDER FORM ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fce4ec,#fff0f6,#fff)", padding: "28px 16px 40px", fontFamily: "'Segoe UI',sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 44 }}>🐌</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: PinkDark, letterSpacing: 1 }}>Snail Shop</div>
          <div style={{ fontSize: 13, color: PinkMid, marginTop: 2 }}>ระบบคิดราคา & ออกใบเสร็จ</div>
        </div>

        {/* Customer */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(233,30,99,0.07)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: PinkMid, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>👤 ชื่อลูกค้า</div>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)}
            placeholder="กรอกชื่อลูกค้า..."
            style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #f8bbd0", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Services */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(233,30,99,0.07)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: PinkMid, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>💅 เลือกบริการ</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SERVICES.map((svc) => {
              const sel = isSelected(svc.id);
              return (
                <div key={svc.id} style={{ display: "flex", flexDirection: "column" }}>
                  <div onClick={() => toggleService(svc)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "11px 14px",
                      borderRadius: sel && (svc.rangeMax || svc.custom) ? "14px 14px 0 0" : 14,
                      cursor: "pointer",
                      background: sel ? PinkLight : "#fafafa",
                      border: `1.5px solid ${sel ? Pink : "#f0f0f0"}`,
                      borderBottom: sel && (svc.rangeMax || svc.custom) ? "none" : undefined,
                      transition: "all 0.15s"
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, background: sel ? Pink : "#fff", border: `2px solid ${sel ? Pink : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 900 }}>{sel ? "✓" : ""}</div>
                      <span style={{ fontSize: 14, fontWeight: sel ? 700 : 400, color: sel ? PinkDark : "#444" }}>{svc.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: sel ? Pink : "#bbb" }}>
                      {svc.rangeMax ? `${svc.price}–${svc.rangeMax} ฿` : svc.custom ? "กรอกราคา" : `${svc.price} ฿`}
                    </span>
                  </div>

                  {/* Larn price input */}
                  {sel && svc.rangeMax && (
                    <div style={{ background: PinkLight, border: `1.5px solid ${Pink}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "10px 14px" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="number" value={larnPrice} onChange={(e) => setLarnPrice(e.target.value)}
                          placeholder="กรอกราคาลาย..." min={20} max={80} inputMode="numeric"
                          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${Pink}`, fontSize: 17, fontWeight: 800, color: Pink, textAlign: "center", outline: "none", boxSizing: "border-box", background: "#fff" }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: Pink }}>฿</span>
                      </div>
                    </div>
                  )}

                  {/* Custom price input */}
                  {sel && svc.custom && (
                    <div style={{ background: PinkLight, border: `1.5px solid ${Pink}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "10px 14px" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="number" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)}
                          placeholder="กรอกราคา..." inputMode="numeric"
                          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${Pink}`, fontSize: 17, fontWeight: 800, color: Pink, textAlign: "center", outline: "none", boxSizing: "border-box", background: "#fff" }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: Pink }}>฿</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(233,30,99,0.07)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: PinkMid, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>💬 หมายเหตุ</div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น สีที่ต้องการ, แบบที่ชอบ, ข้อมูลเพิ่มเติม..."
            rows={2}
            style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1.5px solid #f8bbd0", fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Appointment (optional) */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(233,30,99,0.07)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: PinkMid, marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>📅 วันนัด (ถ้ามี)</div>
          <div style={{ fontSize: 11, color: "#bbb", marginBottom: 10 }}>ไม่บังคับ — ข้ามได้ถ้าแค่คิดราคาอย่างเดียว</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <input type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)}
                style={{ width: "100%", padding: "11px 12px", borderRadius: 12, border: "1.5px solid #f8bbd0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1 }}>
              <input type="time" value={apptTime} onChange={(e) => setApptTime(e.target.value)}
                style={{ width: "100%", padding: "11px 12px", borderRadius: 12, border: "1.5px solid #f8bbd0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        </div>

        {/* Total preview */}
        {selectedItems.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "16px 18px", marginBottom: 16, boxShadow: "0 4px 20px rgba(233,30,99,0.07)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: PinkMid, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>🧾 สรุป</div>
            {selectedItems.map((i) => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 5 }}>
                <span>{i.emoji} {i.name}</span>
                <span style={{ fontWeight: 700, color: PinkDark }}>{getItemPrice(i).toLocaleString()} ฿</span>
              </div>
            ))}
            <div style={{ borderTop: `1.5px dashed #f8bbd0`, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 900, color: Pink, fontSize: 18 }}>
              <span>รวม</span>
              <span>{total.toLocaleString()} ฿</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => selectedItems.length > 0 && setScreen("summary")}
          disabled={selectedItems.length === 0}
          style={{
            width: "100%", padding: "17px", borderRadius: 18, border: "none",
            background: selectedItems.length > 0 ? `linear-gradient(135deg,#f06292,${Pink})` : "#eee",
            color: selectedItems.length > 0 ? "#fff" : "#ccc",
            fontWeight: 900, fontSize: 17, cursor: selectedItems.length > 0 ? "pointer" : "not-allowed",
            boxShadow: selectedItems.length > 0 ? "0 6px 24px rgba(233,30,99,0.35)" : "none"
          }}>
          {selectedItems.length > 0 ? `ดูใบสรุปราคา ${total.toLocaleString()} ฿ →` : "เลือกบริการก่อนนะคะ 🐌"}
        </button>

      </div>
    </div>
  );
}
