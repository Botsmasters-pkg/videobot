/*CMD
command: /admin_save_upi
help: Update UPI ID or Payee Name
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

if (params === "upi_id") {
  User.setProperty("upi_edit_field", "upi_id", "string");
  Bot.sendMessage("✏️ *Enter New UPI ID*\n\nSend the new UPI ID (e.g. `yourname@okaxis` or `paytmqr...`):");
  Bot.run({ command: "/admin_save_upi" });
  return;
}

if (params === "payee_name") {
  User.setProperty("upi_edit_field", "payee_name", "string");
  Bot.sendMessage("✏️ *Enter New Payee Name*\n\nSend the name to display on UPI apps (e.g. `Video Bot Support`):");
  Bot.run({ command: "/admin_save_upi" });
  return;
}

let field = User.getProperty("upi_edit_field");
let inputVal = (message || "").trim();

if (!inputVal) {
  Bot.sendMessage("⚠️ Input cannot be empty. Please enter a valid value:");
  Bot.run({ command: "/admin_save_upi" });
  return;
}

if (field === "upi_id") {
  if (inputVal.indexOf("@") === -1) {
    Bot.sendMessage("⚠️ A valid UPI ID must contain '@' (e.g. `username@bank`). Please re-enter:");
    Bot.run({ command: "/admin_save_upi" });
    return;
  }
  Bot.setProperty("admin_upi_id", inputVal, "string");
  User.setProperty("upi_edit_field", null, "string");

  let buttons = [
    [{ title: "📱 UPI Settings", command: "/admin_upi_settings" }],
    [{ title: "🛠 Admin Dashboard", command: "/admin" }]
  ];
  Bot.sendInlineKeyboard(buttons, "✅ *UPI ID Updated Successfully!*\n\nNew UPI ID: `" + inputVal + "`");
} else if (field === "payee_name") {
  Bot.setProperty("admin_payee_name", inputVal, "string");
  User.setProperty("upi_edit_field", null, "string");

  let buttons = [
    [{ title: "📱 UPI Settings", command: "/admin_upi_settings" }],
    [{ title: "🛠 Admin Dashboard", command: "/admin" }]
  ];
  Bot.sendInlineKeyboard(buttons, "✅ *Payee Name Updated Successfully!*\n\nNew Payee Name: *" + inputVal + "*");
} else {
  Bot.runCommand("/admin_upi_settings");
}
