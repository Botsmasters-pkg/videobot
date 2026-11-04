/*CMD
command: /check_channels
help: Verifies membership across public, private, and request channels
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");
if (isAdmin) {
  Bot.sendMessage("👑 *Admin Bypass:* Membership verified automatically.");
  Bot.runCommand("/start");
  return;
}

let isGlobalEnabled = Bot.getProperty("force_channels_enabled");
if (isGlobalEnabled === false) {
  Bot.runCommand("/start");
  return;
}

let channels = Bot.getProperty("force_channels") || [];
if (channels.length === 0) {
  Bot.runCommand("/start");
  return;
}

let unjoined = [];
let buttons = [];

for (let i = 0; i < channels.length; i++) {
  let ch = channels[i];
  if (ch.enabled === false) {
    continue;
  }

  let isVerified = false;

  if (ch.type === "request") {
    // Check if user has sent a join request or already a member
    let hasRequested = User.getProperty("requested_channel_" + ch.chat_id) || Bot.getProperty("user_pending_req_" + user.telegramid + "_" + ch.chat_id);
    if (hasRequested) {
      isVerified = true;
    }
  }

  if (!isVerified) {
    // Check via Telegram API getChatMember
    let targetChat = ch.chat_id || ch.username;
    if (targetChat) {
      try {
        let memberRes = Api.getChatMember({
          chat_id: targetChat,
          user_id: user.telegramid
        });
        if (memberRes && memberRes.status) {
          let s = memberRes.status;
          if (s === "creator" || s === "administrator" || s === "member" || s === "restricted") {
            isVerified = true;
          }
        }
      } catch (e) {
        // If chat unreachable or bot not admin yet
      }
    }
  }

  if (!isVerified) {
    unjoined.push(ch);
    let linkUrl = ch.invite_link || ("https://t.me/" + (ch.username ? ch.username.replace("@", "") : ""));
    let btnTitle = ch.type === "request" ? "📩 Send Request: Channel " + (i + 1) : "📢 Join Channel " + (i + 1);

    buttons.push([{ title: btnTitle, url: linkUrl }]);

    if (ch.type === "request") {
      buttons.push([{
        title: "✅ I Have Sent Request (Channel " + (i + 1) + ")",
        command: "/verify_req_channel " + ch.chat_id
      }]);
    }
  }
}

if (unjoined.length === 0) {
  User.setProperty("channels_verified", true, "boolean");
  Bot.sendMessage("✅ *All Channels Verified Successfully!*\n\nWelcome back! Opening main menu...");
  Bot.runCommand("/start");
  return;
}

buttons.push([{ title: "🔄 Verify Membership", command: "/check_channels" }]);

let text =
  "📢 *Mandatory Channel Subscription Required!*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n" +
  "To access our video bot and free videos, please join our official channels below:\n\n";

for (let i = 0; i < unjoined.length; i++) {
  let u = unjoined[i];
  let typeDesc = u.type === "public" ? "Public Channel" : (u.type === "private" ? "Private Channel" : "Join Request Channel");
  text += (i + 1) + ". *" + typeDesc + "* (" + (u.username || u.title || "Official Channel") + ")\n";
}

text +=
  "\n━━━━━━━━━━━━━━━━━━━━━\n" +
  "👉 Tap each button above to join or send request, then tap *Verify Membership*!";

Bot.sendInlineKeyboard(buttons, text);
