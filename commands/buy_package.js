/*CMD
command: /buy_package
help: Generates Dynamic UPI QR Code for Selected Package
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let pkgId = parseInt(params);
if (!pkgId) {
  Bot.runCommand("/buy_points");
  return;
}

let packages = Bot.getProperty("pricing_packages") || [
  { id: 1, amount: 10, points: 100 },
  { id: 2, amount: 20, points: 200 },
  { id: 3, amount: 50, points: 500 },
  { id: 4, amount: 100, points: 1000 }
];

let selectedPkg = null;
for (let i = 0; i < packages.length; i++) {
  if (packages[i].id === pkgId) {
    selectedPkg = packages[i];
    break;
  }
}

if (!selectedPkg) {
  Bot.sendMessage("⚠️ Selected package not found. Please choose an active package.");
  Bot.runCommand("/buy_points");
  return;
}

let adminUpi = Bot.getProperty("admin_upi_id") || "paytmqr2810050501011@paytm";
let adminPayee = Bot.getProperty("admin_payee_name") || "Video Bot";

let orderId = "PAY-" + user.telegramid + "-" + Date.now().toString().slice(-5);

// Build standard UPI URI
let upiUri =
  "upi://pay?pa=" +
  encodeURIComponent(adminUpi) +
  "&pn=" +
  encodeURIComponent(adminPayee) +
  "&am=" +
  encodeURIComponent(selectedPkg.amount.toFixed(2)) +
  "&cu=INR&tn=" +
  encodeURIComponent("Points Order " + orderId);

// Dynamic QR code API
let qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=" + encodeURIComponent(upiUri);

// Save active order state
User.setProperty("active_order", {
  order_id: orderId,
  amount: selectedPkg.amount,
  points: selectedPkg.points,
  upi_id: adminUpi,
  created_at: new Date().toISOString()
}, "json");
User.setProperty("awaiting_payment_screenshot", true, "boolean");

let caption =
  "💳 *Dynamic UPI Payment QR Code*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📦 *Selected Package:* ₹" + selectedPkg.amount + " ➔ *" + selectedPkg.points + " Points*\n" +
  "💰 *Exact Amount to Pay:* *₹" + selectedPkg.amount + "*\n" +
  "🆔 *Admin UPI ID:* `" + adminUpi + "`\n" +
  "🧾 *Order ID:* `" + orderId + "`\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📌 *Easy Payment Steps:*\n" +
  "1. Scan this QR code using *Google Pay, PhonePe, Paytm, or BHIM*.\n" +
  "2. The amount *₹" + selectedPkg.amount + "* is automatically pre-filled.\n" +
  "3. Alternatively, copy the UPI ID above and pay ₹" + selectedPkg.amount + " manually.\n" +
  "4. Once paid, **send or upload the payment screenshot directly in this chat**!\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_Awaiting payment screenshot..._";

let inlineKeyboard = [
  [{ text: "📤 Upload Screenshot", callback_data: "/upload_screenshot" }],
  [{ text: "❌ Cancel Order", callback_data: "/cancel_payment" }],
  [{ text: "🔙 Choose Another Package", callback_data: "/buy_points" }]
];

Api.sendPhoto({
  chat_id: chat.chatid,
  photo: qrUrl,
  caption: caption,
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: inlineKeyboard
  }
});
