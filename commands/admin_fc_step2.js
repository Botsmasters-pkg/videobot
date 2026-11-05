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
  Bot.sendMessage("🚫 Access Denied.");
  return;
}

if (!message) {
  Bot.run({ command: "/admin_fc_step2" });
  return;
}

let mText = message.trim();
if (mText === "❌ Cancel" || mText === "🔴 Cancel" || mText === "/admin" || mText === "Cancel") {
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
    text: "⚠️ <b>Please select a valid channel type:</b>",
    parse_mode: "HTML",
    reply_markup: { keyboard: keyboard, resize_keyboard: true }
  });
  Bot.run({ command: "/admin_fc_step2" });
  return;
}

User.setProperty("fc_temp_type", channelType, "string");
User.setProperty("fc_state", "awaiting_url", "string");

let typeLabel = "Public Channel";
if (channelType === "private") typeLabel = "Private Channel";
if (channelType === "request") typeLabel = "Join Request Channel";

let text =
  "➕ <b>ADD CHANNEL — Step 3 of 3</b>\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "• 📌 <b>Selected Type:</b> <i>" + typeLabel + "</i>\n\n" +
  "👉 Now, send the <b>Join URL</b> for this channel:\n" +
  "<i>(e.g. <code>https://t.me/example</code> or <code>https://t.me/+AbCdEfGh</code>)</i>\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "<i>(Or tap ❌ Cancel below)</i>";

let keyboard = [
  [
    { text: "❌ Cancel", style: "danger" }
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

Bot.run({ command: "/admin_fc_step3" });
