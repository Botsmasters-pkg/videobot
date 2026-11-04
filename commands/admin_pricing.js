/*CMD
command: /admin_pricing
help: Manage Pricing Packages
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

let packages = Bot.getProperty("pricing_packages") || [
  { id: 1, amount: 10, points: 100 },
  { id: 2, amount: 20, points: 200 },
  { id: 3, amount: 50, points: 500 },
  { id: 4, amount: 100, points: 1000 }
];

let text =
  "🏷 *Pricing Packages Management*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Active Packages:\n";

let buttons = [];

for (let i = 0; i < packages.length; i++) {
  let pkg = packages[i];
  text += (i + 1) + ". *₹" + pkg.amount + "* ➔ *" + pkg.points + " Points*\n";
  buttons.push([
    {
      title: "🗑 Delete ₹" + pkg.amount + " (" + pkg.points + " pts)",
      command: "/admin_del_package " + pkg.id
    }
  ]);
}

text += "\n━━━━━━━━━━━━━━━━━━━━━\n" +
  "Tap below to add a new pricing package or return:";

buttons.push([{ title: "➕ Add New Package", command: "/admin_add_package" }]);
buttons.push([{ title: "🔙 Admin Dashboard", command: "/admin" }]);

Bot.sendInlineKeyboard(buttons, text);

