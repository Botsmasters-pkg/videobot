/*CMD
command: /admin_del_chan
help: Legacy route forwarding to admin_confirm_del_chan
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

if (params) {
  Bot.runCommand("/admin_confirm_del_chan " + params);
} else {
  Bot.runCommand("/admin_remove_channel");
}
