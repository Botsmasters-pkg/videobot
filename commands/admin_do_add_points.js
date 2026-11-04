/*CMD
command: /admin_do_add_points
help: Execute points credit to user
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
let pointsToAdd = 0;

let text = (message || "").trim();

if (savedTarget) {
  targetId = parseInt(savedTarget);
  pointsToAdd = parseInt(text);
} else {
  let parts = text.split(/\s+/);
  if (parts.length >= 2) {
    targetId = parseInt(parts[0]);
    pointsToAdd = parseInt(parts[1]);
  }
}

if (!targetId || !pointsToAdd || pointsToAdd <= 0) {
  Bot.sendMessage("⚠️ Invalid input! Please enter a valid User ID and positive Points (e.g. `123456789 50`):");
  Bot.run({ command: "/admin_do_add_points" });
  return;
}

User.setProperty("target_points_user", null, "string");

let currentPts = Bot.getProperty("points_" + targetId) || 0;
let newPts = currentPts + pointsToAdd;
Bot.setProperty("points_" + targetId, newPts, "integer");

let totalDist = (Bot.getProperty("total_points_distributed") || 0) + pointsToAdd;
Bot.setProperty("total_points_distributed", totalDist, "integer");

// Notify user if reachable
try {
  Bot.sendMessageToChatWithId(
    targetId,
    "🎁 *Bonus Points Added by Administrator!*\n\n" +
    "• Points Added: *+" + pointsToAdd + " Points*\n" +
    "• Current Balance: *" + newPts + " Points*\n\n" +
    "Tap /categories to start watching videos!"
  );
} catch (e) {
  // If user chat unreachable
}

let buttons = [
  [{ title: "🔍 View User Profile", command: "/admin_show_user_points " + targetId }],
  [{ title: "💰 Points Menu", command: "/admin_points_menu" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Points Added Successfully!*\n\n• User ID: `" + targetId + "`\n• Added: *+" + pointsToAdd + " Points*\n• New Balance: *" + newPts + " Points*"
);

