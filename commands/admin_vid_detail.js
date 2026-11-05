/*CMD
command: /admin_vid_detail
help: Inspect single video and action buttons
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let vidId = parseInt(params);
if (!vidId) {
  Bot.runCommand("/admin_manage_vids");
  return;
}

let videos = Bot.getProperty("videos") || [];
let vid = null;
for (let i = 0; i < videos.length; i++) {
  if (videos[i].id === vidId) {
    vid = videos[i];
    break;
  }
}

if (!vid) {
  Bot.sendMessage("⚠️ Video not found.");
  Bot.runCommand("/admin_manage_vids");
  return;
}

let categories = Bot.getProperty("categories") || [];
let catName = "General";
let catEmoji = "📁";
for (let i = 0; i < categories.length; i++) {
  if (categories[i].id === vid.category_id) {
    catName = categories[i].name;
    catEmoji = categories[i].emoji || "📁";
    break;
  }
}

let text =
  "🎬 *Video Information:*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🆔 *ID:* `" + vid.id + "`\n" +
  "📂 *Category:* " + catEmoji + " " + catName + "\n" +
  "🎬 *Title:* " + vid.title + "\n" +
  "📦 *Storage Channel:* `" + (vid.storage_channel_id || "-1003856912131") + "`\n" +
  "🧾 *Storage Msg ID:* `" + (vid.storage_message_id || "N/A") + "`\n" +
  "👁 *Views:* " + (vid.views || 0) + "\n" +
  "📅 *Uploaded:* `" + (vid.created_at ? vid.created_at.substring(0, 19).replace("T", " ") : "N/A") + "`\n" +
  "📝 *Description:*\n" + (vid.description || "None") + "\n" +
  "━━━━━━━━━━━━━━━━━━━━━";

let buttons = [
  [{ title: "🗑 Delete This Video", command: "/admin_del_vid_do " + vid.id }],
  [
    { title: "🔙 Videos List", command: "/admin_manage_vids" },
    { title: "🛠 Admin Menu", command: "/admin" }
  ]
];

Bot.sendInlineKeyboard(buttons, text);

