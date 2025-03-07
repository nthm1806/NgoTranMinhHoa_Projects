import { get, patch, post, destroy } from './httpClient'

export const getReviewProduct = (param) => post(`/Review/review/detail`, param)

export const addReviewProduct = (param) => post(`/Review/review`, param)

