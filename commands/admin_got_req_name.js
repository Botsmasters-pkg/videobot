/*CMD
command: /admin_got_req_name
help: Step 2 of 3 - Prompt admin for Request Channel Chat ID
need_reply: true
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

if (!message || message.trim() === "/admin") {
  Bot.runCommand("/admin_channels");
  return;
}

let channelName = message.trim();
if (channelName.length < 2) {
  Bot.sendMessage("⚠️ Channel name is too short. Please enter a valid name (e.g. `PREMIUM REQUEST ZONE`):");
  Bot.run({ command: "/admin_got_req_name" });
  return;
}

User.setProperty("temp_req_name", channelName, "string");

let buttons = [[{ title: "❌ Cancel", command: "/admin_channels" }]];

let text =
  "✅ *Channel Name Saved:* `" + channelName + "`\n\n" +
  "📩 *Step 2 of 3:* Enter the **Channel Chat ID** (usually starts with `-100`, e.g. `-1001234567890`):\n\n" +
  "⚠️ *Important:* Ensure the bot is added as an **Administrator** in your channel!\n\n" +
  "_(Send /admin to cancel)_";

Bot.sendInlineKeyboard(buttons, text);
Bot.run({ command: "/admin_got_req_id" });

