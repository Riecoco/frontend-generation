import AccountTypeLabel from "./AccountTypeLabel.vue";

export default {
    title: "Molecules/AccountTypeLabel",
    component: AccountTypeLabel,
    tags: ["autodocs"],
    argTypes: {
        accountType: {
            control: { type: "select" },
            options: ["CHECKING", "SAVINGS"],
        },
    },
    args: {
        accountType: "CHECKING",
    },
    render: (args) => ({
        components: { AccountTypeLabel },
        setup() {
            return { args };
        },
        template: `
          <AccountTypeLabel :account-type="args.accountType" />
        `,
    }),
};

export const Checking = {
    args: {
        accountType: "CHECKING",
    },
};

export const Savings = {
    args: {
        accountType: "SAVINGS",
    },
};

export const AllTypes = {
    render: () => ({
        components: { AccountTypeLabel },
        template: `
          <div class="flex flex-wrap items-center gap-6">
            <AccountTypeLabel account-type="CHECKING" />
            <AccountTypeLabel account-type="SAVINGS" />
          </div>
        `,
    }),
};