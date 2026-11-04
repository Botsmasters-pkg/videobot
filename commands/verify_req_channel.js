/*CMD
command: /verify_req_channel
help: User confirms sending join request for private request channel
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let parts = (params || "").trim().split(/\s+/);
let chatId = parts[0];
let nextIndex = (parts.length >= 2) ? parseInt(parts[1]) + 1 : 1;

if (chatId) {
  User.setProperty("requested_channel_" + chatId, true, "boolean");
  Bot.setProperty("user_pending_req_" + user.telegramid + "_" + chatId, true, "boolean");
}

Bot.sendMessage("📩 *Join Request Recorded!* Checking next channel...");
Bot.runCommand("/check_channels " + nextIndex);
