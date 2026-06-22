module.exports = {
  apps: [
    {
      name: "my-frontend",
      script: "bun",
      args: "run dev",
      watch: false,
    },
    {
      name: "my-backend",
      script: "index.js",
      cwd: "./backend",
      watch: false,
      // السطرين دول هيمنعوا الريستارت المكرر لو السيرفر بيقفل أوتوماتيك
      autorestart: true,
      restart_delay: 3000,
    },
  ],
};
