/*CMD
command: /admin_fc_do_toggle
help: Step 2 of Enable/Disable Channel - Perform status flip and log
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
  Bot.run({ command: "/admin_fc_do_toggle" });
  return;
}

let mText = message.trim();
if (mText === "❌ Cancel" || mText === "🔴 Cancel" || mText === "/admin") {
  Bot.runCommand("/admin_channels");
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let target = null;

let matchNum = mText.match(/^(\d+)\./);
if (matchNum) {
  let idx = parseInt(matchNum[1]) - 1;
  if (channels[idx]) target = channels[idx];
} else if (/^\d+$/.test(mText) && parseInt(mText) <= channels.length && parseInt(mText) > 0) {
  target = channels[parseInt(mText) - 1];
} else {
  for (let i = 0; i < channels.length; i++) {
    let c = channels[i];
    if (
      String(c.chat_id) === mText ||
      String(c.id) === mText ||
      (c.title && mText.includes(c.title))
    ) {
      target = c;
      break;
    }
  }
}

if (!target) {
  Bot.sendMessage("⚠️ *Channel not found.* Please tap one of the channel buttons below:");
  Bot.run({ command: "/admin_fc_do_toggle" });
  return;
}

let oldStatus = (target.enabled !== false);
let newStatus = !oldStatus;
target.enabled = newStatus;

Bot.setProperty("force_channels", channels, "json");

// Audit Logging
let actionStr = newStatus ? "ENABLE" : "DISABLE";
let logs = Bot.getProperty("force_channel_logs") || [];
logs.push({
  admin_id: user.telegramid,
  channel_id: target.chat_id || target.id,
  channel_name: target.title,
  channel_type: target.type,
  action: actionStr,
  timestamp: new Date().toISOString()
});
Bot.setProperty("force_channel_logs", logs, "json");

let oldIcon = oldStatus ? "✅ Enabled" : "🚫 Disabled";
let newIcon = newStatus ? "✅ Enabled" : "🚫 Disabled";

Bot.sendMessage(
  "🔁 *Channel Status Updated!*\n\n" +
  "• **Channel:** *" + (target.title || "Channel") + "*\n" +
  "• **Previous:** " + oldIcon + "\n" +
  "• **Current:** *" + newIcon + "*\n\n" +
  (newStatus
    ? "🟢 Users will now be required to join this channel."
    : "🚫 This channel will be bypassed during user verification.")
);

Bot.runCommand("/admin_channels");
