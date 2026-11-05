/*CMD
command: @
help: Global interceptor executed before all commands
need_reply: false
auto_retry_time: 
folder: 
answer: 
keyboard: 
aliases: 
group: 
CMD*/

// ===== GLOBAL PRIMARY BUTTON STYLE ENFORCER =====
// Enforces Telegram Bot API "style": "primary" on ALL inline keyboards across the bot
function _enforcePrimaryStyle(replyMarkup) {
  if (replyMarkup && Array.isArray(replyMarkup.inline_keyboard)) {
    for (let r = 0; r < replyMarkup.inline_keyboard.length; r++) {
      let row = replyMarkup.inline_keyboard[r];
      if (Array.isArray(row)) {
        for (let b = 0; b < row.length; b++) {
          if (row[b] && typeof row[b] === "object") {
            if (!row[b].style) {
              row[b].style = "primary";
            }
          }
        }
      }
    }
  }
  return replyMarkup;
}

// Intercept Telegram Chat Join Requests
if (typeof request !== "undefined" && request && request.chat_join_request) {
  let cjr = request.chat_join_request;
  let chId = cjr.chat ? cjr.chat.id : null;
  let reqUser = cjr.from ? cjr.from.id : null;
  if (chId && reqUser) {
    let rawChatId = String(chId);
    let numId = rawChatId.replace("-100", "").replace("-", "");
    Bot.setProperty("user_pending_req_" + reqUser + "_" + rawChatId, true, "boolean");
    if (numId) Bot.setProperty("user_pending_req_" + reqUser + "_" + numId, true, "boolean");
    Bot.setProperty("user_pending_req_" + reqUser, true, "boolean");
  }
}

// Intercept Telegram Chat Member status updates (detect when user leaves a channel)
if (typeof request !== "undefined" && request && request.chat_member) {
  let cm = request.chat_member;
  let chId = cm.chat ? cm.chat.id : null;
  let reqUser = cm.from ? cm.from.id : (cm.user ? cm.user.id : null);
  let newStatus = cm.new_chat_member ? cm.new_chat_member.status : null;
  if (chId && reqUser && (newStatus === "left" || newStatus === "kicked")) {
    let rawChatId = String(chId);
    let numId = rawChatId.replace("-100", "").replace("-", "");
    Bot.setProperty("user_pending_req_" + reqUser + "_" + rawChatId, false, "boolean");
    Bot.setProperty("user_left_chan_" + reqUser + "_" + rawChatId, true, "boolean");
    if (numId) {
      Bot.setProperty("user_pending_req_" + reqUser + "_" + numId, false, "boolean");
      Bot.setProperty("user_left_chan_" + reqUser + "_" + numId, true, "boolean");
    }
    Bot.setProperty("user_left_any_" + reqUser, true, "boolean");
    Bot.setProperty("fc_verified_" + reqUser, false, "boolean");
    if (typeof User !== "undefined") {
      User.setProperty("channels_verified", false, "boolean");
    }
  }
}

if (typeof Api !== "undefined") {
  if (Api.sendMessage && !Api._origSendMessage) {
    Api._origSendMessage = Api.sendMessage;
    Api.sendMessage = function(p) {
      if (p && p.reply_markup) {
        _enforcePrimaryStyle(p.reply_markup);
      }
      return Api._origSendMessage(p);
    };
  }
  if (Api.sendVideo && !Api._origSendVideo) {
    Api._origSendVideo = Api.sendVideo;
    Api.sendVideo = function(p) {
      if (p && p.reply_markup) {
        _enforcePrimaryStyle(p.reply_markup);
      }
      return Api._origSendVideo(p);
    };
  }
  if (Api.sendPhoto && !Api._origSendPhoto) {
    Api._origSendPhoto = Api.sendPhoto;
    Api.sendPhoto = function(p) {
      if (p && p.reply_markup) {
        _enforcePrimaryStyle(p.reply_markup);
      }
      return Api._origSendPhoto(p);
    };
  }
  if (Api.copyMessage && !Api._origCopyMessage) {
    Api._origCopyMessage = Api.copyMessage;
    Api.copyMessage = function(p) {
      if (p && p.reply_markup) {
        _enforcePrimaryStyle(p.reply_markup);
      }
      return Api._origCopyMessage(p);
    };
  }
}

