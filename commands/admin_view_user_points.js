/*CMD
command: /admin_view_user_points
help: View points and history of any user ID
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

let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_points_menu" }]];

Bot.sendInlineKeyboard(
  buttons,
  "🔍 *View User Points Profile*\n\nEnter the *numeric Telegram ID* of the user to inspect (e.g. `123456789`):"
);

Bot.run({ command: "/admin_show_user_points" });
