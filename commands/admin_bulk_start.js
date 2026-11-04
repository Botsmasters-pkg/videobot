/*CMD
command: /admin_bulk_start
help: Step 2 of Bulk Video Upload - Activates Listening Mode
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

let catId = parseInt(params);
if (!catId) {
  Bot.runCommand("/admin_bulk_upload");
  return;
}

let categories = Bot.getProperty("categories") || [];
let catName = "Selected Category";
for (let i = 0; i < categories.length; i++) {
  if (categories[i].id === catId) {
    catName = (categories[i].emoji || "📁") + " " + categories[i].name;
    break;
  }
}

User.setProperty("admin_bulk_mode", true, "boolean");
User.setProperty("admin_bulk_cat_id", catId, "integer");
User.setProperty("admin_bulk_uploaded", 0, "integer");
User.setProperty("admin_bulk_failed", 0, "integer");

let buttons = [
  [{ title: "🏁 Finish Bulk Upload", command: "/admin_bulk_finish" }]
];

let text =
  "📦 *Bulk Video Upload Mode is now ACTIVE!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📂 *Target Category:* " + catName + "\n" +
  "⚡ *Mode:* Instant Streaming Batch Processing\n\n" +
  "👉 *How to upload:*\n" +
  "1. Send or forward multiple MP4/MOV videos into this chat (one by one or select multiple and forward).\n" +
  "2. The bot will automatically extract captions or filenames as titles.\n" +
  "3. Duplicate videos will be automatically skipped.\n" +
  "4. Each video will be added immediately.\n\n" +
  "Tap *🏁 Finish Bulk Upload* when you are done! 👇";

Bot.sendInlineKeyboard(buttons, text);
