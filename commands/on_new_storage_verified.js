/*CMD
command: /on_new_storage_verified
help: Handles successful verification of new storage channel
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

if (!newId) {
  Bot.runCommand("/admin_storage_settings");
  return;
}

// Clean up test message from channel
let res = options ? (options.result || options) : null;
let msgId = res ? res.message_id : null;
if (msgId) {
  try {
    Api.deleteMessage({
      chat_id: newId,
      message_id: msgId
    });
  } catch (e) {
    // Ignore deletion error
  }
}

// Set new storage channel as active!
Bot.setProperty("storage_channel_id", newId, "string");

let buttons = [
  [{ title: "📦 Storage Channel Dashboard", command: "/admin_storage_settings" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

let text =
  "🎉 *Storage Channel Verified & Activated Successfully!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🆔 *New Active Storage Channel:* `" + newId + "`\n" +
  "🤖 *Bot Permissions:* Administrator with Post Messages (Verified 🟢)\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📌 *Multi-Storage Rules:*\n" +
  "• All future video uploads (Single & Bulk) will be stored in this new channel.\n" +
  "• All existing videos remain securely linked to their previous channel.\n" +
  "• User rotation, points balance, and video streaming will operate seamlessly!";

Bot.sendInlineKeyboard(buttons, text);
