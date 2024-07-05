import Cookies from "js-cookie"

export const SetAccessTokenCookie = (token) => Cookies.set('access-token', token)
export const SetRefreshTokenCookie = (token) => Cookies.set('refresh-token', token)
export const SetRegistrationTokenCookie = (token) => Cookies.set('registration-token', token)

export const GetAccessTokenCookie = () => Cookies.get('access-token')
export const GetRefreshTokenCookie = () => Cookies.get('refresh-token')
export const GetRegistrationTokenCookie = () => Cookies.get('registration-token')

export const RemoveAccessTokenCookie = () => Cookies.remove('access-token')
export const RemoveRefreshTokenCookie = () => Cookies.remove('refresh-token')
export const RemoveRegistrationTokenCookie = () => Cookies.remove('registration-token')
