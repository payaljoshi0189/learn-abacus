
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
	bcrypt.genSalt(10, function(error, salt) {
    bcrypt.hash(newMember.password, salt, function(error, hash) {
        // Store hash in your password DB.
        newMember.password = hash;
        newMember.save(callBack);
    });
});
}

module.exports.getMemberByMemberId = function(memberId, callback){
	var query = {memberId: memberId};
	Member.findOne(query, callback);

}

module.exports.comparePassword = function(insertedPassword, hash, callback){
	// Load hash from your password DB.
bcrypt.compare(insertedPassword, hash, function(error, isMatch) {
	if(error) throw error;
	callback(null, isMatch);
});
}

module.exports.getMemberById = function(id, callback){
	Member.findById(id, callback);

}
