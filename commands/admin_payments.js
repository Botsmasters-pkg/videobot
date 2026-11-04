/*CMD
command: /admin_payments
help: Admin Payment Approval & Review System with Pending, Approved, and Rejected filters
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let primaryAdmin = 8710308658;
if (user.telegramid != primaryAdmin && user.telegramid != String(primaryAdmin)) {
  Bot.sendMessage("🚫 *Access Denied.*");
  return;
}

let payments = Bot.getProperty("payment_requests") || [];

let currentFilter = (params || "pending").trim().toLowerCase();
if (currentFilter !== "pending" && currentFilter !== "approved" && currentFilter !== "rejected") {
  currentFilter = "pending";
}

let pendingList = [];
let approvedList = [];
let rejectedList = [];

for (let i = 0; i < payments.length; i++) {
  let p = payments[i];
  if (p.status === "pending") {
    pendingList.push(p);
  } else if (p.status === "approved") {
    approvedList.push(p);
  } else if (p.status === "rejected") {
    rejectedList.push(p);
  }
}

let activeList = currentFilter === "approved" ? approvedList : (currentFilter === "rejected" ? rejectedList : pendingList);

let filterTitle = currentFilter === "approved" ? "🟢 Approved Payments" : (currentFilter === "rejected" ? "🔴 Rejected Payments" : "🟡 Pending Payments");

let text =
  "💳 *Payment Management Dashboard*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "🟡 *Pending:* *" + pendingList.length + "* | 🟢 *Approved:* *" + approvedList.length + "* | 🔴 *Rejected:* *" + rejectedList.length + "*\n\n" +
  "Showing: *" + filterTitle + "* (" + activeList.length + ")\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n";

let buttons = [
  [
    { title: "🟡 Pending (" + pendingList.length + ")", command: "/admin_payments pending" },
    { title: "🟢 Approved (" + approvedList.length + ")", command: "/admin_payments approved" },
    { title: "🔴 Rejected (" + rejectedList.length + ")", command: "/admin_payments rejected" }
  ]
];

if (activeList.length === 0) {
  text += "_No " + currentFilter + " payments found._\n";
} else {
  text += "Tap any payment below to inspect screenshot and details:\n";
  let maxShow = Math.min(activeList.length, 10);
  for (let i = activeList.length - 1; i >= Math.max(0, activeList.length - 10); i--) {
    let item = activeList[i];
    let icon = item.status === "approved" ? "🟢" : (item.status === "rejected" ? "🔴" : "🟡");
    buttons.push([
      {
        title: icon + " " + item.order_id + " (₹" + item.amount + " ➔ " + item.points + " pts)",
        command: "/admin_payment_detail " + item.order_id
      }
    ]);
  }
}

buttons.push([
  { title: "🔄 Refresh", command: "/admin_payments " + currentFilter },
  { title: "🛠 Admin Dashboard", command: "/admin" }
]);

Bot.sendInlineKeyboard(buttons, text);
