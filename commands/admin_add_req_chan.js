/*CMD
command: /admin_add_req_chan
help: Step 1 of 2 - Prompt admin for Request Channel Chat ID
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

let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_channels" }]];

let text =
  "📩 *Add Private Request Channel — Step 1 of 2*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👉 Enter the **Channel Chat ID** (usually starts with `-100`, e.g. `-1001234567890`):\n\n" +
  "⚠️ *Important:* Make sure this bot is added as an **Administrator** in your channel!\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_(Send /admin to cancel)_";

Bot.sendInlineKeyboard(buttons, text);
Bot.run({ command: "/admin_got_req_id" });
