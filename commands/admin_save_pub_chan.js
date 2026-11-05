/*CMD
command: /admin_save_pub_chan
help: Save public channel with custom channel name
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
  User.setProperty("temp_pub_name", null, "string");
  Bot.runCommand("/admin_channels");
  return;
}

let username = message.trim();
if (!username.startsWith("@") || username.length < 3) {
  Bot.sendMessage("⚠️ Invalid username! It must start with `@` (e.g. `@MyChannel`). Please try again:");
  Bot.run({ command: "/admin_save_pub_chan" });
  return;
}

let channelName = User.getProperty("temp_pub_name") || username.replace("@", "");
User.setProperty("temp_pub_name", null, "string");

let channels = Bot.getProperty("force_channels") || [];
let newId = Date.now();

channels.push({
  id: newId,
  type: "public",
  username: username,
  chat_id: username,
  invite_link: "https://t.me/" + username.replace("@", ""),
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
  "✅ *Public Channel Added Successfully!*\n\n" +
  "• 🏷 *Channel Name:* " + channelName + "\n" +
  "• 🔘 *Join Button Preview:* `[ " + channelName + " ]`\n" +
  "• 📢 *Username:* " + username + "\n" +
  "• 🔗 *Link:* https://t.me/" + username.replace("@", "") + "\n\n" +
  "Users will see the button with only the channel name: *" + channelName + "*!"
);
