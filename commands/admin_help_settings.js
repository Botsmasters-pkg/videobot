/*CMD
command: /admin_help_settings
help: Configure dynamic Help contact admin username
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
  Bot.sendMessage("🚫 *Access Denied:* Admin authorization required.");
  return;
}

let currentUsername = Bot.getProperty("help_admin_username") || "Botsmasters_support";

let text =
  "💬 *Help Contact Settings*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Current Admin Username: *@" + currentUsername.replace("@", "") + "*\n" +
  "Contact Link: https://t.me/" + currentUsername.replace("@", "") + "\n\n" +
  "Users clicking *ℹ️ Help* will be directed to this Telegram account.\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap below to change the username:";

let buttons = [
  [{ title: "✏️ Change Help Username", command: "/admin_set_help_input" }],
  [{ title: "🔙 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);
