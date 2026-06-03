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
    const totalBalance = computed(() =>
        accounts.value.reduce((sum, account) => sum + account.balance, 0)
    )

    // Actions
    async function fetchAllAccounts(page = 0, size = 20) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/accounts', {
                params: { page, size }
            })
            // save accounts to pinia
            accounts.value = response.data
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
            const response = await apiClient.get('/accounts/user', {
                params: { userId: authStore.user?.id }
            })
            accounts.value = response.data
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
            accounts.value = response.data
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