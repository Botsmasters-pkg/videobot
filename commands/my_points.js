/*CMD
command: /my_points
help: User Points Dashboard & Transaction History
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: /points, /account
group: 
CMD*/

let userPoints = Bot.getProperty("points_" + user.telegramid) || User.getProperty("points") || 0;
let freeUsed = User.getProperty("free_videos_used") || 0;
let freeLeft = Math.max(0, 2 - freeUsed);

let refs = Bot.getProperty("ref_count_" + user.telegramid) || 0;
let refPoints = Bot.getProperty("ref_points_" + user.telegramid) || 0;

let pointsSpent = User.getProperty("total_points_spent") || 0;
let pointsHistory = User.getProperty("points_history") || [];

let historyLines = [];
let maxHistory = Math.min(pointsHistory.length, 5);
for (let i = pointsHistory.length - 1; i >= Math.max(0, pointsHistory.length - 5); i--) {
  let item = pointsHistory[i];
  let icon = item.type === "earned" ? "🟢 +" : "🔴 -";
  let dateStr = item.date ? item.date.substring(0, 10) : "";
  historyLines.push(icon + item.amount + " pts | " + item.reason + " (" + dateStr + ")");
}

let historyText = historyLines.length > 0 ? historyLines.join("\n") : "_No points transactions yet._";

let text =
  "💰 *My Points Dashboard*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🆔 *User ID:* `" + user.telegramid + "`\n" +
  "👤 *Name:* " + (user.first_name || "Valued User") + "\n\n" +
  "💎 *Current Points Balance:* *" + userPoints + " Points*\n" +
  "🎁 *Free Videos Used:* *" + freeUsed + " / 2 Used* (" + freeLeft + " remaining)\n" +
  "👥 *Successful Referrals:* *" + refs + "*\n" +
  "📈 *Total Points Earned:* *" + refPoints + " Points*\n" +
  "📉 *Total Points Spent:* *" + pointsSpent + " Points*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📜 *Recent Transaction History:*\n" +
  historyText + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_Tip: 1 Referral gives you 10 Points! 1 Video requires 5 Points._";

let buttons = [
  [
    { title: "🎁 Refer & Earn", command: "/referral", style: "primary" },
    { title: "💳 Buy Points", command: "/buy_points", style: "primary" }
  ],
  [
    { title: "🎬 Get Video", command: "/get_video", style: "primary" },
    { title: "🔄 Refresh", command: "/my_points", style: "primary" }
  ],
  [{ title: "🏠 Main Menu", command: "/start", style: "primary" }]
];

Bot.sendInlineKeyboard(buttons, text);

