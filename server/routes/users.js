import express from "express";
import user from "../models/User";
import Auth from "../middlewares/auth";

const userRouter = express.Router();

userRouter.get("/auth", Auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role
  });
});
//------------------------------------------
userRouter.post("/login", (req, res) => {
  //find the email
  user.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "인증실패 이메일을 찾을 수 없습니다."
      });
    //comparePassword
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        });
      }
      //generateToken
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("auth_token", user.token)
          .status(200)
          .json({ loginSuccess: true });
      });
    });
  });
});
//------------------------------------------
userRouter.post("/register", (req, res) => {
  const User = new user(req.body);
  console.log(User);
  User.save((err, userData) => {
    if (err) return res.json({ success: "안되잖아", err });

    return res.status(200).json({ success: true, userData });
  });
});
//------------------------------------------
userRouter.get("/logout", Auth, (req, res) => {
  user.findOneAndUpdate(
    { _id: req.user._id },
    { token: "" },
    (err, userData) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({
        success: true
      });
    }
  );
});

export default userRouter;
