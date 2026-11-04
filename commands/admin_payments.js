/*CMD
command: /admin_payments
help: Admin Payment Approval & Review System
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

let payments = Bot.getProperty("payment_requests") || [];

let pendingList = [];
let approvedCount = 0;
let rejectedCount = 0;

for (let i = 0; i < payments.length; i++) {
  let p = payments[i];
  if (p.status === "pending") {
    pendingList.push(p);
  } else if (p.status === "approved") {
    approvedCount++;
  } else if (p.status === "rejected") {
    rejectedCount++;
  }
}

let buttons = [];

if (pendingList.length === 0) {
  buttons.push([{ title: "🔄 Refresh List", command: "/admin_payments" }]);
  buttons.push([{ title: "🔙 Admin Dashboard", command: "/admin" }]);

  let text =
    "💳 *Payment Management Dashboard*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "🟡 *Pending Requests:* 0\n" +
    "🟢 *Total Approved:* " + approvedCount + "\n" +
    "🔴 *Total Rejected:* " + rejectedCount + "\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "_No pending payment approval requests right now._";

  Bot.sendInlineKeyboard(buttons, text);
  return;
}

// Show up to 10 pending requests
let maxShow = Math.min(pendingList.length, 10);
for (let i = 0; i < maxShow; i++) {
  let item = pendingList[i];
  buttons.push([
    {
      title: "🔍 " + item.order_id + " (₹" + item.amount + " ➔ " + item.points + " pts)",
      command: "/admin_payment_detail " + item.order_id
    }
  ]);
}

buttons.push([{ title: "🔄 Refresh List", command: "/admin_payments" }]);
buttons.push([{ title: "🔙 Admin Dashboard", command: "/admin" }]);

let text =
  "💳 *Payment Management Dashboard*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🟡 *Pending Requests:* *" + pendingList.length + "*\n" +
  "🟢 *Total Approved:* *" + approvedCount + "*\n" +
  "🔴 *Total Rejected:* *" + rejectedCount + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap any pending order below to review the screenshot and approve/reject:";

Bot.sendInlineKeyboard(buttons, text);
