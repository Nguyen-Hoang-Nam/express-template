import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (_req, _res, _next) => {
  _res.json({ title: "Hello world" });
});

export default router;
