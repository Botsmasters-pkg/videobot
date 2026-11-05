/*CMD
command: /admin_fc_step2
help: Step 2 Handler - Process Channel Type and ask for Join URL
need_reply: true
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

if (!message) {
  Bot.run({ command: "/admin_fc_step2" });
  return;
}

let mText = message.trim();
if (mText === "❌ Cancel" || mText === "🔴 Cancel" || mText === "/admin") {
  Bot.runCommand("/admin_channels");
  return;
}

let channelType = "public";
if (mText.indexOf("Private") > -1) {
  channelType = "private";
} else if (mText.indexOf("Join Request") > -1 || mText.indexOf("Request") > -1) {
  channelType = "request";
} else if (mText.indexOf("Public") > -1) {
  channelType = "public";
} else {
  // Invalid selection, prompt again
  Bot.sendMessage("⚠️ Please select a valid channel type using the keyboard below:");
  Bot.run({ command: "/admin_fc_step2" });
  return;
}

User.setProperty("fc_temp_type", channelType, "string");
User.setProperty("fc_state", "awaiting_url", "string");

let typeLabel = "Public Channel";
if (channelType === "private") typeLabel = "Private Channel";
if (channelType === "request") typeLabel = "Join Request Channel";

let text =
  "➕ *ADD CHANNEL — Step 3 of 3*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "• 📌 **Selected Type:** *" + typeLabel + "*\n\n" +
  "👉 Now, send the **Join URL** for this channel:\n" +
  "_(e.g. `https://t.me/example` or `https://t.me/+AbCdEfGh` or `https://t.me/+joinchat/...`)_\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_(Or tap ❌ Cancel below)_";

let keyboard = [
  [
    { text: "❌ Cancel", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "Markdown",
  reply_markup: {
    keyboard: keyboard,
    resize_keyboard: true
  }
});

Bot.run({ command: "/admin_fc_step3" });
