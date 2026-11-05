/*CMD
command: /admin_got_storage_id
help: Validates new storage channel and triggers verification ping
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
  Bot.runCommand("/admin_storage_settings");
  return;
}

let newId = message.trim();
if (!newId.startsWith("-")) {
  Bot.sendMessage(
    "⚠️ Invalid Chat ID! A channel Chat ID must start with `-` (usually `-100...`, e.g. `-1001234567890`).\n\n" +
    "Please re-enter the Channel Chat ID (or send /admin to cancel):"
  );
  Bot.run({ command: "/admin_got_storage_id" });
  return;
}

User.setProperty("temp_new_storage_id", newId, "string");

Bot.sendMessage("⏳ *Testing Storage Channel Permissions...*\nSending a test ping to `" + newId + "` to verify bot administration rights...");

// Send test message to verify post permissions
Api.sendMessage({
  chat_id: newId,
  text: "🤖 *Storage Channel Verification Ping*\n" +
        "Testing administration and posting rights for Video Bot.\n" +
        "Timestamp: `" + new Date().toISOString() + "`",
  parse_mode: "Markdown",
  on_result: "/on_new_storage_verified",
  on_error: "/on_new_storage_failed"
});
