/*CMD
command: /admin_fc_do_del
help: Step 3 of Remove Channel - Delete channel, log action, return to menu
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

if (!message) {
  Bot.run({ command: "/admin_fc_do_del" });
  return;
}

let mText = message.trim();
if (mText === "🔴 Cancel" || mText === "❌ Cancel" || mText === "/admin") {
  User.setProperty("fc_pending_remove_id", null, "string");
  Bot.sendMessage("❌ *Channel removal cancelled.*");
  Bot.runCommand("/admin_channels");
  return;
}

if (mText !== "🟢 Confirm Remove" && mText !== "Confirm Remove") {
  Bot.sendMessage("⚠️ Please tap **🟢 Confirm Remove** or **🔴 Cancel**:");
  Bot.run({ command: "/admin_fc_do_del" });
  return;
}

let targetId = User.getProperty("fc_pending_remove_id");
User.setProperty("fc_pending_remove_id", null, "string");

let channels = Bot.getProperty("force_channels") || [];
let newChannels = [];
let removedChannel = null;

for (let i = 0; i < channels.length; i++) {
  if (String(channels[i].id) === String(targetId)) {
    removedChannel = channels[i];
  } else {
    newChannels.push(channels[i]);
  }
}

Bot.setProperty("force_channels", newChannels, "json");

// Audit Logging
if (removedChannel) {
  let logs = Bot.getProperty("force_channel_logs") || [];
  logs.push({
    admin_id: user.telegramid,
    channel_id: removedChannel.chat_id || removedChannel.id,
    channel_name: removedChannel.title,
    channel_type: removedChannel.type,
    action: "REMOVE",
    timestamp: new Date().toISOString()
  });
  Bot.setProperty("force_channel_logs", logs, "json");
}

Bot.sendMessage("✅ *Force Join channel removed successfully.*");

Bot.runCommand("/admin_channels");

