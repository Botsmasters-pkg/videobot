/*CMD
command: /on_verify_fail
help: getChatMember error handler (failsafe)
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let index = parseInt(params) || 0;

// Proceed to next channel to avoid blocking user if bot permissions in channel are broken
Bot.runCommand("/check_channels " + (index + 1));
