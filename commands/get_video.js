/*CMD
command: /get_video
help: Real-time force channel verification on every Get Video request
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");
let isGlobalEnabled = Bot.getProperty("force_channels_enabled");
let channels = Bot.getProperty("force_channels") || [];
let activeChannels = [];
for (let i = 0; i < channels.length; i++) {
  if (channels[i].enabled !== false) {
    activeChannels.push(channels[i]);
  }
}

// 1. If admin, or force channels disabled globally, or 0 active channels -> Deliver immediately!
if (isAdmin || isGlobalEnabled === false || activeChannels.length === 0) {
  Bot.runCommand("/deliver_video");
  return;
}

// 2. Real-time Live Membership Verification on EVERY Get Video click!
// Reset missing channels and set pending action flag so verified user gets video directly
User.setProperty("missing_channels", [], "json");
User.setProperty("pending_video_request", true, "boolean");

// Start step-by-step real-time verification from channel 0
Bot.runCommand("/verify_step 0");
