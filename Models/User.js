const PostgresClient = require('../DataBase/PostgresClient');
const { PasswordHash, PasswordHashMatch } = require('../Helpers/Utils/PasswordHash');
const { CustomAPIError } = require('../Errors');
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

	//*authenticate a user with email and password
	async authenticate(email, password) {
		const columns = '*';
		const where = `WHERE email = '${email}'`;
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

	//*update refresh token in the database
	async updateRefreshToken(userID, refreshToken) {
		const columns = `refresh_token = '${refreshToken}'`;
		const where = `WHERE id = ${userID}`;
		await this.#DBClient.updateData(this.#table, columns, where);
	} 
}

module.exports = UserModel;