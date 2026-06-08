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
    const page = ref(0)
    const size = ref(20)
    const totalPages = ref(0)
    const totalElements = ref(0)

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
        return err?.response?.data?.message || err?.response?.data || fallback
    }

    // normalize backend response - extract array from Page object or return as-is
    function normalizeTransactions(payload) {
        if (Array.isArray(payload)) return payload
        if (Array.isArray(payload?.content)) return payload.content
        if (Array.isArray(payload?.transactions)) return payload.transactions
        if (Array.isArray(payload?.data)) return payload.data
        return []
    }

    function setPaginationMeta(payload) {
        page.value = Number(payload?.number ?? 0)
        size.value = Number(payload?.size ?? 20)
        totalPages.value = Number(payload?.totalPages ?? 1)
        totalElements.value = Number(payload?.totalElements ?? normalizeTransactions(payload).length)
    }

    async function requestAllTransactions(page = 0, size = 20) {
        const response = await apiClient.get('/transactions/all', {
            params: { page, size }
        })
        return response.data
    }

    async function requestCustomerTransactions(userId, filters = {}) {
        const response = await apiClient.get(`/transactions/${ userId }`, {
            params: { ...filters, page: filters.page ?? 0, size: filters.size ?? 20 }
        })
        return response.data
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
                fromAccountIban, toAccountIban, amount, description, transactionType: 'TRANSFER'
            })
            return response.data
        } catch (err) {
            error.value = err.response?.data || 'Failed to create a transfer'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchAllTransactions(page = 0, size = 20) {
        loading.value = true
        error.value = null

        try {
            const result = await requestAllTransactions(page, size)
            transactions.value = normalizeTransactions(result)
            setPaginationMeta(result)
            return result
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to fetch transactions')
            return null
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
            const customerTransactions = await requestCustomerTransactions(userId, filters)
            transactions.value = normalizeTransactions(customerTransactions)
            setPaginationMeta(customerTransactions)
            return transactions.value
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to fetch customer transactions')
            return null
        } finally {
            loading.value = false
        }
    }

    async function fetchTransactionsByIban(iban, page = 0, size = 20) {
        loading.value = true
        error.value = null
        try {
            const response = await apiClient.get(`/transactions/${iban}/transactions`, {
                params: { page, size }
            })
            transactions.value = normalizeTransactions(response.data)
            totalPages.value = response.data?.totalPages ?? 1
            totalElements.value = response.data?.totalElements ?? 0
            return transactions.value
        } catch (err) {
            error.value = getErrorMessage(err, 'Failed to get transaction by iban')
            return null
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
        page,
        size,
        totalPages,
        totalElements,
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
