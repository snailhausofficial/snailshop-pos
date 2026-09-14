import { useState, useRef } from "react";
import html2canvas from "html2canvas";

// ── Supabase config ──────────────────────────────────────────────
const SUPABASE_URL = "https://ugyzgflzcriqjjkvsfch.supabase.co";
const SUPABASE_KEY = "sb_publishable_FD_RGbgYu-v3q7BlcF8lVQ_FqQbebQ5";

const LINE_TOKEN = "IMiW6beyN5bktCu2OsE3Zo9h67LnmaGWlKawZC+5jHpenVyaYWhJvIiwvMzPWRgICZyhM0DXGSQpbCqQO5fcZPbT5BiRRamqKj0AtJs7e+iGA1bE1sE2g43a/wDel6JNcrKLCANnPUUbS5HAEYvaowdB04t89/1O/w1cDnyilFU=";
const LINE_USER_IDS = [
  "U3ffb096501297ba524edd862473d9b84", // มาย
  "U98f03b69129393d3961317664d34de01",  // ดา
];

async function saveOrder(data) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    console.error("Save order error:", e);
    return false;
  }
}

async function notifyLine(data) {
  const msg = [
    "🐌 ออเดอร์ใหม่!",
    `👤 ลูกค้า: ${data.customer_name}`,
    `💅 บริการ: ${data.services}`,
    `💰 รวม: ${data.total} ฿`,
    data.note ? `💬 หมายเหตุ: ${data.note}` : "",
    data.appt_date ? `📅 นัด: ${data.appt_date} ${data.appt_time || ""}` : "",
    `🔖 Order ID: ${data.order_id}`
  ].filter(Boolean).join("\n");

  try {
    await Promise.all(LINE_USER_IDS.map(userId =>
      fetch("https://api.line.me/v2/bot/message/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${LINE_TOKEN}`
        },
        body: JSON.stringify({
          to: userId,
          messages: [{ type: "text", text: msg }]
        })
      })
    ));
  } catch (e) {
    console.error("LINE notify error:", e);
  }
}

// ── Snail Shop CI — Brand Book v1.0 ─────────────────────────────────
const C = {
  sweetPink: "#FFB6C1",   // พื้นหลังรอง
  mainPink:  "#FF8FA3",   // CTA / เน้น
  deepRose:  "#B5006E",   // Typography / Heading
  bgBody:    "#FDECD8",   // พื้นหลักหลัก (ครีม)
  petal:     "#FFE4F0",   // Card / Box
  candy:     "#FFD6E7",   // Hover / Tag
  plum:      "#3D2030",   // Text หลัก
  neutral:   "#F5F5F5",   // พื้นกลาง
  white:     "#FFFFFF",
};
const FONT = "'Itim', sans-serif";

const SERVICES = [
  { id: 1,  name: "สีพื้น",          price: 150, emoji: "💅" },
  { id: 2,  name: "สีลูกแก้ว",       price: 300, emoji: "🫧" },
  { id: 3,  name: "สีแฟลช",          price: 250, emoji: "⚡" },
  { id: 4,  name: "ออมเบร / ขัดผง",  price: 200, emoji: "🌈" },
  { id: 5,  name: "เฟร้นเนล",        price: 200, emoji: "🤍" },
  { id: 6,  name: "สีไซรัป",         price: 200, emoji: "🍹" },
  { id: 7,  name: "ลาย",             price: 20,  rangeMax: 80, emoji: "🌸" },
  { id: 8,  name: "ต่อเล็บชิดโคน",  price: 150, emoji: "✨" },
  { id: 9,  name: "ต่อเล็บเว้นโคน", price: 250, emoji: "🌟" },
  { id: 10, name: "ต่อโพลี่เจล",    price: 699, emoji: "💎" },
  { id: 11, name: "ถอดสี",           price: 100, emoji: "🧴" },
  { id: 12, name: "ถอดสี PVC",       price: 150, emoji: "🧼" },
  { id: 13, name: "เสริมหน้าเล็บ",  price: 100, emoji: "🔧" },
  { id: 14, name: "Overlay",         price: 200, emoji: "💫" },
  { id: 15, name: "ออกแบบลาย",      price: 200, emoji: "🎨" },
  { id: 16, name: "อื่นๆ",           price: 0,   custom: true, emoji: "📝" },
];

