/*CMD
command: /referral
help: Refer & Earn Dashboard
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: /refer_earn
group: 
CMD*/

let validReferrals = Bot.getProperty("ref_count_" + user.telegramid) || 0;
let refPointsEarned = Bot.getProperty("ref_points_" + user.telegramid) || 0;
let userPoints = Bot.getProperty("points_" + user.telegramid) || User.getProperty("points") || 0;

let botUsername = bot.name || "SmartVideoBot";
let refLink = "https://t.me/" + botUsername + "?start=ref_" + user.telegramid;

let pointsPerRef = Bot.getProperty("points_per_referral") || 10;
let pointsPerVid = Bot.getProperty("points_per_video") || 5;

let text =
  "🎁 *Refer & Earn Dashboard*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👥 *Total Successful Referrals:* *" + validReferrals + "*\n" +
  "💎 *Total Referral Points Earned:* *" + refPointsEarned + " Points*\n" +
  "💰 *Current Balance:* *" + userPoints + " Points*\n\n" +
  "📜 *Reward Rules:*\n" +
  "• *1 Referral* = *" + pointsPerRef + " Points* automatically added to your balance!\n" +
  "• *1 Video Stream* = *" + pointsPerVid + " Points* (1 friend = 2 videos free!)\n" +
  "• Every new friend you invite also gets *2 Free Videos*!\n" +
  "• No limits! Share more to earn unlimited points.\n\n" +
  "🔗 *Your Exclusive Referral Link:*\n" +
  "`" + refLink + "`\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_Tip: Tap the link above to copy it instantly._";

let shareText = "🎬 Watch exclusive videos on this bot! First 2 videos are completely FREE! Join using my link:";
let shareUrl =
  "https://t.me/share/url?url=" +
  encodeURIComponent(refLink) +
  "&text=" +
  encodeURIComponent(shareText);

let buttons = [
  [{ title: "📤 Share Referral Link", url: shareUrl, style: "primary" }],
  [
    { title: "💰 My Points", command: "/my_points", style: "primary" },
    { title: "🎬 Get Video", command: "/get_video", style: "primary" }
  ],
  [{ title: "🏠 Main Menu", command: "/start", style: "primary" }]
];

Bot.sendInlineKeyboard(buttons, text);