if (typeof Bot !== "undefined") {
  if (Bot.sendInlineKeyboard && !Bot._origSendInlineKeyboard) {
    Bot._origSendInlineKeyboard = Bot.sendInlineKeyboard;
    Bot.sendInlineKeyboard = function(buttons, text, extra) {
      let tgInline = [];
      if (Array.isArray(buttons)) {
        for (let r = 0; r < buttons.length; r++) {
          let row = buttons[r];
          let tgRow = [];
          if (Array.isArray(row)) {
            for (let b = 0; b < row.length; b++) {
              let btn = row[b];
              if (!btn) continue;
              let tgBtn = {
                text: btn.title || btn.text || "",
                style: btn.style || "primary"
              };
              if (btn.url) {
                tgBtn.url = btn.url;
              } else if (btn.command) {
                tgBtn.callback_data = btn.command;
              } else if (btn.callback_data) {
                tgBtn.callback_data = btn.callback_data;
              }
              tgRow.push(tgBtn);
            }
          }
          if (tgRow.length > 0) {
            tgInline.push(tgRow);
          }
        }
      }

      let targetChat = (chat && chat.chatid) ? chat.chatid : (user ? user.telegramid : null);
      if (targetChat && typeof Api !== "undefined" && Api.sendMessage) {
        return Api.sendMessage({
          chat_id: targetChat,
          text: text,
          parse_mode: (extra && extra.parse_mode) ? extra.parse_mode : "Markdown",
          reply_markup: {
            inline_keyboard: tgInline
          }
        });
      } else {
        return Bot._origSendInlineKeyboard.call(Bot, buttons, text, extra);
      }
    };
  }
}

