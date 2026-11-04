/*CMD
command: /admin_bulk_finish
help: Step 3 of Bulk Video Upload - Completes Mode & Shows Summary
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
let catId = User.getProperty("admin_bulk_cat_id");

// Reset state
User.setProperty("admin_bulk_mode", false, "boolean");
User.setProperty("admin_bulk_cat_id", null, "integer");
User.setProperty("admin_bulk_uploaded", 0, "integer");
User.setProperty("admin_bulk_failed", 0, "integer");

let categories = Bot.getProperty("categories") || [];
let catName = "Target Category";
for (let i = 0; i < categories.length; i++) {
  if (categories[i].id === catId) {
    catName = (categories[i].emoji || "📁") + " " + categories[i].name;
    break;
  }
}

let buttons = [
  [{ title: "📋 Manage Videos", command: "/admin_manage_vids" }],
  [
    { title: "📦 Bulk Upload More", command: "/admin_bulk_upload" },
    { title: "🛠 Admin Dashboard", command: "/admin" }
  ]
];

let text =
  "🏁 *Bulk Upload Completed!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📂 *Category:* " + catName + "\n" +
  "✅ *Successfully Added:* *" + uploaded + " Videos*\n" +
  "⚠️ *Skipped / Duplicates:* *" + failed + " Items*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "All new videos are active and ready to stream directly in Telegram!";

Bot.sendInlineKeyboard(buttons, text);

