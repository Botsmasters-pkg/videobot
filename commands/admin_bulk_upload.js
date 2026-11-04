/*CMD
command: /admin_bulk_upload
help: Bulk Video Upload - Directly Start Uploading Multiple Videos
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

User.setProperty("admin_bulk_mode", true, "boolean");
User.setProperty("admin_bulk_cat_id", null, "integer");
User.setProperty("admin_bulk_uploaded", 0, "integer");
User.setProperty("admin_bulk_failed", 0, "integer");

let buttons = [
  [{ title: "🏁 Finish Bulk Upload", command: "/admin_bulk_finish" }],
  [{ title: "❌ Cancel & Return", command: "/admin" }]
];

let text =
  "📦 *Bulk Video Upload Mode Active!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👉 Send or forward multiple **MP4 or MOV videos** into this chat (one by one or select multiple and forward).\n\n" +
  "• Titles are automatically extracted from your captions or filenames.\n" +
  "• Duplicate videos are automatically skipped.\n" +
  "• Each video will be saved directly into your video library.\n\n" +
  "Tap **🏁 Finish Bulk Upload** below when you are done! 👇";

Bot.sendInlineKeyboard(buttons, text);
