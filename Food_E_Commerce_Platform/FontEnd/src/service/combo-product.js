import {  post } from './httpClient'


export const setComboProduct = (param) => post(`/combo-product/set-combo-product`, param)
export const getComboProduct = (param) => post(`/combo-product/get-combo-product`, param)


