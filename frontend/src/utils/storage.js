const TOKEN_KEY = 'ar_token'
const USER_KEY = 'ar_user'

const s = (persist) => (persist ? localStorage : sessionStorage)

export const storage = {
  getToken: () => sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY),
  setToken: (t, persist = false) => {
    s(!persist).removeItem(TOKEN_KEY)
    s(persist).setItem(TOKEN_KEY, t)
  },
  removeToken: () => { sessionStorage.removeItem(TOKEN_KEY); localStorage.removeItem(TOKEN_KEY) },
  getUser: () => {
    const u = sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY)
    return u ? JSON.parse(u) : null
  },
  setUser: (u, persist = false) => {
    s(!persist).removeItem(USER_KEY)
    s(persist).setItem(USER_KEY, JSON.stringify(u))
  },
  removeUser: () => { sessionStorage.removeItem(USER_KEY); localStorage.removeItem(USER_KEY) },
  clear: () => [TOKEN_KEY, USER_KEY].forEach((k) => { sessionStorage.removeItem(k); localStorage.removeItem(k) }),
}
