import StatusBadge from "./StatusBadge.vue";

export default {
    title: "Molecules/StatusBadge",
    component: StatusBadge,
    tags: ["autodocs"],
    argTypes: {
        status: {
            control: { type: "select" },
            options: ["PENDING", "APPROVED", "DENIED"],
        },
    },
    args: {
        status: "PENDING",
    },
    render: (args) => ({
        components: { StatusBadge },
        setup() {
            return { args };
        },
        template: `
          <StatusBadge :status="args.status" />
        `,
    }),
};

export const Pending = {
    args: {
        status: "PENDING",
    },
};

export const Approved = {
    args: {
        status: "APPROVED",
    },
};

export const Denied = {
    args: {
        status: "DENIED",
    },
};

export const AllStatuses = {
    render: () => ({
        components: { StatusBadge },
        template: `
          <div class="flex flex-wrap gap-3">
            <StatusBadge status="PENDING" />
            <StatusBadge status="APPROVED" />
            <StatusBadge status="DENIED" />
          </div>
        `,
    }),
};