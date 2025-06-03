export interface TokenPair {
	access: string;
	refresh: string;
}

export interface User {
	id: number;
	username: string;
}
export type UserTokenResponse = TokenPair & { user: User };
