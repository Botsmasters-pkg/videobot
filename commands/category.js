/*CMD
command: /category
help: Instantly streams a random video from the selected category with free/points verification
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let parts = params ? params.trim().split(" ") : [];
let catId = parseInt(parts[0]);

if (!catId) {
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

// 2. Fetch Category
let categories = Bot.getProperty("categories") || [];
let cat = null;
for (let i = 0; i < categories.length; i++) {
  if (categories[i].id === catId) {
    cat = categories[i];
    break;
  }
}

if (!cat) {
  Bot.sendMessage("⚠️ Category not found.");
  Bot.runCommand("/categories");
  return;
}

let catEmoji = cat.emoji || "📁";

// 3. Fetch and filter videos in this category
let allVideos = Bot.getProperty("videos") || [];
let catVideos = [];
for (let i = 0; i < allVideos.length; i++) {
  if (allVideos[i].category_id === catId) {
    catVideos.push(allVideos[i]);
  }
}

let playableVideos = [];
for (let i = 0; i < catVideos.length; i++) {
  if (!catVideos[i].is_zip) {
    playableVideos.push(catVideos[i]);
  }
}

if (playableVideos.length === 0) {
  let buttons = [
    [{ title: "🎬 Watch Videos", command: "/categories" }],
    [{ title: "🏠 Main Menu", command: "/start" }]
  ];
  Bot.sendInlineKeyboard(
    buttons,
    catEmoji + " *" + cat.name + "*\n\nNo playable videos in this category yet. Please check back soon!"
  );
  return;
}

// 4. Deduct Points or Update Free Video Count
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
    reason: "Watched video in " + cat.name,
    date: new Date().toISOString()
  });
  User.setProperty("points_history", history, "json");

  accessInfoText = "💎 *Points Balance:* " + newPoints + " Points (-" + videoCost + " pts)";
}

// 5. Pick unwatched or random playable video
let watched = User.getProperty("watched_videos") || [];
let unwatched = [];
for (let i = 0; i < playableVideos.length; i++) {
  if (watched.indexOf(playableVideos[i].id) === -1) {
    unwatched.push(playableVideos[i]);
  }
}

let pool = unwatched.length > 0 ? unwatched : playableVideos;
let randomIndex = Math.floor(Math.random() * pool.length);
let selectedVid = pool[randomIndex];

// Update views
for (let i = 0; i < allVideos.length; i++) {
  if (allVideos[i].id === selectedVid.id) {
    allVideos[i].views = (allVideos[i].views || 0) + 1;
    break;
  }
}
Bot.setProperty("videos", allVideos, "json");

let totalViews = Bot.getProperty("total_views_count") || 0;
Bot.setProperty("total_views_count", totalViews + 1, "integer");

// Record watch on user profile
if (watched.indexOf(selectedVid.id) === -1) {
  watched.push(selectedVid.id);
  User.setProperty("watched_videos", watched, "json");
}

let userWatchedCount = User.getProperty("user_watched_count") || 0;
User.setProperty("user_watched_count", userWatchedCount + 1, "integer");

// Caption & Controls
let descPart = selectedVid.description ? "\n\n📝 _" + selectedVid.description + "_" : "";
let caption =
  "🎬 *" + selectedVid.title + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📂 *Category:* " + catEmoji + " " + cat.name + "\n" +
  accessInfoText +
  descPart + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "✨ _Enjoy watching!_";

let inlineKeyboard = [
  [
    { text: "▶️ Next Video", callback_data: "/category " + cat.id }
  ],
  [
    { text: "🎬 Watch Videos", callback_data: "/categories" },
    { text: "🏠 Main Menu", callback_data: "/start" }
  ]
];

Api.sendVideo({
  chat_id: chat.chatid,
  video: selectedVid.file_id,
  caption: caption,
  parse_mode: "Markdown",
  supports_streaming: true,
  reply_markup: {
    inline_keyboard: inlineKeyboard
  }
});
