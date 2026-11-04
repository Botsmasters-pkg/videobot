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
let videos = Bot.getProperty("videos") || [];

let buttons = [];

if (categories.length === 0) {
  if (videos.length === 0) {
    let emptyButtons = [[{ title: "🔙 Back to Main Menu", command: "/start" }]];
    Bot.sendInlineKeyboard(
      emptyButtons,
      "🎬 *Watch Videos*\n\nNo video has been uploaded yet. Please check back soon!"
    );
    return;
  }

  // Videos exist without categories - directly show watch button!
  buttons.push([{ title: "▶️ Watch Videos Now (" + videos.length + " Available)", command: "/category all" }]);
} else {
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

  // Also offer all videos
  buttons.push([{ title: "🎬 Watch All Videos (" + videos.length + ")", command: "/category all" }]);
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
  "🎬 *Video Library*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  statusText +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap an option below to stream videos instantly 👇";

Bot.sendInlineKeyboard(buttons, msg);
