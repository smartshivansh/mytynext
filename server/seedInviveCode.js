// Run this file when all existing codes have been allocated!

const mongoose = require('mongoose');
const config = require('config');
const InviteCode = require('./models/InviteCode');

mongoose.connect(config.get('mongoURI'), {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database Connected');
});

generate = () => {
	let alphabets = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
	let first = alphabets[Math.floor(Math.random() * alphabets.length)];
	let second = Math.floor(Math.random() * 10);
	let third = Math.floor(Math.random() * 10);
	let fourth = alphabets[Math.floor(Math.random() * alphabets.length)];
	let fifth = alphabets[Math.floor(Math.random() * alphabets.length)];
	let sixth = Math.floor(Math.random() * 10);
	const captcha =
		first.toString() +
		second.toString() +
		third.toString() +
		fourth.toString() +
		fifth.toString() +
		sixth.toString();
	return captcha;
};

const baseDB = async () => {
	try {
		for (let i = 0; i < 200; i++) {
			let c = generate();
			const newcode = new InviteCode({ code: c, status: 'not allocated' });
			await newcode.save();
		}
	} catch (err) {
		console.log('Try again!');
	}
	// const data = await InviteCode.find({ status: 'not allocated' });
	// const codes = data.map((e) => e.code);
	// for (let i = 0; i < 200; i++) {
	// 	console.log(codes[i]);
	// }
};

baseDB().then(() => {
	mongoose.connection.close();
});
