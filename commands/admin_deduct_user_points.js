/*CMD
command: /admin_deduct_user_points
help: Prompt admin for points amount to deduct
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
    "➖ *Deduct Points from User `" + targetId + "`*\n\nEnter the number of points to deduct (e.g. `20`):"
  );
} else {
  Bot.sendInlineKeyboard(
    buttons,
    "➖ *Deduct Points from User*\n\nEnter the *User ID and Points to deduct* separated by a space (e.g. `123456789 20`):"
  );
}

Bot.run({ command: "/admin_do_deduct_points" });
