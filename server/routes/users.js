import express from "express";
import user from "../models/User";
const userRouter = express.Router();

userRouter.get("/auth");
userRouter.get("/login");
userRouter.post("/register", (req, res) => {
  const User = new user(req.body);

  User.save((err, userData) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({ success: true, userData });
  });
});
userRouter.get("/logout");

export default userRouter;
