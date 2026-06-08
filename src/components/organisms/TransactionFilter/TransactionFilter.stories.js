import TransactionFilter from './TransactionFilter.vue'

export default {
    title: 'Organisms/TransactionFilter',
    component: TransactionFilter,
}

export const Default = {
    render: () => ({
        components: { TransactionFilter },
        template: '<TransactionFilter />',
    }),
}
