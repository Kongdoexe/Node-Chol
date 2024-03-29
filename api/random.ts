import  mysql  from 'mysql';
import { queryAsync } from './../dbconnect';
import express from "express";
import { connect } from "../dbconnect";
import { insertVote } from "../model/Project";

export const router = express.Router();

router.get('/', (req, res) => {
  connect.query('SELECT * FROM images ORDER BY RAND() LIMIT 1', (error, results, fields) => {
      if (error) {
          return res.status(500).json({ error: 'An error occurred while fetching the random image' });
      }

      const pic1 = results[0];

      connect.query("SELECT * FROM images WHERE imageID != ? ORDER BY RAND() LIMIT 1", [pic1.imageID], (error, results, fields) => {
          if (error) {
              return res.status(500).json({ error: 'An error occurred while fetching the random image' });
          }

          const pic2 = results[0];
          return res.json({ pic1, pic2 });
      });
  });
});

router.post('/InsertVote',async (req, res) => {
    const body: insertVote = req.body
    console.log(body);
    
    let sqlwinner , sqlloser

    sqlwinner = `SELECT * FROM images where imageID = ${body.winnerID}`
    sqlloser = `SELECT * FROM images where imageID = ${body.loserID}`

    try {
        const resultwinner: any = await queryAsync(sqlwinner);
        const resultloser: any = await queryAsync(sqlloser);

        const body = {
            winner : resultwinner[0],
            loser : resultloser[0]
        }

        if(resultwinner.length > 0 && resultloser.length > 0){
            let k = 32;
            const expectedWin = 1 / (1 + Math.pow(10, (body.winner.score - body.loser.score) / 400));
            const expectedLose = 1 / (1 + Math.pow(10, (body.loser.score - body.winner.score) / 400));

            const newWinnerRating = body.winner.score + k * (1 - expectedWin);
            const newLoserRating = body.loser.score + k * (0 - expectedLose);

            const newScore = {
                k : k,
                winnerID : resultwinner[0].imageID,
                LoserID : resultloser[0].imageID,
                OriginScoreWin : resultwinner[0].score,
                OriginScoreLose : resultloser[0].score,
                expectedWin: expectedWin,
                expectedLose: expectedLose,
                newWinnerRating: newWinnerRating,
                newLoserRating: newLoserRating
            }

            let sql = `INSERT INTO vote(winnerID, loserID, votedate) VALUES (?, ?, ?)`;
            sql = mysql.format(sql , [body.winner.imageID , body.loser.imageID , new Date()])
            await queryAsync(sql);

            sql = `UPDATE images SET score = ${newWinnerRating} where imageID = ${body.winner.imageID}`
            await queryAsync(sql)

            sql = `UPDATE images SET score = ${newLoserRating} where imageID = ${body.loser.imageID}`;
            await queryAsync(sql)

            res.json(newScore);
        }
    } catch (error) {
        res.status(404).json({ error : "ERROR!" })
    }
})