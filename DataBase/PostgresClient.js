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

	//*insert record into a table
	async insertData(table, columns, values) {
		const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
		const result = await this.#client.query(query);
		return result
	}

	//*fetch data from table
	async fetchData(table, columns, where, orderBy, limit) {
		const query = `SELECT ${columns} FROM ${table} ${where} ${orderBy} ${limit}`;
		const result = await this.#client.query(query);
		return result
	}

	//*update a record in a table
	async updateData(table, columns, where) {
		const query = `UPDATE ${table} SET ${columns} ${where}`;
		const result = await this.#client.query(query);
		return result
	}
}

module.exports = PGClient;