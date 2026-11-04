/*CMD
command: /admin_list_channels
help: View all added force channels with full details and pagination
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

let channels = Bot.getProperty("force_channels") || [];

if (channels.length === 0) {
  let buttons = [
    [{ title: "📢 Add Public Channel", command: "/admin_add_pub_chan" }],
    [{ title: "🔒 Add Private Channel", command: "/admin_add_priv_chan" }],
    [{ title: "📩 Add Request Channel", command: "/admin_add_req_chan" }],
    [{ title: "🔙 Force Channels Menu", command: "/admin_channels" }]
  ];
  Bot.sendInlineKeyboard(
    buttons,
    "📋 *Configured Force Channels*\n\n_No force channels have been added yet._\nUse the buttons below to add Public, Private, or Request channels!"
  );
  return;
}

// Pagination logic: 5 channels per page
let page = parseInt(params) || 1;
if (page < 1) page = 1;

let pageSize = 5;
let totalPages = Math.ceil(channels.length / pageSize);
if (page > totalPages) page = totalPages;

let startIndex = (page - 1) * pageSize;
let endIndex = Math.min(startIndex + pageSize, channels.length);

let text =
  "📋 *Configured Force Channels (Page " + page + " of " + totalPages + ")*\n" +
  "Total Channels: *" + channels.length + "*\n" +
  "━━━━━━━━━━━━━━━━━━━━━\n\n";

for (let i = startIndex; i < endIndex; i++) {
  let ch = channels[i];
  let typeStr = "";
  if (ch.type === "public") {
    typeStr = "📢 Public Channel";
  } else if (ch.type === "private") {
    typeStr = "🔒 Private Channel";
  } else if (ch.type === "request") {
    typeStr = "📩 Private Request Channel";
  }

  let statusStr = (ch.enabled !== false) ? "🟢 Enabled" : "🔴 Disabled";
  let usernameStr = ch.username ? "`" + ch.username + "`" : "N/A";
  let chatIdStr = ch.chat_id ? "`" + ch.chat_id + "`" : "N/A";
  let inviteStr = ch.invite_link ? ch.invite_link : "N/A";

  text +=
    "*" + (i + 1) + ". " + (ch.title || "Channel " + (i + 1)) + "*\n" +
    "• *Type:* " + typeStr + "\n" +
    "• *Username:* " + usernameStr + "\n" +
    "• *Chat ID:* " + chatIdStr + "\n" +
    "• *Invite Link:* " + inviteStr + "\n" +
    "• *Status:* " + statusStr + "\n\n";
}

text += "━━━━━━━━━━━━━━━━━━━━━";

let buttons = [];

// Pagination row
let navRow = [];
if (page > 1) {
  navRow.push({ title: "⬅️ Page " + (page - 1), command: "/admin_list_channels " + (page - 1) });
}
if (page < totalPages) {
  navRow.push({ title: "Page " + (page + 1) + " ➡️", command: "/admin_list_channels " + (page + 1) });
}
if (navRow.length > 0) {
  buttons.push(navRow);
}

buttons.push([
  { title: "🗑 Remove Channel", command: "/admin_remove_channel" },
  { title: "➕ Add Channel", command: "/admin_channels" }
]);
buttons.push([
  { title: "🔙 Back to Force Channels", command: "/admin_channels" },
  { title: "🛠 Admin Dashboard", command: "/admin" }
]);

Bot.sendInlineKeyboard(buttons, text);
