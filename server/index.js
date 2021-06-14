const express = require("express");
const app = express();

const fs = require("fs");
app.get("/", (req, res) => {
  //Range - From where video should Start
  const range = req.headers.range;
  const videoPath = "exercise.mp4";
  const videoSize = fs.statSync(videoPath).size;

  //Splitting in 1mb
  const chunkSize = 1 * 1e6;
  //Changing it to number
  const start = Number(range.replace(/\D/g, ""));
  console.log(start);
  const end = Math.min(start + chunkSize, videoSize - 1);
  console.log(end);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);

  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
});

app.listen(4000);
