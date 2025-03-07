import { get, patch, post, destroy } from './httpClient'

export const getListCategory = () => get('/Products/Category')