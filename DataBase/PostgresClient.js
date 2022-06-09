const { Client } = require('pg');
/* ---- this class is used to instantiate the connection with the PS DBMS ---- */
class PGClient {
	#host = process.env.DB_HOST;
	#port = process.env.DB_PORT;
	#user = process.env.DB_USER;
	#password = process.env.DB_PASS;
	#database = process.env.DB_NAME;
	#client;

	//* connect to the database and return a client object
	constructor() {
		//instantiate the client
		this.#client = new Client({
			user: this.#user,
			password: this.#password,
			host: this.#host,
			port: this.#port,
			database: this.#database
		});

		//?connect to the database and return the client object
		return new Promise(async (resolve, reject) => {
			try {
				await this.#client.connect();
				resolve(this);
			} catch (err) {
				reject(err);
			}
		});
	}
}

module.exports = PGClient;