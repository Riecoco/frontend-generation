import AccountStatusBadge from "./AccountStatusBadge.vue";

export default {
    title: "Molecules/AccountStatusBadge",
    component: AccountStatusBadge,
    tags: ["autodocs"],
    argTypes: {
        status: {
            control: { type: "select" },
            options: ["ACTIVE", "FROZEN", "CLOSED"],
        },
    },
    args: {
        status: "ACTIVE",
    },
    render: (args) => ({
        components: { AccountStatusBadge },
        setup() {
            return { args };
        },
        template: `
          <AccountStatusBadge :status="args.status" />
        `,
    }),
};

export const Active = {
    args: {
        status: "ACTIVE",
    },
};

export const Frozen = {
    args: {
        status: "FROZEN",
    },
};

export const Closed = {
    args: {
        status: "CLOSED",
    },
};

export const AllStatuses = {
    render: () => ({
        components: { AccountStatusBadge },
        template: `
          <div class="flex flex-wrap gap-3">
            <AccountStatusBadge status="ACTIVE" />
            <AccountStatusBadge status="FROZEN" />
            <AccountStatusBadge status="CLOSED" />
          </div>
        `,
    }),
};