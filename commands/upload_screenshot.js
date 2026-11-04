/*CMD
command: /upload_screenshot
help: Prompt user to upload screenshot
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let activeOrder = User.getProperty("active_order");
if (!activeOrder) {
  Bot.sendMessage("⚠️ You do not have an active payment order. Please select a package via /buy_points.");
  Bot.runCommand("/buy_points");
  return;
}

let buttons = [
  [{ title: "❌ Cancel Order", command: "/cancel_payment" }],
  [{ title: "🏠 Main Menu", command: "/start" }]
];

let text =
  "📸 *Upload Payment Screenshot*\n\n" +
  "🧾 *Order ID:* `" + activeOrder.order_id + "`\n" +
  "💰 *Amount:* *₹" + activeOrder.amount + "*\n\n" +
  "👉 *Please attach and send the screenshot image of your successful payment now!*";

Bot.sendInlineKeyboard(buttons, text);

