const mongoose = require('mongoose');
const { Schema } = mongoose;

const betauserSchema = Schema({
	name: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true,
		enum: [ 'male', 'female', 'others' ]
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	dob: {
		type: Date,
		required: true
	},
	occupation: {
		type: String,
		required: true,
		enum: [ 'student', 'freelancer', 'professional', 'business-owner', 'home-maker', 'influencer' ]
	}
});

module.exports = mongoose.model('Betauser', betauserSchema);
