/*CMD
command: /admin_got_req_id
help: Step 2 of 2 - Prompt admin for Request Channel Invite Link
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
  Bot.run({ command: "/admin_got_req_id" });
  return;
}

User.setProperty("temp_req_chat_id", chatId, "string");

let buttons = [[{ title: "❌ Cancel", command: "/admin_channels" }]];

let text =
  "✅ *Chat ID Saved:* `" + chatId + "`\n\n" +
  "📩 *Step 2 of 2:* Now enter the **Join Request Invite Link** for this channel (e.g. `https://t.me/+JoinRequestLink`):\n\n" +
  "📌 *Rule:* When users click this link and submit a Join Request, they are considered verified immediately without waiting for admin approval!\n\n" +
  "_(Send /admin to cancel)_";

Bot.sendInlineKeyboard(buttons, text);
Bot.run({ command: "/admin_got_req_link" });
