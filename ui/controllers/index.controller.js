import fs from "fs";

export default {
  index: async (req, res) => {
    let targetsJson = fs.readFileSync("./data/targets.json", "utf-8");
    let logJson = fs.readFileSync("./data/log.json", "utf-8");
    let targets = JSON.parse(targetsJson);
    let log = JSON.parse(logJson);
    for (let target of targets) {
      target["count"] = log.usernames[target["username"]] || 0;
    }
    // sort target based on active status
    targets.sort((a, b) => {
      if (a.active === b.active) return 0;
      if (a.active) return -1;
      return 1;
    });
    return res.render("index", { targets });
  },

  addTarget: async (req, res) => {
    const { username } = req.body;
    if (username === "") return res.redirect("/");
    let targetsJson = fs.readFileSync("./data/targets.json", "utf-8");
    let targets = JSON.parse(targetsJson);
    for (let target of targets) {
      if (target.username === username) return false;
    }

    targets.push({ username: username, active: true });
    targetsJson = JSON.stringify(targets);
    fs.writeFileSync("./data/targets.json", targetsJson, "utf-8");
    return res.redirect("/");
  },

  toggleStatus: async (req, res) => {
    const { username } = req.query;
    if (username === "") return res.redirect("/");
    let targetsJson = fs.readFileSync("./data/targets.json", "utf-8");
    let targets = JSON.parse(targetsJson);
    for (let target of targets) {
      if (target.username === username) {
        target.active = !target.active;
      }
    }

    targetsJson = JSON.stringify(targets);
    fs.writeFileSync("./data/targets.json", targetsJson, "utf-8");
    return res.redirect("/");
  },

  deleteTarget: async (req, res) => {
    const { username } = req.query;
    if (username === "") return res.redirect("/");
    let targetsJson = fs.readFileSync("./data/targets.json", "utf-8");
    let targets = JSON.parse(targetsJson);
    for (let target of targets) {
      if (target.username === username) {
        targets.splice(targets.indexOf(target), 1);
      }
    }

    targetsJson = JSON.stringify(targets);
    fs.writeFileSync("./data/targets.json", targetsJson, "utf-8");
    return res.redirect("/");
  },
};
