/*CMD
command: /admin_del_chan
help: Delete a configured force channel
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

let chanId = parseInt(params);
if (!chanId) {
  Bot.runCommand("/admin_channels");
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let newChannels = [];
for (let i = 0; i < channels.length; i++) {
  if (channels[i].id !== chanId) {
    newChannels.push(channels[i]);
  }
}

Bot.setProperty("force_channels", newChannels, "json");

let buttons = [
  [{ title: "📢 Channels Management", command: "/admin_channels" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, "✅ *Channel Removed Successfully!*");
