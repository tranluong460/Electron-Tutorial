import axios from 'axios'
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { localUser } from '../../db/entity'
import { MASP } from '../../helper'
import { getAccountProfilePath } from '../../helper/browser'
import { gologinNew } from '../../http'
import { generateUTC, getUnitRes } from '../../utils'

export const addCookieProfile = (pathProfile: string, cookie: string): void => {
	try {
		const keyValueList = cookie.split(';')
		keyValueList.forEach((keyValue) => {
			if (keyValue && keyValue.includes('=')) {
				const date = new Date()
				const db = new Database(pathProfile, { verbose: console.log })
				const utcRandom = generateUTC(date, 0)
				const stmt = db.prepare(
					'INSERT INTO cookies(creation_utc,host_key,top_frame_site_key,name,value,encrypted_value,path,expires_utc' +
						',is_secure,is_httponly,last_access_utc,has_expires,is_persistent,priority,samesite,source_scheme,source_port,is_same_party,last_update_utc) ' +
						"VALUES (@creation_utc,@host_key,'',@name,@value,@value,'/',@expires_utc,1,1,@last_access_utc,1,1,1,1,2,443,0,@last_update_utc);"
				)
				stmt.run({
					creation_utc: utcRandom, // creation_utc
					host_key: '.id.zalo.me', // host_key
					name: keyValue.split('=')[0].trim(), // name
					value: keyValue.split('=')[1].trim(), // value
					expires_utc: generateUTC(date, 12), // expires_utc
					last_access_utc: utcRandom, // last_access_utc
					last_update_utc: utcRandom // last_update_utc
				})
			}
		})
	} catch (e) {
		// console.log('🚀 ~ file: profile.ts:42 ~ addCookieProfile ~ e:', e)
	}
}

export const getIPInfo = async (ipAddress?: string): Promise<Record<string, string> | null> => {
	let url = `http://ip-api.com/json`
	if (ipAddress) {
		url = `http://ip-api.com/json/${ipAddress}`
	}
	const response = await axios.get(url)
	if (response.status === 200) {
		const ipInfo: Record<string, string> = {
			latitude: response.data.lat,
			longitude: response.data.lon,
			timezone: response.data.timezone,
			query: response.data.query
		}
		return ipInfo
	}
	return null
}

/**
 * deleteProfile
 * @param tmpdir
 * @param nameProfile
 */
export const deleteProfile = async (tmpdir: string, identifier: string): Promise<boolean> => {
	try {
		const profilePath = getAccountProfilePath(tmpdir, identifier)
		if (fs.existsSync(profilePath)) {
			fs.rmSync(profilePath, { recursive: true })
			return true
		}
	} catch {
		// false
	}
	return false
}

/**
 * create profile from config
 * @param tmpdir: directory include profiles
 * @param options: option create profile
 */
export const createProfile = async (tmpdir: string, options: IOptionProfile): Promise<boolean> => {
	const profilePath = getAccountProfilePath(tmpdir, options.id.toString())
	const prefFileName = path.join(profilePath, 'Default', 'Preferences')
	if (fs.existsSync(profilePath)) {
		return true
	}
	// get ip info: timezone, ip address ...
	const ipInfo = await getIPInfo()
	const [x, y] = getUnitRes()

	const postData = {
		name: options.name,
		latitude: ipInfo!.latitude ?? 0,
		longitude: ipInfo!.longitude ?? 0,
		timezone: ipInfo!.timezone ?? '0',
		ip: ipInfo!.query ?? '0',
		platform: options.platform,
		//proxy:{"username": "", "password": ""}
		res: `${x}x${y}`
	}
	const user = await localUser()
	const aitPreferences = await gologinNew(postData, user.apiToken!)

	if (aitPreferences) {
		fs.mkdirSync(profilePath, { recursive: true })
		fs.mkdirSync(`${profilePath}\\Default`)
		fs.mkdirSync(`${profilePath}\\Default\\Network`)
		fs.writeFileSync(prefFileName, JSON.stringify(aitPreferences))

		if (options.cookie && options.browserDir) {
			const cookiesFile = `${options.browserDir}\\data\\Cookies`
			if (fs.existsSync(cookiesFile)) {
				const pathCookie = path.join(profilePath, 'Default', 'Network', 'Cookies')
				fs.copyFileSync(cookiesFile, pathCookie)
				addCookieProfile(pathCookie, options.cookie)
			}
		}
		return true
	}

	return false
}

export const createProfileWithOptions = async (
	uid: string,
	profileDir: string,
	browserDir: string
): Promise<boolean> => {
	const options: IOptionProfile = {
		id: uid,
		name: `${MASP}${uid}`,
		platform: process.platform,
		browserDir: browserDir,
		mobile: 'android' === process.platform ? true : false
	}
	return await createProfile(profileDir, options)
}
