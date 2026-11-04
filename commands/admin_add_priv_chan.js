/*CMD
command: /admin_add_priv_chan
help: Prompt admin for private channel details
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
  "🔒 *Add Private Channel*\n\n" +
  "Enter the *Channel Chat ID* and *Private Invite Link* separated by a space:\n\n" +
  "Format: `-1001234567890 https://t.me/+AbCdEfGh`\n\n" +
  "⚠️ *Note:* The bot must be an **Administrator** in this private channel to verify members!"
);

Bot.run({ command: "/admin_save_priv_chan" });

