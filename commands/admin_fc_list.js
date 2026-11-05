/*CMD
command: /admin_fc_list
help: 📋 List All Configured Force Channels with Status
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
  let text =
    "📋 *FORCE CHANNELS*\n\n" +
    "No force join channels configured yet.\n\n" +
    "Tap **➕ Add Channel** below to configure a new channel.";

  let keyboard = [
    [
      { text: "➕ Add Channel", style: "success" },
      { text: "📋 List Channels", style: "primary" }
    ],
    [
      { text: "🗑 Remove Channel", style: "danger" },
      { text: "🔁 Enable/Disable Channel", style: "primary" }
    ],
    [
      { text: "🔙 Back", style: "primary" }
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
  return;
}

let text = "📋 *FORCE CHANNELS*\n\n";

for (let i = 0; i < channels.length; i++) {
  let ch = channels[i];
  let isEnabled = (ch.enabled !== false);
  let statusIcon = isEnabled ? "✅" : "🚫";

  let typeStr = "Public";
  if (ch.type === "private") typeStr = "Private";
  if (ch.type === "request") typeStr = "Join Request";

  text += statusIcon + " *" + (ch.title || "Channel") + "*\n";
  text += "Type: " + typeStr + "\n";
  text += "ID: `" + (ch.chat_id || ch.id) + "`\n";
  text += "Link: " + (ch.invite_link || "N/A") + "\n\n";
}

let keyboard = [
  [
    { text: "➕ Add Channel", style: "success" },
    { text: "📋 List Channels", style: "primary" }
  ],
  [
    { text: "🗑 Remove Channel", style: "danger" },
    { text: "🔁 Enable/Disable Channel", style: "primary" }
  ],
  [
    { text: "🔙 Back", style: "primary" }
  ]
];

Api.sendMessage({
  chat_id: user.telegramid,
  text: text.trim(),
  parse_mode: "Markdown",
  reply_markup: {
    keyboard: keyboard,
    resize_keyboard: true
  }
});
