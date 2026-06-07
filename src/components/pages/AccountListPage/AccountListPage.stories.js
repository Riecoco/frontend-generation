import AccountListPage from './AccountListPage.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useAccountsStore } from '@/stores/accounts';

export default {
  title: 'Pages/AccountListPage',
  component: AccountListPage,
  decorators: [
    (story) => {
      setActivePinia(createPinia());
      return story();
    },
  ],
};

export const Default = {
  render: () => ({
    components: { AccountListPage },
    template: '<AccountListPage />',
    setup() {
      const store = useAccountsStore();
      store.accounts = [
        { id: 1, type: 'Checking', accountNumber: '123', balance: 500, currency: 'USD' },
        { id: 2, type: 'Savings', accountNumber: '456', balance: 2000, currency: 'USD' },
      ];
    }
  }),
};
