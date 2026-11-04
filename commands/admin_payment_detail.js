/*CMD
command: /admin_payment_detail
help: View payment request details with screenshot
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
let payment = null;
for (let i = 0; i < payments.length; i++) {
  if (payments[i].order_id === orderId) {
    payment = payments[i];
    break;
  }
}

if (!payment) {
  Bot.sendMessage("⚠️ Payment request not found.");
  Bot.runCommand("/admin_payments");
  return;
}

let statusBadge = "🟡 Pending Verification";
if (payment.status === "approved") {
  statusBadge = "🟢 Approved";
} else if (payment.status === "rejected") {
  statusBadge = "🔴 Rejected (" + (payment.rejection_reason || "None") + ")";
}

let dateStr = payment.created_at ? payment.created_at.replace("T", " ").substring(0, 19) : "Unknown";

let caption =
  "🧾 *Payment Request Details*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🆔 *Order ID:* `" + payment.order_id + "`\n" +
  "👤 *User:* " + payment.user_name + " (`" + payment.user_id + "`)" + (payment.user_username ? " (@" + payment.user_username + ")" : "") + "\n" +
  "💰 *Payment Amount:* *₹" + payment.amount + "*\n" +
  "🎁 *Requested Points:* *" + payment.points + " Points*\n" +
  "💳 *Admin UPI ID:* `" + (payment.upi_id || "N/A") + "`\n" +
  "📅 *Date & Time:* " + dateStr + "\n" +
  "⚡ *Status:* " + statusBadge + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━";

let buttons = [];

if (payment.status === "pending") {
  buttons.push([
    { title: "✅ Approve Payment", command: "/admin_approve_pay " + payment.order_id },
    { title: "❌ Reject Payment", command: "/admin_reject_pay " + payment.order_id }
  ]);
}

buttons.push([{ title: "🔙 Back to Pending List", command: "/admin_payments" }]);

if (payment.photo_file_id) {
  Api.sendPhoto({
    chat_id: chat.chatid,
    photo: payment.photo_file_id,
    caption: caption,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        (payment.status === "pending"
          ? [
              { text: "✅ Approve (+" + payment.points + " pts)", callback_data: "/admin_approve_pay " + payment.order_id },
              { text: "❌ Reject", callback_data: "/admin_reject_pay " + payment.order_id }
            ]
          : []),
        [{ text: "🔙 Back to Pending List", callback_data: "/admin_payments" }]
      ]
    }
  });
} else {
  Bot.sendInlineKeyboard(buttons, caption);
}

