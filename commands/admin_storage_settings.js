/*CMD
command: /admin_storage_settings
help: Dynamic Storage Channel Dashboard
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
let videos = Bot.getProperty("videos") || [];

let storedInActiveCount = 0;
let storedInOtherCount = 0;

for (let i = 0; i < videos.length; i++) {
  let v = videos[i];
  if (v.storage_channel_id === activeStorageId) {
    storedInActiveCount++;
  } else if (v.storage_channel_id) {
    storedInOtherCount++;
  }
}

let text =
  "📦 *Centralized Telegram Storage Channel System*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🆔 *Current Active Storage Channel:* `" + activeStorageId + "`\n" +
  "📊 *Videos in Current Storage:* *" + storedInActiveCount + " Videos*\n" +
  (storedInOtherCount > 0 ? "📂 *Videos in Previous Storage:* *" + storedInOtherCount + " Videos*\n" : "") +
  "🎬 *Total Videos in Library:* *" + videos.length + " Videos*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "📌 *How Storage Channels Work:*\n" +
  "• All newly uploaded videos (Single & Bulk) are automatically stored in the active channel.\n" +
  "• If you change the storage channel, older videos remain securely linked to their previous channel.\n" +
  "• Video delivery seamlessly copies the video from its corresponding storage channel.\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Select an option below 👇";

let buttons = [
  [
    { title: "🔍 Verify Current Storage", command: "/admin_verify_storage" },
    { title: "🔄 Change Storage Channel", command: "/admin_change_storage" }
  ],
  [
    { title: "📋 Manage Videos (" + videos.length + ")", command: "/admin_manage_vids" },
    { title: "🛠 Admin Dashboard", command: "/admin" }
  ]
];

Bot.sendInlineKeyboard(buttons, text);
