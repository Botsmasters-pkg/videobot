/*CMD
command: /admin_save_upi_input
help: Receives and saves new UPI ID
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

let newUpi = message.trim();
if (newUpi.indexOf("@") === -1 || newUpi.length < 5) {
  Bot.sendMessage("⚠️ A valid UPI ID must contain '@' (e.g. `yourname@bank`). Please enter a valid UPI ID (or send /admin to cancel):");
  Bot.run({ command: "/admin_save_upi_input" });
  return;
}

Bot.setProperty("admin_upi_id", newUpi, "string");

let buttons = [
  [{ title: "📱 UPI Settings", command: "/admin_upi_settings" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *UPI ID Updated Successfully!*\n\nNew UPI ID: `" + newUpi + "`\n\nAll future payment QR codes will automatically use this updated UPI ID."
);

