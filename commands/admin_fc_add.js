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
  Bot.sendMessage("🚫 *Access Denied.*");
  return;
}

User.setProperty("in_fc_menu", true, "boolean");
User.setProperty("fc_state", "awaiting_ref", "string");

let text =
  "➕ *ADD CHANNEL — Step 1 of 3*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Please provide the **channel reference**.\n\n" +
  "You can send any of the following:\n" +
  "1. 📨 **Forwarded channel message** from the target channel\n" +
  "2. 📢 **@channel_username** (e.g. `@MyMovieChannel`)\n" +
  "3. 🆔 **Numeric Chat ID** (e.g. `-1001234567890`)\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_(Or tap ❌ Cancel below)_";

let keyboard = [
  [
    { text: "❌ Cancel", style: "danger" }
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

Bot.run({ command: "/admin_fc_step1" });
