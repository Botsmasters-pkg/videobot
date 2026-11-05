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
  Bot.sendMessage("🚫 Access Denied.");
  return;
}

function esc(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

User.setProperty("in_fc_menu", true, "boolean");

let channels = Bot.getProperty("force_channels") || [];
if (channels.length === 0) {
  Bot.sendMessage("⚠️ <b>No channels configured to remove.</b>", { parse_mode: "HTML" });
  Bot.runCommand("/admin_channels");
  return;
}

let text =
  "🗑 <b>REMOVE CHANNEL — Select Channel</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap the channel button below to remove:\n\n";

let keyboardRows = [];
for (let i = 0; i < channels.length; i++) {
  let ch = channels[i];
  let cleanTitle = ch.title || ("Channel " + (ch.chat_id || ch.id));
  let btnLabel = (i + 1) + ". " + cleanTitle;

  text += (i + 1) + ". <b>" + esc(cleanTitle) + "</b> (ID: <code>" + esc(ch.chat_id || ch.id) + "</code>)\n";
  keyboardRows.push([{ text: btnLabel, style: "primary" }]);
}

keyboardRows.push([{ text: "❌ Cancel", style: "danger" }]);

text += "\n━━━━━━━━━━━━━━━━━━━━━\n<i>(Or tap ❌ Cancel to abort)</i>";

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "HTML",
  reply_markup: {
    keyboard: keyboardRows,
    resize_keyboard: true
  }
});

Bot.run({ command: "/admin_fc_confirm_del" });

