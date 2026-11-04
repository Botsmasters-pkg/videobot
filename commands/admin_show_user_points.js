/*CMD
command: /admin_show_user_points
help: Displays points profile of entered user ID
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

let targetId = parseInt(message);
if (!targetId) {
  Bot.sendMessage("⚠️ Please enter a valid numeric Telegram ID:");
  Bot.run({ command: "/admin_show_user_points" });
  return;
}

let pts = Bot.getProperty("points_" + targetId) || 0;
let refs = Bot.getProperty("ref_count_" + targetId) || 0;
let refPts = Bot.getProperty("ref_points_" + targetId) || 0;
let isBanned = Bot.getProperty("banned_" + targetId) ? "🔴 Banned" : "🟢 Active";

let text =
  "👤 *User Points Profile: `" + targetId + "`*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "💎 *Current Points Balance:* *" + pts + " Points*\n" +
  "👥 *Successful Referrals:* *" + refs + "*\n" +
  "🎁 *Referral Points Earned:* *" + refPts + " Points*\n" +
  "⚡ *Status:* " + isBanned + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Quick Actions for user `" + targetId + "`:";

let buttons = [
  [
    { title: "➕ Add Points", command: "/admin_add_user_points " + targetId },
    { title: "➖ Deduct Points", command: "/admin_deduct_user_points " + targetId }
  ],
  [{ title: "🔙 Points Menu", command: "/admin_points_menu" }]
];

Bot.sendInlineKeyboard(buttons, text);

