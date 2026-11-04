/*CMD
command: /admin_save_pub_chan
help: Save public channel
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

let username = (message || "").trim();
if (!username.startsWith("@") || username.length < 3) {
  Bot.sendMessage("⚠️ Invalid username! It must start with `@` (e.g. `@MyChannel`). Please try again:");
  Bot.run({ command: "/admin_save_pub_chan" });
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let newId = Date.now();

channels.push({
  id: newId,
  type: "public",
  username: username,
  chat_id: username,
  invite_link: "https://t.me/" + username.replace("@", ""),
  title: username,
  enabled: true
});

Bot.setProperty("force_channels", channels, "json");

let buttons = [
  [{ title: "📢 Channels Management", command: "/admin_channels" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Public Channel Added Successfully!*\n\nChannel: *" + username + "*\nLink: https://t.me/" + username.replace("@", "")
);
