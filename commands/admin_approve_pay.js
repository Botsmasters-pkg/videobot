/*CMD
command: /admin_approve_pay
help: Approve pending payment and credit points
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
  Bot.runCommand("/admin_payments");
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
  Bot.runCommand("/admin_payments");
  return;
}

let pay = payments[paymentIndex];

// Security: Prevent duplicate credit!
if (pay.status === "approved") {
  Bot.sendMessage("⚠️ *Already Approved:* This payment was already approved on " + (pay.reviewed_at || "earlier") + ".");
  return;
}

if (pay.status === "rejected") {
  Bot.sendMessage("⚠️ *Already Rejected:* This payment was marked rejected earlier.");
  return;
}

// Mark Approved
payments[paymentIndex].status = "approved";
payments[paymentIndex].reviewed_at = new Date().toISOString();
Bot.setProperty("payment_requests", payments, "json");

// Credit Points to User
let currentPoints = Bot.getProperty("points_" + pay.user_id) || 0;
let newPoints = currentPoints + pay.points;
Bot.setProperty("points_" + pay.user_id, newPoints, "integer");

let totalDistributed = (Bot.getProperty("total_points_distributed") || 0) + pay.points;
Bot.setProperty("total_points_distributed", totalDistributed, "integer");

// Record transaction on user profile
let history = Bot.getProperty("user_history_" + pay.user_id) || [];
history.push({
  type: "earned",
  amount: pay.points,
  reason: "Purchased package ₹" + pay.amount,
  date: new Date().toISOString()
});
Bot.setProperty("user_history_" + pay.user_id, history, "json");

// Send instant notification to User
try {
  let userNotice =
    "🎉 *Payment Approved!*\n\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Your payment of *₹" + pay.amount + "* (Order ID: `" + pay.order_id + "`) has been verified and approved by the Administrator!\n\n" +
    "🎁 *+" + pay.points + " Points Credited to your account!*\n" +
    "💎 *Your New Balance:* *" + newPoints + " Points*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Tap below to browse and stream videos now 👇";

  let userButtons = [
    [{ title: "🎬 Get Video", command: "/get_video" }],
    [{ title: "💰 My Points", command: "/my_points" }]
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
  "✅ *Payment Approved Successfully!*\n\n" +
  "🧾 Order ID: `" + pay.order_id + "`\n" +
  "👤 User ID: `" + pay.user_id + "`\n" +
  "💰 Amount: *₹" + pay.amount + "*\n" +
  "🎁 Points Credited: *" + pay.points + " Points*\n" +
  "💎 User New Total: *" + newPoints + " Points*"
);

