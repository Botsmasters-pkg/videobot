/*CMD
command: /contact_admin
help: Displays Admin Telegram Contact Profile
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let helpAdmin = Bot.getProperty("help_admin_username") || "CODEVEXA";
let cleanUsername = helpAdmin.replace("@", "").trim();
let contactUrl = "https://t.me/" + cleanUsername;

let text =
  "👨‍💻 *Admin Support Contact*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Have a question, payment issue, or need help?\n\n" +
  "👑 *Administrator Username:*\n" +
  "[@" + cleanUsername + "](" + contactUrl + ")\n\n" +
  "📌 Tap the username above or click the button below to open a direct chat with the Administrator:\n" +
  "━━━━━━━━━━━━━━━━━━━━━";

let buttons = [
  [{ title: "💬 Open Profile (@" + cleanUsername + ")", url: contactUrl }],
  [
    { title: "🔙 Back to Help", command: "/help" },
    { title: "🏠 Main Menu", command: "/start" }
  ]
];

Bot.sendInlineKeyboard(buttons, text);

