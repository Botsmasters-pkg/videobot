/*CMD
command: /admin_got_priv_link
help: Saves Private Channel with Name, Chat ID, and Invite Link
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
  User.setProperty("temp_priv_name", null, "string");
  User.setProperty("temp_chan_chat_id", null, "string");
  Bot.runCommand("/admin_channels");
  return;
}

let link = message.trim();
if (link.indexOf("t.me") === -1) {
  Bot.sendMessage("⚠️ Invalid link! It must be a valid Telegram link (e.g. `https://t.me/+AbCdEf`):\n\nPlease re-enter the link (or send /admin to cancel):");
  Bot.run({ command: "/admin_got_priv_link" });
  return;
}

let chatId = User.getProperty("temp_chan_chat_id");
let channelName = User.getProperty("temp_priv_name") || ("Private Channel (" + chatId + ")");

User.setProperty("temp_chan_chat_id", null, "string");
User.setProperty("temp_priv_name", null, "string");

let channels = Bot.getProperty("force_channels") || [];
let newId = Date.now();

channels.push({
  id: newId,
  type: "private",
  username: null,
  chat_id: chatId,
  invite_link: link,
  title: channelName,
  enabled: true
});

Bot.setProperty("force_channels", channels, "json");

let buttons = [
  [{ title: "📋 View All Channels (" + channels.length + ")", command: "/admin_list_channels" }],
  [{ title: "📢 Force Channels Menu", command: "/admin_channels" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Private Channel Added Successfully!*\n\n" +
  "• 🏷 *Channel Name:* " + channelName + "\n" +
  "• 🔘 *Join Button Preview:* `[ " + channelName + " ]`\n" +
  "• 🆔 *Chat ID:* `" + chatId + "`\n" +
  "• 🔗 *Invite Link:* " + link + "\n\n" +
  "Users will see the button with only the channel name: *" + channelName + "*!"
);
