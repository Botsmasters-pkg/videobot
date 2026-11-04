/*CMD
command: /admin_set_ref_points
help: Prompt admin for new points per referral
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

let cur = Bot.getProperty("points_per_referral") || 10;
let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_points_menu" }]];

Bot.sendInlineKeyboard(
  buttons,
  "✏️ *Configure Referral Points*\n\n" +
  "Current Value: *" + cur + " Points / Referral*\n\n" +
  "Enter the new points to award when a new user joins via referral link (e.g. `10`, `15`, `20`):"
);

Bot.run({ command: "/admin_save_ref_points" });
