/*CMD
command: *
help: Fallback command for unrecognized input
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

let buttons = [
  [
    { title: "🎬 Get Video", command: "/get_video" }
  ],
  [
    { title: "💰 My Points", command: "/my_points" },
    { title: "🎁 Refer & Earn", command: "/referral" }
  ],
  [
    { title: "💳 Buy Points", command: "/buy_points" },
    { title: "ℹ️ Help", command: "/help" }
  ]
];

Bot.sendInlineKeyboard(buttons, "👋 Tap an option below to browse videos or manage your account:");
