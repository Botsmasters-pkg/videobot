/*CMD
command: /admin_help_settings
help: Configure dynamic Help contact admin username (Default: CODEVEXA)
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

let currentUsername = Bot.getProperty("help_admin_username") || "CODEVEXA";
let cleanName = currentUsername.replace("@", "").trim();

let text =
  "💬 *Help Contact Settings*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Current Admin Username: *@" + cleanName + "*\n" +
  "Clickable Link: https://t.me/" + cleanName + "\n\n" +
  "Users clicking *Contact Admin* in the Help section will be redirected to this Telegram account.\n" +
  "Default Username: `@CODEVEXA`\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap below to change the contact username:";

let buttons = [
  [{ title: "✏️ Change Contact Username", command: "/admin_set_help_input" }],
  [{ title: "🔄 Reset to Default (@CODEVEXA)", command: "/admin_set_help_input default" }],
  [{ title: "🔙 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);
