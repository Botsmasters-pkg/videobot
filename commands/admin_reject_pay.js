/*CMD
command: /admin_reject_pay
help: Instantly reject a payment request and notify user
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let primaryAdmin = 8710308658;
if (user.telegramid != primaryAdmin && user.telegramid != String(primaryAdmin)) {
  Bot.sendMessage("🚫 *Access Denied.*");
  return;
}

let orderId = (params || "").trim();
if (!orderId) {
  Bot.runCommand("/admin_payments pending");
  return;
}

let payments = Bot.getProperty("payment_requests") || [];
let paymentIndex = -1;
for (let i = 0; i < payments.length; i++) {
  if (payments[i].order_id === orderId) {
    paymentIndex = i;
    break;
  }
}

if (paymentIndex === -1) {
  Bot.sendMessage("⚠️ Payment request not found.");
  Bot.runCommand("/admin_payments pending");
  return;
}

let pay = payments[paymentIndex];

if (pay.status === "rejected") {
  Bot.sendMessage("⚠️ This payment was already rejected earlier.");
  Bot.runCommand("/admin_payments pending");
  return;
}

// Mark status as rejected
payments[paymentIndex].status = "rejected";
payments[paymentIndex].reviewed_at = new Date().toISOString();
payments[paymentIndex].rejection_reason = "Payment screenshot could not be verified or funds not received in bank account.";
Bot.setProperty("payment_requests", payments, "json");

// Notify User
try {
  let userNotice =
    "❌ *Payment Request Rejected*\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Your payment request for Order ID `" + pay.order_id + "` (₹" + pay.amount + ") could not be verified.\n\n" +
    "📝 *Reason:* Payment screenshot could not be verified or funds not received in bank account.\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "If you have already paid, please contact Admin via /help.";

  let userButtons = [
    [{ title: "ℹ️ Contact Admin / Help", command: "/help" }],
    [{ title: "🏠 Main Menu", command: "/start" }]
  ];
  Bot.sendInlineKeyboardToChatWithId(pay.user_id, userButtons, userNotice);
} catch (e) {
  // If user chat unreachable
}

let adminButtons = [
  [{ title: "📋 View Pending Payments", command: "/admin_payments pending" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  adminButtons,
  "🚫 *Payment Rejected Successfully!*\n\n" +
  "🧾 *Order ID:* `" + pay.order_id + "`\n" +
  "👤 *User ID:* `" + pay.user_id + "`\n" +
  "💰 *Amount:* *₹" + pay.amount + "*\n\n" +
  "• Status updated to **Rejected** (moved out of pending list).\n" +
  "• No points were credited to the user.\n" +
  "• User has been notified."
);
