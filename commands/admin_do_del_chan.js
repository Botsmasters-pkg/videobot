/*CMD
command: /admin_do_del_chan
help: Executes removal of the selected force channel
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
  Bot.runCommand("/admin_remove_channel");
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let removedChannel = null;
let newChannels = [];

for (let i = 0; i < channels.length; i++) {
  if (channels[i].id === chanId) {
    removedChannel = channels[i];
  } else {
    newChannels.push(channels[i]);
  }
}

if (!removedChannel) {
  Bot.sendMessage("⚠️ Channel not found or already removed.");
  Bot.runCommand("/admin_remove_channel");
  return;
}

Bot.setProperty("force_channels", newChannels, "json");

let typeStr = removedChannel.type === "public" ? "📢 Public" : (removedChannel.type === "private" ? "🔒 Private" : "📩 Request");
let label = removedChannel.username || removedChannel.title || removedChannel.chat_id || "Channel";

let text =
  "✅ *Channel Removed Successfully!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "The channel *" + label + "* (" + typeStr + ") has been removed from the Force Channel verification requirements.\n\n" +
  "📊 Remaining Active Channels: *" + newChannels.length + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━";

let buttons = [
  [{ title: "📋 View Remaining Channels", command: "/admin_list_channels" }],
  [
    { title: "🗑 Remove Another Channel", command: "/admin_remove_channel" },
    { title: "🔙 Force Channels Menu", command: "/admin_channels" }
  ],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);

