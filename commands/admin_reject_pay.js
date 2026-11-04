/*CMD
command: /admin_reject_pay
help: Prompt admin for rejection reason
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

User.setProperty("rejecting_order_id", orderId, "string");

let buttons = [
  [{ title: "❌ Default Reason (Fake/Unverified)", command: "/admin_save_reject_pay default" }],
  [{ title: "🔙 Cancel & Return", command: "/admin_payments" }]
];

let text =
  "❌ *Reject Payment Request: " + orderId + "*\n\n" +
  "Please type the *rejection reason* to send to the user, or click below for default reason:";

Bot.sendInlineKeyboard(buttons, text);
Bot.run({ command: "/admin_save_reject_pay" });

