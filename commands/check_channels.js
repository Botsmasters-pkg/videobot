/*CMD
command: /check_channels
help: Verifies membership across public, private, and request channels
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
  Bot.sendMessage("👑 *Admin Bypass:* Membership verified automatically.");
  Bot.runCommand("/start");
  return;
}

let isGlobalEnabled = Bot.getProperty("force_channels_enabled");
if (isGlobalEnabled === false) {
  User.setProperty("channels_verified", true, "boolean");
  Bot.runCommand("/start");
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let activeChannels = [];
for (let i = 0; i < channels.length; i++) {
  if (channels[i].enabled !== false) {
    activeChannels.push(channels[i]);
  }
}

if (activeChannels.length === 0) {
  User.setProperty("channels_verified", true, "boolean");
  Bot.runCommand("/start");
  return;
}

let index = parseInt(params) || 0;

if (index >= activeChannels.length) {
  // All channels successfully verified!
  User.setProperty("channels_verified", true, "boolean");
  Bot.sendMessage("✅ *All Channels Verified Successfully!*\n\nWelcome to the bot! Opening main menu...");
  let pendingRef = User.getProperty("pending_ref_param");
  if (pendingRef) {
    User.setProperty("pending_ref_param", null, "string");
    Bot.runCommand("/start " + pendingRef);
  } else {
    Bot.runCommand("/start");
  }
  return;
}

let ch = activeChannels[index];

if (ch.type === "request") {
  // Check if join request is recorded as pending in bot's memory
  let rawChatId = (ch.chat_id || "").toString();
  let numId = rawChatId.replace("-100", "").replace("-", "");
  let hasPendingReq =
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId) ||
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId.replace("-100", "-")) ||
    (numId && Bot.getProperty("user_pending_req_" + user.telegramid + "_" + numId)) ||
    Bot.getProperty("user_pending_req_" + user.telegramid);

  if (hasPendingReq) {
    // Join request is already pending and verified! Move to next channel
    Bot.runCommand("/check_channels " + (index + 1));
    return;
  }
}

// Check membership via Telegram getChatMember
let targetChat = ch.chat_id || ch.username;
if (!targetChat) {
  Bot.runCommand("/check_channels " + (index + 1));
  return;
}

Api.getChatMember({
  chat_id: targetChat,
  user_id: user.telegramid,
  on_result: "/on_verify_member " + index,
  on_error: "/on_verify_fail " + index
});
