import express from "express";
import bodyParser from "body-parser";
import { v4 } from "uuid";
import { config } from "dotenv";
import { result } from "./generate_graph/handle.js";
import { getGraph, getIPAddress } from "./generate_graph/function.js";

config();
const app = express();
const uuidv4 = v4;
const sessions = new Map();
const ipAdress = getIPAddress();
const link = `http://${ipAdress}:${process.env.PORT}`;
app.use(bodyParser.json());
app.set('trust proxy', true);

app.use("/generate-graph", (req,res,next) => {
    const clientIP = req.headers.host || req.headers['x-forwarded-for'] || req.ip;
    console.log(`A Request has been sent to the Server (${clientIP})`);
    console.log(req.body);
    next();
})

app.post("/generate-graph",(req,res) => {
    const sessionID = uuidv4();

    const config = req.body;
    const traces = result(config);

    sessions.set(sessionID, {
        traces,
        createAt: new Date()
    });

    res.json({
        link: `${link}/view-graph/${sessionID}`
    });
})

app.get("/view-graph/:sessionID",(req,res) => {
    const sessionID = req.params.sessionID;
    const session = sessions.get(sessionID);

    if (!session) {
        return res.status(404).send("Biểu đồ không thể tìm thấy hoặc đã hết hạn");
    }

    const graph = getGraph(session.traces);
    res.send(graph);
})


// Hàm dọn dẹp session cũ
function cleanupSessions() {
    const now = new Date();
    for (const [sessionID, session] of sessions.entries()) {
      if (now - session.createdAt > 24 * 60 * 60 * 1000) { // 24 giờ
        sessions.delete(sessionID);
      }
    }
  }
  
// Chạy hàm dọn dẹp mỗi giờ
setInterval(cleanupSessions, 60 * 60 * 1000);

app.listen(process.env.PORT,ipAdress,() => {
    console.log(`API is working at ${link}`);
})