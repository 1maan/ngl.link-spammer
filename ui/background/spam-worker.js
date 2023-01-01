// const fetch = require("node-fetch");
// const questions = require("./questions.js");
// const smoldb = require("@jagamypriera/smoldb");
// const model = require("./model.js");
// const fs = require("fs");
import fetch from "node-fetch";
import questions from "../data/questions.js";
import smoldb from "@jagamypriera/smoldb";
import model from "../data/model.js";
import fs from "fs";

var chars =
  "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const prepareSmol = await smoldb.smoldb({
  path: "./data/log.json",
  model: model,
});
const { smol } = model;

const sendQuestion = async (username, randomQuestion, deviceId) => {
  return await fetch("https://ngl.link/" + username, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language":
        "id-ID,id;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6,pt;q=0.5",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua":
        '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "upgrade-insecure-requests": "1",
      cookie:
        "cf_clearance=cyinoLBgMjFJa3tBoeTCXTIIxpKgtpvegAqSKWQ7fuo-1669396702-0-160",
      Referer: "https://ngl.link/" + username,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `question=${encodeURIComponent(
      randomQuestion
    )}+&deviceId=${deviceId}`,
    method: "POST",
  });
};

const generateId = () => {
  let randomId = "";
  for (var i = 0; i <= 20; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    randomId += chars.substring(randomNumber, randomNumber + 1);
  }
  return randomId;
};

const sleep = async (sleepfor) => {
  return await new Promise((r) => setTimeout(r, sleepfor));
};

const sendQuestionToUser = async (username) => {
  let randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  let randomId = generateId();
  const res = await sendQuestion(username, randomQuestion, randomId);
  if (res.status >= 400) {
    const sleepfor = 60 * 1000;
    console.log("error " + res.status + " " + res.statusText);
    console.log(`sleeping for ${sleepfor / 1000} seconds\n`);

    await sleep(sleepfor);
    return;
  }
  const count = smol.usernames[username] || 0;
  console.log(`(#${count}) Sent(@${username}): ${randomQuestion}`);
  if (smol.usernames[username]) {
    smol.usernames[username] = count + 1;
    return;
  }
  smol.usernames[username] = 1;
};

const getTargets = async () => {
  let targetsJson = fs.readFileSync("./data/targets.json", "utf-8");
  let targets = JSON.parse(targetsJson);
  return targets;
};

const getActiveTargets = async () => {
  let targetsJson = fs.readFileSync("./data/targets.json", "utf-8");
  let targets = JSON.parse(targetsJson);
  return targets.filter((target) => target.active);
};

const getInactiveTargets = async () => {
  let targetsJson = fs.readFileSync("./data/targets.json", "utf-8");
  let targets = JSON.parse(targetsJson);
  return targets.filter((target) => !target.active);
};

async function startSpamming() {
  while (true) {
    const targets = await getTargets();
    const activeTargets = await getActiveTargets();
    // console.log(targets);
    if (targets.length === 0 || activeTargets.length === 0) {
      console.log("no targets");
      await sleep(2000);
      continue;
    }
    // pick one of targets randomly
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    if (!randomTarget.active) continue;
    await sendQuestionToUser(randomTarget.username);
    await sleep(1000);
  }
}

export default startSpamming;
