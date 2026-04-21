const CONSTANTS = {
	ACCESS_TOKEN: "access_token",
	REFRESH_TOKEN: "refresh_token",
	USER_DATA: "user_data",
	AUTH_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
	REFRESH_INTERVAL_MS: 10 * 60 * 1000, // 10 minutes
} as const;

export default CONSTANTS;
