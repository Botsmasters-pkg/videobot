/*CMD
command: /on_verify_member
help: Telegram getChatMember callback handler
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

let res = options ? (options.result || options) : null;
let status = res ? res.status : null;

let isMember = (status === "creator" || status === "administrator" || status === "member" || status === "restricted");

let ch = activeChannels[index] || { title: "Official Channel" };

// Check if request channel has pending request recorded
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

if (isMember || isPending) {
  // Verified for this channel, check next
  Bot.runCommand("/check_channels " + (index + 1));
} else {
  // User is not a member and has no pending request
  let isReq = (ch && ch.type === "request");
  let chTitle = ch.title || ch.username || ("Channel " + (index + 1));
  let linkUrl = ch.invite_link || ("https://t.me/" + (ch.username ? ch.username.replace("@", "") : ""));

  let btnTitle = isReq ? "📩 Send Join Request (" + (index + 1) + " of " + activeChannels.length + ")" : "📢 Join Channel (" + (index + 1) + " of " + activeChannels.length + ")";

  let buttons = [
    [{ title: btnTitle, url: linkUrl }],
    [{ title: "🔄 Verify Membership", command: "/check_channels " + index }]
  ];

  let text = isReq ?
    ("📢 *Channel Join Request Required!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "Channel " + (index + 1) + " of " + activeChannels.length + " requires a **Join Request**:\n\n" +
    "👉 Tap **Send Join Request** below and submit your request, then tap **Verify Membership**!\n\n" +
    "📌 *Notice:* Pending requests are verified immediately without waiting for admin approval.\n" +
    "━━━━━━━━━━━━━━━━━━━━━")
    :
    ("⚠️ *Channel Membership Not Detected!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "You have not joined Channel " + (index + 1) + ": *" + chTitle + "* yet.\n\n" +
    "👉 Please click the button below to join the channel, then tap **Verify Membership** to continue!\n" +
    "━━━━━━━━━━━━━━━━━━━━━");

  Bot.sendInlineKeyboard(buttons, text);
}
