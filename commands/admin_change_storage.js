/*CMD
command: /admin_change_storage
help: Prompt admin for new storage channel ID
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
let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_storage_settings" }]];

let text =
  "🔄 *Change Active Storage Channel*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Current Storage Channel: `" + activeStorageId + "`\n\n" +
  "👉 Enter the **New Storage Channel Chat ID** (usually starts with `-100`, e.g. `-1001234567890`):\n\n" +
  "⚠️ *Prerequisites before submitting:*\n" +
  "1. Add this bot to the new channel.\n" +
  "2. Promote the bot to **Administrator**.\n" +
  "3. Enable **'Post Messages'** permission for the bot.\n\n" +
  "The bot will automatically test posting permissions before saving!\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_(Send /admin to cancel)_";

Bot.sendInlineKeyboard(buttons, text);
Bot.run({ command: "/admin_got_storage_id" });

