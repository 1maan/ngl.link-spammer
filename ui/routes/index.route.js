import indexController from "../controllers/index.controller.js";
// const router = require("express").Router();
import express from "express";
const router = express.Router();

router.post("/add", indexController.addTarget);
router.get("/toggle", indexController.toggleStatus);
router.get("/", indexController.index);
router.get("/delete", indexController.deleteTarget);

export default router;
