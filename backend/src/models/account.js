const mongoose = require("mongoose");
const { Schema } = mongoose;
const crypto = require("crypto");
const Token = require("lib/token");

/**
 * 비밀번호를 HMAC SHA256 방식으로 해싱
 * @param {String} pwd
 */
function hash(pwd) {
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(pwd)
    .digest("hex");
}

const Account = new Schema({
  userId: String,
  pwd: String,
  createdAt: { type: Date, default: Date.now }
});

/**
 * userId로 계정 정보 찾기
 */
Account.statics.findByUserId = function(userId) {
  return this.findOne({ userId }).exec();
};

/**
 * 회원가입
 */
Account.statics.register = function({ userId, pwd }) {
  const account = new this({
    userId,
    pwd: hash(pwd)
  });

  return account.save();
};

/**
 * 인자로 전달받은 pwd의 해시값과 데이터에 담겨있는 해시값 비교
 */
Account.methods.validatePassword = function(pwd) {
  const hashed = hash(pwd);
  return this.pwd === hashed;
};

/**
 * 계정정보로 토큰 생성
 */
Account.methods.generateToken = function(subscription) {
  const payload = {
    _id: this._id,
    userId: this.userId,
    subscription
  };

  return Token.generateToken(payload);
};

module.exports = mongoose.model("Account", Account);
