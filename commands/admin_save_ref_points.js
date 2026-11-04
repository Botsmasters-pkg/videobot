/*CMD
command: /admin_save_ref_points
help: Save updated referral points
need_reply: true
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

let newPoints = parseInt(message);
if (!newPoints || newPoints < 1) {
  Bot.sendMessage("⚠️ Please enter a positive number of points (at least 1):");
  Bot.run({ command: "/admin_save_ref_points" });
  return;
}

Bot.setProperty("points_per_referral", newPoints, "integer");

let buttons = [
  [{ title: "💰 Points Menu", command: "/admin_points_menu" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Referral Points Updated Successfully!*\n\nNew Reward: *" + newPoints + " Points per successful referral*"
);
