# Village Seeds - Quick Startup Guide

## **One-Click Startup (Recommended)**
**Double-click**: `start-website.bat` file on your desktop

This will automatically:
- Navigate to project directory
- Check MongoDB connection
- Start the web server
- Open your website at `http://localhost:3000`

---

## **Manual Startup Steps**

### **Step 1: Open Command Prompt**
- Press `Windows Key + R`
- Type `cmd` and press Enter

### **Step 2: Navigate to Project**
```bash
cd "C:\Users\abhi\OneDrive\Desktop\REAL ESTATE"
```

### **Step 3: Start Server**
```bash
node server-new.js
```

### **Step 4: Open Website**
- Open browser
- Go to: `http://localhost:3000`

---

## **Troubleshooting**

### **If MongoDB is not running:**
```bash
net start MongoDB
```

### **If port 3000 is in use:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID [PROCESS_ID] /F
```

### **If Node.js is not recognized:**
- Install Node.js from: https://nodejs.org
- Restart your laptop

---

## **Quick Access Setup**

### **Create Desktop Shortcut:**
1. Right-click on desktop
2. New > Shortcut
3. Location: `C:\Users\abhi\OneDrive\Desktop\REAL ESTATE\start-website.bat`
4. Name: `Village Seeds Website`
5. Finish

### **Add to Startup (Optional):**
1. Press `Windows Key + R`
2. Type `shell:startup` and press Enter
3. Copy `start-website.bat` to this folder
4. Website will start automatically when laptop boots

---

## **What You'll See**

**Successful startup shows:**
```
Server running on port 3000
MongoDB connected successfully
Village Seeds website ready!
```

**Website features available:**
- User registration and login
- Product browsing and ordering
- WhatsApp order notifications
- Admin dashboard
- Product management

---

## **Daily Usage**

**Every morning:**
1. Double-click `start-website.bat`
2. Wait for server to start
3. Open `http://localhost:3000`
4. Your Village Seeds marketplace is ready!

**To stop server:**
- Press `Ctrl+C` in command window
- Or close the command window

---

## **Emergency Recovery**

**If nothing works:**
1. Restart laptop
2. Open Command Prompt as Administrator
3. Run: `cd "C:\Users\abhi\OneDrive\Desktop\REAL ESTATE"`
4. Run: `node server-new.js`
5. If errors occur, check Node.js installation

**File locations:**
- Main website: `index.html`
- Server file: `server-new.js`
- Startup script: `start-website.bat`
- Database: MongoDB (localhost:27017)

---

*Last updated: Today*
