/*CMD
command: /admin_stats
help: Advanced Global Bot Analytics and Statistics
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

let totalUsers = Bot.getProperty("total_users_count") || 0;
let categories = Bot.getProperty("categories") || [];
let videos = Bot.getProperty("videos") || [];
let totalViews = Bot.getProperty("total_views_count") || 0;
let totalRefs = Bot.getProperty("total_valid_referrals") || 0;
let totalDist = Bot.getProperty("total_points_distributed") || 0;

let payments = Bot.getProperty("payment_requests") || [];
let pendingPayments = 0;
let approvedPayments = 0;
for (let i = 0; i < payments.length; i++) {
  if (payments[i].status === "pending") {
    pendingPayments++;
  } else if (payments[i].status === "approved") {
    approvedPayments++;
  }
}

let text =
  "📊 *Bot Global Analytics & Insights*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👥 *Total Registered Users:* *" + totalUsers + "*\n" +
  "🤝 *Total Successful Referrals:* *" + totalRefs + "*\n" +
  "💎 *Total Points Distributed:* *" + totalDist + " Points*\n" +
  "💳 *Approved Payments:* *" + approvedPayments + "* | 🟡 *Pending:* *" + pendingPayments + "*\n\n" +
  "🎬 *Total Videos:* *" + videos.length + "*\n" +
  "📂 *Total Categories:* *" + categories.length + "*\n" +
  "👁 *Total Video Streams:* *" + totalViews + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🟢 *Platform Status:* Operational & Production Ready";

let buttons = [
  [{ title: "🔄 Refresh Analytics", command: "/admin_stats" }],
  [{ title: "🔙 Back to Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);
