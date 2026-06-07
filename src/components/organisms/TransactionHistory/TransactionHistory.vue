<script setup>
import { computed } from 'vue'
import { ArrowDownRight, ArrowUpRight, CalendarDays, CreditCard, ReceiptText, } from '@lucide/vue'
import { Card, CardContent } from '../../molecules'
import { Text } from '../../atoms'

// props passed from parent page
const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  accounts: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [String, Object],
    default: '',
  },
})

// store customer IBANs to check if transaction is incoming or outgoing
const accountIbans = computed(() =>
    props.accounts
        .map((account) => account?.iban)
        .filter(Boolean),
)

// total number of transactions to display in the header
const transactionCount = computed(() => props.transactions.length)

// sort newest transactions first
const sortedTransactions = computed(() => {
  return [...props.transactions].sort((a, b) => {
    const dateA = new Date(a?.timestamp || a?.createdAt || a?.date || 0).getTime()
    const dateB = new Date(b?.timestamp || b?.createdAt || b?.date || 0).getTime()
    return dateB - dateA  // newest first
  })
})

function isIncoming(transaction) {
  if (transaction?.transactionType === 'DEPOSIT') return true
  if (transaction?.transactionType === 'WITHDRAWAL') return false

  return accountIbans.value.includes(transaction?.toAccountIban) &&
      !accountIbans.value.includes(transaction?.fromAccountIban)
}

function isOutgoing(transaction) {
  if (transaction?.transactionType === 'WITHDRAWAL') return true
  if (transaction?.transactionType === 'DEPOSIT') return false

  return accountIbans.value.includes(transaction?.fromAccountIban) &&
      !accountIbans.value.includes(transaction?.toAccountIban)
}

function getDirectionLabel(transaction) {
  if (isIncoming(transaction)) return 'Incoming'
  if (isOutgoing(transaction)) return 'Outgoing'
  return 'Transfer'
}

function getDirectionClasses(transaction) {
  if (isIncoming(transaction)) {
    return {
      iconWrapper: 'bg-success/10 text-success',
      amount: 'text-success',
      sign: '+',
    }
  }

  if (isOutgoing(transaction)) {
    return {
      iconWrapper: 'bg-destructive/10 text-destructive',
      amount: 'text-destructive',
      sign: '-',
    }
  }
  return {
    iconWrapper: 'bg-muted text-muted-foreground',
    amount: 'text-foreground',
    sign: '',
  }
}

function getTransactionTitle(transaction) {
  return transaction?.description || formatType(transaction?.transactionType)
}

// convert transaction type enum into text
function formatType(type) {
  if (!type) return 'Transaction'
  return String(type)
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/^\w/, (letter) => letter.toUpperCase())
}

function formatDate(value) {
  if (!value) return 'Date unavailable'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(amount || 0))
}

function formatIban(iban) {
  return iban || '—'
}

function getErrorMessage(error) {
  if (!error) return ''
  if (typeof error === 'string') return error
  return error?.message || 'Could not load transactions.'
}
</script>

<template>
  <Card class="overflow-hidden">
    <div class="border-b border-primary/10 bg-primary/5 px-8 pb-6 pt-8">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
            History
          </p>
          <h2 class="text-2xl font-bold tracking-tight">
            Transactions
          </h2>
        </div>

        <div class="rounded-full border border-primary/20 bg-card px-4 py-2 text-sm font-semibold text-primary">
          {{ transactionCount }} transactions
        </div>
      </div>
    </div>

    <CardContent class="p-8">
      <!-- loading state -->
      <div
          v-if="loading"
          class="rounded-3xl border border-border bg-muted/30 p-8 text-center"
      >
        <Text color="muted">
          Loading transactions...
        </Text>
      </div>

      <!-- error state -->
      <div
          v-else-if="error"
          class="rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center"
      >
        <Text class="text-destructive">
          {{ getErrorMessage(error) }}
        </Text>
      </div>

      <!-- empty state -->
      <div
          v-else-if="transactions.length === 0"
          class="rounded-3xl border border-border bg-muted/30 p-8 text-center"
      >
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ReceiptText class="h-7 w-7" />
        </div>
        <h3 class="mb-2 text-lg font-semibold text-foreground">
          No transactions yet
        </h3>
        <Text color="muted">
          Your transaction history will appear here after your first transfer, deposit, or withdrawal.
        </Text>
      </div>

      <!-- transaction list sorted by newest first -->
      <div v-else class="space-y-3">
        <div
            v-for="transaction in sortedTransactions"
            :key="transaction.id"
            class="rounded-3xl border border-border bg-muted/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
          <div class="grid gap-5 lg:grid-cols-[minmax(260px,1.4fr)_minmax(220px,1fr)_minmax(220px,1fr)_minmax(140px,auto)] lg:items-center">
            <!-- direction icon + title + date -->
            <div class="flex min-w-0 items-start gap-4">
              <div
                  :class="[
                  'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl',
                  getDirectionClasses(transaction).iconWrapper,
                ]"
              >
                <ArrowDownRight
                    v-if="isIncoming(transaction)"
                    class="h-6 w-6"
                />
                <ArrowUpRight
                    v-else-if="isOutgoing(transaction)"
                    class="h-6 w-6"
                />
                <CreditCard
                    v-else
                    class="h-6 w-6"
                />
              </div>

              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="font-semibold text-foreground">
                    {{ getTransactionTitle(transaction) }}
                  </p>
                  <span class="rounded-full bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {{ getDirectionLabel(transaction) }}
                  </span>
                </div>

                <div class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays class="h-4 w-4" />
                  <span>
                    {{ formatDate(transaction.timestamp || transaction.createdAt || transaction.date) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- from IBAN -->
            <div class="rounded-2xl border border-border bg-card px-4 py-3">
              <p class="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                From
              </p>
              <p class="break-all font-mono text-sm text-foreground">
                {{ formatIban(transaction.fromAccountIban) }}
              </p>
            </div>

            <!-- to IBAN -->
            <div class="rounded-2xl border border-border bg-card px-4 py-3">
              <p class="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                To
              </p>
              <p class="break-all font-mono text-sm text-foreground">
                {{ formatIban(transaction.toAccountIban) }}
              </p>
            </div>

            <!-- amount with sign and color based on direction -->
            <p
                :class="[
                'text-left text-xl font-bold lg:text-right',
                getDirectionClasses(transaction).amount,
              ]"
            >
              {{ getDirectionClasses(transaction).sign }}{{ formatCurrency(transaction.amount) }}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>