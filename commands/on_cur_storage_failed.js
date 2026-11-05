/*CMD
command: /on_cur_storage_failed
help: Handles active storage channel verification failure
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let activeStorageId = Bot.getProperty("storage_channel_id") || "-1003856912131";

let buttons = [
  [{ title: "🔄 Try Again", command: "/admin_verify_storage" }],
  [{ title: "🔄 Change Storage Channel", command: "/admin_change_storage" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

let text =
  "⚠️ *Active Storage Channel Warning!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "The bot failed to post a verification message to `" + activeStorageId + "`.\n\n" +
  "👉 *Action Needed:*\n" +
  "1. Verify that the channel exists and is not deleted.\n" +
  "2. Verify that this bot is added as an **Administrator** with **Post Messages** enabled.\n" +
  "3. Or tap 'Change Storage Channel' below to switch to another active channel.";

Bot.sendInlineKeyboard(buttons, text);
