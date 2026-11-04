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

  // 3. Intercept Telegram Chat Join Requests (for Private Request Force Channels)
  if (request && request.chat_join_request) {
    let reqChatId = request.chat_join_request.chat.id.toString();
    let reqUserId = request.chat_join_request.from.id.toString();
    Bot.setProperty("user_pending_req_" + reqUserId + "_" + reqChatId, true, "boolean");
    return;
  }

  // 4. Intercept Bulk Video Upload by Admin
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

        // Add Video
        let newVidId = Date.now() + Math.floor(Math.random() * 1000);
        videos.push({
          id: newVidId,
          category_id: catId,
          file_id: fileId,
          title: autoTitle,
          description: "",
          is_zip: false,
          views: 0,
          created_at: new Date().toISOString()
        });
        Bot.setProperty("videos", videos, "json");

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
                  { text: "✅ Approve (+" + newPayment.points + " pts)", callback_data: "/admin_approve_pay " + newPayment.order_id },
                  { text: "❌ Reject", callback_data: "/admin_reject_pay " + newPayment.order_id }
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

          // Preserve referral parameters if user started via referral link
          if (currentCmd.indexOf("/start") === 0) {
            let refParam = currentCmd.replace("/start", "").trim();
            if (refParam) {
              User.setProperty("pending_ref_param", refParam, "string");
            }
          }

          // Allow channel verification commands to execute
          let isVerifyCmd = false;
          let allowedPrefixes = ["/check_channels", "/on_verify_member", "/on_verify_fail", "/verify_req_channel"];
          for (let p = 0; p < allowedPrefixes.length; p++) {
            if (currentCmd.indexOf(allowedPrefixes[p]) === 0) {
              isVerifyCmd = true;
              break;
            }
          }

          if (!isVerifyCmd) {
            let buttons = [];
            for (let i = 0; i < activeChannels.length; i++) {
              let ch = activeChannels[i];
              let title = ch.title || (ch.username ? ch.username : "Channel #" + (i + 1));
              let link = ch.invite_link || (ch.username ? "https://t.me/" + ch.username.replace("@", "") : "");
              if (link) {
                buttons.push([{ title: "📢 Join " + title, url: link }]);
              }
            }
            buttons.push([{ title: "🔄 Verify Membership", command: "/check_channels 0" }]);

            let joinText =
              "⚠️ *Membership Required to Access Bot!*\n" +
              "━━━━━━━━━━━━━━━━━━━━━\n" +
              "To use this bot and access all video content, you must join our official channels below:\n\n";

            for (let i = 0; i < activeChannels.length; i++) {
              let ch = activeChannels[i];
              let cType = ch.type ? ch.type.toUpperCase() : "PUBLIC";
              let cName = ch.title || ch.username || ("Channel #" + (i + 1));
              joinText += (i + 1) + ". *" + cName + "* (" + cType + ")\n";
            }

            joinText +=
              "\n👉 *Step 1:* Click each channel link above to join.\n" +
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
