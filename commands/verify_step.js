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

// All active channels have been checked live via Telegram!
if (index >= activeChannels.length) {
  let missing = User.getProperty("missing_channels") || [];

  if (missing.length === 0) {
    // 100% verified right now!
    User.setProperty("channels_verified", true, "boolean");
    Bot.setProperty("user_left_any_" + user.telegramid, false, "boolean");

    // Process pending referral reward if new user joined via referral link
    let pendingRefId = User.getProperty("pending_referrer_id");
    if (pendingRefId) {
      User.setProperty("pending_referrer_id", null, "integer");
      let refEnabled = Bot.getProperty("referral_enabled");
      if (refEnabled !== false) {
        let refPoints = Bot.getProperty("points_per_referral") || 10;
        let refCount = Bot.getProperty("ref_count_" + pendingRefId) || 0;
        let newCount = refCount + 1;
        Bot.setProperty("ref_count_" + pendingRefId, newCount, "integer");

        let referrerPoints = Bot.getProperty("points_" + pendingRefId) || 0;
        let newReferrerPoints = referrerPoints + refPoints;
        Bot.setProperty("points_" + pendingRefId, newReferrerPoints, "integer");

        let refPointsEarned = Bot.getProperty("ref_points_" + pendingRefId) || 0;
        Bot.setProperty("ref_points_" + pendingRefId, refPointsEarned + refPoints, "integer");

        let refList = Bot.getProperty("ref_list_" + pendingRefId) || [];
        refList.push({
          id: user.telegramid,
          name: user.first_name || "Friend",
          username: user.username || "",
          date: new Date().toISOString()
        });
        Bot.setProperty("ref_list_" + pendingRefId, refList, "json");

        let totalValid = Bot.getProperty("total_valid_referrals") || 0;
        Bot.setProperty("total_valid_referrals", totalValid + 1, "integer");

        let totalDist = Bot.getProperty("total_points_distributed") || 0;
        Bot.setProperty("total_points_distributed", totalDist + refPoints, "integer");

        try {
          Bot.sendMessageToChatWithId(
            pendingRefId,
            "🎉 *New Referral Joined!*\n\n" +
            "User *" + (user.first_name || "Friend") + "* joined and verified channels!\n" +
            "• Total Referrals: *" + newCount + "*\n\n" +
            "🎁 *+" + refPoints + " Points Credited!* (Your Balance: *" + newReferrerPoints + " Points*)\n\n" +
            "Tap /my_points to view your balance or /get_video to watch videos!"
          );
        } catch (e) {
          // Referrer unreachable
        }
      }
    }

    if (User.getProperty("pending_video_request")) {
      User.setProperty("pending_video_request", false, "boolean");
      Bot.runCommand("/deliver_video");
      return;
    }

    Bot.runCommand("/start dashboard");
    return;
  }

  // User has not joined or has LEFT one or more required channels!
  User.setProperty("channels_verified", false, "boolean");
  User.setProperty("pending_video_request", false, "boolean");
  User.setProperty("pending_start_dashboard", false, "boolean");

  // Build join buttons ONLY for the missing channels!
  // Buttons arranged in 2x2 layout, title is strictly bold JOIN!
  let chanBtns = [];
  for (let i = 0; i < missing.length; i++) {
    let m = missing[i];
    let link = m.invite_link || (m.username ? "https://t.me/" + m.username.replace("@", "") : "");
    if (link) {
      chanBtns.push({ title: "𝗝𝗢𝗜𝗡", url: link, style: "primary" });
    }
  }

  // 2x2 Layout (2 buttons per row)
  let buttons = [];
  for (let i = 0; i < chanBtns.length; i += 2) {
    if (i + 1 < chanBtns.length) {
      buttons.push([chanBtns[i], chanBtns[i + 1]]);
    } else {
      buttons.push([chanBtns[i]]);
    }
  }

  // Verification action button (Only Verify button, no bypass!)
  buttons.push([{ title: "🔄 Verify Membership", command: "/verify_step 0", style: "primary" }]);

  let text =
    "⚠️ *Channel Membership Required!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "To use this bot and access videos, you must join our official channels below:\n\n";

  for (let i = 0; i < missing.length; i++) {
    let m = missing[i];
    let cleanName = (m.title || "").replace(/^@/, "").replace(/^Private Channel \([^)]*\)/, "Private Channel").replace(/^Request Channel \([^)]*\)/, "Request Channel").trim() || "Official Channel";
    text += (i + 1) + ". *" + cleanName + "*\n";
  }

  text +=
    "\n👉 Tap **𝗝𝗢𝗜𝗡** below to join each channel, then tap **Verify Membership**:\n" +
    "━━━━━━━━━━━━━━━━━━━━━";

  Bot.sendInlineKeyboard(buttons, text);
  return;
}

let ch = activeChannels[index];

// Check Request Channel
// Rule: User sends join request -> Bot considers user VERIFIED immediately!
// BUT if user LEFT the channel -> Bot detects and flags as missing!
if (ch.type === "request") {
  let rawChatId = (ch.chat_id || "").toString();
  let numId = rawChatId.replace("-100", "").replace("-", "");

  // 1. Check if user LEFT this channel!
  let hasLeft =
    Bot.getProperty("user_left_chan_" + user.telegramid + "_" + rawChatId) ||
    Bot.getProperty("user_left_chan_" + user.telegramid + "_" + rawChatId.replace("-100", "-")) ||
    (numId && Bot.getProperty("user_left_chan_" + user.telegramid + "_" + numId));

  if (hasLeft) {
    // User left this request channel! Invalidate verification and require them to re-join!
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

  // 2. Check if join request is pending (from Telegram chat_join_request webhook)
  let hasPendingReq =
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId) ||
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId.replace("-100", "-")) ||
    (numId && Bot.getProperty("user_pending_req_" + user.telegramid + "_" + numId)) ||
    Bot.getProperty("user_pending_req_" + user.telegramid) ||
    User.getProperty("requested_channel_" + ch.id) ||
    User.getProperty("requested_channel_" + rawChatId);

  // If user has sent request or request is pending in Telegram -> 100% Verified!
  if (hasPendingReq) {
    Bot.runCommand("/verify_step " + (index + 1));
    return;
  }

  // 3. If user was shown this channel button previously and now tapped Verify Membership:
  let seenBefore = User.getProperty("seen_req_chan_" + ch.id);
  if (seenBefore) {
    // User tapped the channel button to request and clicked Verify!
    // Mark as requested immediately without waiting for admin approval!
    User.setProperty("requested_channel_" + ch.id, true, "boolean");
    User.setProperty("requested_channel_" + rawChatId, true, "boolean");
    Bot.setProperty("user_pending_req_" + user.telegramid + "_" + rawChatId, true, "boolean");
    Bot.setProperty("user_pending_req_" + user.telegramid, true, "boolean");

    Bot.runCommand("/verify_step " + (index + 1));
    return;
  }

  // First time seeing this request channel: show button so user can send request
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
