/*CMD
command: /admin_add_req_chan
help: Prompt admin for private request channel details
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
  "📩 *Add Private Request Channel*\n\n" +
  "Enter the *Channel Chat ID* and *Join Request Invite Link* separated by a space:\n\n" +
  "Format: `-1001234567890 https://t.me/+JoinRequestLink`\n\n" +
  "📌 *Rule:* When users click the link and submit a Join Request, they are considered verified immediately without waiting for admin approval!"
);

Bot.run({ command: "/admin_save_req_chan" });
