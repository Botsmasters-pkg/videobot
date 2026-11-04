/*CMD
command: /admin_do_deduct_points
help: Execute points deduction from user
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

let savedTarget = User.getProperty("target_points_user");
let targetId = null;
let pointsToDeduct = 0;

let text = (message || "").trim();

if (savedTarget) {
  targetId = parseInt(savedTarget);
  pointsToDeduct = parseInt(text);
} else {
  let parts = text.split(/\s+/);
  if (parts.length >= 2) {
    targetId = parseInt(parts[0]);
    pointsToDeduct = parseInt(parts[1]);
  }
}

if (!targetId || !pointsToDeduct || pointsToDeduct <= 0) {
  Bot.sendMessage("⚠️ Invalid input! Please enter a valid User ID and positive Points to deduct:");
  Bot.run({ command: "/admin_do_deduct_points" });
  return;
}

User.setProperty("target_points_user", null, "string");

let currentPts = Bot.getProperty("points_" + targetId) || 0;
let newPts = Math.max(0, currentPts - pointsToDeduct);
Bot.setProperty("points_" + targetId, newPts, "integer");

let buttons = [
  [{ title: "🔍 View User Profile", command: "/admin_show_user_points " + targetId }],
  [{ title: "💰 Points Menu", command: "/admin_points_menu" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Points Deducted Successfully!*\n\n• User ID: `" + targetId + "`\n• Deducted: *-" + pointsToDeduct + " Points*\n• Remaining Balance: *" + newPts + " Points*"
);

