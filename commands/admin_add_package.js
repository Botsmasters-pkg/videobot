/*CMD
command: /admin_add_package
help: Prompt admin for new package details
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

let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_pricing" }]];
Bot.sendInlineKeyboard(
  buttons,
  "➕ *Add New Pricing Package*\n\n" +
  "Enter the *Amount in ₹ and Points* separated by a space (e.g. `15 150` for ₹15 = 150 Points):\n\n" +
  "_Minimum amount is ₹10._"
);

Bot.run({ command: "/admin_save_package" });
