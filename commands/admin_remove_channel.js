/*CMD
command: /admin_remove_channel
help: Displays all force channels for selection to remove
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

let channels = Bot.getProperty("force_channels") || [];

if (channels.length === 0) {
  let buttons = [[{ title: "🔙 Force Channels Menu", command: "/admin_channels" }]];
  Bot.sendInlineKeyboard(buttons, "⚠️ No force channels currently exist to remove.");
  return;
}

let text =
  "🗑 *Remove Force Channel*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select the channel you wish to remove from the verification requirement:\n\n";

let buttons = [];

for (let i = 0; i < channels.length; i++) {
  let ch = channels[i];
  let typeIcon = ch.type === "public" ? "📢 Public" : (ch.type === "private" ? "🔒 Private" : "📩 Request");
  let label = (ch.username ? ch.username : (ch.title || "Channel " + (i + 1)));

  text += (i + 1) + ". *" + typeIcon + "*: " + label + "\n";

  buttons.push([
    {
      title: "🗑 Remove: " + label + " (" + typeIcon + ")",
      command: "/admin_confirm_del_chan " + ch.id
    }
  ]);
}

text += "\n━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap any channel above to proceed with removal:";

buttons.push([
  { title: "📋 View Channel Details", command: "/admin_list_channels" },
  { title: "🔙 Cancel & Return", command: "/admin_channels" }
]);

Bot.sendInlineKeyboard(buttons, text);

