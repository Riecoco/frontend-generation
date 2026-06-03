import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../utils/axios.js'

export const useUsersStore = defineStore('users', () => {

    // State
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Actions
    async function fetchPendingUsers(page = 0, size = 20) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/users/pending', {
                params: { page, size }
            })
            users.value = response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to fetch pending users'
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

    return{
        // state
        users,
        loading,
        error,
        // actions
        fetchPendingUsers,
        approveUser
    }
})
