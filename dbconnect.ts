import mysql from "mysql";
import util from "util";
export const connect = mysql.createPool({
  connectionLimit: 10,
  host: "202.28.34.197",
  user: "web66_6501212020",
  password: "6501212020@csmsu",
  database: "web66_6501212020",
});

export const queryAsync = util.promisify(connect.query).bind(connect);