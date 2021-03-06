import { User } from './User';
import { Image } from './Image';
import * as Consts from '../util/Consts';

import { JsonObject, JsonProperty } from 'json2typescript';
import { DateConverter } from '../util/DateConverter';
import { Fetch } from '..';

/**
 * Represents a single comment on an image
 *
 * @export
 * @class Comment
 */
@JsonObject
export class Comment {
	/**
	 * The ID of the comment
	 *
	 * @readonly
	 * @type {number}
	 * @memberof Comment
	 */
	@JsonProperty('id', Number)
	public readonly id: number = 0;

	/**
	 * The body of the comment
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Comment
	 */
	@JsonProperty('body', String)
	public readonly body: string = '';

	/**
	 * Has the comment been deleted?
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof Comment
	 */
	@JsonProperty('deleted', Boolean)
	public readonly deleted: boolean = false;

	/**
	 * The date the comment was posted on
	 *
	 * @readonly
	 * @type {Date}
	 * @memberof Comment
	 */
	@JsonProperty('posted_at', DateConverter)
	public readonly posted: Date = Consts.DEFAULT_DATE;

	/**
	 * The name of the user who posted this comment
	 *
	 * Use this instead of (await author()).name to save an HTTP request and make the Derpi admins happy
	 *
	 * @readonly
	 * @type {string}
	 * @memberof Comment
	 */
	@JsonProperty('author', String)
	public readonly authorName: string = '';

	/**
	 * The internal ID of the image this comment was posted on
	 *
	 * @readonly
	 * @private
	 * @type {number}
	 * @memberof Comment
	 */
	@JsonProperty('image_id', Number)
	private readonly _image: number = 0;

	/**
	 * Gets the author of this comment
	 *
	 * @returns {Promise<User>} A Promise wrapping the user that posted this comment
	 * @memberof Comment
	 */
	public async author(): Promise<User> {
		// Part II of the Background Pony saga:
		// comments_home.json does NOT provide me with the user ID of the uploader, just the name
		// Is this a **user** with the name Background Pony #whatever, or is it a real anonymous user??
		// We're just going to assume the latter and hope nobody breaks anything.
		if (this.authorName.match(/Background Pony \#[0-9A-Z]+/)) {
			let user = new User();
			user.name = this.authorName; // TODO: figure out how to do this better so user.name can be readonly
			return user;
		}

		let user = await Fetch.fetchUser(this.authorName);

		return user;
	}

	/**
	 * Gets the image this comment belongs to
	 *
	 * @returns {Promise<Image>} A Promise wrapping the image this comment was posted on
	 * @memberof Comment
	 */
	public async image(): Promise<Image> {
		return Fetch.fetchImage(this._image);
	}
}
