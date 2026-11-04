/*CMD
command: /categories
help: Browse video categories and show balance/free video status
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");
let freeUsed = User.getProperty("free_videos_used") || 0;
let userPoints = Bot.getProperty("points_" + user.telegramid) || User.getProperty("points") || 0;
let videoCost = Bot.getProperty("points_per_video") || 5;

let categories = Bot.getProperty("categories") || [];

if (categories.length === 0) {
  let buttons = [[{ title: "🔙 Back to Main Menu", command: "/start" }]];
  Bot.sendInlineKeyboard(
    buttons,
    "🎬 *Watch Videos*\n\nCurrently, there are no categories available. Please check back soon!"
  );
  return;
}

let buttons = [];
let row = [];

for (let i = 0; i < categories.length; i++) {
  let cat = categories[i];
  let btnTitle = (cat.emoji || "📁") + " " + cat.name;

  row.push({ title: btnTitle, command: "/category " + cat.id });
  if (row.length === 2) {
    buttons.push(row);
    row = [];
  }
}
if (row.length > 0) {
  buttons.push(row);
}

// Low balance or buy options
if (!isAdmin && freeUsed >= 2 && userPoints < videoCost) {
  buttons.push([
    { title: "🎁 Earn Free Points", command: "/referral" },
    { title: "💳 Buy Points", command: "/buy_points" }
  ]);
}

buttons.push([{ title: "🏠 Main Menu", command: "/start" }]);

let statusText = "";
if (isAdmin) {
  statusText = "👑 *Status:* Unlimited Access (Administrator)\n";
} else if (freeUsed < 2) {
  let left = 2 - freeUsed;
  statusText = "🎁 *Free Videos Remaining:* *" + left + " of 2 Free Videos*\n_Enjoy your complimentary free videos!_\n";
} else {
  statusText = "💎 *My Points Balance:* *" + userPoints + " Points* (Cost: *" + videoCost + " pts/video*)\n";
  if (userPoints < videoCost) {
    statusText += "⚠️ _Notice: Low balance. Earn points via /referral or /buy_points!_\n";
  }
}

let msg =
  "🎬 *Video Library Categories*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  statusText +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select a category below to stream videos instantly 👇";

Bot.sendInlineKeyboard(buttons, msg);
