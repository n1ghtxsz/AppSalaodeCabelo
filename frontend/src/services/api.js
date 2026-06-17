const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

let _token = null

export function setAccessToken(token) {
    _token = token
}

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
            ...options.headers,
        },
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
        throw new Error(err.error || err.message)
    }

    return res.json()
}

export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: 'DELETE' }),
}
