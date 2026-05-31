import { ref } from 'vue'
import {
    Home,
    Wallet,
    CreditCard,
    ArrowLeftRight,
    Landmark,
    Users,
    UserCheck,
    Receipt,
} from '@lucide/vue'
import Sidebar from './Sidebar.vue'

const customerApprovedItems = [
    {
        key: 'overview',
        label: 'Overview',
        icon: Home,
    },
    {
        key: 'accounts',
        label: 'Accounts',
        icon: Wallet,
    },
    {
        key: 'transactions',
        label: 'Transactions',
        icon: CreditCard,
    },
    {
        key: 'transfer',
        label: 'Transfer',
        icon: ArrowLeftRight,
    },
    {
        key: 'atm',
        label: 'ATM',
        icon: Landmark,
    },
]

const employeeItems = [
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

export default {
    title: 'Organisms/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
}

export const CustomerApproved = {
    render: () => ({
        components: { Sidebar },
        setup() {
            const activeKey = ref('overview')

            const selectItem = (key) => {
                activeKey.value = key
            }

            return {
                customerApprovedItems,
                activeKey,
                selectItem,
            }
        },
        template: `
          <Sidebar
              user-name="Maria Jansen"
              user-role="Customer"
              :items="customerApprovedItems"
              :active-key="activeKey"
              @select="selectItem"
              @logout="console.log('Logout clicked')"
          />
        `,
    }),
}

export const CustomerPending = {
    render: () => ({
        components: { Sidebar },
        setup() {
            const activeKey = ref('overview')

            const pendingItems = [
                {
                    key: 'overview',
                    label: 'Overview',
                    icon: Home,
                },
            ]

            const selectItem = (key) => {
                activeKey.value = key
            }

            return {
                pendingItems,
                activeKey,
                selectItem,
            }
        },
        template: `
          <Sidebar
              user-name="Anna de Vries"
              user-role="Pending customer"
              :items="pendingItems"
              :active-key="activeKey"
              @select="selectItem"
              @logout="console.log('Logout clicked')"
          />
        `,
    }),
}

export const Employee = {
    render: () => ({
        components: { Sidebar },
        setup() {
            const activeKey = ref('customers')

            const selectItem = (key) => {
                activeKey.value = key
            }

            return {
                employeeItems,
                activeKey,
                selectItem,
            }
        },
        template: `
          <Sidebar
              user-name="Sophie Bakker"
              user-role="Employee"
              :items="employeeItems"
              :active-key="activeKey"
              @select="selectItem"
              @logout="console.log('Logout clicked')"
          />
        `,
    }),
}