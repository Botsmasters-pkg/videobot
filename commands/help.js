/*CMD
command: /help
help: Bot Help & Support Center with Contact Admin, Refer & Earn, and Buy Points
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

let text =
  "ℹ️ *Bot Help & Support Center*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Welcome to the Help Center! How can we assist you today?\n\n" +
  "📌 *Select an option below:*\n" +
  "• 💬 *Contact Admin:* Get direct assistance from our administrator.\n" +
  "• 🎁 *Refer & Earn:* Learn how to earn free video points by inviting friends.\n" +
  "• 💳 *Buy Points:* Purchase points packages starting at ₹10 via instant UPI QR.\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap an option below 👇";

let buttons = [
  [{ title: "💬 Contact Admin", command: "/contact_admin", style: "primary" }],
  [
    { title: "🎁 Refer & Earn", command: "/referral", style: "primary" },
    { title: "💳 Buy Points", command: "/buy_points", style: "primary" }
  ],
  [{ title: "🏠 Main Menu", command: "/start", style: "primary" }]
];

Bot.sendInlineKeyboard(buttons, text);
