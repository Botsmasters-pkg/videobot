/*CMD
command: /admin_got_req_link
help: Saves Private Request Channel with Chat ID and Request Link
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
  User.setProperty("temp_req_chat_id", null, "string");
  Bot.runCommand("/admin_channels");
  return;
}

let link = message.trim();
if (link.indexOf("t.me") === -1) {
  Bot.sendMessage("⚠️ Invalid link! It must be a valid Telegram link:\n\nPlease re-enter the link (or send /admin to cancel):");
  Bot.run({ command: "/admin_got_req_link" });
  return;
}

let chatId = User.getProperty("temp_req_chat_id");
if (!chatId) {
  Bot.runCommand("/admin_add_req_chan");
  return;
}

User.setProperty("temp_req_chat_id", null, "string");

let channels = Bot.getProperty("force_channels") || [];
let newId = Date.now();

channels.push({
  id: newId,
  type: "request",
  username: null,
  chat_id: chatId,
  invite_link: link,
  title: "Request Channel (" + chatId + ")",
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
  "✅ *Private Request Channel Added Successfully!*\n\n" +
  "• 📩 *Type:* Private Request Channel\n" +
  "• 🆔 *Chat ID:* `" + chatId + "`\n" +
  "• 🔗 *Request Link:* " + link + "\n\n" +
  "Users sending a Join Request to this channel will be verified immediately."
);
