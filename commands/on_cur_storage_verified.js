/*CMD
command: /on_cur_storage_verified
help: Handles active storage channel verification success
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let activeStorageId = Bot.getProperty("storage_channel_id") || "-1003856912131";

let res = options ? (options.result || options) : null;
let msgId = res ? res.message_id : null;
if (msgId) {
  try {
    Api.deleteMessage({
      chat_id: activeStorageId,
      message_id: msgId
    });
  } catch (e) {
    // Ignore error
  }
}

let buttons = [
  [{ title: "📦 Storage Channel Settings", command: "/admin_storage_settings" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

let text =
  "✅ *Active Storage Channel Verified Successfully!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🆔 *Channel ID:* `" + activeStorageId + "`\n" +
  "🟢 *Status:* Fully Operational & Accessible\n" +
  "🤖 *Permissions:* Administrator with Post Messages Enabled\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "All new video uploads will be successfully archived in this channel.";

Bot.sendInlineKeyboard(buttons, text);
