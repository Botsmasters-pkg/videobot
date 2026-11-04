/*CMD
command: /play_video
help: Streams the requested video directly to user with free/points verification
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let vidId = parseInt(params);
if (!vidId) {
  Bot.runCommand("/categories");
  return;
}

// 1. Balance and Free Video Verification
let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");
let freeUsed = User.getProperty("free_videos_used") || 0;
let userPoints = Bot.getProperty("points_" + user.telegramid) || User.getProperty("points") || 0;
let videoCost = Bot.getProperty("points_per_video") || 5;

let isFreeVideo = (!isAdmin && freeUsed < 2);

if (!isAdmin && !isFreeVideo && userPoints < videoCost) {
  let botUsername = bot.name || "SmartVideoBot";
  let refLink = "https://t.me/" + botUsername + "?start=ref_" + user.telegramid;
  let shareText = "🎬 Watch amazing videos on this bot! First 2 videos are completely FREE! Join using my link:";
  let shareUrl =
    "https://t.me/share/url?url=" +
    encodeURIComponent(refLink) +
    "&text=" +
    encodeURIComponent(shareText);

  let buttons = [
    [{ title: "💳 Buy Points (Starting ₹10)", command: "/buy_points" }],
    [{ title: "📤 Share Referral Link (+10 pts)", url: shareUrl }],
    [
      { title: "🎁 Refer & Earn", command: "/referral" },
      { title: "💰 My Points", command: "/my_points" }
    ],
    [{ title: "🏠 Main Menu", command: "/start" }]
  ];

  let text =
    "⚠️ *Insufficient Points!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Aapne apne *2 Free Videos* use kar liye hain!\n" +
    "Aage ke videos dekhne ke liye *" + videoCost + " Points* ki zaroorat hai.\n\n" +
    "💎 *Aapka Current Balance:* *" + userPoints + " Points*\n" +
    "🎯 *Zaroorat:* *" + videoCost + " Points*\n\n" +
    "🎁 *Points Kaise Kamaye?*\n" +
    "• *Refer Karein:* Har 1 dost ko invite karne par *" + (Bot.getProperty("points_per_referral") || 10) + " Points* milenge!\n" +
    "• *Points Kharidein:* Instant UPI QR se Points khareed sakte hain (₹10 = 100 Points).\n\n" +
    "Niche diye gaye options se Points hasil karein 👇";

  Bot.sendInlineKeyboard(buttons, text);
  return;
}

// 2. Fetch video
let videos = Bot.getProperty("videos") || [];
let vidIndex = -1;
for (let i = 0; i < videos.length; i++) {
  if (videos[i].id === vidId) {
    vidIndex = i;
    break;
  }
}

if (vidIndex === -1) {
  Bot.sendMessage("⚠️ Video not found or has been removed.");
  return;
}

let vid = videos[vidIndex];

// If video was saved as a zip file, cannot stream
if (vid.is_zip) {
  Bot.sendMessage("⚠️ Telegram cannot stream ZIP archives in the video player. Please ask the admin to upload the extracted MP4 video!");
  return;
}

// 3. Deduct Points or Update Free Video Count
let accessInfoText = "";

if (isAdmin) {
  accessInfoText = "👑 *Admin Access:* Unlimited";
} else if (isFreeVideo) {
  let newFreeUsed = freeUsed + 1;
  User.setProperty("free_videos_used", newFreeUsed, "integer");
  accessInfoText = "🎁 *Complimentary Video:* " + newFreeUsed + " of 2 Free Used (0 points deducted)";
} else {
  let newPoints = userPoints - videoCost;
  User.setProperty("points", newPoints, "integer");
  Bot.setProperty("points_" + user.telegramid, newPoints, "integer");

  let totalSpent = (User.getProperty("total_points_spent") || 0) + videoCost;
  User.setProperty("total_points_spent", totalSpent, "integer");

  // Save transaction history
  let history = User.getProperty("points_history") || [];
  history.push({
    type: "spent",
    amount: videoCost,
    reason: "Watched video (" + vid.title + ")",
    date: new Date().toISOString()
  });
  User.setProperty("points_history", history, "json");

  accessInfoText = "💎 *Points Balance:* " + newPoints + " Points (-" + videoCost + " pts)";
}

// Get category info
let categories = Bot.getProperty("categories") || [];
let catName = "General";
let catEmoji = "📁";
for (let i = 0; i < categories.length; i++) {
  if (categories[i].id === vid.category_id) {
    catName = categories[i].name;
    catEmoji = categories[i].emoji || "📁";
    break;
  }
}

// Increment views
let currentViews = (vid.views || 0) + 1;
videos[vidIndex].views = currentViews;
Bot.setProperty("videos", videos, "json");

let totalViews = Bot.getProperty("total_views_count") || 0;
Bot.setProperty("total_views_count", totalViews + 1, "integer");

// Record watched video on user profile
let watched = User.getProperty("watched_videos") || [];
if (watched.indexOf(vid.id) === -1) {
  watched.push(vid.id);
  User.setProperty("watched_videos", watched, "json");
}

let userWatchedCount = User.getProperty("user_watched_count") || 0;
User.setProperty("user_watched_count", userWatchedCount + 1, "integer");

// Caption & Controls
let descPart = vid.description ? "\n\n📝 _" + vid.description + "_" : "";
let caption =
  "🎬 *" + vid.title + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📂 *Category:* " + catEmoji + " " + catName + "\n" +
  accessInfoText +
  descPart + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "✨ _Enjoy watching!_";

let inlineKeyboard = [
  [
    { text: "▶️ Next Video", callback_data: "/category " + vid.category_id }
  ],
  [
    { text: "🎬 Watch Videos", callback_data: "/categories" },
    { text: "🏠 Main Menu", callback_data: "/start" }
  ]
];

// Always send as native streaming video
Api.sendVideo({
  chat_id: chat.chatid,
  video: vid.file_id,
  caption: caption,
  parse_mode: "Markdown",
  supports_streaming: true,
  reply_markup: {
    inline_keyboard: inlineKeyboard
  }
});
