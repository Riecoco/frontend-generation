import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../utils/axios.js'

export const useUsersStore = defineStore('users', () => {

    // State
    const users = ref([])
    const selectedUser = ref(null)
    const loading = ref(false)
    const error = ref(null)

    function normalizeUsers(payload) {
        if (Array.isArray(payload)) return payload
        if (Array.isArray(payload?.content)) return payload.content
        if (Array.isArray(payload?.users)) return payload.users
        if (Array.isArray(payload?.data)) return payload.data
        if (Array.isArray(payload?._embedded?.users)) return payload._embedded.users
        return []
    }

    function getUserId(user) {
        return user?.id ?? user?.userId ?? user?.customerId
    }

    function getErrorMessage(err, fallback) {
        return err?.response?.data || fallback
    }

    function findUserById(id) {
        return users.value.find(user => String(getUserId(user)) === String(id)) ?? null
    }

    async function requestUsers(page = 0, size = 100) {
        const response = await apiClient.get('/users', {
            params: { page, size }
        })
        return normalizeUsers(response.data)
    }

    async function requestPendingUsers(page = 0, size = 20) {
        const response = await apiClient.get('/users/pending', {
            params: { page, size }
        })
        return normalizeUsers(response.data)
    }

    // Actions
    async function fetchAllUsers(page = 0, size = 100) {
        loading.value = true
        error.value = null
        try {
            const result = await requestUsers(page, size)
            if (result) users.value = result
            return result
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to fetch users')
            return null
        } finally {
            loading.value = false
        }
    }

    async function fetchPendingUsers(page = 0, size = 20) {
        loading.value = true
        error.value = null
        try {
            const result = await requestPendingUsers(page, size)
            if (result) users.value = result
            return result
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to fetch pending users')
            return null
        } finally {
            loading.value = false
        }
    }

    async function approveUser(id, accountLimits) {
        loading.value = true
        error.value = null

        try {
            // approve user and create accounts with given limits
            const response = await apiClient.post(`/users/${id}/approve`, accountLimits)
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to approve user'
        } finally {
            loading.value = false
        }
    }

    async function fetchUserById(id) {
        loading.value = true
        error.value = null

        selectedUser.value = findUserById(id)
        if (selectedUser.value) {
            loading.value = false
            return selectedUser.value
        }

        try {
            const allUsers = await requestUsers(0, 100)
            if (allUsers) {
                users.value = allUsers
                selectedUser.value = findUserById(id)
            }
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to fetch user')
        }

        if (selectedUser.value) {
            error.value = null
            loading.value = false
            return selectedUser.value
        }

        try {
            const pendingUsers = await requestPendingUsers(0, 100)
            if (pendingUsers) {
                users.value = pendingUsers
                selectedUser.value = findUserById(id)
            }
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to fetch user')
        }

        if (!selectedUser.value && !error.value) {
            error.value = 'Customer not found'
        }

        loading.value = false
        return selectedUser.value
    }

    async function closeUser(id) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.patch(`/users/${id}/close`)
            selectedUser.value = response.data ?? selectedUser.value
            return response.data ?? true
        } catch (err) {
            error.value = err.response?.data || 'Failed to close user account'
            return null
        } finally {
            loading.value = false
        }
    }

    return{
        // state
        users,
        selectedUser,
        loading,
        error,
        // actions
        fetchAllUsers,
        fetchPendingUsers,
        approveUser,
        fetchUserById,
        closeUser
    }
})
