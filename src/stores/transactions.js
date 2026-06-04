import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../utils/axios.js'
import { useAuthStore } from './auth.js'
import { useAccountsStore } from './accounts.js'

export const useTransactionsStore = defineStore('transactions', () => {

    // State
    const transactions = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const recentTransactions = computed(() =>
        transactions.value.slice(0, 10) // return last 10 transactions
    )
    const incomingTransactions = computed(() => {
        const accountsStore = useAccountsStore()
        const myIban = accountsStore.checkingAccount?.iban
        return transactions.value.filter(t => t.toAccountIban === myIban)
    })
    const outgoingTransactions = computed(() => {
        const accountsStore = useAccountsStore()
        const myIban = accountsStore.checkingAccount?.iban
        return transactions.value.filter(t => t.fromAccountIban === myIban)
    })

    function getUserId(user) {
        return user?.id ?? user?.userId ?? user?.customerId
    }

    // Actions
    async function createTransfer(fromAccountIban, toAccountIban, amount, description) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.post('/transactions/transfer', {
                fromAccountIban, toAccountIban, amount, description
            })
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to create a transfer'
        } finally {
            loading.value = false
        }
    }

    async function fetchAllTransactions(page = 0, size = 20) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get('/transactions/all', {
                params: { page, size }
            })
            // save transactions to pinia
            transactions.value = response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to fetch transactions'
        } finally {
            loading.value = false
        }
    }

    async function fetchTransactionsByUserId() {
        const authStore = useAuthStore()
        loading.value = true
        error.value = null

        try {
            if (!authStore.user) {
                await authStore.fetchCurrentUser()
            }

            const userId = getUserId(authStore.user)
            if (!userId) {
                error.value = 'Failed to fetch transactions: missing user ID'
                return
            }

            const response = await apiClient.get('/transactions/user', {
                params: { userId }
            })
            transactions.value = response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to fetch transactions'
        } finally {
            loading.value = false
        }
    }

    async function fetchCustomerTransactions(userId, filters = {}) {
        loading.value = true
        error.value = null
        try {
            // send filters with page number and page size
            const response = await apiClient.get(`/transactions/${ userId }`, {
                params: { ...filters, page: filters.page ?? 0, size: filters.size ?? 20 }
            })
            transactions.value = response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to fetch customer transactions'
        } finally {
            loading.value = false
        }
    }

    async function fetchTransactionsByIban(iban, page = 0, size = 20) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.get(`/transactions/${ iban }/transactions`, {
                params: { page, size }
            })
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to get transaction by iban'
        } finally {
            loading.value = false
        }
    }

    async function withdraw(iban, amount) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.post('/transactions/withdraw', {
                iban, amount, description: 'ATM withdrawal', transactionType: 'WITHDRAWAL'
            })
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to create a withdraw'
        } finally {
            loading.value = false
        }
    }

    async function deposit(iban, amount) {
        loading.value = true
        error.value = null

        try {
            const response = await apiClient.post('/transactions/deposit', {
                iban, amount, description: 'ATM deposit', transactionType: 'DEPOSIT'
            })
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to create a deposit'
        } finally {
            loading.value = false
        }
    }

    return {
        // state
        transactions,
        loading,
        error,
        // getters
        recentTransactions,
        incomingTransactions,
        outgoingTransactions,
        // actions
        createTransfer,
        fetchAllTransactions,
        fetchTransactionsByUserId,
        fetchCustomerTransactions,
        fetchTransactionsByIban,
        withdraw,
        deposit
    }
})
