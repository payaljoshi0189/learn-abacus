// Copyright (c) 2018 Payal P Joshi
//[This program is licensed under the "MIT License"]
// Please see the file LICENSE in the source
// distribution of this software for license terms.



/*  Code reference for Login and Register Functionality:
    1. Passportjs official documentation: http://www.passportjs.org/docs/
    2. bcryptjs official documentation: https://www.npmjs.com/package/bcryptjs
    3. Video Tutorials by Traversy Media at https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA
    4. https://github.com/bradtraversy/loginapp
 */

 //This is a model class for mongoose's member collection.
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

	//Code Reference: bcryptjs official documentation https://www.npmjs.com/package/bcryptjs (Usage Async)
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
