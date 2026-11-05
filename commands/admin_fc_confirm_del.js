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
  Bot.sendMessage("🚫 Access Denied.");
  return;
}

function esc(s) {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

if (!message) {
  Bot.run({ command: "/admin_fc_confirm_del" });
  return;
}

let mText = message.trim();
if (mText === "❌ Cancel" || mText === "🔴 Cancel" || mText === "/admin" || mText === "Cancel") {
  Bot.runCommand("/admin_channels");
  return;
}

let channels = Bot.getProperty("force_channels") || [];
let target = null;

// Match by number (e.g. "1. Channel Name" or "1")
let matchNum = mText.match(/^(\d+)\./);
if (matchNum) {
  let idx = parseInt(matchNum[1]) - 1;
  if (channels[idx]) target = channels[idx];
} else if (/^\d+$/.test(mText) && parseInt(mText) <= channels.length && parseInt(mText) > 0) {
  target = channels[parseInt(mText) - 1];
} else {
  // Search by Chat ID, username, or title
  for (let i = 0; i < channels.length; i++) {
    let c = channels[i];
    if (
      String(c.chat_id) === mText ||
      String(c.id) === mText ||
      (c.username && c.username.toLowerCase() === mText.toLowerCase()) ||
      (c.title && mText.toLowerCase().includes(c.title.toLowerCase()))
    ) {
      target = c;
      break;
    }
  }
}

if (!target) {
  // Re-build selection keyboard so admin doesn't lose buttons
  let keyboardRows = [];
  for (let i = 0; i < channels.length; i++) {
    let ch = channels[i];
    let cleanTitle = ch.title || ("Channel " + (ch.chat_id || ch.id));
    keyboardRows.push([{ text: (i + 1) + ". " + cleanTitle, style: "primary" }]);
  }
  keyboardRows.push([{ text: "❌ Cancel", style: "danger" }]);

  Api.sendMessage({
    chat_id: user.telegramid,
    text: "⚠️ <b>Channel not recognized.</b> Please tap a channel button below:",
    parse_mode: "HTML",
    reply_markup: { keyboard: keyboardRows, resize_keyboard: true }
  });
  Bot.run({ command: "/admin_fc_confirm_del" });
  return;
}

User.setProperty("fc_pending_remove_id", target.id, "string");

let typeStr = "Public";
if (target.type === "private") typeStr = "Private";
if (target.type === "request") typeStr = "Join Request";

let text =
  "⚠️ <b>CONFIRM REMOVE CHANNEL</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Are you sure you want to remove this channel?\n\n" +
  "• <b>Name:</b> " + esc(target.title || "Channel") + "\n" +
  "• <b>Type:</b> " + typeStr + "\n" +
  "• <b>Chat ID:</b> <code>" + esc(target.chat_id || target.id) + "</code>\n" +
  "• <b>Link:</b> " + esc(target.invite_link || "N/A") + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Confirm your action using the buttons below 👇";

let keyboard = [
  [
    { text: "🟢 Confirm Remove", style: "success" },
    { text: "🔴 Cancel", style: "danger" }
  ]
];

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "HTML",
  reply_markup: {
    keyboard: keyboard,
    resize_keyboard: true
  }
});

Bot.run({ command: "/admin_fc_do_del" });

