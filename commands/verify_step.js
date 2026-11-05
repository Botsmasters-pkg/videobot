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
    Bot.runCommand("/start dashboard");
  }
  return;
}

function esc(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
    Bot.runCommand("/start dashboard");
  }
  return;
}

let index = parseInt(params) || 0;
if (index === 0) {
  User.setProperty("missing_channels", [], "json");
}

// All active channels checked live!
if (index >= activeChannels.length) {
  let missing = User.getProperty("missing_channels") || [];

  if (missing.length === 0) {
    // 100% verified right now!
    User.setProperty("channels_verified", true, "boolean");
    Bot.setProperty("user_left_any_" + user.telegramid, false, "boolean");

    Bot.sendMessage("✅ <b>Verified</b>", { parse_mode: "HTML" });

    if (User.getProperty("pending_video_request")) {
      User.setProperty("pending_video_request", false, "boolean");
      Bot.runCommand("/deliver_video");
      return;
    }

    Bot.runCommand("/start dashboard");
    return;
  }

  // User has missing channels
  User.setProperty("channels_verified", false, "boolean");
  User.setProperty("pending_video_request", false, "boolean");
  User.setProperty("pending_start_dashboard", false, "boolean");

  // Build join buttons in 2x2 layout with bold JOIN
  let chanBtns = [];
  for (let i = 0; i < missing.length; i++) {
    let m = missing[i];
    let link = m.invite_link || (m.username ? "https://t.me/" + m.username.replace("@", "") : "");
    if (link) {
      chanBtns.push({ title: "𝗝𝗢𝗜𝗡", url: link, style: "primary" });
    }
  }

  let buttons = [];
  for (let i = 0; i < chanBtns.length; i += 2) {
    if (i + 1 < chanBtns.length) {
      buttons.push([chanBtns[i], chanBtns[i + 1]]);
    } else {
      buttons.push([chanBtns[i]]);
    }
  }

  buttons.push([{ title: "🔵 Check Membership", command: "/verify_step 0", style: "primary" }]);

  let text =
    "⚠️ <b>Channel Membership Required!</b>\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "To access this bot and watch videos, you must join our required channel(s) below:\n\n";

  for (let i = 0; i < missing.length; i++) {
    let m = missing[i];
    let cleanName = m.title || "Official Channel";
    text += (i + 1) + ". <b>" + esc(cleanName) + "</b>\n";
  }

  text +=
    "\n👉 Tap <b>𝗝𝗢𝗜𝗡</b> above to join each channel, then tap <b>Check Membership</b>:\n" +
    "━━━━━━━━━━━━━━━━━━━━━";

  Bot.sendInlineKeyboard(buttons, text, { parse_mode: "HTML" });
  return;
}

let ch = activeChannels[index];

// Check Request Channel
// Rule: User sends join request -> Bot considers user VERIFIED immediately!
// Do NOT wait for admin approval.
if (ch.type === "request") {
  let rawChatId = (ch.chat_id || "").toString();
  let numId = rawChatId.replace("-100", "").replace("-", "");

  // Check if user left
  let hasLeft =
    Bot.getProperty("user_left_chan_" + user.telegramid + "_" + rawChatId) ||
    Bot.getProperty("user_left_chan_" + user.telegramid + "_" + rawChatId.replace("-100", "-")) ||
    (numId && Bot.getProperty("user_left_chan_" + user.telegramid + "_" + numId));

  if (hasLeft) {
    User.setProperty("requested_channel_" + ch.id, false, "boolean");
    User.setProperty("requested_channel_" + rawChatId, false, "boolean");
    User.setProperty("seen_req_chan_" + ch.id, false, "boolean");

    let missing = User.getProperty("missing_channels") || [];
    let alreadyAdded = false;
    for (let m = 0; m < missing.length; m++) {
      if (missing[m].id === ch.id) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) {
      missing.push(ch);
      User.setProperty("missing_channels", missing, "json");
    }
    Bot.runCommand("/verify_step " + (index + 1));
    return;
  }

  let hasPendingReq =
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId) ||
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId.replace("-100", "-")) ||
    (numId && Bot.getProperty("user_pending_req_" + user.telegramid + "_" + numId)) ||
    Bot.getProperty("user_pending_req_" + user.telegramid) ||
    User.getProperty("requested_channel_" + ch.id) ||
    User.getProperty("requested_channel_" + rawChatId);

  if (hasPendingReq) {
    Bot.runCommand("/verify_step " + (index + 1));
    return;
  }

  let seenBefore = User.getProperty("seen_req_chan_" + ch.id);
  if (seenBefore) {
    User.setProperty("requested_channel_" + ch.id, true, "boolean");
    User.setProperty("requested_channel_" + rawChatId, true, "boolean");
    Bot.setProperty("user_pending_req_" + user.telegramid + "_" + rawChatId, true, "boolean");
    Bot.setProperty("user_pending_req_" + user.telegramid, true, "boolean");

    Bot.runCommand("/verify_step " + (index + 1));
    return;
  }

  User.setProperty("seen_req_chan_" + ch.id, true, "boolean");
  let missing = User.getProperty("missing_channels") || [];
  missing.push(ch);
  User.setProperty("missing_channels", missing, "json");

  Bot.runCommand("/verify_step " + (index + 1));
  return;
}

// Live Telegram getChatMember check for Public and Private channels
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
