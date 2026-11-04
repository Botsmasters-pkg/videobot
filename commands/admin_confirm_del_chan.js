/*CMD
command: /admin_confirm_del_chan
help: Confirmation dialog before removing a channel
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

let chanId = parseInt(params);
if (!chanId) {
  Bot.runCommand("/admin_remove_channel");
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let target = null;
for (let i = 0; i < channels.length; i++) {
  if (channels[i].id === chanId) {
    target = channels[i];
    break;
  }
}

if (!target) {
  Bot.sendMessage("⚠️ Channel not found or already removed.");
  Bot.runCommand("/admin_remove_channel");
  return;
}

let typeStr = target.type === "public" ? "📢 Public Channel" : (target.type === "private" ? "🔒 Private Channel" : "📩 Private Request Channel");
let identifier = target.username || target.chat_id || "N/A";

let text =
  "⚠️ *Confirmation: Remove Force Channel?*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Are you sure you want to remove this channel?\n\n" +
  "• *Title:* " + (target.title || "Channel") + "\n" +
  "• *Type:* " + typeStr + "\n" +
  "• *Identifier:* `" + identifier + "`\n" +
  "• *Invite Link:* " + (target.invite_link || "N/A") + "\n\n" +
  "📌 *Note:* Users will no longer be required to join this channel to access videos. All other channels will remain intact.\n" +
  "━━━━━━━━━━━━━━━━━━━━━";

let buttons = [
  [{ title: "✅ Yes, Confirm Remove", command: "/admin_do_del_chan " + target.id }],
  [{ title: "❌ Cancel", command: "/admin_remove_channel" }]
];

Bot.sendInlineKeyboard(buttons, text);

