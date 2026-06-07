<template>
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
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAccountsStore } from '@/stores/accounts';
import AccountRow from '../../organisms/AccountRow/AccountRow.vue';
import AccountsTable from "@/components/organisms/AccountsTable/AccountsTable.vue";

const accountsStore = useAccountsStore();
const { accounts, loading, error, currentPage, totalPages } = storeToRefs(accountsStore);

const fetchPage = (pageNumber) => {
  accountsStore.fetchAllAccounts(pageNumber);
};

onMounted(() => {
  accountsStore.fetchAllAccounts();
});
</script>
