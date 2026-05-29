import TransactionStatusBadge from "./TransactionStatusBadge.vue";

export default {
    title: "Molecules/TransactionStatusBadge",
    component: TransactionStatusBadge,
    tags: ["autodocs"],
    argTypes: {
        status: {
            control: { type: "select" },
            options: ["PENDING", "COMPLETED", "FAILED"],
        },
    },
    args: {
        status: "PENDING",
    },
    render: (args) => ({
        components: { TransactionStatusBadge },
        setup() {
            return { args };
        },
        template: `
          <TransactionStatusBadge :status="args.status" />
        `,
    }),
};

export const Pending = {
    args: {
        status: "PENDING",
    },
};

export const Completed = {
    args: {
        status: "COMPLETED",
    },
};

export const Failed = {
    args: {
        status: "FAILED",
    },
};

export const AllStatuses = {
    render: () => ({
        components: { TransactionStatusBadge },
        template: `
          <div class="flex flex-wrap gap-3">
            <TransactionStatusBadge status="PENDING" />
            <TransactionStatusBadge status="COMPLETED" />
            <TransactionStatusBadge status="FAILED" />
          </div>
        `,
    }),
};