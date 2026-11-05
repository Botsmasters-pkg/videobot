/*CMD
command: /admin_got_pub_name
help: Step 2 of 2 - Prompt admin for public channel username
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
  Bot.sendMessage("⚠️ Channel name is too short. Please enter a valid channel name (e.g. `CODE VEX UPDATES`):");
  Bot.run({ command: "/admin_got_pub_name" });
  return;
}

User.setProperty("temp_pub_name", channelName, "string");

let buttons = [[{ title: "❌ Cancel", command: "/admin_channels" }]];

Bot.sendInlineKeyboard(
  buttons,
  "✅ *Channel Name Saved:* `" + channelName + "`\n\n" +
  "📢 *Step 2 of 2:* Now enter the **Channel Username** starting with `@` (e.g. `@CODEVEXA`):\n\n" +
  "⚠️ *Important:* Ensure the bot is added as an **Administrator** in your channel so it can verify memberships!\n\n" +
  "_(Send /admin to cancel)_"
);

Bot.run({ command: "/admin_save_pub_chan" });
