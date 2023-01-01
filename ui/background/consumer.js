// const Bull = require('bull');
// const spamWorker = require("./spam-worker");
import spamWorker from "./spam-worker.js";
import Bull from "bull";

const consumer = async function() {
  const imageProcessingQueue = new Bull('ngl-link-spam');
  console.log("Consumer started");

  imageProcessingQueue.process(async function(job) {
    console.log("job.id", job.id);

    await spamWorker()

    if (job.id % 1 === 0) {
      throw new Error("job failed")
    }

    return {result: "OK"};
  });
};

consumer()
