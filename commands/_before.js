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

// 0a. Intercept Telegram Chat Join Requests (Unconditional for all updates)
if (request && request.chat_join_request) {
  let reqChat = request.chat_join_request.chat;
  let reqFrom = request.chat_join_request.from;
  let reqChatId = reqChat ? reqChat.id.toString() : "";
  let reqUserId = reqFrom ? reqFrom.id.toString() : "";

  if (reqUserId && reqChatId) {
    Bot.setProperty("user_pending_req_" + reqUserId + "_" + reqChatId, true, "boolean");
    Bot.setProperty("user_pending_req_" + reqUserId + "_" + reqChatId.replace("-100", "-"), true, "boolean");
    let numId = reqChatId.replace("-100", "").replace("-", "");
    Bot.setProperty("user_pending_req_" + reqUserId + "_" + numId, true, "boolean");
    Bot.setProperty("user_pending_req_" + reqUserId, true, "boolean");

    // Clear left flag if user re-requested
    Bot.setProperty("user_left_chan_" + reqUserId + "_" + reqChatId, false, "boolean");
    Bot.setProperty("user_left_chan_" + reqUserId + "_" + reqChatId.replace("-100", "-"), false, "boolean");
    if (numId) {
      Bot.setProperty("user_left_chan_" + reqUserId + "_" + numId, false, "boolean");
    }
    Bot.setProperty("user_left_any_" + reqUserId, false, "boolean");
  }
  return;
}

