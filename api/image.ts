import mysql from 'mysql';
import express from "express";
import { connect, queryAsync } from "../dbconnect";

export const router = express.Router();

router.get("/:uid", async (req, res) => {
    const uid = req.params.uid

    let sql = `SELECT 
    users.userid AS id, 
    users.image as images, 
    users.username, 
    images.name, 
    images.imageID, 
    images.score, 
    images.image
    FROM 
        users
    LEFT JOIN 
        images ON images.userid = users.userid 
    WHERE 
    users.userid = ${uid}`
    const result = await queryAsync(sql) as any[];

    if (result.length > 0) {
        const userData = result[0];
        const imageData = result.map(item => ({
            name: item.name,
            imageID: item.imageID,
            score: item.score,
            image: item.image
        }));
        if(result[0].image != null){
            const formatData = {
                userID: userData.id,
                username: userData.username,
                imageUser: userData.images,
                images: imageData
            };
            res.status(200).json(formatData)
        } else {
            const formatData = {
                userID: userData.id,
                username: userData.username,
                imageUser: userData.images,
            };
            res.status(200).json(formatData)
        }
    } else {
        console.log('No data found.');
        res.status(400).json({ error: "Error no Result" })
    }
})

router.get("/get/:imageID", async (req, res) => {
    const imageID = req.params.imageID

    let sql = 'select * from images where imageID = ' + imageID
    const result : any = await queryAsync(sql)
    if(result.length > 0){
        res.status(200).json({ result : result })
    } else {
        res.status(500).json({ error : "Error!" })
    }
})

router.post("/insertImage", async (req , res) => {
    const body = req.body
    let sql = `SELECT * FROM images where userid = ${body.userid}`
    const result1 : any = await queryAsync(sql)

    if(result1.length < 5){
        sql = `INSERT INTO images(image, userid, score, name) VALUES(? , ?, ?, ?)`;
        sql = mysql.format(sql , [body.image , body.userid, 1000, body.name]);
        const result : any = await queryAsync(sql);
        if (result.affectedRows > 0) {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }    
    } else {
        res.status(200).json(false)
    }
})

router.put("/EditImage", async (req, res) => {
    const body = req.body
    const score = 1000;
    let sql = `UPDATE images SET score = ${score}, image = '${body.image}', name = '${body.name}' WHERE imageID = ${body.imageID}`;
        const result : any = await queryAsync(sql)
        if(result.affectedRows > 0){
            sql = `DELETE FROM statistics where imageID = ${body.imageID}`
            await queryAsync(sql)
            sql = `DELETE FROM vote where winnerID = ${body.imageID} or loserID = ${body.imageID}`;
            await queryAsync(sql)
            res.status(200).json(result)
        } else {
            res.json(false)
        }
})

router.delete("/delete/:imageID", async (req, res) => {
    const imageID = req.params.imageID
    let sql = `DELETE FROM images WHERE imageID = ${imageID}`;
    const result : any = await queryAsync(sql)
    if(result.affectedRows > 0){
        res.status(200).json(result)
    } else {
        res.json(false)
    }
})

router.get("/Graph/:uid", async (req, res) => {
    const uid = req.params.uid

    let sql = `SELECT vote.winnerID, vote.scoreWinner, DATE_FORMAT(vote.votedate, '%Y-%m-%d %H:%i:%s') AS date, winner_image.score AS Origin_Score, winner_image.image AS url
                FROM vote
                JOIN images AS winner_image ON vote.winnerID = winner_image.imageID
                WHERE winner_image.userid = ${uid}
                AND vote.votedate IN ( SELECT MAX(votedate)
                        FROM vote AS v
                        WHERE DATE(v.votedate) >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                        AND DATE(v.votedate) < DATE_SUB(CURDATE(), INTERVAL 1 DAY) -- Added missing 'AND'
                        GROUP BY DATE(v.votedate))
                ORDER BY vote.winnerID DESC`;

    try {
        const result = await queryAsync(sql);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
})