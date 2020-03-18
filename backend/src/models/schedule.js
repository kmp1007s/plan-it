const mongoose = require("mongoose");
const { Schema } = mongoose;

const Schedule = new Schema({
  date: String,
  startTime: String,
  finishTime: String,
  schedule: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * UserId로 스케쥴 정보를 가져옴
 */
Schedule.statics.findByUserId = function(userId) {
  return this.find({ userId }).exec();
};

/**
 * 스케줄을 DB에 저장
 */
Schedule.statics.create = function(scheduleInfo) {
  const schedule = new this(scheduleInfo);
  return schedule.save();
};

module.exports = mongoose.model("Schedule", Schedule);
