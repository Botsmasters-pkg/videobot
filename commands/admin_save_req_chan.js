/*CMD
command: /admin_save_req_chan
help: Save private request channel
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

let parts = (message || "").trim().split(/\s+/);
if (parts.length < 2) {
  Bot.sendMessage("⚠️ Invalid format! Please enter *Chat ID* and *Join Request Link* separated by a space:\nExample: `-1001234567890 https://t.me/+JoinRequestLink`");
  Bot.run({ command: "/admin_save_req_chan" });
  return;
}

let chatId = parts[0].trim();
let inviteLink = parts[1].trim();

if (!chatId.startsWith("-100") && !chatId.startsWith("-")) {
  Bot.sendMessage("⚠️ Channel Chat ID usually starts with `-100`. Please re-enter:");
  Bot.run({ command: "/admin_save_req_chan" });
  return;
}

if (inviteLink.indexOf("t.me") === -1) {
  Bot.sendMessage("⚠️ Invalid invite link! Must be a valid Telegram link:");
  Bot.run({ command: "/admin_save_req_chan" });
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let newId = Date.now();

channels.push({
  id: newId,
  type: "request",
  username: null,
  chat_id: chatId,
  invite_link: inviteLink,
  title: "Request Channel (" + chatId + ")",
  enabled: true
});

Bot.setProperty("force_channels", channels, "json");

let buttons = [
  [{ title: "📢 Channels Management", command: "/admin_channels" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Private Request Channel Added Successfully!*\n\n• Chat ID: `" + chatId + "`\n• Request Link: " + inviteLink
);

