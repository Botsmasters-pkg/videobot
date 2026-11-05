/*CMD
command: /admin_add_priv_chan
help: Step 1 of 3 - Prompt admin for Private Channel Name
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
  "🔒 *Add Private Channel — Step 1 of 3*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👉 Enter the **Channel Name** to display on the Join Button (e.g. `VIP MOVIE CLUB`):\n\n" +
  "📌 *Note:* Only this name will appear on the button for users. Chat ID and link will remain hidden.\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_(Send /admin to cancel)_";

Bot.sendInlineKeyboard(buttons, text);
Bot.run({ command: "/admin_got_priv_name" });
