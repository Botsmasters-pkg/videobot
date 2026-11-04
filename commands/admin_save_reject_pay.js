/*CMD
command: /admin_save_reject_pay
help: Save rejection status and notify user
need_reply: true
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

let orderId = User.getProperty("rejecting_order_id");
if (!orderId) {
  Bot.runCommand("/admin_payments");
  return;
}

let reason = (params && params === "default") ? "Payment screenshot could not be verified or funds not received in bank account." : (message || "Payment not verified or invalid screenshot.").trim();

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
  Bot.runCommand("/admin_payments");
  return;
}

payments[paymentIndex].status = "rejected";
payments[paymentIndex].reviewed_at = new Date().toISOString();
payments[paymentIndex].rejection_reason = reason;
Bot.setProperty("payment_requests", payments, "json");

User.setProperty("rejecting_order_id", null, "string");

let pay = payments[paymentIndex];

// Send notification to User
try {
  let userNotice =
    "❌ *Payment Request Rejected*\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Your payment request for Order ID `" + pay.order_id + "` (₹" + pay.amount + ") was not approved.\n\n" +
    "📝 *Reason:* " + reason + "\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "If you have already paid and believe this is an error, please reach out to Admin via /help.";

  let userButtons = [
    [{ title: "ℹ️ Contact Admin / Help", command: "/help" }],
    [{ title: "🏠 Main Menu", command: "/start" }]
  ];
  Bot.sendInlineKeyboardToChatWithId(pay.user_id, userButtons, userNotice);
} catch (e) {
  // If user chat unreachable
}

let adminButtons = [
  [{ title: "📋 View Pending Payments", command: "/admin_payments" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  adminButtons,
  "🚫 *Payment Rejected!*\n\n" +
  "🧾 Order ID: `" + pay.order_id + "`\n" +
  "👤 User ID: `" + pay.user_id + "`\n" +
  "📝 Reason: *" + reason + "*\n\n" +
  "User has been notified."
);
