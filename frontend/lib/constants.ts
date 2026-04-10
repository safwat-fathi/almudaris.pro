const CONSTANTS = {
	ACCESS_TOKEN: "access_token",
	REFRESH_TOKEN: "refresh_token",
	USER_DATA: "user_data",
	AUTH_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
} as const;

export default CONSTANTS;
