/*CMD
command: /admin_save_package
help: Saves new pricing package
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
  Bot.sendMessage("🚫 *Access Denied.*");
  return;
}

let parts = (message || "").trim().split(/\s+/);
if (parts.length < 2) {
  Bot.sendMessage("⚠️ Invalid format! Please enter *Amount* and *Points* separated by a space (e.g. `25 250`):");
  Bot.run({ command: "/admin_save_package" });
  return;
}

let amount = parseFloat(parts[0]);
let points = parseInt(parts[1]);

if (!amount || amount < 10) {
  Bot.sendMessage("⚠️ Minimum starting price is ₹10. Please enter valid amount (e.g. `10 100`):");
  Bot.run({ command: "/admin_save_package" });
  return;
}

if (!points || points < 1) {
  Bot.sendMessage("⚠️ Points must be at least 1. Please re-enter (e.g. `10 100`):");
  Bot.run({ command: "/admin_save_package" });
  return;
}

let packages = Bot.getProperty("pricing_packages") || [];
let newId = Date.now();

packages.push({
  id: newId,
  amount: amount,
  points: points
});

// Sort by amount ascending
packages.sort(function(a, b) {
  return a.amount - b.amount;
});

Bot.setProperty("pricing_packages", packages, "json");

let buttons = [
  [{ title: "🏷 Pricing Management", command: "/admin_pricing" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Pricing Package Added Successfully!*\n\n• Package: *₹" + amount + " ➔ " + points + " Points*\n• Total Active Packages: *" + packages.length + "*"
);
