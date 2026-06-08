import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient, { setAuthToken } from '../utils/axios.js'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('auth_token') || null)
    const user = ref(null)
    const loading = ref(false)
    const error = ref(null)


const isLoggedIn = computed(() => !!token.value)
const isEmployee = computed(() => user.value?.role === 'EMPLOYEE')
const isCustomer = computed(() => user.value?.role === 'CUSTOMER')
    const isApproved = computed(() => user.value?.status === 'APPROVED')

    // Safe display name for use in templates, mostly when its null
    const displayName = computed(() => {
        if (!user.value) return ''
        const full = [user.value.firstName, user.value.lastName].filter(Boolean).join(' ')
        return full || user.value.email || ''
    })

    async function login(email, password) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.post('/auth/login', { email, password })
            token.value = response.data
            setAuthToken(response.data)

            const meResponse = await apiClient.get('/auth/me')
            user.value = meResponse.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Invalid username or password.'
            token.value = null
            user.value = null
            setAuthToken(null)
        } finally {
            loading.value = false
        }
    }

async function fetchCurrentUser() {
    if (!token.value) return null

    loading.value = true
    error.value = null

    try {
        const response = await apiClient.get('/auth/me')
        user.value = response.data
        return response.data
    } catch (err) {
        error.value = err.response?.data || 'Failed to fetch current user'
        return null
    } finally {
        loading.value = false
    }
}

async function register(userData) {
   try {
     const response = await apiClient.post('/auth/register', userData)
          token.value = response.data
          setAuthToken(response.data)

          //get the user object
          const meResponse = await apiClient.get('/auth/me')
          user.value = meResponse.data
    } catch (err) {
        error.value = err.response?.data || 'Registration failed'
        throw err
    } finally {
            loading.value = false
        }
 } 
    

function logout() {
    token.value = null
    user.value = null
    setAuthToken(null)
}

//to keep the user logged in
async function initAuth() {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
        token.value = savedToken
        setAuthToken(savedToken)
        // populate the `user` from the API when a token is present
        await fetchCurrentUser()
    }
}

    return {
        token, user, loading, error,
        isLoggedIn, isEmployee, isCustomer, isApproved,
        displayName,
        login, logout, initAuth, fetchCurrentUser, register
    }

})
