/*CMD
command: /admin_channels
help: Force Channel Management Dashboard (Public, Private, Request)
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

let isGlobalEnabled = Bot.getProperty("force_channels_enabled");
let statusBadge = (isGlobalEnabled !== false) ? "🟢 Active (Enforced)" : "🔴 Disabled (Off)";

let channels = Bot.getProperty("force_channels") || [];

let text =
  "📢 *Force Channel Management Dashboard*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "⚙️ *Global System Status:* " + statusBadge + "\n" +
  "📊 *Total Added Channels:* *" + channels.length + "*\n\n" +
  "📌 *Supported Channel Types:*\n" +
  "1. 📢 *Public Channel:* Verified via `@channelusername`\n" +
  "2. 🔒 *Private Channel:* Verified via Chat ID (`-100...`) & Invite Link\n" +
  "3. 📩 *Private Request Channel:* Verified immediately upon Join Request sent\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select a management option below 👇";

let toggleBtn = (isGlobalEnabled !== false) ? "🔴 Disable System" : "🟢 Enable System";

let buttons = [
  [
    { title: "📋 List Channels (" + channels.length + ")", command: "/admin_list_channels" },
    { title: "🗑 Remove Channel", command: "/admin_remove_channel" }
  ],
  [
    { title: "📢 Add Public Channel", command: "/admin_add_pub_chan" },
    { title: "🔒 Add Private Channel", command: "/admin_add_priv_chan" }
  ],
  [
    { title: "📩 Add Request Channel", command: "/admin_add_req_chan" },
    { title: toggleBtn, command: "/admin_toggle_chan all" }
  ],
  [
    { title: "🛠 Admin Dashboard", command: "/admin" }
  ]
];

Bot.sendInlineKeyboard(buttons, text);
