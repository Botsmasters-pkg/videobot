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
  Bot.sendMessage("🚫 Access Denied.");
  return;
}

function esc(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

if (!message) {
  Bot.run({ command: "/admin_fc_do_toggle" });
  return;
}

let mText = message.trim();
if (mText === "❌ Cancel" || mText === "🔴 Cancel" || mText === "/admin" || mText === "Cancel") {
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
      (c.username && c.username.toLowerCase() === mText.toLowerCase()) ||
      (c.title && mText.toLowerCase().includes(c.title.toLowerCase()))
    ) {
      target = c;
      break;
    }
  }
}

if (!target) {
  let keyboardRows = [];
  for (let i = 0; i < channels.length; i++) {
    let ch = channels[i];
    let isEnabled = (ch.enabled !== false);
    let statusIcon = isEnabled ? "✅" : "🚫";
    let cleanTitle = ch.title || ("Channel " + (ch.chat_id || ch.id));
    keyboardRows.push([{ text: (i + 1) + ". " + statusIcon + " " + cleanTitle, style: isEnabled ? "primary" : "danger" }]);
  }
  keyboardRows.push([{ text: "❌ Cancel", style: "danger" }]);

  Api.sendMessage({
    chat_id: user.telegramid,
    text: "⚠️ <b>Channel not recognized.</b> Please tap a channel button below:",
    parse_mode: "HTML",
    reply_markup: { keyboard: keyboardRows, resize_keyboard: true }
  });
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

let updateMsg =
  "🔁 <b>Channel Status Updated!</b>\n\n" +
  "• <b>Channel:</b> " + esc(target.title || "Channel") + "\n" +
  "• <b>Previous:</b> " + oldIcon + "\n" +
  "• <b>Current:</b> <b>" + newIcon + "</b>\n\n" +
  (newStatus
    ? "🟢 Users will now be required to join this channel."
    : "🚫 This channel will be bypassed during user verification.");

Bot.sendMessage(updateMsg, { parse_mode: "HTML" });

Bot.runCommand("/admin_channels");
