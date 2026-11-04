/*CMD
command: /help
help: Bot Help & Guidelines with Dynamic Admin Contact
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let helpAdmin = Bot.getProperty("help_admin_username") || "Botsmasters_support";
let cleanUsername = helpAdmin.replace("@", "").trim();
let contactUrl = "https://t.me/" + cleanUsername;

let videoCost = Bot.getProperty("points_per_video") || 5;
let refReward = Bot.getProperty("points_per_referral") || 10;

let helpText =
  "ℹ️ *Bot Help & Support Center*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🎬 *1. How Video Access Works:*\n" +
  "• 🎁 *First 2 Videos Free:* Every new user receives the first 2 videos completely free! No points are deducted.\n" +
  "• 🎬 *3rd Video Onwards:* Each video requires *" + videoCost + " Points* to stream.\n" +
  "• ⚡ *No Daily Limits:* You can watch as many videos as you want as long as you have points balance!\n\n" +
  "🎁 *2. How to Earn Free Points:*\n" +
  "• Invite your friends using your unique referral link from *🎁 Refer & Earn*.\n" +
  "• Each successful friend who joins gives you *" + refReward + " Points* automatically!\n" +
  "• That means 1 friend = 2 video accesses!\n\n" +
  "💳 *3. How to Buy Points:*\n" +
  "• Tap *💳 Buy Points* to view packages.\n" +
  "• Scan the instant UPI QR code with GPay/PhonePe/Paytm.\n" +
  "• Upload your payment screenshot for instant admin approval.\n\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👨‍💻 *Admin Support Contact:*\n" +
  "Need help, want to report an issue, or have questions?\n" +
  "Directly contact our Admin: [@" + cleanUsername + "](" + contactUrl + ")";

let buttons = [
  [{ title: "💬 Contact Admin (@" + cleanUsername + ")", url: contactUrl }],
  [
    { title: "🎬 Watch Videos", command: "/categories" },
    { title: "🎁 Refer & Earn", command: "/referral" }
  ],
  [{ title: "🏠 Main Menu", command: "/start" }]
];

Bot.sendInlineKeyboard(buttons, helpText);
