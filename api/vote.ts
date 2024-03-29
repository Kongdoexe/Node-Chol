import express from "express";
import { connect } from "../dbconnect";

export const router = express.Router();

router.post("/voteimage/elo", (req , res)=>{
  const id_image1 = req.body.id_image1;
  const id_image2 = req.body.id_image2;
  const point1 = req.body.point1;
  const point2 = req.body.point2;

  let ra: number, rb: number;
  connect.query(
    "SELECT * FROM image WHERE id_image = ?"
    [id_image1],
    (error, results1)=>{
      if(error){
        return res.status(500).json({error : "An error Whle fetching imag1"})
      }
      ra = results1[0].soreimage;
      connect.query(
        "SELECT * FROM image WHERE id_image = ?"
        [id_image2],
        (error , results2)=>{
          if(error){
            return res.status(500).json({error: "iamgw2"});
        }
        else{
          rb = results2[0].scoreimage;

          const ea = 1 / (1 + Math.pow(10, (rb-ra) /400 ));
          const eb = 1 / (1 + Math.pow(10, (ra-rb) /400 ));
        console.log("ea=" + ea);
        console.log("eb=" + eb);
        const rpa:number = ra +32 * (point1 - ea ); 
        const rpb:number = rb+32 * (point2 - ea );
        console.log("rpa=" + rpa);
        console.log("rpb=" + rpb);

        const currentDate = new Date();
          const day = currentDate.getDate();
          const month = currentDate.getMonth(); + 1;
          const year = currentDate.getFullYear();
          const formattedDate = `${year}-${month}-${day}`;
          console.log(formattedDate);
          connect.query("SELECT day FROM vote WHERE day = ? AND id_image = ?",[formattedDate, results1[0].imageID],(error, results3)=>{
            if(error){
              return res.status(500).json({error : "An Err IMAGE 1"});
            }else{
              if(results3.length == 0){
                const sql ="INSERT INTO `vote` (`id_image`,`score_day`, `day`) VALUES (?,?)";
                connect.query(sql,[id_image1, rpa ,formattedDate],
                  (err , result)=>{
                      if(err){
                        console.error("Error iner user", err);
                        return res.status(500).json({error : "Erorr Uer"});
                      }
                });
              }else{
                const sql = "UPDATE `vote` SET `score_day` = ? WHERE `id_image`=?";
                connect.query(sql,[rpa, id_image1],(err, results)=>{
                  if(err){
                    console.error("ERROR",err);
                    res.status(500).json({error : "Error inserting user"});
                  }
                  else{
                    const sql ="UPDATE `image` SET `score_image`=? WHERE `id_image`=?";
                    connect.query(sql, [rpa , id_image1], (err, results)=>{
                      if(err){
                        console.error("Error",err);
                        return res.status(500).json({error: "Error User"});
                      }
                    });
                  }
                });
              }

              
              connect.query("SELECT day FROM vote WHERE day = ? AND image_ref = ?",[formattedDate, results2[0].imageID],(error, results4)=>{
                if (error){
                  return res.status(500).json({error: "AN Err iamg1"});
                }else{
                  if(results4.length == 0){
                    const sql = "INSERT INTO `vote` (`image_ref`,`score`,` day`) VALUES (?,?,?)";
                    connect.query(sql,[id_image2, rpb, formattedDate],
                      (error, result)=>{
                        if(error){
                          console.error("Errir inser user:",error);
                          return res.status(500).json({error: "Error Inser User"});
                        }
                      });
                  }
                  else{
                    const sql = "UPDATE `image` SET `image_score`=? WHERE `imageid` = ?"
                    connect.query(sql,[rpb, id_image2],(err, results)=>{
                      if(err){
                        console.error("Error user:", err);
                        res.status(500).json({errr: "Error user"});
                      }else{
                        const sql ="UPDATE `image` SET `score` = ? WHERE `image_ref`=?";
                        connect.query(sql,[rpb, id_image2], (err ,result)=>{
                          if(err){
                            console.error("Error user",err);
                            return res.status(500).json({error : "Error User"});
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          });
          }
        });
    }
  )
});

  