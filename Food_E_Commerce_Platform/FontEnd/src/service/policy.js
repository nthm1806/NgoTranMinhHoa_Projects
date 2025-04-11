import { post } from './httpClient'


export const getCategoryPolicy = (body) => post(`/policy/get-categories`, body)
export const searchPolicy = (body) => post(`/policy/search-policy`, body)


