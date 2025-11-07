const mongoose = require("mongoose")

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body:{type:String,required:true},
  start_date: { type: String, required: true},
  end_date: { type: String,required:true}
});

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion; 