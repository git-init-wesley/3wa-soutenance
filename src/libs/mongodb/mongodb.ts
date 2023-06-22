import mongoose from 'mongoose';

mongoose.set({ strictQuery: false });

/**
 * Mongodb class to manage MongoDB connections and operations.
 * @class Mongodb
 */
export default class Mongodb {
	/**
	 * MongoDB's connection string
	 * @protected
	 * @type {string}
	 * @memberOf Mongodb
	 */
	protected readonly _uri: string;

	/**
	 * Name of the MongoDB database
	 * @protected
	 * @type {string}
	 * @memberOf Mongodb
	 */
	protected readonly _dbName: string;

	/**
	 * Creates a new Mongodb instance.
	 * @param uri {@type {string}}- MongoDB connection string
	 * @param dbName {@type {string}}- Name of the MongoDB database
	 * @memberOf Mongodb
	 */
	public constructor(uri: string, dbName: string) {
		this._uri = uri;
		this._dbName = dbName;
	}

	/**
	 * MongoDB client instance
	 * @protected
	 * @type {mongoose.Mongoose | undefined}
	 * @memberOf Mongodb
	 */
	protected _client: mongoose.Mongoose | undefined;

	/**
	 * Returns the MongoDB client instance.
	 * @returns The MongoDB client instance
	 * @return {mongoose.Mongoose | undefined}
	 * @memberOf Mongodb
	 */
	public get client(): mongoose.Mongoose | undefined {
		return this._client;
	}

	/**
	 * Closes the MongoDB connection.
	 * @returns A Promise that resolves when the connection is closed
	 * @return {Promise<void>}
	 * @deprecated Not use, it's disable to gain page speed
	 * @memberOf Mongodb
	 */
	public async close(): Promise<void> {
		//Disable close
		//return await this._client?.disconnect?.()
	}

	/**
	 * Initializes the MongoDB connection and returns the client instance.
	 * @returns The MongoDB client instance
	 * @return {Promise<mongoose.Mongoose>}
	 * @memberOf Mongodb
	 */
	public async init(): Promise<mongoose.Mongoose> {
		this._client = await mongoose.connect(this._uri, { dbName: this._dbName });
		return this._client;
	}
}
