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
  if (ch && ch.type !== "request") {
    // Flag this public/private channel as missing!
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

