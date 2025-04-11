import { post } from './httpClient'


export const updateCart = (body) => post(`/cart/update`, body)

