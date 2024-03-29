import express from "express";

import { router as users} from "./api/users";
import { router as login} from "./api/login";
import { router as register} from "./api/register";
import { router as rank} from "./api/rank";
import { router as random} from "./api/random";
import { router as vote} from "./api/vote";
import { router as images} from "./api/image";
import { router as upload } from "./api/uploads";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();


app.use(
  cors({
    origin: "*", //origin: "*" ระบบไหน ก็เรียกได้
  })
);
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/user", users);
// app.use("/login", users);
app.use("/login", login);
app.use("/register", register);
app.use("/rank", rank);
app.use("/random", random);
app.use("/vote", vote);
app.use("/images", images)
 app.use("/uploads", upload);