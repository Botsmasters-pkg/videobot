# 🎬 Smart Video Reward Telegram Bot for Bots.Business

A production-ready Telegram Video Bot built specifically for **[Bots.Business](https://app.bots.business/)** using **Bot JavaScript (BJS)**.

---

## 🌟 Key Features Overview

### 👤 1. Normal User Panel
- **🎬 Watch Videos:** Streams native video in Telegram video player (`supports_streaming: true`).
- **🎁 Free Video System:** Every new user gets their **first 2 videos completely FREE** (0 points deducted).
- **💰 3rd Video Onwards:** Video access requires **5 Points per video** (Admin configurable).
- **⚡ No Limits:** No daily limits and no daily resets. Users can watch as many videos as their points allow.
- **💰 My Points Dashboard (`/my_points`):** Live points balance, free videos used (X/2), total points earned/spent, and real-time transaction history.
- **🎁 Refer & Earn (`/referral`):** Personal referral link with instant 1-click Telegram share button. Earns **10 Points per referral**!
- **💳 Buy Points (`/buy_points`):** Dynamic UPI QR code generator starting at **₹10 = 100 Points**.
- **ℹ️ Help Center (`/help`):** Dynamic admin contact link and guide.

---

### 🎁 2. Referral & Points Reward System
- **Formula:** 
  - **1 Successful Referral = 10 Points** (Default)
  - **1 Video Access = 5 Points** (Default)
  - That means **1 Friend Invited = 2 Full Video Streams**!
- **Anti-Cheat Security:**
  - Self-referrals strictly blocked.
  - Duplicate accounts prevented.
  - Only genuine first-time users award points to their referrer.
- **Instant Referral Notifications:** Referrers receive an immediate Telegram message whenever a friend joins through their link.

---

### 💳 3. Dynamic UPI QR Payment System
- **Packages:**
  - ₹10 = 100 Points
  - ₹20 = 200 Points
  - ₹50 = 500 Points
  - ₹100 = 1000 Points
- **Dynamic QR Code:**
  - Prefilled with Admin's current UPI ID and exact package amount.
  - Compatible with Google Pay, PhonePe, Paytm, and BHIM.
- **Screenshot Verification:**
  - User uploads payment screenshot directly in chat.
  - Status set to `pending` with unique Order ID.
  - Admin receives immediate notification with photo and 1-tap `[ ✅ Approve ]` and `[ ❌ Reject ]` buttons.
  - On approval, points are credited automatically to user's balance without manual math.

---

### 📢 4. Force Channel Verification (3 Types)
1. **Public Channel:** Verification via Channel Username (`@channelname`).
2. **Private Channel:** Verification via Channel Chat ID (`-100...`) and Private Invite Link.
3. **Private Request Channel:** User sends Join Request; pending join request is verified valid immediately without waiting for admin approval.

---

### 🛠 5. Master Administrator Panel (`8710308658`)
- **Single & Bulk Video Upload:** Direct MP4/MOV upload with batch processing and duplicate detection.
- **Points Management:** Adjust points per referral, video cost, add/deduct points from any user by ID.
- **Payment Management:** Review pending screenshot submissions, approve or reject with custom reason.
- **UPI & QR Configuration:** Change UPI ID and Payee Name anytime.
- **Pricing Management:** Add, edit, or delete coin pricing packages.
- **Force Channel Settings:** Add, remove, and toggle Public, Private, and Request channels.
- **Help Username Settings:** Change support contact username on the fly.
- **Admin Bypass:** Master Admin `8710308658` enjoys unlimited video streaming with 0 points deducted.

---

## 🚀 How to Import into Bots.Business (1-Click Setup)

1. Open your bot at **[https://app.bots.business/](https://app.bots.business/)**.
2. Click on the **"Git"** tab.
3. Link this repository:
   ```text
   https://github.com/Botsmasters-pkg/videobot.git
   ```
4. Click **"Import from Git"** or **"Sync"**.
5. All commands in `commands/` and `bot.json` are automatically loaded into your bot!
