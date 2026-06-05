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

    async function requestOrNull(request, fallback) {
        try {
            return await request()
        } catch (err) {
            error.value = getErrorMessage(err, fallback)
            return null
        }
    }

    function filterAccountsByUserId(allAccounts, userId) {
        return allAccounts.filter(account => {
            const ownerId = account.userId ?? account.customerId ?? account.ownerId ?? account.user?.id ?? account.customer?.id
            return String(ownerId) === String(userId)
        })
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

        const result = await requestOrNull(
            () => requestAllAccounts(page, size),
            'Failed to fetch accounts'
        )

        if (result) {
            accounts.value = result
        }

        loading.value = false
        return result
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

        const directAccounts = await requestOrNull(
            () => requestAccountsByUserId(resolvedUserId),
            'Failed to fetch accounts'
        )

        if (directAccounts) {
            accounts.value = directAccounts
            loading.value = false
            return accounts.value
        }

        if (!userId) {
            loading.value = false
            return null
        }

        const allAccounts = await requestOrNull(
            () => requestAllAccounts(0, 100),
            'Failed to fetch accounts'
        )

        if (!allAccounts) {
            loading.value = false
            return null
        }

        accounts.value = filterAccountsByUserId(allAccounts, resolvedUserId)
        error.value = null
        loading.value = false
        return accounts.value
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

        const updatedAccount = await requestOrNull(
            () => requestAccountLimitUpdate(iban, limitsData),
            'Failed to update account limits'
        )

        if (!updatedAccount) {
            loading.value = false
            return null
        }

        accounts.value = mergeAccountUpdate(iban, updatedAccount, limitsData)
        error.value = null
        loading.value = false
        return updatedAccount
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
