/*CMD
command: /admin_set_vid_points
help: Prompt admin for video cost points
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

let cur = Bot.getProperty("points_per_video") || 5;
let buttons = [[{ title: "🔙 Cancel & Return", command: "/admin_points_menu" }]];

Bot.sendInlineKeyboard(
  buttons,
  "🎬 *Configure Video Access Cost*\n\n" +
  "Current Cost: *" + cur + " Points / Video*\n\n" +
  "Enter the points to deduct when a user streams a video after their 2 free videos (e.g. `5`, `10`):"
);

Bot.run({ command: "/admin_save_vid_points" });

