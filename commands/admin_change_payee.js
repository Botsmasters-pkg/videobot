/*CMD
command: /admin_change_payee
help: Prompts admin to enter new Payee Name
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

let cur = Bot.getProperty("admin_payee_name") || "Video Bot";
let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_upi_settings" }]];

Bot.sendInlineKeyboard(
  buttons,
  "✏️ *Change Payee Name*\n\n" +
  "Current Payee Name: *" + cur + "*\n\n" +
  "👉 Enter the new name to display on UPI apps (e.g. `Video Bot Support`):\n\n" +
  "_(Send /admin to cancel)_"
);

Bot.run({ command: "/admin_save_payee_input" });