// 0b. Intercept Telegram Chat Member Updates (Detect when user leaves/is removed from channel)
if (request && request.chat_member) {
  let cm = request.chat_member;
  let cmFrom = (cm.new_chat_member && cm.new_chat_member.user) || cm.from || cm.user;
  let cmChat = cm.chat;
  let newStatus = cm.new_chat_member ? cm.new_chat_member.status : null;

  if (cmFrom && cmChat) {
    let uId = cmFrom.id.toString();
    let cId = cmChat.id.toString();
    let numId = cId.replace("-100", "").replace("-", "");

    if (newStatus === "left" || newStatus === "kicked") {
      // User left channel! Invalidate verification immediately!
      Bot.setProperty("user_pending_req_" + uId + "_" + cId, false, "boolean");
      Bot.setProperty("user_pending_req_" + uId + "_" + cId.replace("-100", "-"), false, "boolean");
      if (numId) {
        Bot.setProperty("user_pending_req_" + uId + "_" + numId, false, "boolean");
      }
      Bot.setProperty("user_pending_req_" + uId, false, "boolean");

      Bot.setProperty("user_left_chan_" + uId + "_" + cId, true, "boolean");
      Bot.setProperty("user_left_chan_" + uId + "_" + cId.replace("-100", "-"), true, "boolean");
      if (numId) {
        Bot.setProperty("user_left_chan_" + uId + "_" + numId, true, "boolean");
      }
      Bot.setProperty("user_left_any_" + uId, true, "boolean");
    } else if (newStatus === "member" || newStatus === "administrator" || newStatus === "creator") {
      // User rejoined or is active member
      Bot.setProperty("user_left_chan_" + uId + "_" + cId, false, "boolean");
      Bot.setProperty("user_left_chan_" + uId + "_" + cId.replace("-100", "-"), false, "boolean");
      if (numId) {
        Bot.setProperty("user_left_chan_" + uId + "_" + numId, false, "boolean");
      }
      Bot.setProperty("user_left_any_" + uId, false, "boolean");
    }
  }
  return;
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

  // Intercept Admin Force Channels Reply Keyboard Buttons
  if (isAdmin && typeof message === "string") {
    let m = message.trim();
    if (m === "➕ Add Channel") {
      Bot.runCommand("/admin_fc_add");
      return false;
    }
    if (m === "📋 List Channels") {
      Bot.runCommand("/admin_fc_list");
      return false;
    }
    if (m === "🗑 Remove Channel") {
      Bot.runCommand("/admin_fc_remove");
      return false;
    }
    if (m === "🔁 Enable/Disable Channel") {
      Bot.runCommand("/admin_fc_toggle");
      return false;
    }
    if (m === "🔙 Back") {
      User.setProperty("in_fc_menu", false, "boolean");
      Api.sendMessage({
        chat_id: user.telegramid,
        text: "Returning to Admin Panel...",
        reply_markup: { remove_keyboard: true }
      });
      Bot.runCommand("/admin");
      return false;
    }
    if ((m === "❌ Cancel" || m === "🔴 Cancel") && User.getProperty("in_fc_menu")) {
      User.setProperty("fc_state", null, "string");
      User.setProperty("fc_temp_ref", null, "json");
      User.setProperty("fc_temp_type", null, "string");
      User.setProperty("fc_pending_remove_id", null, "string");
      Bot.runCommand("/admin_channels");
      return false;
    }
  }

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

  // 6. Force Channel Membership Enforcement
  if (!isAdmin) {
    let isGlobalChannelsEnabled = Bot.getProperty("force_channels_enabled");
    if (isGlobalChannelsEnabled !== false) {
      let channels = Bot.getProperty("force_channels") || [];
      let activeChannels = [];
      for (let i = 0; i < channels.length; i++) {
        if (channels[i].enabled !== false) {
          activeChannels.push(channels[i]);
        }
      }

      if (activeChannels.length > 0) {
        if (Bot.getProperty("user_left_any_" + user.telegramid)) {
          User.setProperty("channels_verified", false, "boolean");
        }
        let isVerified = User.getProperty("channels_verified");
        if (!isVerified) {
          // Identify incoming command / callback
          let currentCmd = "";
          if (typeof message === "string") {
            currentCmd = message.trim();
          } else if (request && request.callback_query && request.callback_query.data) {
            currentCmd = request.callback_query.data.trim();
          } else if (request && request.message && request.message.text) {
            currentCmd = request.message.text.trim();
          }

          // Allow channel verification, start (which has its own channel check), video delivery, and clone commands
          let isVerifyCmd = false;
          let allowedPrefixes = [
            "/start",
            "/verify_step",
            "/on_verify_step_res",
            "/on_verify_step_err",
            "/deliver_video",
            "/get_video",
            "/41",
            "41"
          ];
          for (let p = 0; p < allowedPrefixes.length; p++) {
            if (currentCmd.indexOf(allowedPrefixes[p]) === 0) {
              isVerifyCmd = true;
              break;
            }
          }

          // Check if user is waiting to input Bots.Business clone email
          if (Bot.getProperty("waiting_clone_email_" + user.telegramid)) {
            if (currentCmd.indexOf("@") > -1 && currentCmd.indexOf(".") > -1) {
              isVerifyCmd = true;
              Bot.runCommand("/41 " + currentCmd);
              return false;
            }
          }

          if (!isVerifyCmd) {
            let chanBtns = [];
            for (let i = 0; i < activeChannels.length; i++) {
              let ch = activeChannels[i];
              let link = ch.invite_link || (ch.username ? "https://t.me/" + ch.username.replace("@", "") : "");
              if (link) {
                chanBtns.push({ title: "𝗝𝗢𝗜𝗡", url: link, style: "primary" });
              }
            }

            // 2x2 Layout (2 buttons per row)
            let buttons = [];
            for (let i = 0; i < chanBtns.length; i += 2) {
              if (i + 1 < chanBtns.length) {
                buttons.push([chanBtns[i], chanBtns[i + 1]]);
              } else {
                buttons.push([chanBtns[i]]);
              }
            }
            buttons.push([{ title: "🔄 Verify Membership", command: "/verify_step 0", style: "primary" }]);

            let joinText =
              "⚠️ *Membership Required to Access Bot!*\n" +
              "━━━━━━━━━━━━━━━━━━━━━\n" +
              "To use this bot and access all video content, you must join our official channels below:\n\n";

            for (let i = 0; i < activeChannels.length; i++) {
              let ch = activeChannels[i];
              let cleanName = (ch.title || "").replace(/^@/, "").replace(/^Private Channel \([^)]*\)/, "Private Channel").replace(/^Request Channel \([^)]*\)/, "Request Channel").trim() || "Official Channel";
              joinText += (i + 1) + ". *" + cleanName + "*\n";
            }

            joinText +=
              "\n👉 *Step 1:* Click **𝗝𝗢𝗜𝗡** buttons above to join.\n" +
              "👉 *Step 2:* Tap *🔄 Verify Membership* below once you've joined.\n" +
              "━━━━━━━━━━━━━━━━━━━━━";

            Bot.sendInlineKeyboard(buttons, joinText);
            return false;
          }
        }
      }
    }
  }
}
