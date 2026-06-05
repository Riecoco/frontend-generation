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

    function getErrorMessage(err, fallback) {
        return err?.response?.data || fallback
    }

    async function requestAllAccounts(page = 0, size = 20) {
        const response = await apiClient.get('/accounts', {
            params: { page, size }
        })
        return normalizeAccounts(response.data)
    }

    async function requestAccountsByUserId(userId) {
        const response = await apiClient.get('/accounts/user', {
            params: { userId }
        })
        return normalizeAccounts(response.data)
    }

    async function requestAccountLimitUpdate(iban, limitsData) {
        const response = await apiClient.patch(`/accounts/${encodeURIComponent(iban)}`, limitsData)
        return response.data || true
    }

    function mergeAccountUpdate(iban, updatedAccount, limitsData) {
        return accounts.value.map(account => {
            if (account.iban !== iban) return account

            return updatedAccount && typeof updatedAccount === 'object'
                ? { ...account, ...updatedAccount }
                : { ...account, ...limitsData }
        })
    }

    // Actions
    async function fetchAllAccounts(page = 0, size = 20) {
        loading.value = true
        error.value = null
        try {
            const result = await requestAllAccounts(page, size)
            if (result) accounts.value = result
            return result
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to fetch accounts')
            return null
        } finally {
            loading.value = false
        }
    }

    async function fetchAccountsByUserId(userId = null) {
        const authStore = useAuthStore()
        loading.value = true
        error.value = null

        if (!userId && !authStore.user) {
            await authStore.fetchCurrentUser()
        }

        const resolvedUserId = userId ?? getUserId(authStore.user)
        if (!resolvedUserId) {
            error.value = 'Failed to fetch accounts: missing user ID'
            loading.value = false
            return null
        }

        try {
            const directAccounts = await requestAccountsByUserId(resolvedUserId)
            if (directAccounts) {
                accounts.value = directAccounts
                return accounts.value
            }
            error.value = 'Failed to fetch accounts'
            return null
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to fetch accounts')
            return null
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
            const updatedAccount = await requestAccountLimitUpdate(iban, limitsData)
            if (!updatedAccount) return null
            accounts.value = mergeAccountUpdate(iban, updatedAccount, limitsData)
            error.value = null
            return updatedAccount
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to update account limits')
            return null
        } finally {
            loading.value = false
        }
    }

    async function closeAccount(iban) {
        loading.value = true
        error.value = null

        try {
            await apiClient.patch(`/accounts/${encodeURIComponent(iban)}/close`)
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
