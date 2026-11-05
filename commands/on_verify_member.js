/*CMD
command: /on_verify_member
help: Forwarder to on_verify_step_res
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

Bot.runCommand("/on_verify_step_res " + (params || "0"));
