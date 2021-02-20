const { sessionStorage } = window

export default {
    set(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        sessionStorage.setItem(key, value)
    },
    get(key) {
        const value = sessionStorage.getItem(key) || ''
        try {
            return JSON.parse(value)
        } catch (e) {
            return value
        }
    },
    remove(key) {
        sessionStorage.removeItem(key)
    },
}
