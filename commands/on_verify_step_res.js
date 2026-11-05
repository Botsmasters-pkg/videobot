/*CMD
command: /on_verify_step_res
help: Callback for live getChatMember result in verify_step
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

let res = options ? (options.result || options) : null;
let status = res ? res.status : null;
let isMember = (status === "creator" || status === "administrator" || status === "member" || status === "restricted");

if (!isMember) {
  // If it's a request channel, verify if user has pending request recorded
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

  if (!isPending && ch) {
    // Flag this channel as missing!
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
  }
}

// Proceed to verify next channel
Bot.runCommand("/verify_step " + (index + 1));
