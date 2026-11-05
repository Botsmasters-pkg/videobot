/*CMD
command: /admin_upload_got_video
help: Receive Video File and Save Directly
need_reply: true
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

if (message && message.trim() === "/admin") {
  Bot.runCommand("/admin");
  return;
}

let doc = (request && request.document) ? request.document : (request && request.message && request.message.document);
let vid = (request && request.video) ? request.video : (request && request.message && request.message.video);

let fileId = null;
let autoTitle = "";

if (vid) {
  fileId = vid.file_id;
  let caption = (request.message && request.message.caption) ? request.message.caption.trim() : "";
  autoTitle = caption || ((vid.file_name) ? vid.file_name.replace(/\.[^/.]+$/, "") : "Video " + Date.now().toString().slice(-4));
} else if (doc) {
  let fileName = doc.file_name ? doc.file_name.toLowerCase() : "";
  if (fileName.endsWith(".zip") || (doc.mime_type && doc.mime_type.indexOf("zip") > -1) || fileName.endsWith(".rar") || fileName.endsWith(".7z")) {
    Bot.sendMessage(
      "❌ *ZIP Archives Cannot Stream as Video!*\n\n" +
      "Telegram cannot extract or stream .ZIP files in its built-in video player.\n" +
      "Please extract the archive on your device and send the **MP4 or MOV video file** directly here:\n\n" +
      "_(Send /admin to cancel)_"
    );
    Bot.run({ command: "/admin_upload_got_video" });
    return;
  }
  fileId = doc.file_id;
  let caption = (request.message && request.message.caption) ? request.message.caption.trim() : "";
  autoTitle = caption || (doc.file_name ? doc.file_name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") : "Video " + Date.now().toString().slice(-4));
}

if (!fileId) {
  Bot.sendMessage("⚠️ No video detected. Please send or forward an MP4/MOV video file, or send /admin to cancel:");
  Bot.run({ command: "/admin_upload_got_video" });
  return;
}

// Save video with Storage Channel reference
let activeStorageChannel = Bot.getProperty("storage_channel_id") || "-1003856912131";
let videos = Bot.getProperty("videos") || [];
let newId = Date.now();

let newVid = {
  id: newId,
  category_id: null,
  file_id: fileId,
  storage_channel_id: activeStorageChannel,
  storage_message_id: null,
  storage_file_id: null,
  title: autoTitle,
  description: "",
  is_zip: false,
  views: 0,
  created_at: new Date().toISOString(),
  upload_status: "active"
};

videos.push(newVid);
Bot.setProperty("videos", videos, "json");

// Archive video to active Storage Channel
try {
  Api.sendVideo({
    chat_id: activeStorageChannel,
    video: fileId,
    caption: "🎬 *" + autoTitle + "*\n🆔 ID: `" + newId + "`\n📅 Uploaded: `" + new Date().toISOString() + "`",
    parse_mode: "Markdown",
    supports_streaming: true,
    on_result: "/on_storage_upload_res " + newId,
    on_error: "/on_storage_upload_err " + newId
  });
} catch (e) {
  // Ignore sync exception if any
}

let buttons = [
  [{ title: "📤 Upload Another Video", command: "/admin_upload" }],
  [
    { title: "📋 Manage Videos (" + videos.length + ")", command: "/admin_manage_vids" },
    { title: "📦 Storage Settings", command: "/admin_storage_settings" }
  ],
  [{ title: "🛠 Admin Dashboard", command: "/admin" }]
];

let summary =
  "🎉 *Video Uploaded & Saved to Storage!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🆔 *Video ID:* `" + newId + "`\n" +
  "🎬 *Title:* *" + autoTitle + "*\n" +
  "📦 *Archived in Storage Channel:* `" + activeStorageChannel + "`\n" +
  "📊 *Total Videos in Library:* *" + videos.length + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "The video is live and available in the rotation queue!";

Bot.sendInlineKeyboard(buttons, summary);
