<template>
  <aside class="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
    <header class="border-b border-sidebar-border p-6">
      <div class="flex items-center gap-3">
        <BaseAvatar
            :name="userName"
            size="md"
        />

        <div class="min-w-0">
          <Text
              as="p"
              weight="semibold"
              class="truncate leading-tight text-sidebar-foreground"
          >
            {{ userName }}
          </Text>

          <Text
              as="p"
              size="xs"
              color="muted"
              class="truncate lowercase"
          >
            {{ userRole }}
          </Text>
        </div>
      </div>
    </header>

    <nav class="flex-1 overflow-y-auto p-3">
      <div class="space-y-1">
        <SidebarNavItem
            v-for="item in items"
            :key="item.key"
            :label="item.label"
            :icon="item.icon"
            :active="activeKey === item.key"
            @select="$emit('select', item.key)"
        />
      </div>
    </nav>

    <footer class="space-y-4 border-t border-sidebar-border p-4">
      <div class="flex items-center gap-2">
        <div class="shrink-0 rounded-lg bg-primary p-1.5 shadow-sm">
          <Cloud class="h-5 w-5 text-primary-foreground" />
        </div>

        <Text
            as="span"
            size="lg"
            weight="bold"
            class="tracking-tight text-sidebar-foreground"
        >
          CloudBank
        </Text>
      </div>

      <Button
          variant="outline"
          class="w-full border-sidebar-border bg-card text-sidebar-foreground hover:bg-sidebar-accent"
          title="Logout"
          @click="$emit('logout')"
      >
        <LogOut class="h-5 w-5 shrink-0 text-sidebar-foreground" />

        <Text
            as="span"
            weight="semibold"
            class="text-sidebar-foreground"
        >
          Logout
        </Text>
      </Button>
    </footer>
  </aside>
</template>

<script setup>
import { Cloud, LogOut } from '@lucide/vue'
import { BaseAvatar, Button, Text } from '../../atoms'
import { SidebarNavItem } from '../../molecules'

defineProps({
  userName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  activeKey: {
    type: String,
    required: true,
  },
})

defineEmits(['select', 'logout'])
</script>