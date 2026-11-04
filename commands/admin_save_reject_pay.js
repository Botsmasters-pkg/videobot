/*CMD
command: /admin_save_reject_pay
help: Forwarding wrapper for admin_reject_pay
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let orderId = User.getProperty("rejecting_order_id") || params;
if (orderId) {
  Bot.runCommand("/admin_reject_pay " + orderId);
} else {
  Bot.runCommand("/admin_payments pending");
}
