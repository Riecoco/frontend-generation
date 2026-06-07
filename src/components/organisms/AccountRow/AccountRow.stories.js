import AccountRow from './AccountRow.vue';

export default {
  title: 'Organisms/AccountRow',
  component: AccountRow,
};

export const Default = {
  args: {
    account: {
      type: 'Savings',
      accountNumber: '123456789',
      balance: 1000.00,
      currency: 'USD',
    },
  },
};
