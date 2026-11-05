/*CMD
command: /admin_fc_remove
help: Step 1 of Remove Channel - Prompt admin to select channel to remove
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

User.setProperty("in_fc_menu", true, "boolean");

let channels = Bot.getProperty("force_channels") || [];
if (channels.length === 0) {
  Bot.sendMessage("⚠️ *No channels configured to remove.*");
  Bot.runCommand("/admin_channels");
  return;
}

let text =
  "🗑 *REMOVE CHANNEL — Select Channel*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap the channel button below or send its **Numeric Chat ID** to remove:\n\n";

let keyboardRows = [];
for (let i = 0; i < channels.length; i++) {
  let ch = channels[i];
  let btnText = (i + 1) + ". " + (ch.title || "Channel") + " (" + (ch.chat_id || ch.id) + ")";
  text += (i + 1) + ". *" + (ch.title || "Channel") + "* (`" + (ch.chat_id || ch.id) + "`)\n";
  keyboardRows.push([{ text: btnText, style: "primary" }]);
}

keyboardRows.push([{ text: "❌ Cancel", style: "danger" }]);

text += "\n━━━━━━━━━━━━━━━━━━━━━\n_(Or tap ❌ Cancel to abort)_";

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "Markdown",
  reply_markup: {
    keyboard: keyboardRows,
    resize_keyboard: true
  }
});

Bot.run({ command: "/admin_fc_confirm_del" });
