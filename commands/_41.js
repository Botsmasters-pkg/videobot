/*CMD
command: /41
help: Bot Clone / Transfer to Bots.Business Account
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 41
group: 
CMD*/

if (!user) return;

var ADMIN_ID = 8710308658;

// ===== OFFICIAL CHANNEL =====
var CHANNEL = "@botadminshere";

function escapeHtml(str) {
  if (!str) return "";
  return str.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Get email from params, options, or message
var email = (options && options.email) ? options.email : (params ? params.trim().toLowerCase() : "");

if (!email && message) {
  var mTxt = message.trim();
  if (mTxt.indexOf("/41") === 0 || mTxt.indexOf("41") === 0) {
    email = mTxt.replace(/^\/?41\s*/i, "").trim().toLowerCase();
  } else if (mTxt.includes("@") && mTxt.includes(".")) {
    email = mTxt.toLowerCase();
  }
}

// ===== EMAIL VALIDATION =====
if (!email || !email.includes("@") || !email.includes(".")) {
  Bot.setProperty("waiting_clone_email_" + user.telegramid, true, "boolean");
  Bot.sendMessage(
    '<tg-emoji emoji-id="5416117059207572332">❌</tg-emoji> ' +
    '<b>Invalid Email Address!</b>\n\n' +

    '<tg-emoji emoji-id="5416081784641168838">📧</tg-emoji> ' +
    '<b>Example:</b> <code>/41 google@gmail.com</code>\n\n' +
    '👉 <i>Or simply send your Bots.Business email address now:</i>',
    {
      parse_mode: "HTML"
    }
  );
  return;
}

// Clear waiting state
Bot.setProperty("waiting_clone_email_" + user.telegramid, false, "boolean");

// ===== INSTALL BOT =====
try {
  BBAdmin.installBot({
    bot_id: bot.id,
    email: email
  });
} catch (err) {}

// User details
var rawName = user.first_name ? user.first_name : (user.username ? "@" + user.username : "User");
var userName = escapeHtml(rawName);
var userHandle = user.username ? ("@" + escapeHtml(user.username)) : "No username";
var uDirectUrl = user.username ? ("https://t.me/" + user.username) : ("tg://user?id=" + user.telegramid);
var now = new Date();
var dateStr = now.toISOString().replace("T", " ").slice(0, 19);

// ===== SUCCESS MESSAGE =====
Bot.sendMessage(
  '<tg-emoji emoji-id="5375338737028841420">✅</tg-emoji> ' +
  '<b>Bot Successfully Sent!</b>\n\n' +

  '<tg-emoji emoji-id="5276032951342088188">📩</tg-emoji> ' +
  '<b>Email:</b> <code>' + escapeHtml(email) + '</code>\n\n' +

  '<tg-emoji emoji-id="5416081784641168838">📢</tg-emoji> ' +
  '<b>Official Channel:</b> ' + CHANNEL + '\n\n' +

  '<tg-emoji emoji-id="5460795800101594035">🙏</tg-emoji> ' +
  'Please join our official channel for updates &amp; support.\n\n' +

  '🎁 <b>ले जा गरीब ' + userName + '! 🚀</b>',
  {
    parse_mode: "HTML"
  }
);

// ===== NOTIFY ADMIN =====
var adminNotice = "🤖 <b>NEW BOT CLONE CLAIMED!</b>\n" +
                  "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                  "👤 <b>Claimed By:</b> <a href=\"" + uDirectUrl + "\">" + userName + "</a> (" + userHandle + ")\n" +
                  "🆔 <b>Chat ID:</b> <code>" + user.telegramid + "</code>\n" +
                  "📧 <b>Bots.Business Email:</b> <code>" + escapeHtml(email) + "</code>\n" +
                  "⏰ <b>Claim Time:</b> <code>" + dateStr + "</code>\n" +
                  "━━━━━━━━━━━━━━━━━━━━━━";

Api.sendMessage({
  chat_id: ADMIN_ID,
  text: adminNotice,
  parse_mode: "HTML",
  reply_markup: {
    inline_keyboard: [[
      { text: "✉️ Direct Message User", url: uDirectUrl }
    ]]
  }
});
