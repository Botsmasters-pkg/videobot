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
  // Check if join request is recorded
  let hasRequested = User.getProperty("requested_channel_" + ch.chat_id) || Bot.getProperty("user_pending_req_" + user.telegramid + "_" + ch.chat_id);
  if (hasRequested) {
    // Request is valid! Move to next channel
    Bot.runCommand("/check_channels " + (index + 1));
    return;
  }

  // Prompt user to send request
  let reqLink = ch.invite_link || "https://t.me/";
  let buttons = [
    [{ title: "📩 Send Join Request (Channel " + (index + 1) + ")", url: reqLink }],
    [{ title: "✅ I Have Sent Request", command: "/verify_req_channel " + ch.chat_id + " " + index }],
    [{ title: "🔄 Verify Membership", command: "/check_channels " + index }]
  ];

  let text =
    "📢 *Channel Join Request Required!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Channel " + (index + 1) + " of " + activeChannels.length + " requires a **Join Request**:\n\n" +
    "1. Tap **Send Join Request** below and request to join.\n" +
    "2. Once you tap request, click **I Have Sent Request**.\n\n" +
    "📌 *Notice:* You do NOT have to wait for admin approval! Pending requests are verified immediately.\n" +
    "━━━━━━━━━━━━━━━━━━━━━";

  Bot.sendInlineKeyboard(buttons, text);
  return;
}

// Public or Private Channel Check via Telegram getChatMember
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
