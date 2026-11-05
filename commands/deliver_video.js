/*CMD
command: /deliver_video
help: Continuous video rotation with new video priority and transaction-safe delivery
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let videos = Bot.getProperty("videos") || [];

// 1. Check if videos exist in the library
if (!videos || videos.length === 0) {
  let buttons = [[{ title: "🏠 Main Menu", command: "/start" }]];
  Bot.sendInlineKeyboard(
    buttons,
    "⚠️ *No video has been uploaded yet.*\n\nPlease check back later when an admin uploads videos!"
  );
  return;
}

// 2. Concurrency & Rapid Click Protection (debounce rapid taps)
let now = Date.now();
let lastClick = User.getProperty("last_get_video_click") || 0;
if (now - lastClick < 1500) {
  return;
}
User.setProperty("last_get_video_click", now, "integer");

// 3. User Identity & Points Setup
let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");
let freeUsed = User.getProperty("free_videos_used") || 0;
let userPoints = Bot.getProperty("points_" + user.telegramid);
if (userPoints === null || userPoints === undefined) {
  userPoints = User.getProperty("points") || 0;
}
let videoCost = Bot.getProperty("points_per_video") || 5;
let isFreeVideo = (!isAdmin && freeUsed < 2);

// 4. Points Verification BEFORE Queue Progression
if (!isAdmin && !isFreeVideo && userPoints < videoCost) {
  let insufficientText =
    "You don't have enough points to get the next video!\n\n" +
    "Earn free points by referring friends or purchase points to continue watching videos.";

  let buttons = [
    [
      { title: "🎁 Refer & Earn", command: "/referral", style: "primary" },
      { title: "💳 Buy Points", command: "/buy_points", style: "primary" }
    ],
    [{ title: "🏠 Main Menu", command: "/start", style: "primary" }]
  ];

  Bot.sendInlineKeyboard(buttons, insufficientText);
  return;
}

// 5. Rotation Logic: Priority to Brand-New Videos, then Continuous Sequential Rotation
let allSeen = User.getProperty("all_seen_video_ids") || User.getProperty("watched_videos") || [];
let cycleDelivered = User.getProperty("cycle_delivered_ids") || [];
let lastRegularId = User.getProperty("last_rotation_vid_id");
let cycleNumber = User.getProperty("rotation_cycle") || 1;

let nextVideo = null;
let isNewPriorityVideo = false;

// Step A: Priority Check - Look for brand new videos never seen by this user
let brandNewVideos = [];
for (let i = 0; i < videos.length; i++) {
  if (allSeen.indexOf(videos[i].id) === -1) {
    brandNewVideos.push(videos[i]);
  }
}

if (brandNewVideos.length > 0) {
  nextVideo = brandNewVideos[0];
  isNewPriorityVideo = true;
} else {
  // Step B: Continuous Sequential Rotation
  let remainingInCycle = [];
  for (let i = 0; i < videos.length; i++) {
    if (cycleDelivered.indexOf(videos[i].id) === -1) {
      remainingInCycle.push(videos[i]);
    }
  }

  // If all videos in library have been delivered in this cycle, advance to next cycle!
  if (remainingInCycle.length === 0) {
    cycleNumber = cycleNumber + 1;
    User.setProperty("rotation_cycle", cycleNumber, "integer");
    cycleDelivered = [];
    User.setProperty("cycle_delivered_ids", cycleDelivered, "json");
    lastRegularId = null;
    User.setProperty("last_rotation_vid_id", null, "string");
  }

  // Find index of last regular video delivered in rotation
  let lastIndex = -1;
  if (lastRegularId !== null && lastRegularId !== undefined) {
    for (let i = 0; i < videos.length; i++) {
      if (videos[i].id == lastRegularId) {
        lastIndex = i;
        break;
      }
    }
  }

  // Search for the next undelivered video in sequence starting from lastIndex + 1 to end
  for (let i = lastIndex + 1; i < videos.length; i++) {
    if (cycleDelivered.indexOf(videos[i].id) === -1) {
      nextVideo = videos[i];
      break;
    }
  }

  // If reached the end without finding, wrap around from beginning (0) to lastIndex
  if (!nextVideo) {
    for (let i = 0; i <= lastIndex && i < videos.length; i++) {
      if (cycleDelivered.indexOf(videos[i].id) === -1) {
        nextVideo = videos[i];
        break;
      }
    }
  }

  // Ultimate fallback if any video is left undelivered
  if (!nextVideo) {
    for (let i = 0; i < videos.length; i++) {
      if (cycleDelivered.indexOf(videos[i].id) === -1) {
        nextVideo = videos[i];
        break;
      }
    }
  }
}

if (!nextVideo) {
  Bot.sendMessage("⚠️ Unable to load next video. Please try again.");
  return;
}

// 6. Deduct Points or Increment Free Video Counter
let statusLine = "";
if (isAdmin) {
  statusLine = "👑 *Admin Access:* Unlimited";
} else if (isFreeVideo) {
  let newFree = freeUsed + 1;
  User.setProperty("free_videos_used", newFree, "integer");
  statusLine = "🎁 *Free Video:* " + newFree + " of 2 used (0 points deducted)";
} else {
  let newPoints = userPoints - videoCost;
  User.setProperty("points", newPoints, "integer");
  Bot.setProperty("points_" + user.telegramid, newPoints, "integer");

  let totalSpent = (User.getProperty("total_points_spent") || 0) + videoCost;
  User.setProperty("total_points_spent", totalSpent, "integer");

  let history = User.getProperty("points_history") || [];
  history.push({
    type: "spent",
    amount: videoCost,
    reason: "Watched video (" + nextVideo.title + ")",
    date: new Date().toISOString()
  });
  User.setProperty("points_history", history, "json");

  statusLine = "💎 *Points Balance:* *" + newPoints + " Points* (-" + videoCost + " pts)";
}

// 7. Update User Rotation State & History
if (allSeen.indexOf(nextVideo.id) === -1) {
  allSeen.push(nextVideo.id);
  User.setProperty("all_seen_video_ids", allSeen, "json");
  User.setProperty("watched_videos", allSeen, "json");
}

if (cycleDelivered.indexOf(nextVideo.id) === -1) {
  cycleDelivered.push(nextVideo.id);
  User.setProperty("cycle_delivered_ids", cycleDelivered, "json");
}

if (!isNewPriorityVideo) {
  User.setProperty("last_rotation_vid_id", nextVideo.id, "string");
}

for (let i = 0; i < videos.length; i++) {
  if (videos[i].id === nextVideo.id) {
    videos[i].views = (videos[i].views || 0) + 1;
    break;
  }
}
Bot.setProperty("videos", videos, "json");

// 8. Deliver Video to User
let priorityTag = isNewPriorityVideo ? "🔥 *[New Video Priority]*\n" : "";
let caption =
  priorityTag +
  "🎬 *" + nextVideo.title + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  statusLine + "\n" +
  "🔄 *Cycle:* #" + cycleNumber + " (" + cycleDelivered.length + " of " + videos.length + " in rotation)\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "✨ _Enjoy watching!_";

let inlineKeyboard = [
  [{ text: "🎬 Get Next Video", callback_data: "/get_video", style: "primary" }],
  [{ text: "🏠 Main Menu", callback_data: "/start", style: "primary" }]
];

// Deliver Video using Storage Channel copyMessage if available, else sendVideo
if (nextVideo.storage_channel_id && nextVideo.storage_message_id) {
  try {
    Api.copyMessage({
      chat_id: chat.chatid,
      from_chat_id: nextVideo.storage_channel_id,
      message_id: nextVideo.storage_message_id,
      caption: caption,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });
    return;
  } catch (e) {
    // Fall back to sendVideo if copyMessage encounters an issue
  }
}

// Fallback: Direct Video Streaming via File ID
Api.sendVideo({
  chat_id: chat.chatid,
  video: nextVideo.storage_file_id || nextVideo.file_id,
  caption: caption,
  parse_mode: "Markdown",
  supports_streaming: true,
  reply_markup: {
    inline_keyboard: inlineKeyboard
  }
});

