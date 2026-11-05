/*CMD
command: /admin_fc_confirm_del
help: Step 2 of Remove Channel - Ask for confirmation with Reply Buttons
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
  Bot.run({ command: "/admin_fc_confirm_del" });
  return;
}

let mText = message.trim();
if (mText === "❌ Cancel" || mText === "🔴 Cancel" || mText === "/admin") {
  Bot.runCommand("/admin_channels");
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let target = null;

// Check if admin clicked "1. Channel Name (-100...)" or entered number or chat ID
let matchNum = mText.match(/^(\d+)\./);
if (matchNum) {
  let idx = parseInt(matchNum[1]) - 1;
  if (channels[idx]) target = channels[idx];
} else if (/^\d+$/.test(mText) && parseInt(mText) <= channels.length && parseInt(mText) > 0) {
  target = channels[parseInt(mText) - 1];
} else {
  // Search by Chat ID or ID
  for (let i = 0; i < channels.length; i++) {
    let c = channels[i];
    if (
      String(c.chat_id) === mText ||
      String(c.id) === mText ||
      (c.username && c.username.toLowerCase() === mText.toLowerCase()) ||
      (c.title && mText.includes(c.title))
    ) {
      target = c;
      break;
    }
  }
}

if (!target) {
  Bot.sendMessage("⚠️ *Channel not found.* Please tap one of the channel buttons below:");
  Bot.run({ command: "/admin_fc_confirm_del" });
  return;
}

User.setProperty("fc_pending_remove_id", target.id, "string");

let typeStr = "Public";
if (target.type === "private") typeStr = "Private";
if (target.type === "request") typeStr = "Join Request";

let text =
  "⚠️ *CONFIRM REMOVE CHANNEL*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Are you sure you want to remove this channel?\n\n" +
  "• **Name:** " + (target.title || "Channel") + "\n" +
  "• **Type:** " + typeStr + "\n" +
  "• **Chat ID:** `" + (target.chat_id || target.id) + "`\n" +
  "• **Link:** " + (target.invite_link || "N/A") + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Confirm your action below 👇";

let keyboard = [
  [
    { text: "🟢 Confirm Remove", style: "success" },
    { text: "🔴 Cancel", style: "danger" }
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

Bot.run({ command: "/admin_fc_do_del" });

