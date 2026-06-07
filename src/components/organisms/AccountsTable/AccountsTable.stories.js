import AccountsTable from './AccountsTable.vue';

export default {
    title: 'Organisms/AccountsTable',
    component: AccountsTable,
    tags: ['autodocs'],
};

export const Default = {
    args: {
        accounts: [
            {
                accountType: 'Savings',
                iban: 'NL91ABNA0417164300',
                balance: 1000.00,
            },
            {
                accountType: 'Checking',
                iban: 'NL02ABNA0123456789',
                balance: 2500.50,
            },
        ],
    },
};

export const SingleAccount = {
    args: {
        accounts: [
            {
                accountType: 'Savings',
                iban: 'NL91ABNA0417164300',
                balance: 500.00,
            },
        ],
    },
};

export const Empty = {
    args: {
        accounts: [],
    },
};