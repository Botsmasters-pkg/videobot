/*CMD
command: /admin_channels
help: Force Channel Management Dashboard (Public, Private, Request)
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

let isGlobalEnabled = Bot.getProperty("force_channels_enabled");
let statusBadge = (isGlobalEnabled !== false) ? "🟢 Active (Enforced)" : "🔴 Disabled (Off)";

let channels = Bot.getProperty("force_channels") || [];

let channelLines = [];
let buttons = [];

if (channels.length === 0) {
  channelLines.push("_No force channels added yet._");
} else {
  for (let i = 0; i < channels.length; i++) {
    let ch = channels[i];
    let typeIcon = ch.type === "public" ? "📢 Public" : (ch.type === "private" ? "🔒 Private" : "📩 Request");
    let detail = ch.username ? ch.username : (ch.chat_id || "N/A");
    channelLines.push((i + 1) + ". *" + typeIcon + "*: `" + detail + "`");
    buttons.push([{
      title: "🗑 Remove Channel " + (i + 1) + " (" + typeIcon + ")",
      command: "/admin_del_chan " + ch.id
    }]);
  }
}

let text =
  "📢 *Force Channel Management*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "⚙️ *Global System Status:* " + statusBadge + "\n" +
  "Total Channels: *" + channels.length + "*\n\n" +
  "📋 *Configured Channels:*\n" +
  channelLines.join("\n") +
  "\n━━━━━━━━━━━━━━━━━━━━━\n" +
  "Add channels or toggle system below:";

let toggleBtn = (isGlobalEnabled !== false) ? "🔴 Disable Force Channels" : "🟢 Enable Force Channels";

buttons.push([
  { title: "📢 Add Public Channel", command: "/admin_add_pub_chan" }
]);
buttons.push([
  { title: "🔒 Add Private Channel", command: "/admin_add_priv_chan" },
  { title: "📩 Add Request Channel", command: "/admin_add_req_chan" }
]);
buttons.push([
  { title: toggleBtn, command: "/admin_toggle_chan all" },
  { title: "🛠 Admin Dashboard", command: "/admin" }
]);

Bot.sendInlineKeyboard(buttons, text);
