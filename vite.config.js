import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // 👈 غيرنا السطر ده للمكتبة القياسية بتاعة Vite

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 السطر السحري بتاع الديسكتوب اللي ضفناه
});
