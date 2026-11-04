/*CMD
command: /admin_add_pub_chan
help: Prompt admin for public channel username
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

let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_channels" }]];

Bot.sendInlineKeyboard(
  buttons,
  "📢 *Add Public Channel*\n\n" +
  "Enter the channel username starting with `@` (e.g. `@MyTelegramChannel`):\n\n" +
  "⚠️ *Important:* Make sure the bot is added as an **Administrator** in your channel so it can verify user memberships!"
);

Bot.run({ command: "/admin_save_pub_chan" });

