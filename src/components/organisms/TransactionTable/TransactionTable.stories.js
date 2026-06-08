import TransactionTable from './TransactionTable.vue'

export default {
    title: 'Organisms/TransactionTable',
    component: TransactionTable,
}

export const Default = {
    args: {
        transactions: [
            { id: 1, date: '2026-06-08', description: 'Test', amount: 100, toAccountIban: 'NL123' }
        ],
        page: 0
    }
}
