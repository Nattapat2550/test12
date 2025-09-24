require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { sendEmail } = require("./services/gmail");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// หน้าเว็บฟอร์ม
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// เมื่อกดส่ง
app.post("/send", async (req, res) => {
  const to = req.body.email;
  try {
    await sendEmail(to, "Test Run", "This is a test run message!");
    res.send(`<h2>ส่งอีเมลไปที่ ${to} สำเร็จแล้ว ✅</h2>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด: " + err.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
