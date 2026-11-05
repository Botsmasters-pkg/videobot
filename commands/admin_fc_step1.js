/*CMD
command: /admin_fc_step1
help: Step 1 Handler - Process channel ref and ask for Channel Type
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

if (!message && (!request || !request.message)) {
  Bot.run({ command: "/admin_fc_step1" });
  return;
}

let mText = message ? message.trim() : "";
if (mText === "❌ Cancel" || mText === "🔴 Cancel" || mText === "/admin") {
  Bot.runCommand("/admin_channels");
  return;
}

// 1. Check if forwarded from channel
let fwdChat = null;
if (request && request.message && request.message.forward_from_chat) {
  fwdChat = request.message.forward_from_chat;
} else if (request && request.forward_from_chat) {
  fwdChat = request.forward_from_chat;
}

let channelId = null;
let channelTitle = "";
let channelUsername = null;

if (fwdChat) {
  channelId = fwdChat.id.toString();
  channelTitle = fwdChat.title || fwdChat.username || ("Channel " + channelId);
  channelUsername = fwdChat.username ? ("@" + fwdChat.username) : null;
} else if (mText.startsWith("@")) {
  channelUsername = mText;
  channelId = mText;
  channelTitle = mText.replace("@", "");
} else if (/^-?\d+$/.test(mText)) {
  channelId = mText;
  channelTitle = "Channel (" + channelId + ")";
} else if (mText.indexOf("t.me/") > -1) {
  // If user pasted a link instead
  let extracted = mText.replace(/.*t\.me\//, "").replace(/^\+/, "").replace(/\/.*$/, "").trim();
  if (extracted.startsWith("+")) {
    channelId = "Private Link";
    channelTitle = "Private Channel";
  } else {
    channelUsername = "@" + extracted;
    channelId = channelUsername;
    channelTitle = extracted;
  }
} else {
  // Assume text is username or name
  channelTitle = mText;
  channelId = mText.startsWith("@") ? mText : ("@" + mText);
  channelUsername = channelId;
}

User.setProperty("fc_temp_ref", {
  id: channelId,
  title: channelTitle,
  username: channelUsername
}, "json");

User.setProperty("fc_state", "awaiting_type", "string");

let text =
  "➕ *ADD CHANNEL — Step 2 of 3*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "• 🏷 **Detected Name:** " + channelTitle + "\n" +
  "• 🆔 **Detected ID:** `" + channelId + "`\n\n" +
  "👉 Select the **Channel Type** using the keyboard below:\n" +
  "━━━━━━━━━━━━━━━━━━━━━";

let keyboard = [
  [
    { text: "⚪ Public", style: "primary" },
    { text: "⚪ Private", style: "primary" }
  ],
  [
    { text: "⚪ Join Request", style: "primary" }
  ],
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

Bot.run({ command: "/admin_fc_step2" });

