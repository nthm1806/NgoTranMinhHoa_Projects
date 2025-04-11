import { post } from './httpClient'


export const getQuestion = (body) => post(`/chat/get-question`, body)

export const getChat = (body) => post(`/chat/get-chat`, body)

export const setChat = (body) => post(`/chat/set-chat`, body)

