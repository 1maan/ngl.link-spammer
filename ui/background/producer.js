import Bull from "bull";

console.log("Background long running jobs with Bull...");

const producer = function () {
  const processQueue = new Bull("ngl-link-spam");

  console.log("About to enqueue 2 jobs");

  (async function () {
    const job = await processQueue.add();
  })();
};

export default producer;
