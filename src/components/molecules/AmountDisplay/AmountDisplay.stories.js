import AmountDisplay from "./AmountDisplay.vue";

export default {
    title: "Molecules/AmountDisplay",
    component: AmountDisplay,
    tags: ["autodocs"],
    argTypes: {
        amount: {
            control: "text",
        },
        currency: {
            control: "text",
        },
        locale: {
            control: "text",
        },
        size: {
            control: { type: "select" },
            options: ["xs", "sm", "base", "lg"],
        },
        weight: {
            control: { type: "select" },
            options: ["normal", "medium", "semibold", "bold"],
        },
        color: {
            control: { type: "select" },
            options: ["default", "muted", "primary", "secondary", "destructive"],
        },
    },
    args: {
        amount: "1250.50",
        currency: "EUR",
        locale: "nl-NL",
        size: "base",
        weight: "semibold",
        color: "default",
    },
    render: (args) => ({
        components: { AmountDisplay },
        setup() {
            return { args };
        },
        template: `
          <AmountDisplay
            :amount="args.amount"
            :currency="args.currency"
            :locale="args.locale"
            :size="args.size"
            :weight="args.weight"
            :color="args.color"
          />
        `,
    }),
};

export const Default = {};

export const AccountBalance = {
    args: {
        amount: "2450.75",
        size: "lg",
        weight: "bold",
    },
};

export const DailyLimit = {
    args: {
        amount: "500.00",
        color: "muted",
    },
};

export const TransactionAmount = {
    args: {
        amount: "75.25",
        weight: "semibold",
    },
};