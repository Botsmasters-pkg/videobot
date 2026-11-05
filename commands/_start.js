/*CMD
command: /start
help: Starts the bot and displays the main dashboard
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

// 1. Check if user is banned
let isBanned = Bot.getProperty("banned_" + user.telegramid);
if (isBanned) {
  Bot.sendMessage("🚫 *Access Denied*\n\nYour account has been suspended by administrators.");
  return;
}

// 2. Register user & handle referral if new
let isRegistered = User.getProperty("is_registered");
if (!isRegistered) {
  User.setProperty("is_registered", true, "boolean");
  User.setProperty("points", 0, "integer");
  User.setProperty("free_videos_used", 0, "integer");
  User.setProperty("total_points_earned", 0, "integer");
  User.setProperty("total_points_spent", 0, "integer");
  User.setProperty("points_history", [], "json");
  User.setProperty("watched_videos", [], "json");
  User.setProperty("joined_at", new Date().toISOString(), "string");
  Bot.setProperty("points_" + user.telegramid, 0, "integer");

  // Track global user list
  let allUsers = Bot.getProperty("all_users_list") || [];
  allUsers.push({
    id: user.telegramid,
    name: user.first_name || "User",
    username: user.username || "",
    joined: new Date().toISOString()
  });
  Bot.setProperty("all_users_list", allUsers, "json");

  // Increment total users counter
  let totalUsers = Bot.getProperty("total_users_count") || 0;
  Bot.setProperty("total_users_count", totalUsers + 1, "integer");

  // Clear any old hardcoded seed categories
  let existingCats = Bot.getProperty("categories");
  if (existingCats && existingCats.length === 3 && existingCats[0].name === "Action & Thriller") {
    Bot.setProperty("categories", [], "json");
  }

  // Initialize default storage channel if not set
  if (!Bot.getProperty("storage_channel_id")) {
    Bot.setProperty("storage_channel_id", "-1003856912131", "string");
  }

  // Handle Referral: save referrer ID on user to be awarded upon channel verification
  if (params && params !== "dashboard") {
    let cleanParam = params.toString().replace("ref_", "").replace("ref", "").trim();
    let refId = parseInt(cleanParam);
    if (refId && refId != user.telegramid) {
      User.setProperty("pending_referrer_id", refId, "integer");
      User.setProperty("referrer_id", refId, "string");
    }
  }
}

// 3. Force Channel Verification Check on /start
let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");
let isGlobalEnabled = Bot.getProperty("force_channels_enabled");
let channels = Bot.getProperty("force_channels") || [];
let activeChannels = [];
for (let i = 0; i < channels.length; i++) {
  if (channels[i].enabled !== false) {
    activeChannels.push(channels[i]);
  }
}

let needVerify = (!isAdmin && isGlobalEnabled !== false && activeChannels.length > 0 && params !== "dashboard");

if (needVerify) {
  User.setProperty("missing_channels", [], "json");
  User.setProperty("pending_video_request", false, "boolean");
  User.setProperty("pending_start_dashboard", true, "boolean");
  Bot.runCommand("/verify_step 0");
  return;
}

// 4. Render Main Menu with Buttons
let buttons = [
  [
    { title: "🎬 Get Video", command: "/get_video", style: "primary" }
  ],
  [
    { title: "💰 My Points", command: "/my_points", style: "primary" },
    { title: "🎁 Refer & Earn", command: "/referral", style: "primary" }
  ],
  [
    { title: "💳 Buy Points", command: "/buy_points", style: "primary" },
    { title: "ℹ️ Help", command: "/help", style: "primary" }
  ]
];

// Show Admin button only for authorized admin 8710308658
if (user.telegramid == 8710308658 || user.telegramid == "8710308658") {
  buttons.push([{ title: "🛠 Open Admin Panel", command: "/admin", style: "primary" }]);
}

let freeUsed = User.getProperty("free_videos_used") || 0;
let freeLeft = Math.max(0, 2 - freeUsed);
let userPoints = Bot.getProperty("points_" + user.telegramid) || User.getProperty("points") || 0;

let welcomeText =
  "👋 *Welcome, " + (user.first_name || "Friend") + "!*\n\n" +
  "🎬 *Smart Video Bot Dashboard*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🎁 *Free Videos Left:* *" + freeLeft + " of 2 Free Videos*\n" +
  "💰 *My Points Balance:* *" + userPoints + " Points*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📌 *How it works:*\n" +
  "• 🎁 *First 2 Videos FREE:* Tap 'Get Video' to watch 2 free videos!\n" +
  "• 👥 *Refer & Earn:* Invite friends to get *10 Points per referral*!\n" +
  "• 💳 *Buy Points:* Instant UPI starting at *₹10 = 100 Points*.\n\n" +
  "Tap *🎬 Get Video* below to get your video 👇";

Bot.sendInlineKeyboard(buttons, welcomeText);
