/*CMD
command: /admin_verify_storage
help: Verifies bot permissions in currently active storage channel
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

let activeStorageId = Bot.getProperty("storage_channel_id") || "-1003856912131";

Bot.sendMessage("⏳ *Verifying Active Storage Channel...*\nSending verification ping to `" + activeStorageId + "`...");

Api.sendMessage({
  chat_id: activeStorageId,
  text: "🤖 *Storage Channel Health Check Ping*\n" +
        "Testing administration and posting rights for Video Bot.\n" +
        "Timestamp: `" + new Date().toISOString() + "`",
  parse_mode: "Markdown",
  on_result: "/on_cur_storage_verified",
  on_error: "/on_cur_storage_failed"
});

