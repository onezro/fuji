import Cookies from 'js-cookie'

const TokenKey = 'OPCENTER_ADMIN'
const expirationTime = new Date();
expirationTime.setMonth(expirationTime.getMonth() + 1); 
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token:any) {
  return Cookies.set(TokenKey, token,{ expires: expirationTime })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}