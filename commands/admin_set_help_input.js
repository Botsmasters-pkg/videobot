/*CMD
command: /admin_set_help_input
help: Receives new admin username input
need_reply: true
auto_retry_time: 
folder: 
answer: ✏️ *Change Help Admin Username*\n\nEnter the new Telegram username (with or without @, e.g. `MySupportAdmin`):
keyboard: 
aliases: 
group: 
CMD*/

let primaryAdmin = 8710308658;
if (user.telegramid != primaryAdmin && user.telegramid != String(primaryAdmin)) {
  Bot.sendMessage("🚫 *Access Denied.*");
  return;
}

let newUsername = (message || "").trim().replace("@", "");
if (!newUsername || newUsername.length < 3) {
  Bot.sendMessage("⚠️ Invalid username. Please send a valid Telegram username (at least 3 characters):");
  Bot.run({ command: "/admin_set_help_input" });
  return;
}

Bot.setProperty("help_admin_username", newUsername, "string");

let buttons = [
  [{ title: "💬 Help Settings", command: "/admin_help_settings" }],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Help Username Updated Successfully!*\n\nNew Admin Username: *@" + newUsername + "*\nClickable URL: https://t.me/" + newUsername
);
