/*CMD
command: /admin_default_settings
help: Configure or Reset Default System Settings and Region
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: /admin_settings
group: 
CMD*/

let primaryAdmin = 8710308658;
if (user.telegramid != primaryAdmin && user.telegramid != String(primaryAdmin)) {
  Bot.sendMessage("🚫 *Access Denied.*");
  return;
}

if (params && params.trim() === "apply") {
  // Apply all default values
  Bot.setProperty("help_admin_username", "CODEVEXA", "string");
  Bot.setProperty("points_per_referral", 10, "integer");
  Bot.setProperty("points_per_video", 5, "integer");
  Bot.setProperty("admin_upi_id", "paytmqr2810050501011@paytm", "string");
  Bot.setProperty("admin_payee_name", "Video Bot", "string");
  Bot.setProperty("force_channels_enabled", true, "boolean");
  Bot.setProperty("referral_enabled", true, "boolean");

  let defaultPackages = [
    { id: 1, amount: 10, points: 100 },
    { id: 2, amount: 20, points: 200 },
    { id: 3, amount: 50, points: 500 },
    { id: 4, amount: 100, points: 1000 }
  ];
  Bot.setProperty("pricing_packages", defaultPackages, "json");

  let buttons = [
    [{ title: "🛠 Admin Dashboard", command: "/admin" }]
  ];

  let successMsg =
    "✅ *Default Settings & Region Applied Successfully!*\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "• 💬 *Help Admin:* `@CODEVEXA`\n" +
    "• 🎁 *Referral Reward:* `10 Points`\n" +
    "• 🎬 *Video Cost:* `5 Points`\n" +
    "• 🆓 *Complimentary Videos:* `First 2 Videos Free`\n" +
    "• 📱 *Default UPI ID:* `paytmqr2810050501011@paytm`\n" +
    "• 🏷 *Pricing Packages:* `₹10=100pts, ₹20=200pts, ₹50=500pts, ₹100=1000pts`\n" +
    "• 📢 *Force Channels:* `Active (Enabled)`\n" +
    "━━━━━━━━━━━━━━━━━━━━━\n" +
    "All configurations are saved and actively applied across the entire bot!";

  Bot.sendInlineKeyboard(buttons, successMsg);
  return;
}

let helpUser = Bot.getProperty("help_admin_username") || "CODEVEXA";
let refPts = Bot.getProperty("points_per_referral") || 10;
let vidPts = Bot.getProperty("points_per_video") || 5;
let upi = Bot.getProperty("admin_upi_id") || "paytmqr2810050501011@paytm";
let forceStatus = Bot.getProperty("force_channels_enabled") !== false ? "🟢 Enabled" : "🔴 Disabled";

let text =
  "⚙️ *System Default Settings & Region Configuration*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Here are the recommended standard default configurations:\n\n" +
  "• 💬 *Support Admin Username:* `@" + helpUser.replace("@", "") + "` (Default: `@CODEVEXA`)\n" +
  "• 🎁 *Referral Reward:* `" + refPts + " Points` (Default: `10 Points`)\n" +
  "• 🎬 *Video Access Cost:* `" + vidPts + " Points` (Default: `5 Points`)\n" +
  "• 🆓 *Free Videos:* `First 2 Videos Free for new users`\n" +
  "• 📱 *UPI ID:* `" + upi + "`\n" +
  "• 🏷 *Base Pricing:* `₹10 = 100 Points`\n" +
  "• 📢 *Force Channels:* `" + forceStatus + "`\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap below to apply and save these default settings:";

let buttons = [
  [{ title: "🔄 Apply / Reset Default Settings", command: "/admin_default_settings apply" }],
  [{ title: "🔙 Back to Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);
