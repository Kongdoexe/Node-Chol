import  mysql from 'mysql';
import express from "express";
import { connect, queryAsync } from "../dbconnect";
export const router = express.Router();

router.post("/", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  const sql = "SELECT * FROM `users` WHERE `email` = ? AND `password` = ?";
  const values = [email, password];

  connect.query(sql, values, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error!" });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: "Invalid userid or password!" });
      return;
    }

    // User login successful
    const user = results[0];
    res.status(200).json({
      id: user.userid,
      email: user.email,
      type: user.type,
      username: user.username,
      // และข้อมูลอื่น ๆ ที่ต้องการแสดง
    });
  });
});



