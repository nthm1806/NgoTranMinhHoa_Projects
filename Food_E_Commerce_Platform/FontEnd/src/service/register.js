import { get, patch, post, destroy } from './httpClient'

export const register = (param) => post("/register", param);