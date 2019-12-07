import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});
//------------------------------------
userSchema.pre("save", function(next) {
  let user = this;
  console.log("enter2");
  if (user.isModified("password")) {
    console.log("enter1");
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
//------------------------------------
userSchema.methods.comparePassword = function(plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};
//------------------------------------
userSchema.methods.generateToken = function(callback) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secret");
  user.token = token;
  user.save((err, user) => {
    if (err) return callback(err);
    callback(null, user);
  });
};
//------------------------------------
userSchema.statics.findByToken = function(token, callback) {
  let user = this;

  jwt.verify(token, "secret", function(err, decode) {
    user.findOne({ _id: decode, token: token }, function(err, user) {
      if (err) return callback(err);
      callback(null, user);
    });
  });
};
const User = mongoose.model("User", userSchema);

export default User;
