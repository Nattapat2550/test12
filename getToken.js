// getToken.js
require("dotenv").config();
const { google } = require("googleapis");
const open = require("open");
const readline = require("readline");

// สร้าง OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// กำหนด scopes (สิทธิ์ที่เราต้องการ)
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

async function main() {
  // สร้าง URL ให้ user ไป login และยินยอม
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // สำคัญ! ต้องใช้ offline ถึงจะได้ refresh_token
    prompt: "consent",      // บังคับถามทุกครั้งเพื่อได้ refresh_token
    scope: SCOPES,
  });

  console.log("ไปที่ลิงก์นี้เพื่ออนุญาตแอปของคุณ:\n", url);
  await open(url);

  // รับ code กลับมาทาง console
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\nกรุณาวาง code ที่ได้จาก Google: ", async (code) => {
    try {
      const { tokens } = await oauth2Client.getToken(code.trim());
      console.log("\nAccess Token:", tokens.access_token);
      console.log("Refresh Token:", tokens.refresh_token);
      console.log("\n👉 นำค่า refresh_token ไปใส่ในไฟล์ .env ของคุณ");

      rl.close();
    } catch (err) {
      console.error("Error retrieving access token", err);
      rl.close();
    }
  });
}

main();
