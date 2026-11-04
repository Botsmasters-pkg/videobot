/*CMD
command: /cancel_payment
help: Cancel active payment order
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

User.setProperty("awaiting_payment_screenshot", false, "boolean");
User.setProperty("active_order", null, "json");

let buttons = [
  [{ title: "💳 Buy Points", command: "/buy_points" }],
  [{ title: "🏠 Main Menu", command: "/start" }]
];

Bot.sendInlineKeyboard(buttons, "❌ *Order Cancelled.* No payment request was created. You can browse packages again whenever you're ready.");
