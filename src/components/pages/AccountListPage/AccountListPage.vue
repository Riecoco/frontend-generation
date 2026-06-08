<template>
  <AppLayout
      :user-name="employeeName"
      user-role="Employee"
      :items="navItems"
      active-key="customers"
      @select="handleNavigation"
      @logout="handleLogout"
  >
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Accounts</h1>
    
    <div v-if="loading" class="text-gray-500">Loading accounts...</div>
    <div v-else-if="error" class="text-red-500 p-4 border border-red-200 rounded bg-red-50">
      {{ error }}
    </div>
    
    <div v-else>
      <AccountsTable :accounts="accounts"></AccountsTable>
    </div>

    <div class="mt-6 flex justify-center gap-2">
      <button 
        :disabled="currentPage <= 1"
        @click="fetchPage(currentPage - 1)"
        class="px-4 py-2 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span class="px-4 py-2">Page {{ currentPage }}</span>
      <button 
        :disabled="currentPage >= totalPages"
        @click="fetchPage(currentPage + 1)"
        class="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
  </AppLayout>
</template>

<script setup>
import {computed, onMounted} from 'vue';
import { storeToRefs } from 'pinia';
import { useAccountsStore } from '@/stores/accounts';
import AccountsTable from "@/components/organisms/AccountsTable/AccountsTable.vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "../../../stores/auth.js";
import {useUsersStore} from "../../../stores/users.js";
import {AppLayout} from "../../organisms/index.js";
import {ArrowLeftRight, Clock, List, Users} from "@lucide/vue";

const accountsStore = useAccountsStore();
const { accounts, loading, error, currentPage, totalPages } = storeToRefs(accountsStore);

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const employeeName = computed(() => {
  return [authStore.user?.firstName, authStore.user?.lastName]
      .filter(Boolean)
      .join(' ') || 'Employee'
})

const navItems = [
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'pending', label: 'Pending Approvals', icon: Clock },
  { key: 'transfer', label: 'Transfer', icon: ArrowLeftRight },
  { key: 'transactions', label: 'All Transactions', icon: List },
  { key: 'accounts', label: 'Accounts', icon: List },
]
const fetchPage = (pageNumber) => {
  accountsStore.fetchAllAccounts(pageNumber);
};

onMounted(() => {
  accountsStore.fetchAllAccounts();
});

function handleNavigation(key) {
  const routes = {
    customers: '/employee/customers',
    pending: '/employee/pending',
    transfer: '/employee/transfer',
    transactions: '/employee/transactions',
    accounts: '/employee/accounts',
  }

  const routePath = routes[key]

  if (routePath) {
    router.push(routePath)
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
