
//Code Reference: Online tutorial by Traversy Media:
//Link: https://github.com/bradtraversy/loginapp
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var MemberSchema = mongoose.Schema({
	memberId: {
		type : String,
		index: true
	},
	firstName:{
		type : String,
		default: null
	},
	lastName: {
		type : String,
		default: null
	},
	password: {
		type: String
	},
	email: {
		type: String
	}

});

var Member = module.exports = mongoose.model('Member', MemberSchema);

module.exports.createMember = function(newMember, callBack){

	//Code Reference: https://www.npmjs.com/package/bcryptjs (Usage Async)
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newMember.password, salt, function(err, hash) {
        // Store hash in your password DB.
        newMember.password = hash;
        newMember.save(callBack);
    });
});
}
