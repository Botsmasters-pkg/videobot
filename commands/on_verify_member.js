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

if (isMember) {
  // Verified for this channel, check next
  Bot.runCommand("/check_channels " + (index + 1));
} else {
  // User is not a member (status is 'left' or 'kicked')
  let ch = activeChannels[index] || { title: "Official Channel" };
  let linkUrl = ch.invite_link || ("https://t.me/" + (ch.username ? ch.username.replace("@", "") : ""));

  let buttons = [
    [{ title: "📢 Join Channel (" + (index + 1) + " of " + activeChannels.length + ")", url: linkUrl }],
    [{ title: "🔄 Verify Membership", command: "/check_channels " + index }]
  ];

  let text =
    "⚠️ *Channel Membership Not Detected!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "You have not joined Channel " + (index + 1) + ": *" + (ch.title || ch.username || "Official Channel") + "* yet.\n\n" +
    "👉 Please click the button below to join the channel, then tap **Verify Membership** to continue!\n" +
    "━━━━━━━━━━━━━━━━━━━━━";

  Bot.sendInlineKeyboard(buttons, text);
}
