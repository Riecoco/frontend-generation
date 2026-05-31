import StatusBadge from './StatusBadge.vue'

export default {
    title: 'Atoms/StatusBadge',
    component: StatusBadge,
    tags: ['autodocs'],
    argTypes: {
        status: {
            control: 'select',
            options: [
                'active',
                'approved',
                'pending',
                'frozen',
                'closed',
                'denied',
            ],
        },
    },
}

export const Active = {
    args: {
        status: 'active',
    },
}

export const Approved = {
    args: {
        status: 'approved',
    },
}

export const Pending = {
    args: {
        status: 'pending',
    },
}

export const Frozen = {
    args: {
        status: 'frozen',
    },
}

export const Closed = {
    args: {
        status: 'closed',
    },
}

export const Denied = {
    args: {
        status: 'denied',
    },
}

export const AllStatuses = {
    render: () => ({
        components: {
            StatusBadge,
        },
        template: `
          <div class="flex flex-wrap items-center gap-3">
            <StatusBadge status="active" />
            <StatusBadge status="approved" />
            <StatusBadge status="pending" />
            <StatusBadge status="frozen" />
            <StatusBadge status="closed" />
            <StatusBadge status="denied" />
          </div>
        `,
    }),
}