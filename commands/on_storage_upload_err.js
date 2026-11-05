/*CMD
command: /on_storage_upload_err
help: Failsafe error handler if storage channel upload fails
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let vidId = parseInt(params);
if (!vidId) return;

// Failsafe: keep video upload status recorded as local_only
let videos = Bot.getProperty("videos") || [];
for (let i = 0; i < videos.length; i++) {
  if (videos[i].id === vidId) {
    videos[i].upload_status = "local_only";
    break;
  }
}
Bot.setProperty("videos", videos, "json");

