const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");

let mainWindow;
let serverProcess = null;

function startBackendServer() {
  // هنا بنحدد مسار ملف الـ Backend بتاعك
  // لو ملف index.js بتاع السيرفر بره، اكتب مساره صح. هنا بنفترض إنه جوه فولدر اسمه backend
  const serverPath = path.join(__dirname, "backend", "index.js");

  // تشغيل السيرفر في الخلفية
  serverProcess = fork(serverPath, [], {
    env: { ...process.env, NODE_ENV: "production" },
  });

  serverProcess.on("error", (err) => {
    console.error("Failed to start backend server:", err);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // التحميل بعد ما نضمن إن السيرفر بدأ يقوم
  mainWindow.loadURL("http://localhost:5000"); // أو مسار الـ Frontend بتاعك
}

// لما الأبليكيشن يجهز، شغل السيرفر وافتح الشاشة
app.whenReady().then(() => {
  startBackendServer();
  createWindow();
});

// قفل السيرفر فوراً أول ما الدكتور يقفل البرنامج عشان ميفضلش شغال في الخلفية
app.on("window-all-closed", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
