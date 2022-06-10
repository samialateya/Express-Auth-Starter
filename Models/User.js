const PostgresClient = require('../DataBase/PostgresClient');
const { PasswordHash } = require('../Helpers/Utils');
class UserModel {
	#table = 'users';
	#fillable = ['email','name','password','is_admin'];
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
}

module.exports = UserModel;