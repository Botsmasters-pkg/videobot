/*CMD
command: /admin_save_vid_points
help: Save updated video cost points
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

let newCost = parseInt(message);
if (!newCost || newCost < 1) {
  Bot.sendMessage("⚠️ Please enter a positive number of points (at least 1):");
  Bot.run({ command: "/admin_save_vid_points" });
  return;
}

Bot.setProperty("points_per_video", newCost, "integer");

let buttons = [
  [{ title: "💰 Points Menu", command: "/admin_points_menu" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Video Access Cost Updated Successfully!*\n\nNew Cost: *" + newCost + " Points per video access*"
);

