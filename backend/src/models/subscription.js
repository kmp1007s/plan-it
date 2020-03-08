const mongoose = require("mongoose");
const { Schema } = mongoose;

const Subscription = new Schema({
  endpoint: String,
  keys: Schema.Types.Mixed,
  createDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Subscription", Subscription);