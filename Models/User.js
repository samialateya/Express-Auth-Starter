const PostgresClient = require('../Database/PostgresClient');
const { PasswordHash, PasswordHashMatch } = require('../Helpers/Utils/PasswordHash');
const { CustomAPIError } = require('../Errors');
const jwt = require('jsonwebtoken');

class UserModel {
	#table = 'users';
	#fillable = ['email','name','password','is_admin'];
	#defaultAvatarLink = '/profile/default.svg';
	#DBClient;
	//?connect to the database and return the postgres db client object
	constructor() {
		return new Promise(async (resolve, reject) => {
			try {
				this.#DBClient = await (new PostgresClient());
				//return current object after waiting for the db client to connect
				resolve(this);
			}
			catch (err) {
				reject(err);
			}
		});
	}

	//*create a new user
	async create(user) {
		//?hash the password
		user.password = await PasswordHash(user.password);
		try {
			const columns = this.#fillable.join(',');
			const values = `'${user.email}' , '${user.name}' , '${user.password}' , false`;
			const result = await this.#DBClient.insertData(this.#table, columns, values);
			return result;
		}
		catch (err) {
			throw err;
		}
	}

	//*update user data
	async update(userID, values) {
		//convert task object to string key = value,
		//and separate each key/value pair with a comma
		//values sample: {name: 'John', email: 'john@email.com'}
		const columns = Object.keys(values).map(key => `${key} = '${values[key]}'`).join(',');

		const where = `WHERE id = ${userID}`;
		await this.#DBClient.updateData(this.#table, columns, where);
	}

	//*authenticate a user with email and password
	async authenticate(email, password) {
		const columns = '*';
		const where = `WHERE email = '${email}' AND is_admin = false`;
		const user = await this.#DBClient.fetchData(this.#table, columns, where, '', 'LIMIT 1');
		//?if no user found throw an error
		if (user.rows.length === 0) throw new CustomAPIError('Invalid Credentials', 401);
		const userData = user.rows[0];
		//?compare the password hash with the one in the database throw error if not matched
		const passwordMatch = await PasswordHashMatch(password, userData.password);
		if (!passwordMatch) throw new CustomAPIError('Invalid Credentials', 401);
		//?check if user is blocked
		if (!userData.is_active) throw new CustomAPIError('User is blocked', 401);
		//?append default avatar link if the user dose not have one
		if (!userData.avatar_link) userData.avatar_link = this.#defaultAvatarLink;
		//*return user data
		return userData;
	}

	//*find user data by key
	async findUser(key, value) {
		const columns = '*';
		const where = `WHERE ${key} = '${value}'`;
		const user = await this.#DBClient.fetchData(this.#table, columns, where, '', 'LIMIT 1');
		const userData = user.rows[0];
		//?append default avatar link if the user dose not have one
		if (!userData.avatar_link) userData.avatar_link = this.#defaultAvatarLink;
		return userData;
	}

	//*verify user email
	async verifyEmail(token) {
		const user = await this.findUser('verification_token', token);
		//!doesn't matter the type of the error it will be caught in the controller and send the 403 page
		if (!user) throw "token not found";
		//?verify the token to make sure it is not expired
		try{
			await jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
			//remove the token and update verified at to current time
			await this.update(user.id, { verification_token : '', email_verified_at : 'now()' });
		}
		catch(err){
			throw "token expired";
		}
	}

	//*update password
	async updatePassword(token, password) {
		//?verify the token to make sure it is not expired
		const user = await this.findUser('reset_password_token', token);
		if (!user) throw "token not found";
		try {
			await jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
			//hash the password
			password = await PasswordHash(password);
			//remove the token and update verified at to current time
			await this.update(user.id, { reset_password_token: '', password: password });
		}
		catch (err) {
			throw "token expired";
		}
	}
}

module.exports = UserModel;