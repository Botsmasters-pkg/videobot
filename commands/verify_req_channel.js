/*CMD
command: /verify_req_channel
help: Forwarder to check_channels
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let parts = (params || "").trim().split(/\s+/);
let nextIndex = (parts.length >= 2) ? parseInt(parts[1]) : 0;
Bot.runCommand("/check_channels " + nextIndex);
