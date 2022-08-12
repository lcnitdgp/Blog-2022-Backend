var mongoose = require('mongoose');
var Schema = mongoose.Schema;
;

var messageSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
message:{
    type: String
}
},
{ timestamps: true }
);
messageSchema.plugin(passportLocalMongoose);
const Message = mongoose.model('message', messageSchema);
module.exports = Message;