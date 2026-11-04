/*CMD
command: /admin_save_payee_input
help: Receives and saves new Payee Name
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

if (!message || message.trim() === "/admin") {
  Bot.runCommand("/admin_upi_settings");
  return;
}

let newPayee = message.trim();
if (newPayee.length < 2) {
  Bot.sendMessage("⚠️ Payee name must be at least 2 characters long. Please enter a valid name:");
  Bot.run({ command: "/admin_save_payee_input" });
  return;
}

Bot.setProperty("admin_payee_name", newPayee, "string");

let buttons = [
  [{ title: "📱 UPI Settings", command: "/admin_upi_settings" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Payee Name Updated Successfully!*\n\nNew Payee Name: *" + newPayee + "*"
);

