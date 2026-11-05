/*CMD
command: /get_video
help: Deliver video to user directly
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let primaryAdmin = 8710308658;
let isAdmin = (user.telegramid == primaryAdmin || user.telegramid == String(primaryAdmin));

let channels = Bot.getProperty("force_channels") || [];
let activeChannels = [];
for (let i = 0; i < channels.length; i++) {
  if (channels[i].enabled !== false) activeChannels.push(channels[i]);
}

if (!isAdmin && activeChannels.length > 0) {
  User.setProperty("pending_video_request", true, "boolean");
  Bot.runCommand("/verify_step 0");
  return;
}

Bot.runCommand("/deliver_video");
