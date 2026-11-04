/*CMD
command: /i_have_paid
help: User confirms payment and is prompted for screenshot
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
  Bot.sendMessage("⚠️ You do not have an active payment order. Please select a package via /buy_points first.");
  Bot.runCommand("/buy_points");
  return;
}

User.setProperty("awaiting_payment_screenshot", true, "boolean");

let text =
  "📸 *Payment Screenshot Required*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Please upload or send your payment screenshot now for verification.\n\n" +
  "🧾 *Order ID:* `" + activeOrder.order_id + "`\n" +
  "💰 *Amount:* *₹" + activeOrder.amount + "*\n" +
  "🎁 *Points to Credit:* *" + activeOrder.points + " Points*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👉 *Attach and send the screenshot photo directly into this chat:*";

let buttons = [
  [{ title: "❌ Cancel Order", command: "/cancel_payment" }]
];

Bot.sendInlineKeyboard(buttons, text);
