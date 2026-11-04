/*CMD
command: /admin_change_upi
help: Prompts admin to enter new UPI ID
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

let cur = Bot.getProperty("admin_upi_id") || "paytmqr2810050501011@paytm";
let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_upi_settings" }]];

Bot.sendInlineKeyboard(
  buttons,
  "✏️ *Change Admin UPI ID*\n\n" +
  "Current UPI ID: `" + cur + "`\n\n" +
  "👉 Enter your new UPI ID (e.g. `yourname@okaxis`, `yourname@paytm`):\n\n" +
  "_(Send /admin to cancel)_"
);

Bot.run({ command: "/admin_save_upi_input" });

