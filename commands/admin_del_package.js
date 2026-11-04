/*CMD
command: /admin_del_package
help: Delete a pricing package
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

let pkgId = parseInt(params);
if (!pkgId) {
  Bot.runCommand("/admin_pricing");
  return;
}

let packages = Bot.getProperty("pricing_packages") || [];
let newPackages = [];
for (let i = 0; i < packages.length; i++) {
  if (packages[i].id !== pkgId) {
    newPackages.push(packages[i]);
  }
}

Bot.setProperty("pricing_packages", newPackages, "json");

let buttons = [
  [{ title: "🏷 Pricing Management", command: "/admin_pricing" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, "✅ *Pricing Package Deleted Successfully!*");
