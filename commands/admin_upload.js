/*CMD
command: /admin_upload
help: Single Video Upload - Directly Prompt for Video
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

let buttons = [[{ title: "❌ Cancel & Return", command: "/admin" }]];

let text =
  "📤 *Single Video Upload*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👉 Send or forward the **MP4 or MOV video file** directly into this chat:\n\n" +
  "• Title will be automatically extracted from your video caption or file name.\n" +
  "• The video will be saved directly and ready to stream!\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_(Send /admin to cancel)_";

Bot.sendInlineKeyboard(buttons, text);
Bot.run({ command: "/admin_upload_got_video" });
