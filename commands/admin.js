/*CMD
command: /admin
help: Administrative Control Dashboard with Full Modular Controls
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let primaryAdmin = 8710308658;
Bot.setProperty("admin_ids", [primaryAdmin], "json");

if (user.telegramid != primaryAdmin && user.telegramid != String(primaryAdmin)) {
  Bot.sendMessage("🚫 *Access Denied:* You are not authorized to access the Admin Panel.");
  return;
}

// Fetch live metrics
let videos = Bot.getProperty("videos") || [];
let totalUsers = Bot.getProperty("total_users_count") || 0;
let payments = Bot.getProperty("payment_requests") || [];
let pendingPayments = 0;
for (let i = 0; i < payments.length; i++) {
  if (payments[i].status === "pending") {
    pendingPayments++;
  }
}

let paymentBadge = pendingPayments > 0 ? " (" + pendingPayments + " Pending!)" : "";

let buttons = [
  [
    { title: "📤 Single Video Upload", command: "/admin_upload", style: "primary" },
    { title: "📦 Bulk Video Upload", command: "/admin_bulk_upload", style: "primary" }
  ],
  [
    { title: "📋 Manage Videos (" + videos.length + ")", command: "/admin_manage_vids", style: "primary" },
    { title: "📂 Manage Categories", command: "/admin_edit_cat", style: "primary" }
  ],
  [
    { title: "💳 Payments" + paymentBadge, command: "/admin_payments", style: "primary" },
    { title: "📱 UPI & QR Settings", command: "/admin_upi_settings", style: "primary" }
  ],
  [
    { title: "🏷 Pricing Packages", command: "/admin_pricing", style: "primary" },
    { title: "💰 Points Management", command: "/admin_points_menu", style: "primary" }
  ],
  [
    { title: "🎬 Video Cost Points", command: "/admin_set_vid_points", style: "primary" },
    { title: "🎁 Referral Settings", command: "/admin_ref_settings", style: "primary" }
  ],
  [
    { title: "📢 Force Channels", command: "/admin_channels", style: "primary" },
    { title: "📦 Storage Channel", command: "/admin_storage_settings", style: "primary" }
  ],
  [
    { title: "💬 Help Username Settings", command: "/admin_help_settings", style: "primary" },
    { title: "🔍 User Points Lookup", command: "/admin_view_user_points", style: "primary" }
  ],
  [
    { title: "📊 Global Statistics", command: "/admin_stats", style: "primary" },
    { title: "📢 Broadcast Message", command: "/admin_broadcast", style: "primary" }
  ],
  [
    { title: "🚫 Ban/Unban User", command: "/admin_ban", style: "primary" },
    { title: "⚙️ Default Settings / Region", command: "/admin_default_settings", style: "primary" }
  ],
  [
    { title: "🔙 Back to User Panel", command: "/start", style: "primary" }
  ]
];

let text =
  "🛠 *Smart Video Bot — Master Admin Dashboard*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "👑 *Master Admin:* `" + primaryAdmin + "`\n" +
  "👥 *Total Users:* " + totalUsers + " | 🎬 *Videos:* " + videos.length + "\n" +
  "💳 *Pending Payments:* *" + pendingPayments + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Welcome Administrator! Select any management module below 👇";

Bot.sendInlineKeyboard(buttons, text);
