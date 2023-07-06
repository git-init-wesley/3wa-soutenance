/**
 * Format a SIRET number to a French format.
 * @param str {@type {string | undefined}} The SIRET number to format.
 * @returns The formatted SIRET number.
 * @return {string | undefined}
 */
export function siret_format(str?: string): string | undefined {
	if (!str || str.replaceAll(' ', '').length !== 14) return str;
	const _str = str.replaceAll(' ', '');
	return `${_str.slice(0, 3)} ${_str.slice(3, 6)} ${_str.slice(6, 9)} ${_str.slice(9, 12)} ${_str.slice(12)}`;
}

/**
 * Format a SIREN number to a French format.
 * @param str {@type {string | undefined}} The SIREN number to format.
 * @returns The formatted SIREN number.
 * @return {string | undefined}
 */
export function siren_format(str?: string): string | undefined {
	if (!str || str.replaceAll(' ', '').length !== 9) return str;
	const _str = str.replaceAll(' ', '');
	return `${_str.slice(0, 3)} ${_str.slice(3, 6)} ${_str.slice(6)}`;
}

/**
 * Format a date string to a 'DD/MM/YYYY' format.
 * @param str {@type {string | undefined}} The date string to format.
 * @returns The formatted date string.
 * @return {string | undefined}
 */
export function date_format(str?: string): string | undefined {
	if (!str || str.replace(/[-/]/g, '').length !== 8) return str;
	const _str = str.replace(/[-/]/g, '');
	return `${_str.slice(0, 2)}/${_str.slice(2, 4)}/${_str.slice(4)}`;
}

/**
 * Format a phone number string to a "XX XX XX XX XX" format.
 * @param str {@type {string | undefined}} The phone number string to format.
 * @returns The formatted phone number string.
 * @return {string | undefined}
 */
export function phone_format(str?: string): string | undefined {
	if (!str) return str;
	const cleanStr = str.replaceAll(' ', '');
	if (cleanStr.length % 2 === 0) {
		const chunks = [];
		for (let i = 0; i < cleanStr.length; i += 2) {
			const chunk = cleanStr.slice(i, i + 2);
			chunks.push(chunk);
		}
		return chunks.join(' ');
	}
	return str;
}

/**
 * Generate a version 4 UUID.
 * @returns A version 4 UUID.
 */
export function uuid_e4(): string {
	const h = '0123456789abcdef';
	let u = '';
	for (let i = 0; i < 36; i++) {
		const c = i === 8 || i === 13 || i === 18 || i === 23 ? '-' : i === 14 ? '4' : 'x';
		u += c === '-' || c === '4' ? c : h[Math.floor(Math.random() * 16)];
	}
	return u;
}

/**
 * Converts an ArrayBuffer to a base64-encoded string.
 * @param {ArrayBuffer} buffer - The ArrayBuffer to convert.
 * @returns {string} The base64-encoded string.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer) {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
	// noinspection JSDeprecatedSymbols
	return btoa(binary);
}


export const RegexMail: RegExp = RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/);
export const RegexPassword: RegExp = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&]).{8,32}$');
export const RegexUsername: RegExp = RegExp('^([a-zA-Z_.0-9]){3,16}$');
export const RegexTo_09: RegExp = RegExp('(?=[0-9])');
export const RegexTo_az: RegExp = RegExp('(?=[a-z])');
export const RegexTo_AZ: RegExp = RegExp('(?=[A-Z])');
export const RegexTo_aZ: RegExp = RegExp('(?=[a-zA-Z])');
export const RegexSpecialCharacters: RegExp = RegExp('(?=[@$!%*#?&])');
export const RegexTo_3_16: RegExp = RegExp('^.{3,16}$');
export const RegexTo_8_32: RegExp = RegExp('^.{8,32}$');
