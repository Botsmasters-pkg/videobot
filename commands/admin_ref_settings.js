/*CMD
command: /admin_ref_settings
help: Referral system management
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

let refPoints = Bot.getProperty("points_per_referral") || 10;
let isEnabled = Bot.getProperty("referral_enabled");
let statusStr = (isEnabled !== false) ? "🟢 Enabled (Active)" : "🔴 Disabled (Paused)";
let totalRefs = Bot.getProperty("total_valid_referrals") || 0;

let text =
  "🎁 *Referral Program Configuration*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "⚙️ *Current Status:* " + statusStr + "\n" +
  "💎 *Reward per Referral:* *" + refPoints + " Points*\n" +
  "📈 *Total Successful Referrals:* *" + totalRefs + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "Modify settings using the buttons below:";

let toggleBtnText = (isEnabled !== false) ? "🔴 Pause Referral Program" : "🟢 Activate Referral Program";

let buttons = [
  [{ title: toggleBtnText, command: "/admin_toggle_ref" }],
  [{ title: "✏️ Change Referral Points (" + refPoints + " pts)", command: "/admin_set_ref_points" }],
  [{ title: "📊 Points & Referral Statistics", command: "/admin_points_stats" }],
  [{ title: "🔙 Back to Admin", command: "/admin" }]
];

Bot.sendInlineKeyboard(buttons, text);
