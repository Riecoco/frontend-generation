<script setup>
import { computed } from 'vue'
import { ChevronRight, Users } from '@lucide/vue'
import { BaseAvatar, Button, Heading, StatusBadge, Text } from '../../atoms'
import { Card } from '../../molecules'

// props passed from parent page
const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['select'])

// total number of customers shown in the header
const customerCount = computed(() => props.users.length)

function getUserId(user) {
  return user?.id ?? user?.userId ?? user?.customerId
}

function getFullName(user) {
  return [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(' ') || 'Unknown customer'
}

function getStatus(user) {
  return (user?.userStatus || user?.status || 'approved').toLowerCase()
}

function selectUser(user) {
  emit('select', user)
}
</script>

<template>
  <Card class="overflow-hidden rounded-[2rem]">
    <section class="border-b border-border bg-card p-8 text-center">
      <div class="mb-3 flex items-center justify-center gap-2 text-primary">
        <Users class="h-5 w-5" />

        <Text
            size="sm"
            weight="bold"
            color="primary"
            class="uppercase tracking-widest"
        >
          Customers
        </Text>
      </div>

      <Heading level="2">
        Customer List
      </Heading>

      <Text color="muted" class="mt-2">
        {{ customerCount }} customers found
      </Text>
    </section>

    <section class="space-y-4 p-8">
      <!-- loading state -->
      <div
          v-if="loading"
          class="rounded-3xl border border-border bg-muted/30 p-6 text-center"
      >
        <Text color="muted">
          Loading customers...
        </Text>
      </div>

      <!-- error state -->
      <div
          v-else-if="error"
          class="rounded-3xl border border-destructive/20 bg-destructive/10 p-6 text-center"
      >
        <Text class="text-destructive">
          {{ error }}
        </Text>
      </div>

      <!-- empty state -->
      <div
          v-else-if="users.length === 0"
          class="rounded-3xl border border-border bg-muted/30 p-8 text-center"
      >
        <Heading level="3">
          No customers found
        </Heading>

        <Text color="muted" class="mt-2">
          There are no customers to display yet.
        </Text>
      </div>

      <!-- list of customers -->
      <article
          v-for="user in users"
          v-else
          :key="getUserId(user)"
          class="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <BaseAvatar
            :name="getFullName(user)"
            size="lg"
            class="shrink-0 rounded-2xl"
        />

        <div class="min-w-0 flex-1">
          <Heading level="3" class="truncate text-xl">
            {{ getFullName(user) }}
          </Heading>

          <Text color="muted" class="truncate">
            {{ user.email || 'No email provided' }}
          </Text>

          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <Text size="xs" color="muted">
              ID: {{ getUserId(user) || '—' }}
            </Text>

            <Text size="xs" color="muted">
              Phone: {{ user.phoneNumber || user.phone || '—' }}
            </Text>
          </div>
        </div>

        <div class="flex shrink-0 items-center justify-center">
          <StatusBadge :status="getStatus(user)" />
        </div>

        <Button
            variant="outline"
            size="icon"
            class="rounded-full"
            @click="selectUser(user)"
        >
          <ChevronRight class="h-5 w-5" />
        </Button>
      </article>
    </section>
  </Card>
</template>