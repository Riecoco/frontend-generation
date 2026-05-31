import { ref } from 'vue'
import {
    Users,
    UserCheck,
    ArrowLeftRight,
    Receipt,
} from '@lucide/vue'
import SidebarNavItem from './SidebarNavItem.vue'

export default {
    title: 'Molecules/SidebarNavItem',
    component: SidebarNavItem,
    tags: ['autodocs'],
    argTypes: {
        label: {
            control: 'text',
        },
        active: {
            control: 'boolean',
        },
    },
    args: {
        label: 'Customers',
        icon: Users,
        active: false,
    },
    render: (args) => ({
        components: {
            SidebarNavItem,
        },
        setup() {
            return {
                args,
            }
        },
        template: `
          <div class="w-72 bg-sidebar p-4">
            <SidebarNavItem
                :label="args.label"
                :icon="args.icon"
                :active="args.active"
            />
          </div>
        `,
    }),
}

export const Default = {}

export const Active = {
    args: {
        active: true,
    },
}

export const EmployeeItems = {
    render: () => ({
        components: {
            SidebarNavItem,
        },
        setup() {
            const items = [
                {
                    key: 'customers',
                    label: 'Customers',
                    icon: Users,
                },
                {
                    key: 'pending-approvals',
                    label: 'Pending Approvals',
                    icon: UserCheck,
                },
                {
                    key: 'transfer',
                    label: 'Transfer',
                    icon: ArrowLeftRight,
                },
                {
                    key: 'all-transactions',
                    label: 'All Transactions',
                    icon: Receipt,
                },
            ]

            const activeKey = ref('customers')

            const selectItem = (key) => {
                activeKey.value = key
            }

            return {
                items,
                activeKey,
                selectItem,
            }
        },
        template: `
          <div class="w-72 space-y-2 bg-sidebar p-4">
            <SidebarNavItem
                v-for="item in items"
                :key="item.key"
                :label="item.label"
                :icon="item.icon"
                :active="activeKey === item.key"
                @select="selectItem(item.key)"
            />
          </div>
        `,
    }),
}