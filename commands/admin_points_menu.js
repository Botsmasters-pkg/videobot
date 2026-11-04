/*CMD
command: /admin_points_menu
help: Admin Points Management Dashboard
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

let text =
  "💰 *Points & Referral Management*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👥 *Points per Referral:* *" + refPoints + " Points*\n" +
  "🎬 *Video Access Cost:* *" + vidPoints + " Points*\n" +
  "🎁 *Free Videos per User:* *2 Videos Free*\n" +
  "💎 *Total Points Distributed:* *" + totalDist + " Points*\n" +
  "📈 *Total Successful Referrals:* *" + totalRefs + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select a management tool below 👇";

let buttons = [
  [
    { title: "✏️ Set Referral Points", command: "/admin_set_ref_points" },
    { title: "✏️ Set Video Cost Points", command: "/admin_set_vid_points" }
  ],
  [
    { title: "🔍 View User Points", command: "/admin_view_user_points" },
    { title: "➕ Add User Points", command: "/admin_add_user_points" }
  ],
  [
    { title: "➖ Deduct User Points", command: "/admin_deduct_user_points" },
    { title: "📊 Points Statistics", command: "/admin_points_stats" }
  ],
  [{ title: "🔙 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);

