/*CMD
command: /admin_edit_cat
help: List categories to edit or delete
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
  let buttons = [
    [{ title: "➕ Add New Category", command: "/admin_add_cat" }],
    [{ title: "🔙 Admin Dashboard", command: "/admin" }]
  ];
  Bot.sendInlineKeyboard(buttons, "📂 *Manage Categories*\n\n_No custom categories have been created yet._\n(Categories are optional — you can upload and stream videos directly without creating any category).");
  return;
}

let buttons = [];
for (let i = 0; i < categories.length; i++) {
  let cat = categories[i];
  buttons.push([{
    title: (cat.emoji || "📁") + " " + cat.name,
    command: "/admin_cat_detail " + cat.id
  }]);
}

buttons.push([
  { title: "➕ Add Category", command: "/admin_add_cat" },
  { title: "🔙 Admin Dashboard", command: "/admin" }
]);

Bot.sendInlineKeyboard(buttons, "📂 *Manage Categories (Total: " + categories.length + ")*\n\nTap any category to view details or delete:");
