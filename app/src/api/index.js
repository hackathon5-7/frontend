import axios from 'axios'
import { AuthorizationTokenType } from '../Constants'
import { GetAccessTokenCookie } from '../storage/CookiesService'

export const POST = 'POST'
export const GET = 'GET'
export const DELETE = 'DELETE'
export const PATCH = 'PATCH'

const _Request = {
    send: async ({ method, url, params = {}, data = {}, useToken = true, validStatuses = [200, 201] }) => {
        try {
            url = _Request.getFullUrl(url, params)

            const response = await axios({
                method: method,
                url: url,
                data: method !== GET ? data : undefined,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: useToken
                        ? `${AuthorizationTokenType} ${GetAccessTokenCookie()}`
                        : '',
                },
                validateStatus: status => validStatuses.includes(status) // Проверяем, включен ли статус в список допустимых
            })

            return response
        } catch (error) {
            console.error('Произошла неизвестная ошибка:', error)
        }
    },

    paramsToString: (params) => {
        return new URLSearchParams(params).toString()
    },

    getFullUrl: (url, params) => {
        params = _Request.paramsToString(params)
        return url + `?${params}`
    },
}

export const Request = _Request