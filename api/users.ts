import express from "express";
import { connect, queryAsync } from "../dbconnect";
import { error } from "console";
import mysql from 'mysql';
export const router = express.Router();

router.get("/:id", (req, res) => {
  const id = req.params.id;
  connect.query("select * from users where userid = ?",
    [id], (err, result) => {
      if (err) {
        res.json(err);
      }
      else {
        res.json(result);
      }
    });
});

router.put("/UpdataPass/:id", async (req, res) => {
  const body = req.body
  const id = req.params.id
  let sql = `UPDATE users SET password = ${body.Npass} where userid = ${id}`;
  const result = await queryAsync(sql);
  res.status(200).json(result)
})

router.put("/UpdataData/:id", async (req, res) => {
  const body = req.body
  const id = req.params.id
  let sql = `UPDATE users SET image = '${body.image}' , username = '${body.name}' where userid = ${id}`;
  const result = await queryAsync(sql)
  res.status(200).json(result)
})



