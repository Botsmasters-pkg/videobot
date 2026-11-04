/*CMD
command: /get_video
help: Direct video delivery with 2 free videos and points verification
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");
let videos = Bot.getProperty("videos") || [];

// 1. Check if videos exist
if (!videos || videos.length === 0) {
  let buttons = [[{ title: "🏠 Main Menu", command: "/start" }]];
  Bot.sendInlineKeyboard(
    buttons,
    "⚠️ *No video has been uploaded yet.*\n\nPlease check back later when an admin uploads videos!"
  );
  return;
}

// 2. Check Free Videos vs Points Balance
let freeUsed = User.getProperty("free_videos_used") || 0;
let userPoints = Bot.getProperty("points_" + user.telegramid);
if (userPoints === null || userPoints === undefined) {
  userPoints = User.getProperty("points") || 0;
}
let videoCost = Bot.getProperty("points_per_video") || 5;

let isFreeVideo = (!isAdmin && freeUsed < 2);

// 3. Balance Verification: If free used up & points insufficient
if (!isAdmin && !isFreeVideo && userPoints < videoCost) {
  let text =
    "⚠️ *You do not have sufficient balance!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Aapne apne *2 Free Videos* use kar liye hain.\n" +
    "Agla video dekhne ke liye *" + videoCost + " Points* ki zaroorat hai.\n\n" +
    "💰 *Aapka Current Balance:* *" + userPoints + " Points*\n" +
    "🎯 *Zaroorat:* *" + videoCost + " Points*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "👉 *Points Kaise Paayein?*\n" +
    "• 🎁 *Refer & Earn:* Dosto ko invite karein aur har referral par *" + (Bot.getProperty("points_per_referral") || 10) + " Points* paayein!\n" +
    "• 💳 *Buy Points:* Instant UPI se points khareedein (₹10 = 100 Points).";

  let buttons = [
    [
      { title: "🎁 Refer & Earn", command: "/referral" },
      { title: "💳 Buy Points", command: "/buy_points" }
    ],
    [{ title: "🏠 Main Menu", command: "/start" }]
  ];

  Bot.sendInlineKeyboard(buttons, text);
  return;
}

// 4. Select Next Video from library
let watched = User.getProperty("watched_videos") || [];
let nextVid = null;
let nextIndex = -1;

for (let i = 0; i < videos.length; i++) {
  if (watched.indexOf(videos[i].id) === -1) {
    nextVid = videos[i];
    nextIndex = i;
    break;
  }
}

// If user has watched all videos, restart queue
if (!nextVid) {
  watched = [];
  nextVid = videos[0];
  nextIndex = 0;
}

// Update watched list
watched.push(nextVid.id);
User.setProperty("watched_videos", watched, "json");

// Update views
nextVid.views = (nextVid.views || 0) + 1;
videos[nextIndex] = nextVid;
Bot.setProperty("videos", videos, "json");

// 5. Deduct Points or Update Free Video Counter
let statusLine = "";
if (isAdmin) {
  statusLine = "👑 *Admin Access:* Unlimited";
} else if (isFreeVideo) {
  let newFreeUsed = freeUsed + 1;
  User.setProperty("free_videos_used", newFreeUsed, "integer");
  statusLine = "🎁 *Free Video:* " + newFreeUsed + " of 2 used (0 points deducted)";
} else {
  let newPoints = userPoints - videoCost;
  User.setProperty("points", newPoints, "integer");
  Bot.setProperty("points_" + user.telegramid, newPoints, "integer");

  let totalSpent = (User.getProperty("total_points_spent") || 0) + videoCost;
  User.setProperty("total_points_spent", totalSpent, "integer");

  // Save history
  let history = User.getProperty("points_history") || [];
  history.push({
    type: "spent",
    amount: videoCost,
    reason: "Watched video (" + nextVid.title + ")",
    date: new Date().toISOString()
  });
  User.setProperty("points_history", history, "json");

  statusLine = "💎 *Remaining Points:* *" + newPoints + " Points* (-" + videoCost + " pts)";
}

// 6. Send Video directly
let caption =
  "🎬 *" + nextVid.title + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  statusLine + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "✨ _Enjoy watching!_";

let inlineKeyboard = [
  [{ text: "🎬 Get Next Video", callback_data: "/get_video" }],
  [{ text: "🏠 Main Menu", callback_data: "/start" }]
];

Api.sendVideo({
  chat_id: chat.chatid,
  video: nextVid.file_id,
  caption: caption,
  parse_mode: "Markdown",
  supports_streaming: true,
  reply_markup: {
    inline_keyboard: inlineKeyboard
  }
});
