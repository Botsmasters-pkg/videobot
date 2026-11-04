/*CMD
command: /admin_add_user_points
help: Prompt admin for points amount to credit
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

let targetId = params ? params.trim() : "";
User.setProperty("target_points_user", targetId, "string");

let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_points_menu" }]];

if (targetId) {
  Bot.sendInlineKeyboard(
    buttons,
    "➕ *Add Points to User `" + targetId + "`*\n\nEnter the number of points to add (e.g. `50`):"
  );
} else {
  Bot.sendInlineKeyboard(
    buttons,
    "➕ *Add Points to User*\n\nEnter the *User ID and Points* separated by a space (e.g. `123456789 50`):"
  );
}

Bot.run({ command: "/admin_do_add_points" });
