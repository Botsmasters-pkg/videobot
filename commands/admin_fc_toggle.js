/*CMD
command: /admin_fc_toggle
help: Step 1 of Enable/Disable Channel - Select channel to toggle status
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
  Bot.sendMessage("⚠️ <b>No channels configured yet.</b> Tap ➕ Add Channel to configure one.", { parse_mode: "HTML" });
  Bot.runCommand("/admin_channels");
  return;
}

let text =
  "🔁 <b>ENABLE / DISABLE CHANNEL</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select a channel below to toggle its status:\n\n";

let keyboardRows = [];
for (let i = 0; i < channels.length; i++) {
  let ch = channels[i];
  let isEnabled = (ch.enabled !== false);
  let statusIcon = isEnabled ? "✅" : "🚫";
  let statusText = isEnabled ? "Enabled" : "Disabled";
  let cleanTitle = ch.title || ("Channel " + (ch.chat_id || ch.id));

  text += (i + 1) + ". " + statusIcon + " <b>" + esc(cleanTitle) + "</b> (" + statusText + ")\n";

  let btnLabel = (i + 1) + ". " + statusIcon + " " + cleanTitle;
  keyboardRows.push([{ text: btnLabel, style: isEnabled ? "primary" : "danger" }]);
}

keyboardRows.push([{ text: "❌ Cancel", style: "danger" }]);

text += "\n━━━━━━━━━━━━━━━━━━━━━\n<i>(Tap channel button to flip status, or ❌ Cancel)</i>";

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "HTML",
  reply_markup: {
    keyboard: keyboardRows,
    resize_keyboard: true
  }
});

Bot.run({ command: "/admin_fc_do_toggle" });