if (user) {
  // 1. Check if user is banned
  let isBanned = Bot.getProperty("banned_" + user.telegramid);
  if (isBanned) {
    Bot.sendMessage("🚫 *Access Denied*\n\nYour account has been suspended by administrators.");
    return false;
  }

  // 2. Synchronize Points Balance from global store if needed
  let globalPoints = Bot.getProperty("points_" + user.telegramid);
  if (globalPoints !== null && globalPoints !== undefined) {
    let currentLocalPoints = User.getProperty("points") || 0;
    if (globalPoints !== currentLocalPoints) {
      User.setProperty("points", globalPoints, "integer");
    }
  } else {
    let currentLocalPoints = User.getProperty("points");
    if (currentLocalPoints === null || currentLocalPoints === undefined) {
      User.setProperty("points", 0, "integer");
      Bot.setProperty("points_" + user.telegramid, 0, "integer");
    } else {
      Bot.setProperty("points_" + user.telegramid, currentLocalPoints, "integer");
    }
  }

  // 3. Intercept Bulk Video Upload by Admin
  let isBulkMode = User.getProperty("admin_bulk_mode");
  let isAdmin = (user.telegramid == 8710308658 || user.telegramid == "8710308658");

  if (isBulkMode && isAdmin) {
    let vid = (request && request.video) ? request.video : (request && request.message && request.message.video);
    let doc = (request && request.document) ? request.document : (request && request.message && request.message.document);

    if (vid || doc) {
      let fileId = null;
      let autoTitle = "";
      let isZip = false;

      if (vid) {
        fileId = vid.file_id;
        let caption = (request.message && request.message.caption) ? request.message.caption.trim() : "";
        autoTitle = caption || ((vid.file_name) ? vid.file_name.replace(/\.[^/.]+$/, "") : "Video " + Date.now().toString().slice(-4));
      } else if (doc) {
        let fileName = doc.file_name ? doc.file_name.toLowerCase() : "";
        if (fileName.endsWith(".zip") || (doc.mime_type && doc.mime_type.indexOf("zip") > -1) || fileName.endsWith(".rar") || fileName.endsWith(".7z")) {
          isZip = true;
        }
        fileId = doc.file_id;
        let caption = (request.message && request.message.caption) ? request.message.caption.trim() : "";
        autoTitle = caption || (doc.file_name ? doc.file_name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") : "Video " + Date.now().toString().slice(-4));
      }

      if (isZip) {
        Bot.sendMessage("⚠️ *Skipped:* ZIP file detected. Telegram cannot stream ZIP archives in video player. Please send MP4/MOV videos!");
        return false;
      }

      if (fileId) {
        let catId = User.getProperty("admin_bulk_cat_id");
        let videos = Bot.getProperty("videos") || [];

        // Check for duplicates
        let isDuplicate = false;
        for (let i = 0; i < videos.length; i++) {
          if (videos[i].file_id === fileId) {
            isDuplicate = true;
            break;
          }
        }

        if (isDuplicate) {
          let failedCount = (User.getProperty("admin_bulk_failed") || 0) + 1;
          User.setProperty("admin_bulk_failed", failedCount, "integer");
          Bot.sendMessage("⚠️ *Duplicate Skipped:* Video with title *" + autoTitle + "* already exists in the system!");
          return false;
        }

        // Add Video with Storage Channel reference
        let activeStorage = Bot.getProperty("storage_channel_id") || "-1003856912131";
        let newVidId = Date.now() + Math.floor(Math.random() * 1000);
        videos.push({
          id: newVidId,
          category_id: catId,
          file_id: fileId,
          storage_channel_id: activeStorage,
          storage_message_id: null,
          storage_file_id: null,
          title: autoTitle,
          description: "",
          is_zip: false,
          views: 0,
          created_at: new Date().toISOString(),
          upload_status: "active"
        });
        Bot.setProperty("videos", videos, "json");

        // Archive to active Storage Channel
        try {
          Api.sendVideo({
            chat_id: activeStorage,
            video: fileId,
            caption: "🎬 *" + autoTitle + "*\n🆔 ID: `" + newVidId + "`\n📅 Uploaded: `" + new Date().toISOString() + "`",
            parse_mode: "Markdown",
            supports_streaming: true,
            on_result: "/on_storage_upload_res " + newVidId,
            on_error: "/on_storage_upload_err " + newVidId
          });
        } catch (e) {
          // Ignore sync exception if any
        }

        let uploadedCount = (User.getProperty("admin_bulk_uploaded") || 0) + 1;
        User.setProperty("admin_bulk_uploaded", uploadedCount, "integer");

        let buttons = [
          [{ title: "🏁 Finish Bulk Upload", command: "/admin_bulk_finish" }]
        ];
        Bot.sendInlineKeyboard(
          buttons,
          "✅ *Video #" + uploadedCount + " Added!*\n" +
          "🎬 *Title:* " + autoTitle + "\n" +
          "📊 Total in this batch: *" + uploadedCount + "*\n\n" +
          "_Send next video or tap Finish below._"
        );
        return false;
      }
    }
  }

  // 5. Intercept Payment Screenshot Upload by User
  let awaitingScreenshot = User.getProperty("awaiting_payment_screenshot");
  if (awaitingScreenshot) {
    let photos = (request && request.message && request.message.photo) ? request.message.photo : (request && request.photo);
    if (photos && photos.length > 0) {
      let activeOrder = User.getProperty("active_order");
      if (activeOrder) {
        let largestPhoto = photos[photos.length - 1];
        let photoFileId = largestPhoto.file_id;

        let payments = Bot.getProperty("payment_requests") || [];
        let newPayment = {
          order_id: activeOrder.order_id,
          user_id: user.telegramid,
          user_name: user.first_name || "User",
          user_username: user.username || "",
          amount: activeOrder.amount,
          points: activeOrder.points,
          upi_id: activeOrder.upi_id,
          photo_file_id: photoFileId,
          status: "pending",
          created_at: new Date().toISOString(),
          reviewed_at: null,
          rejection_reason: null
        };

        payments.push(newPayment);
        Bot.setProperty("payment_requests", payments, "json");

        // Clear active order state
        User.setProperty("awaiting_payment_screenshot", false, "boolean");
        User.setProperty("active_order", null, "json");

        // Send confirmation to User
        let userConfirmText =
          "Your payment screenshot has been submitted successfully!\n\n" +
          "Please wait while our admin verifies your payment.\n\n" +
          "Your payment will be verified within 2 hours. Once approved, your purchased points will be automatically added to your account.\n\n" +
          "Thank you for your patience!\n\n" +
          "━━━━━━━━━━━━━━━━━━━━━\n" +
          "🧾 *Order ID:* `" + newPayment.order_id + "`\n" +
          "💰 *Amount Paid:* *₹" + newPayment.amount + "*\n" +
          "🎁 *Purchased Points:* *" + newPayment.points + " Points*";

        let userButtons = [
          [{ title: "💰 My Points", command: "/my_points" }],
          [{ title: "🏠 Main Menu", command: "/start" }]
        ];
        Bot.sendInlineKeyboard(userButtons, userConfirmText);

        // Notify Master Admin
        let primaryAdmin = 8710308658;
        let adminCaption =
          "🔔 *New Payment Request Received!*\n\n" +
          "━━━━━━━━━━━━━━━━━━━━━\n" +
          "🧾 *Order ID:* `" + newPayment.order_id + "`\n" +
          "👤 *User:* " + newPayment.user_name + " (`" + newPayment.user_id + "`)" + (newPayment.user_username ? " (@" + newPayment.user_username + ")" : "") + "\n" +
          "💰 *Amount:* *₹" + newPayment.amount + "*\n" +
          "🎁 *Points to Credit:* *" + newPayment.points + " Points*\n" +
          "━━━━━━━━━━━━━━━━━━━━━\n" +
          "Verify the screenshot below and approve or reject:";

        let adminButtons = [
          [
            { title: "✅ Approve", command: "/admin_approve_pay " + newPayment.order_id },
            { title: "❌ Reject", command: "/admin_reject_pay " + newPayment.order_id }
          ]
        ];

        try {
          Api.sendPhoto({
            chat_id: primaryAdmin,
            photo: photoFileId,
            caption: adminCaption,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "✅ Approve (+" + newPayment.points + " pts)", callback_data: "/admin_approve_pay " + newPayment.order_id, style: "primary" },
                  { text: "❌ Reject", callback_data: "/admin_reject_pay " + newPayment.order_id, style: "primary" }
                ]
              ]
            }
          });
        } catch (e) {
          // If admin chat cannot receive photo
        }
        return false;
      }
    }
  }

  // 6. Check if user is waiting to input Bots.Business clone email
  if (Bot.getProperty("waiting_clone_email_" + user.telegramid)) {
    let currentCmd = "";
    if (typeof message === "string") {
      currentCmd = message.trim();
    } else if (request && request.message && request.message.text) {
      currentCmd = request.message.text.trim();
    }
    if (currentCmd.indexOf("@") > -1 && currentCmd.indexOf(".") > -1) {
      Bot.runCommand("/41 " + currentCmd);
      return false;
    }
  }

  // 7. Force Channels Admin Reply Keyboard Navigation
  if (isAdmin) {
    let mText = "";
    if (typeof message === "string") {
      mText = message.trim();
    } else if (request && request.message && request.message.text) {
      mText = request.message.text.trim();
    }

    if (mText === "➕ Add Channel" || mText.endsWith("Add Channel")) {
      Bot.runCommand("/admin_fc_add");
      return false;
    }
    if (mText === "📋 List Channels" || mText.endsWith("List Channels")) {
      Bot.runCommand("/admin_fc_list");
      return false;
    }
    if (mText === "🗑 Remove Channel" || mText.endsWith("Remove Channel")) {
      Bot.runCommand("/admin_fc_remove");
      return false;
    }
    if (mText === "🔁 Enable/Disable Channel" || mText.endsWith("Enable/Disable Channel")) {
      Bot.runCommand("/admin_fc_toggle");
      return false;
    }
    if (mText === "🔙 Back" || mText === "Back") {
      if (User.getProperty("in_fc_menu")) {
        User.setProperty("in_fc_menu", false, "boolean");
        Api.sendMessage({
          chat_id: user.telegramid,
          text: "🔙 <i>Returning to Admin Panel...</i>",
          parse_mode: "HTML",
          reply_markup: { remove_keyboard: true }
        });
        Bot.runCommand("/admin");
        return false;
      }
    }
    if (mText === "❌ Cancel" || mText === "🔴 Cancel") {
      if (User.getProperty("in_fc_menu")) {
        User.setProperty("fc_state", null, "string");
        User.setProperty("fc_temp_ref", null, "json");
        User.setProperty("fc_temp_type", null, "string");
        User.setProperty("fc_pending_remove_id", null, "string");
        Bot.runCommand("/admin_channels");
        return false;
      }
    }
  }

  // 8. Force Channels Membership Enforcement for Normal Users
  if (!isAdmin) {
    let channels = Bot.getProperty("force_channels") || [];
    let activeFc = [];
    for (let f = 0; f < channels.length; f++) {
      if (channels[f].enabled !== false) activeFc.push(channels[f]);
    }

    if (activeFc.length > 0) {
      let currentCmd = "";
      if (typeof message === "string") {
        currentCmd = message.trim();
      } else if (request && request.message && request.message.text) {
        currentCmd = request.message.text.trim();
      }

      let isLeftAny = Bot.getProperty("user_left_any_" + user.telegramid);
      let isVerified = User.getProperty("channels_verified");
      if (isLeftAny) {
        isVerified = false;
        User.setProperty("channels_verified", false, "boolean");
      }

      let isExempt = false;
      let exemptPrefixes = [
        "/verify_step",
        "/on_verify_step",
        "/start"
      ];
      for (let p = 0; p < exemptPrefixes.length; p++) {
        if (currentCmd.startsWith(exemptPrefixes[p])) {
          isExempt = true;
          break;
        }
      }

      if (!isExempt && !isVerified) {
        Bot.runCommand("/verify_step 0");
        return false;
      }
    }
  }
}
