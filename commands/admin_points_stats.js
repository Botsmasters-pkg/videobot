/*CMD
command: /admin_points_stats
help: Detailed points and referral statistics overview
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

let refPoints = Bot.getProperty("points_per_referral") || 10;
let vidPoints = Bot.getProperty("points_per_video") || 5;
let totalDist = Bot.getProperty("total_points_distributed") || 0;
let totalRefs = Bot.getProperty("total_valid_referrals") || 0;
let totalUsers = Bot.getProperty("total_users_count") || 0;
let totalViews = Bot.getProperty("total_views_count") || 0;

let text =
  "📊 *Points & Referral Global Statistics*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👥 *Total Registered Users:* *" + totalUsers + "*\n" +
  "📈 *Total Successful Referrals:* *" + totalRefs + "*\n" +
  "💎 *Total Points Distributed:* *" + totalDist + " Points*\n" +
  "🎬 *Total Videos Watched:* *" + totalViews + "*\n\n" +
  "⚙️ *Current Rate Rules:*\n" +
  "• Reward per Referral: *" + refPoints + " Points*\n" +
  "• Deduction per Video: *" + vidPoints + " Points*\n" +
  "• Free Videos per User: *First 2 Videos*\n" +
  "━━━━━━━━━━━━━━━━━━━━━";

let buttons = [
  [{ title: "💰 Points Management", command: "/admin_points_menu" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);

