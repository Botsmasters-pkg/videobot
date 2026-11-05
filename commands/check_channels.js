/*CMD
command: /check_channels
help: Forwards to verify_step master verification
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

User.setProperty("missing_channels", [], "json");
Bot.runCommand("/verify_step 0");
