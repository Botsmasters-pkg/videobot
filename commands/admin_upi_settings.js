/*CMD
command: /admin_upi_settings
help: Configure UPI ID and Payee Name for Dynamic QR
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

let upiId = Bot.getProperty("admin_upi_id") || "paytmqr2810050501011@paytm";
let payeeName = Bot.getProperty("admin_payee_name") || "Video Bot";

let text =
  "📱 *Dynamic UPI ID & QR Configuration*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Current UPI ID: `" + upiId + "`\n" +
  "Current Payee Name: *" + payeeName + "*\n\n" +
  "📌 *How it works:*\n" +
  "Whenever any user clicks *Buy Points*, the bot creates a dynamic QR code pre-filled with this UPI ID and the package amount. When you change this UPI ID, all new payment QRs will immediately use the updated ID!\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select an option to update:";

let buttons = [
  [{ title: "✏️ Change UPI ID", command: "/admin_save_upi upi_id" }],
  [{ title: "✏️ Change Payee Name", command: "/admin_save_upi payee_name" }],
  [{ title: "🔙 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);

