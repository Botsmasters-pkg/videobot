/*CMD
command: /on_verify_fail
help: Forwarder to on_verify_step_err
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

Bot.runCommand("/on_verify_step_err " + (params || "0"));