function generateOrderId() {
  const now = new Date();
  const d = `${String(now.getDate()).padStart(2,"0")}${String(now.getMonth()+1).padStart(2,"0")}${now.getFullYear()}`;
  const rand = String(Math.floor(Math.random() * 99999)).padStart(5,"0");
  return `${d}-${rand}`;
}

// ── Placeholder logo (swap with real logo file later) ──────────────
function LogoMark({ size = 40, reverse = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: reverse ? C.white : `linear-gradient(135deg, ${C.sweetPink}, ${C.mainPink})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.55, flexShrink: 0,
      border: reverse ? "none" : `2px solid ${C.white}`,
      boxShadow: "0 2px 8px rgba(181,0,110,0.15)"
    }}>
      🐌
    </div>
  );
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
  const cardRef = useRef(null);

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

  const fontImport = (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');`}</style>
  );

  // ─── SUMMARY CARD ───────────────────────────────────────────────
  if (screen === "summary") {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.bgBody}, ${C.petal} 60%, ${C.bgBody})`, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "28px 16px 40px", fontFamily: FONT }}>
        {fontImport}
        <div style={{ width: "100%", maxWidth: 380 }}>

          <div ref={cardRef} style={{ background: C.white, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(181,0,110,0.16)" }}>

            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${C.mainPink}, ${C.deepRose})`, padding: "22px 24px 18px", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <LogoMark size={40} reverse />
                <div>
                  <div style={{ fontSize: 21, fontWeight: 400, color: "#fff", letterSpacing: 0.5 }}>Snail Shop</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginTop: 1 }}>062-989-9419 / 065-429-5646 · Line: @402fdhvy</div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 12, background: C.white, clipPath: "polygon(0% 100%,2.5% 0%,5% 100%,7.5% 0%,10% 100%,12.5% 0%,15% 100%,17.5% 0%,20% 100%,22.5% 0%,25% 100%,27.5% 0%,30% 100%,32.5% 0%,35% 100%,37.5% 0%,40% 100%,42.5% 0%,45% 100%,47.5% 0%,50% 100%,52.5% 0%,55% 100%,57.5% 0%,60% 100%,62.5% 0%,65% 100%,67.5% 0%,70% 100%,72.5% 0%,75% 100%,77.5% 0%,80% 100%,82.5% 0%,85% 100%,87.5% 0%,90% 100%,92.5% 0%,95% 100%,97.5% 0%,100% 100%)" }} />
            </div>

            <div style={{ padding: "16px 20px 20px", background: C.white }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#bbb" }}>ลูกค้า</div>
                  <div style={{ fontSize: 17, fontWeight: 400, color: C.deepRose }}>{customerName || "—"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#bbb" }}>วันที่</div>
                  <div style={{ fontSize: 12, color: C.plum }}>{orderTime.toLocaleDateString("th-TH")}</div>
                  <div style={{ fontSize: 11, color: "#bbb", fontFamily: "monospace" }}>{orderId}</div>
                </div>
              </div>

              {(apptDate || apptTime) && (
                <div style={{ background: C.petal, borderRadius: 12, padding: "8px 14px", marginBottom: 14, display: "flex", gap: 14 }}>
                  {apptDate && <span style={{ fontSize: 13, color: C.deepRose, fontWeight: 400 }}>📅 {new Date(apptDate).toLocaleDateString("th-TH", { day:"numeric", month:"long" })}</span>}
                  {apptTime && <span style={{ fontSize: 13, color: C.deepRose, fontWeight: 400 }}>⏰ {apptTime} น.</span>}
                </div>
              )}

              <div style={{ borderTop: `1.5px dashed ${C.sweetPink}`, paddingTop: 12, marginBottom: 12 }}>
                {selectedItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{item.emoji}</span>
                      <span style={{ fontSize: 14, color: C.plum }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 400, color: C.mainPink }}>{getItemPrice(item).toLocaleString()} ฿</span>
                  </div>
                ))}
              </div>

              {note && (
                <div style={{ background: C.neutral, borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#777" }}>
                  💬 {note}
                </div>
              )}

              <div style={{ background: `linear-gradient(135deg, ${C.mainPink}, ${C.deepRose})`, borderRadius: 16, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 16, fontWeight: 400, color: "#fff" }}>รวมทั้งหมด</span>
                <span style={{ fontSize: 28, fontWeight: 400, color: "#fff" }}>{total.toLocaleString()} ฿</span>
              </div>

              {(apptDate || apptTime) && (
                <div style={{ background: "#FFF4E0", border: "1px solid #FFD9A0", borderRadius: 10, padding: "8px 14px", marginBottom: 14, fontSize: 12, color: "#B5722B" }}>
                  ⚠️ <b>สายเกิน 15 นาที</b> ทางร้านขอสงวนสิทธิ์<b>ยึดมัดจำ</b>นะคะ
                </div>
              )}

              <div style={{ textAlign: "center", fontSize: 12, color: C.deepRose, marginBottom: 16 }}>
                🐌 ขอบคุณสำหรับออเดอร์นะคะ💕 ถ้าชอบ ฝากรีวิวด้วยน้า
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setScreen("order")}
                  style={{ flex: 1, padding: "12px", borderRadius: 14, border: `2px solid ${C.mainPink}`, background: "#fff", color: C.deepRose, fontWeight: 400, cursor: "pointer", fontSize: 15, fontFamily: FONT }}>
                  ← แก้ไข
                </button>
                <button onClick={() => {
                  html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null }).then(canvas => {
                    const link = document.createElement("a");
                    link.download = "snailshop-summary.png";
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                  });
                }}
                  style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", background: `linear-gradient(135deg, ${C.mainPink}, ${C.deepRose})`, color: "#fff", fontWeight: 400, cursor: "pointer", fontSize: 15, fontFamily: FONT }}>
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
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.bgBody}, ${C.petal} 50%, ${C.bgBody})`, padding: "28px 16px 40px", fontFamily: FONT }}>
      {fontImport}
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <LogoMark size={64} />
          </div>
          <div style={{ fontSize: 26, fontWeight: 400, color: C.deepRose, letterSpacing: 0.5 }}>Snail Shop</div>
          <div style={{ fontSize: 13, color: C.mainPink, marginTop: 2 }}>ระบบคิดราคา & ออกใบเสร็จ</div>
        </div>

        {/* Customer */}
        <div style={{ background: C.white, borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(181,0,110,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 400, color: C.mainPink, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>👤 ชื่อลูกค้า</div>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)}
            placeholder="กรอกชื่อลูกค้า..."
            style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: `1.5px solid ${C.sweetPink}`, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: FONT, color: C.plum }} />
        </div>

        {/* Services */}
        <div style={{ background: C.white, borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(181,0,110,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 400, color: C.mainPink, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>💅 เลือกบริการ</div>
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
                      background: sel ? C.petal : C.neutral,
                      border: `1.5px solid ${sel ? C.mainPink : "#eee"}`,
                      borderBottom: sel && (svc.rangeMax || svc.custom) ? "none" : undefined,
                      transition: "all 0.15s"
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, background: sel ? C.mainPink : "#fff", border: `2px solid ${sel ? C.mainPink : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>{sel ? "✓" : ""}</div>
                      <span style={{ fontSize: 14, fontWeight: sel ? 400 : 400, color: sel ? C.deepRose : C.plum }}>{svc.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 400, color: sel ? C.mainPink : "#bbb" }}>
                      {svc.rangeMax ? `${svc.price}–${svc.rangeMax} ฿` : svc.custom ? "กรอกราคา" : `${svc.price} ฿`}
                    </span>
                  </div>

                  {sel && svc.rangeMax && (
                    <div style={{ background: C.petal, border: `1.5px solid ${C.mainPink}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "10px 14px" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="number" value={larnPrice} onChange={(e) => setLarnPrice(e.target.value)}
                          placeholder="กรอกราคาลาย..." min={20} max={80} inputMode="numeric"
                          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.mainPink}`, fontSize: 17, fontWeight: 400, color: C.deepRose, textAlign: "center", outline: "none", boxSizing: "border-box", background: "#fff", fontFamily: FONT }} />
                        <span style={{ fontSize: 14, fontWeight: 400, color: C.mainPink }}>฿</span>
                      </div>
                    </div>
                  )}

                  {sel && svc.custom && (
                    <div style={{ background: C.petal, border: `1.5px solid ${C.mainPink}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "10px 14px" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="number" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)}
                          placeholder="กรอกราคา..." inputMode="numeric"
                          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.mainPink}`, fontSize: 17, fontWeight: 400, color: C.deepRose, textAlign: "center", outline: "none", boxSizing: "border-box", background: "#fff", fontFamily: FONT }} />
                        <span style={{ fontSize: 14, fontWeight: 400, color: C.mainPink }}>฿</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div style={{ background: C.white, borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(181,0,110,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 400, color: C.mainPink, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>💬 หมายเหตุ</div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น สีที่ต้องการ, แบบที่ชอบ, ข้อมูลเพิ่มเติม..."
            rows={2}
            style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: `1.5px solid ${C.sweetPink}`, fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: FONT, color: C.plum }} />
        </div>

        {/* Appointment */}
        <div style={{ background: C.white, borderRadius: 20, padding: "18px", marginBottom: 14, boxShadow: "0 4px 20px rgba(181,0,110,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 400, color: C.mainPink, marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>📅 วันนัด (ถ้ามี)</div>
          <div style={{ fontSize: 11, color: "#bbb", marginBottom: 10 }}>ไม่บังคับ — ข้ามได้ถ้าแค่คิดราคาอย่างเดียว</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <input type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)}
                style={{ width: "100%", padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${C.sweetPink}`, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: FONT, color: C.plum }} />
            </div>
            <div style={{ flex: 1 }}>
              <input type="time" value={apptTime} onChange={(e) => setApptTime(e.target.value)}
                style={{ width: "100%", padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${C.sweetPink}`, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: FONT, color: C.plum }} />
            </div>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div style={{ background: C.white, borderRadius: 20, padding: "16px 18px", marginBottom: 16, boxShadow: "0 4px 20px rgba(181,0,110,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 400, color: C.mainPink, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>🧾 สรุป</div>
            {selectedItems.map((i) => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 5 }}>
                <span>{i.emoji} {i.name}</span>
                <span style={{ fontWeight: 400, color: C.deepRose }}>{getItemPrice(i).toLocaleString()} ฿</span>
              </div>
            ))}
            <div style={{ borderTop: `1.5px dashed ${C.sweetPink}`, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 400, color: C.mainPink, fontSize: 19 }}>
              <span>รวม</span>
              <span>{total.toLocaleString()} ฿</span>
            </div>
          </div>
        )}

        <button
          onClick={async () => {
            if (selectedItems.length === 0) return;
            const orderData = {
              order_id: orderId,
              customer_name: customerName || "ไม่ระบุ",
              services: selectedItems.map(i => `${i.name} (${getItemPrice(i)}฿)`).join(", "),
              total: total,
              note: note || null,
              appt_date: apptDate || null,
              appt_time: apptTime || null,
              created_at: new Date().toISOString()
            };
            await saveOrder(orderData);
            await notifyLine(orderData);
            setScreen("summary");
          }}
          disabled={selectedItems.length === 0}
          style={{
            width: "100%", padding: "17px", borderRadius: 18, border: "none",
            background: selectedItems.length > 0 ? `linear-gradient(135deg, ${C.mainPink}, ${C.deepRose})` : "#eee",
            color: selectedItems.length > 0 ? "#fff" : "#ccc",
            fontWeight: 400, fontSize: 18, cursor: selectedItems.length > 0 ? "pointer" : "not-allowed",
            boxShadow: selectedItems.length > 0 ? "0 6px 24px rgba(181,0,110,0.3)" : "none",
            fontFamily: FONT
          }}>
          {selectedItems.length > 0 ? `ดูใบสรุปราคา ${total.toLocaleString()} ฿ →` : "เลือกบริการก่อนนะคะ 🐌"}
        </button>

      </div>
    </div>
  );
}
