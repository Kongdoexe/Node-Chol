import express from "express";
import { connect } from "../dbconnect";

export const router = express.Router();

router.get("/", (req, res) => {
    const sql = "SELECT * FROM images ORDER BY score DESC LIMIT 10";
    connect.query(sql, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  });