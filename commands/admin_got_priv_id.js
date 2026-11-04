/*CMD
command: /admin_got_priv_id
help: Step 2 of 2 - Prompt admin for Private Channel Invite Link
need_reply: true
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

if (!message || message.trim() === "/admin") {
  Bot.runCommand("/admin_channels");
  return;
}

let chatId = message.trim();
if (!chatId.startsWith("-")) {
  Bot.sendMessage("⚠️ A channel Chat ID must start with `-` (usually `-100...`, e.g. `-1001234567890`).\n\nPlease re-enter the Channel Chat ID (or send /admin to cancel):");
  Bot.run({ command: "/admin_got_priv_id" });
  return;
}

User.setProperty("temp_chan_chat_id", chatId, "string");

let buttons = [[{ title: "❌ Cancel", command: "/admin_channels" }]];

let text =
  "✅ *Chat ID Saved:* `" + chatId + "`\n\n" +
  "🔒 *Step 2 of 2:* Now enter the **Private Invite Link** for this channel (e.g. `https://t.me/+AbCdEfGh`):\n\n" +
  "_(Send /admin to cancel)_";

Bot.sendInlineKeyboard(buttons, text);
Bot.run({ command: "/admin_got_priv_link" });
