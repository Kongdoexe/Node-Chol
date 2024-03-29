import  mysql from 'mysql';
import express from "express";
import { connect, queryAsync } from "../dbconnect";
export const router = express.Router();

router.post("/", (req, res) => {
  const { email, username, password,image, confirm } = req.body;

  let sql = "SELECT * FROM `users` WHERE email = ?";
  const values = [email]

    connect.query(sql, values, (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error!" });
        return;
      }
      
      if (result == 0) {
        sql = "INSERT INTO `users`(`username`, `password`, `image`,`type`, `email`) VALUES (?,?,?,?,?)";
  
        sql = mysql.format(sql , [
          username,
          password,
          image,
          'user',
          email
        ])
        console.log(sql);

        connect.query(sql , (err, result) => {
          
          if(err) {
            res.status(500).json({ error: "Error!" });
            return; 
          }

          res.json(result);
        })
      } else {
        res.status(500).json("Error")
      }
    });
  } 
);
