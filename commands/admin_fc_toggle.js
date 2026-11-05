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
  Bot.sendMessage("🚫 *Access Denied.*");
  return;
}

User.setProperty("in_fc_menu", true, "boolean");

let channels = Bot.getProperty("force_channels") || [];
if (channels.length === 0) {
  Bot.sendMessage("⚠️ *No channels configured yet.* Tap ➕ Add Channel to configure one.");
  Bot.runCommand("/admin_channels");
  return;
}

let text =
  "🔁 *ENABLE / DISABLE CHANNEL*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select a channel below to toggle its status:\n\n";

let keyboardRows = [];
for (let i = 0; i < channels.length; i++) {
  let ch = channels[i];
  let isEnabled = (ch.enabled !== false);
  let statusIcon = isEnabled ? "✅" : "🚫";
  let statusText = isEnabled ? "Enabled" : "Disabled";

  text += (i + 1) + ". " + statusIcon + " *" + (ch.title || "Channel") + "* (" + statusText + ")\n";

  let btnLabel = (i + 1) + ". " + statusIcon + " " + (ch.title || "Channel");
  keyboardRows.push([{ text: btnLabel, style: isEnabled ? "primary" : "danger" }]);
}

keyboardRows.push([{ text: "❌ Cancel", style: "danger" }]);

text += "\n━━━━━━━━━━━━━━━━━━━━━\n_(Tap channel button to flip status, or ❌ Cancel)_";

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "Markdown",
  reply_markup: {
    keyboard: keyboardRows,
    resize_keyboard: true
  }
});

Bot.run({ command: "/admin_fc_do_toggle" });

