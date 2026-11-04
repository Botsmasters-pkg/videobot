/*CMD
command: /admin_bulk_upload
help: Step 1 of Bulk Video Upload - Pick Category
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

let categories = Bot.getProperty("categories") || [];
if (categories.length === 0) {
  let buttons = [[{ title: "🔙 Admin Menu", command: "/admin" }]];
  Bot.sendInlineKeyboard(buttons, "⚠️ No categories exist yet! Please add a category first via *Add Category*.");
  return;
}

let buttons = [];
let row = [];

for (let i = 0; i < categories.length; i++) {
  let cat = categories[i];
  row.push({
    title: (cat.emoji || "📁") + " " + cat.name,
    command: "/admin_bulk_start " + cat.id
  });
  if (row.length === 2) {
    buttons.push(row);
    row = [];
  }
}
if (row.length > 0) {
  buttons.push(row);
}

buttons.push([{ title: "❌ Cancel & Return", command: "/admin" }]);

let text =
  "📦 *Bulk Video Upload — Select Target Category*\n\n" +
  "Choose which category will receive the bulk video uploads:";

Bot.sendInlineKeyboard(buttons, text);
