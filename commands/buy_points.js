/*CMD
command: /buy_points
help: Buy Points Pricing Packages
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let defaultPackages = [
  { id: 1, amount: 10, points: 100 },
  { id: 2, amount: 20, points: 200 },
  { id: 3, amount: 50, points: 500 },
  { id: 4, amount: 100, points: 1000 }
];

let packages = Bot.getProperty("pricing_packages");
if (!packages || packages.length === 0) {
  packages = defaultPackages;
  Bot.setProperty("pricing_packages", packages, "json");
}

let userPoints = Bot.getProperty("points_" + user.telegramid) || User.getProperty("points") || 0;

let text =
  "💳 *Buy Video Points — Instant UPI Packages*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "💎 *Your Current Balance:* *" + userPoints + " Points*\n" +
  "🎬 *Video Cost:* *5 Points / Video*\n\n" +
  "📌 *Select a package to generate your dynamic UPI QR code:*\n" +
  "• Scan with Google Pay, PhonePe, Paytm, or BHIM.\n" +
  "• The exact amount will be pre-filled automatically.\n" +
  "• Upload screenshot after payment for instant admin verification.\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select your preferred package below 👇";

let buttons = [];
for (let i = 0; i < packages.length; i++) {
  let pkg = packages[i];
  let vids = Math.floor(pkg.points / 5);
  buttons.push([
    {
      title: "💎 ₹" + pkg.amount + " ➔ " + pkg.points + " Points (" + vids + " Videos)",
      command: "/buy_package " + pkg.id
    }
  ]);
}

buttons.push([
  { title: "🎁 Refer & Earn Free", command: "/referral" },
  { title: "💰 My Points", command: "/my_points" }
]);
buttons.push([{ title: "🏠 Main Menu", command: "/start" }]);

Bot.sendInlineKeyboard(buttons, text);
