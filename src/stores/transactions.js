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

    function getErrorMessage(err, fallback) {
        return err?.response?.data || fallback
    }

    function normalizeTransactions(payload) {
        if (Array.isArray(payload)) return payload
        if (Array.isArray(payload?.content)) return payload.content
        if (Array.isArray(payload?.transactions)) return payload.transactions
        if (Array.isArray(payload?.data)) return payload.data
        if (Array.isArray(payload?._embedded?.transactions)) return payload._embedded.transactions
        return []
    }

    async function requestOrNull(request, fallback) {
        try {
            return await request()
        } catch (err) {
            error.value = getErrorMessage(err, fallback)
            return null
        }
    }

    async function requestAllTransactions(page = 0, size = 20) {
        const response = await apiClient.get('/transactions/all', {
            params: { page, size }
        })
        return normalizeTransactions(response.data)
    }

    async function requestCustomerTransactions(userId, filters = {}) {
        const response = await apiClient.get(`/transactions/${ userId }`, {
            params: { ...filters, page: filters.page ?? 0, size: filters.size ?? 20 }
        })
        return normalizeTransactions(response.data)
    }

    function filterTransactionsByUserId(allTransactions, userId) {
        return allTransactions.filter(transaction => {
            const ownerId = transaction.userId ?? transaction.customerId ?? transaction.account?.userId ?? transaction.account?.customerId
            return String(ownerId) === String(userId)
        })
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

        const result = await requestOrNull(
            () => requestAllTransactions(page, size),
            'Failed to fetch transactions'
        )

        if (result) {
            transactions.value = result
        }

        loading.value = false
        return result
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

        const customerTransactions = await requestOrNull(
            () => requestCustomerTransactions(userId, filters),
            'Failed to fetch customer transactions'
        )

        if (customerTransactions) {
            transactions.value = customerTransactions
            loading.value = false
            return transactions.value
        }

        const allTransactions = await requestOrNull(
            () => requestAllTransactions(filters.page ?? 0, filters.size ?? 100),
            'Failed to fetch customer transactions'
        )

        if (!allTransactions) {
            loading.value = false
            return null
        }

        transactions.value = filterTransactionsByUserId(allTransactions, userId)
        error.value = null
        loading.value = false
        return transactions.value
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
