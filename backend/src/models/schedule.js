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

Schedule.statics.findByUserId = function(userId) {
  return this.find({ userId }).exec();
};

Schedule.statics.create = function(scheduleInfo) {
  const schedule = new this(scheduleInfo);
  return schedule.save();
};

module.exports = mongoose.model("Schedule", Schedule);
