export interface LoginParams {
	email: string
	password: string
}

export interface Login {
	getToken: (params: LoginParams) => Promise<string>
}
