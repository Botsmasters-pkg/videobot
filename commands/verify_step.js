/*CMD
command: /verify_step
help: Step-by-step real-time membership check for all active channels
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");
if (isAdmin) {
  User.setProperty("channels_verified", true, "boolean");
  if (User.getProperty("pending_video_request")) {
    User.setProperty("pending_video_request", false, "boolean");
    Bot.runCommand("/deliver_video");
  } else {
    Bot.runCommand("/start");
  }
  return;
}

let isGlobalEnabled = Bot.getProperty("force_channels_enabled");
let channels = Bot.getProperty("force_channels") || [];
let activeChannels = [];
for (let i = 0; i < channels.length; i++) {
  if (channels[i].enabled !== false) {
    activeChannels.push(channels[i]);
  }
}

if (isGlobalEnabled === false || activeChannels.length === 0) {
  User.setProperty("channels_verified", true, "boolean");
  if (User.getProperty("pending_video_request")) {
    User.setProperty("pending_video_request", false, "boolean");
    Bot.runCommand("/deliver_video");
  } else {
    Bot.runCommand("/start");
  }
  return;
}

let index = parseInt(params) || 0;

// All active channels have been checked live via Telegram!
if (index >= activeChannels.length) {
  let missing = User.getProperty("missing_channels") || [];

  if (missing.length === 0) {
    // 100% verified right now!
    User.setProperty("channels_verified", true, "boolean");
    if (User.getProperty("pending_video_request")) {
      User.setProperty("pending_video_request", false, "boolean");
      Bot.runCommand("/deliver_video");
    } else {
      Bot.sendMessage("✅ *All Channels Verified Successfully!*\n\nWelcome back! You have full access to videos.");
      let pendingRef = User.getProperty("pending_ref_param");
      if (pendingRef) {
        User.setProperty("pending_ref_param", null, "string");
        Bot.runCommand("/start " + pendingRef);
      } else {
        Bot.runCommand("/start");
      }
    }
    return;
  }

  // User has not joined or has LEFT one or more required channels!
  User.setProperty("channels_verified", false, "boolean");
  User.setProperty("pending_video_request", false, "boolean");

  // Build join buttons ONLY for the missing channels!
  // Button text MUST BE ONLY THE CHANNEL NAME (no usernames, chat IDs, or clutter)!
  let buttons = [];
  for (let i = 0; i < missing.length; i++) {
    let m = missing[i];
    let cleanName = (m.title || "").replace(/^@/, "").replace(/^Private Channel \([^)]*\)/, "Private Channel").replace(/^Request Channel \([^)]*\)/, "Request Channel").trim() || "Official Channel";
    let link = m.invite_link || (m.username ? "https://t.me/" + m.username.replace("@", "") : "");
    if (link) {
      buttons.push([{ title: cleanName, url: link, style: "primary" }]);
    }
  }

  // Verification action buttons
  buttons.push([{ title: "🔄 Verify Membership", command: "/verify_step 0", style: "primary" }]);
  buttons.push([{ title: "🏠 Main Menu", command: "/start", style: "primary" }]);

  let text =
    "⚠️ *Channel Membership Required!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "To access videos, you must be an active member of our channel(s).\n\n" +
    "👉 Please join the missing channel(s) below, then tap **Verify Membership**:\n" +
    "━━━━━━━━━━━━━━━━━━━━━";

  Bot.sendInlineKeyboard(buttons, text);
  return;
}

let ch = activeChannels[index];

// Check Request Channel
if (ch.type === "request") {
  let rawChatId = (ch.chat_id || "").toString();
  let numId = rawChatId.replace("-100", "").replace("-", "");
  let hasPendingReq =
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId) ||
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId.replace("-100", "-")) ||
    (numId && Bot.getProperty("user_pending_req_" + user.telegramid + "_" + numId)) ||
    Bot.getProperty("user_pending_req_" + user.telegramid);

  if (hasPendingReq) {
    // Verified for this channel! Check next channel
    Bot.runCommand("/verify_step " + (index + 1));
    return;
  }
}

// Live Telegram getChatMember check for Public, Private, and Request channels
let targetChat = ch.chat_id || ch.username;
if (!targetChat) {
  Bot.runCommand("/verify_step " + (index + 1));
  return;
}

Api.getChatMember({
  chat_id: targetChat,
  user_id: user.telegramid,
  on_result: "/on_verify_step_res " + index,
  on_error: "/on_verify_step_err " + index
});

