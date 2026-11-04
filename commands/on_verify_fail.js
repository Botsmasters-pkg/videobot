/*CMD
command: /on_verify_fail
help: getChatMember error handler (failsafe)
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let index = parseInt(params) || 0;

let channels = Bot.getProperty("force_channels") || [];
let activeChannels = [];
for (let i = 0; i < channels.length; i++) {
  if (channels[i].enabled !== false) {
    activeChannels.push(channels[i]);
  }
}

let ch = activeChannels[index];

// Check if user has a pending join request recorded
let isPending = false;
if (ch && ch.type === "request") {
  let rawChatId = (ch.chat_id || "").toString();
  let numId = rawChatId.replace("-100", "").replace("-", "");
  isPending =
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId) ||
    Bot.getProperty("user_pending_req_" + user.telegramid + "_" + rawChatId.replace("-100", "-")) ||
    (numId && Bot.getProperty("user_pending_req_" + user.telegramid + "_" + numId)) ||
    Bot.getProperty("user_pending_req_" + user.telegramid);
}

if (isPending) {
  // Pending join request found! Move to next channel
  Bot.runCommand("/check_channels " + (index + 1));
} else if (ch && ch.type === "request") {
  let chTitle = ch.title || "Request Channel";
  let linkUrl = ch.invite_link || "https://t.me/";
  let buttons = [
    [{ title: "📩 Send Join Request (" + (index + 1) + " of " + activeChannels.length + ")", url: linkUrl }],
    [{ title: "🔄 Verify Membership", command: "/check_channels " + index }]
  ];
  Bot.sendInlineKeyboard(
    buttons,
    "📢 *Join Request Required!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Channel *" + chTitle + "* requires a **Join Request**:\n\n" +
    "👉 Please tap **Send Join Request** to submit your request, then tap **Verify Membership**!"
  );
} else {
  // For broken chat ID in public or private channel, skip to avoid bricking the bot
  Bot.runCommand("/check_channels " + (index + 1));
}
