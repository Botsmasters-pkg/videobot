/*CMD
command: /admin_add_pub_chan
help: Prompt admin for public channel name (Step 1 of 2)
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

Bot.sendInlineKeyboard(
  buttons,
  "📢 *Add Public Channel — Step 1 of 2*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👉 Enter the **Channel Name** to display on the Join Button (e.g. `CODE VEX UPDATES`):\n\n" +
  "📌 *Note:* Only this name will appear on the button for users. Technical details like @username will remain hidden.\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "_(Send /admin to cancel)_"
);

Bot.run({ command: "/admin_got_pub_name" });
