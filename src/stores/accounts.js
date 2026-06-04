import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../utils/axios.js'
import { useAuthStore } from './auth.js'

export const useAccountsStore = defineStore('accounts', () => {

    // State
    const accounts = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const checkingAccount = computed(() =>
        accounts.value.find(account => account.accountType === 'CHECKING')
    )
    const savingsAccount = computed(() =>
        accounts.value.find(account => account.accountType === 'SAVINGS')
    )
    const activeAccounts = computed(() =>
        accounts.value.filter(account => {
            const rawStatus = account.status ?? account.accountStatus
            if (!rawStatus) return true

            const status = String(rawStatus).toUpperCase()
            return status === 'ACTIVE' || status === 'APPROVED'
        })
    )
    const totalBalance = computed(() =>
        accounts.value.reduce((sum, account) => sum + account.balance, 0)
    )

    function getUserId(user) {
        return user?.id ?? user?.userId ?? user?.customerId
    }

    function normalizeAccounts(payload) {
        if (Array.isArray(payload)) return payload
        if (Array.isArray(payload?.content)) return payload.content
        if (Array.isArray(payload?.accounts)) return payload.accounts
        if (Array.isArray(payload?.data)) return payload.data
        if (Array.isArray(payload?._embedded?.accounts)) return payload._embedded.accounts
        return []
    }

    // Actions
    async function fetchAllAccounts(page = 0, size = 20) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/accounts', {
                params: { page, size }
            })
            // save accounts to pinia
            accounts.value = normalizeAccounts(response.data)
        } catch (err) {
            error.value = err.response?.data || 'Failed to fetch accounts'
        } finally {
            loading.value = false
        }
    }

    async function fetchAccountsByUserId() {
        const authStore = useAuthStore()
        loading.value = true
        error.value = null

        try {
            if (!authStore.user) {
                await authStore.fetchCurrentUser()
            }

            const userId = getUserId(authStore.user)
            if (!userId) {
                error.value = 'Failed to fetch accounts: missing user ID'
                return
            }

            const response = await apiClient.get('/accounts/user', {
                params: { userId }
            })
            accounts.value = normalizeAccounts(response.data)
        } catch (err) {
            error.value = err.response?.data || 'Failed to fetch accounts'
        } finally {
            loading.value = false
        }
    }

    async function getAccountByIban(iban) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/accounts/iban', {
                params: { iban }
            })
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to get account'
        } finally {
            loading.value = false
        }
    }

    async function searchAccountsByName(firstName, lastName) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/accounts/search', {
                params: { firstName, lastName }
            })
            accounts.value = normalizeAccounts(response.data)
        } catch (err) {
            error.value = err.response?.data || 'Failed to search accounts'
        } finally {
            loading.value = false
        }
    }

    async function updateAccountLimits(iban, limitsData) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.patch(`/accounts/${ iban }`, limitsData)
            // update account with new data
            accounts.value = accounts.value.map(account =>
                account.iban === iban ? response.data : account
            )
        } catch (err) {
            error.value = err.response?.data || 'Failed to update account limits'
        } finally {
            loading.value = false
        }
    }

    async function closeAccount(iban) {
        loading.value = true
        error.value = null

        try {
            await apiClient.patch(`/accounts/${ iban} /close`)
            accounts.value = accounts.value.filter(account => account.iban !== iban)
        } catch (err) {
            error.value = err.response?.data || 'Failed to close the account'
        } finally {
            loading.value = false
        }
    }

    return {
        // state
        accounts,
        loading,
        error,
        // getters
        checkingAccount,
        savingsAccount,
        activeAccounts,
        totalBalance,
        // actions
        fetchAllAccounts,
        fetchAccountsByUserId,
        searchAccountsByName,
        updateAccountLimits,
        closeAccount,
        getAccountByIban
    }
})
