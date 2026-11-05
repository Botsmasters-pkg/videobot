/*CMD
command: /admin_fc_add
help: Step 1 of Add Channel - Ask for channel reference
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
  Bot.sendMessage("🚫 Access Denied.");
  return;
}

User.setProperty("in_fc_menu", true, "boolean");
User.setProperty("fc_state", "awaiting_ref", "string");

let text =
  "➕ <b>ADD CHANNEL — Step 1 of 3</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Please provide the <b>channel reference</b>.\n\n" +
  "Accepts:\n" +
  "• 📨 <b>Forwarded channel message</b>\n" +
  "• 📢 <b>@channel_username</b> (e.g. <code>@MyChannel</code>)\n" +
  "• 🆔 <b>Numeric Chat ID</b> (e.g. <code>-1001234567890</code>)\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "<i>(Or tap ❌ Cancel below)</i>";

let keyboard = [
  [
    { text: "❌ Cancel", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "HTML",
  reply_markup: {
    keyboard: keyboard,
    resize_keyboard: true
  }
});

Bot.run({ command: "/admin_fc_step1" });

