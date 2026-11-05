/*CMD
command: /on_new_storage_failed
help: Handles failure when testing new storage channel
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let newId = User.getProperty("temp_new_storage_id");
User.setProperty("temp_new_storage_id", null, "string");

let buttons = [
  [{ title: "🔄 Try Again", command: "/admin_change_storage" }],
  [{ title: "🔙 Storage Settings", command: "/admin_storage_settings" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

let text =
  "❌ *Storage Channel Verification Failed!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "The bot was unable to post a test message to `" + (newId || "the channel") + "`.\n\n" +
  "🔍 *Please check the following:*\n" +
  "1. Is the Chat ID correct (usually `-100...`)?\n" +
  "2. Has this bot been added to the channel as an **Administrator**?\n" +
  "3. Does the bot have **'Post Messages'** (or 'Manage Messages') permission enabled?\n\n" +
  "⚠️ *Notice:* The active storage channel was **NOT** changed.";

Bot.sendInlineKeyboard(buttons, text);
