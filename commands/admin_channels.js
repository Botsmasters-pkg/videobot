/*CMD
command: /admin_channels
help: 📢 Force Channels Admin Menu (Reply Keyboard)
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

User.setProperty("in_fc_menu", true, "boolean");
User.setProperty("fc_state", null, "string");
User.setProperty("fc_temp_ref", null, "json");
User.setProperty("fc_temp_type", null, "string");
User.setProperty("fc_pending_remove_id", null, "string");

let channels = Bot.getProperty("force_channels") || [];
let enabledCount = 0;
for (let i = 0; i < channels.length; i++) {
  if (channels[i].enabled !== false) enabledCount++;
}

let text =
  "📢 *FORCE CHANNELS*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📊 *Total Configured Channels:* *" + channels.length + "*\n" +
  "🟢 *Active (Enabled):* *" + enabledCount + "*\n" +
  "🔴 *Inactive (Disabled):* *" + (channels.length - enabledCount) + "*\n\n" +
  "Select a management option from the keyboard below 👇";

let keyboard = [
  [
    { text: "➕ Add Channel", style: "success" },
    { text: "📋 List Channels", style: "primary" }
  ],
  [
    { text: "🗑 Remove Channel", style: "danger" },
    { text: "🔁 Enable/Disable Channel", style: "primary" }
  ],
  [
    { text: "🔙 Back", style: "primary" }
  ]
];

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "Markdown",
  reply_markup: {
    keyboard: keyboard,
    resize_keyboard: true
  }
});
