/*CMD
command: /admin_manage_vids
help: Catalog of videos for administrator management
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

let videos = Bot.getProperty("videos") || [];
if (videos.length === 0) {
  let buttons = [
    [{ title: "📤 Upload Video", command: "/admin_upload" }],
    [{ title: "🛠 Admin Dashboard", command: "/admin" }]
  ];
  Bot.sendInlineKeyboard(buttons, "📋 *Manage Videos*\n\nNo video has been uploaded yet.");
  return;
}

let buttons = [];
for (let i = 0; i < videos.length; i++) {
  let v = videos[i];
  let shortTitle = v.title.length > 25 ? v.title.substring(0, 25) + "..." : v.title;
  buttons.push([{
    title: "🎬 " + shortTitle + " (" + (v.views || 0) + " views)",
    command: "/admin_vid_detail " + v.id
  }]);
}

buttons.push([
  { title: "📤 Upload Video", command: "/admin_upload" },
  { title: "📦 Bulk Upload", command: "/admin_bulk_upload" }
]);
buttons.push([{ title: "🛠 Admin Dashboard", command: "/admin" }]);

Bot.sendInlineKeyboard(
  buttons,
  "📋 *Manage Videos (Total: " + videos.length + ")*\n\nTap any video to view details, preview, or delete:"
);
