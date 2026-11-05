/*CMD
command: /admin_fc_step3
help: Step 3 Handler - Save Channel, Log Action, Return to Force Channels
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

if (!message) {
  Bot.run({ command: "/admin_fc_step3" });
  return;
}

let mText = message.trim();
if (mText === "❌ Cancel" || mText === "🔴 Cancel" || mText === "/admin" || mText === "Cancel") {
  Bot.runCommand("/admin_channels");
  return;
}

// URL Validation
let joinUrl = mText;
if (!joinUrl.includes("t.me") && !joinUrl.includes("telegram.me")) {
  let keyboard = [
    [
      { text: "❌ Cancel", style: "danger" }
    ]
  ];
  Api.sendMessage({
    chat_id: user.telegramid,
    text: "⚠️ <b>Invalid Telegram Join URL!</b>\n\nPlease send a valid Telegram link (e.g. <code>https://t.me/example</code>):\n\n<i>(Or tap ❌ Cancel below)</i>",
    parse_mode: "HTML",
    reply_markup: { keyboard: keyboard, resize_keyboard: true }
  });
  Bot.run({ command: "/admin_fc_step3" });
  return;
}

let ref = User.getProperty("fc_temp_ref") || {};
let type = User.getProperty("fc_temp_type") || "public";

let channels = Bot.getProperty("force_channels") || [];
let newId = Date.now();

let channelEntry = {
  id: newId,
  chat_id: ref.id,
  username: ref.username || (ref.id && ref.id.toString().startsWith("@") ? ref.id : null),
  title: ref.title || ("Channel " + ref.id),
  type: type, // "public", "private", "request"
  invite_link: joinUrl,
  enabled: true,
  added_time: new Date().toISOString()
};

channels.push(channelEntry);
Bot.setProperty("force_channels", channels, "json");
Bot.setProperty("force_channels_enabled", true, "boolean");

// Audit Logging
let logs = Bot.getProperty("force_channel_logs") || [];
logs.push({
  admin_id: user.telegramid,
  channel_id: channelEntry.chat_id,
  channel_name: channelEntry.title,
  channel_type: type,
  action: "ADD",
  timestamp: new Date().toISOString()
});
Bot.setProperty("force_channel_logs", logs, "json");

// Clear temp states
User.setProperty("fc_temp_ref", null, "json");
User.setProperty("fc_temp_type", null, "string");
User.setProperty("fc_state", null, "string");

Bot.sendMessage("✅ <b>Force Join channel added successfully.</b>", { parse_mode: "HTML" });

Bot.runCommand("/admin_channels");
