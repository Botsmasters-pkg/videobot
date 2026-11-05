/*CMD
command: /on_storage_upload_res
help: Callback when a video is posted to the storage channel
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

let res = options ? (options.result || options) : null;
let msgId = res ? res.message_id : null;
let chanId = (res && res.chat) ? res.chat.id.toString() : null;
let videoObj = res ? (res.video || res.document) : null;
let fileId = videoObj ? videoObj.file_id : null;

if (msgId) {
  let videos = Bot.getProperty("videos") || [];
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].id === vidId) {
      videos[i].storage_message_id = msgId;
      if (chanId) videos[i].storage_channel_id = chanId;
      if (fileId) videos[i].storage_file_id = fileId;
      videos[i].upload_status = "active";
      break;
    }
  }
  Bot.setProperty("videos", videos, "json");
}
