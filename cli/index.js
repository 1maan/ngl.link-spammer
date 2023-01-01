// import fetch
import fetch from "node-fetch";
import questions from "./questions.js";
import { smoldb } from "@jagamypriera/smoldb";
import model from "./model.js";
import fs from "fs";

var chars =
  "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const prepareSmol = await smoldb({ path: "log.json", model: model });
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

const initTargets = async () => {
  const targets = [];
  const targetsJson = JSON.stringify(targets);
  fs.writeFileSync("targets.json", targetsJson, "utf-8");
};

const addTarget = async (username) => {
  let targetsJson = fs.readFileSync("targets.json", "utf-8");
  let targets = JSON.parse(targetsJson);
  for (let target of targets) {
    if (target.username === username) return false;
  }

  targets.push({ username: username, active: true });
  targetsJson = JSON.stringify(targets);
  fs.writeFileSync("targets.json", targetsJson, "utf-8");
  return true;
};

const setTarget = async (username, active) => {
  let targetsJson = fs.readFileSync("targets.json", "utf-8");
  let targets = JSON.parse(targetsJson);
  for (let target of targets) {
    if (target.username === username) {
      target.active = active;
      targetsJson = JSON.stringify(targets);
      fs.writeFileSync("targets.json", targetsJson, "utf-8");
      return true;
    }
  }
  return false;
};

const setTargetInactive = async (username) => {
  return await setTarget(username, false);
};

const setTargetActive = async (username) => {
  return await setTarget(username, true);
};

const removeTarget = async (username) => {
  let targetsJson = fs.readFileSync("targets.json", "utf-8");
  let targets = JSON.parse(targetsJson);
  for (let i = 0; i < targets.length; i++) {
    if (targets[i].username === username) {
      targets.splice(i, 1);
      targetsJson = JSON.stringify(targets);
      fs.writeFileSync("targets.json", targetsJson, "utf-8");
      return true;
    }
  }
  return false;
};

const getTargets = async () => {
  let targetsJson = fs.readFileSync("targets.json", "utf-8");
  let targets = JSON.parse(targetsJson);
  return targets;
};

async function startSpamming() {
  console.log("Spammer started");
  while (true) {
    const targets = await getTargets();
    if (targets.length === 0) {
      console.log("no targets");
      await sleep(2000);
      continue;
    }
    for (let username of targets) {
      if (!username.active) continue;
      await sendQuestionToUser(username.username);
      await sleep(1000);
    }
  }
}

await startSpamming();
