/*CMD
command: /admin_bulk_finish
help: Completes Bulk Upload Mode & Shows Summary
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

let uploaded = User.getProperty("admin_bulk_uploaded") || 0;
let failed = User.getProperty("admin_bulk_failed") || 0;

// Reset state
User.setProperty("admin_bulk_mode", false, "boolean");
User.setProperty("admin_bulk_cat_id", null, "integer");
User.setProperty("admin_bulk_uploaded", 0, "integer");
User.setProperty("admin_bulk_failed", 0, "integer");

let videos = Bot.getProperty("videos") || [];

let buttons = [
  [{ title: "📋 Manage Videos (" + videos.length + ")", command: "/admin_manage_vids" }],
  [
    { title: "📦 Bulk Upload More", command: "/admin_bulk_upload" },
    { title: "🛠 Admin Dashboard", command: "/admin" }
  ]
];

let text =
  "🏁 *Bulk Upload Completed!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "✅ *Successfully Added:* *" + uploaded + " Videos*\n" +
  "⚠️ *Skipped / Duplicates:* *" + failed + " Items*\n" +
  "📊 *Total Videos in Library:* *" + videos.length + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "All new videos are active and ready to stream directly in Telegram!";

Bot.sendInlineKeyboard(buttons, text);
