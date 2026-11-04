/*CMD
command: /admin_toggle_chan
help: Toggle force channel active/inactive
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let primaryAdmin = 8710308658;
if (user.telegramid != primaryAdmin && user.telegramid != String(primaryAdmin)) {
  Bot.sendMessage("🚫 *Access Denied.*");
  return;
}

if (params === "all") {
  let cur = Bot.getProperty("force_channels_enabled");
  let newVal = (cur === false) ? true : false;
  Bot.setProperty("force_channels_enabled", newVal, "boolean");

  let statusStr = newVal ? "🟢 Enabled (Active)" : "🔴 Disabled (Off)";
  Bot.sendMessage("⚙️ *Force Channel System is now " + statusStr + "!*");
}

Bot.runCommand("/admin_channels");

