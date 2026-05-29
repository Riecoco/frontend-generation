<template>
  <aside class="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
    <header class="border-b border-sidebar-border p-6">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {{ userInitials }}
        </div>

        <div class="min-w-0">
          <p class="truncate font-semibold leading-tight text-sidebar-foreground">
            {{ userName }}
          </p>

          <p class="truncate text-xs lowercase text-muted-foreground">
            {{ userRole }}
          </p>
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

        <span class="text-xl font-bold tracking-tight text-sidebar-foreground">
          CloudBank
        </span>
      </div>

      <button
          type="button"
          class="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-sidebar-border bg-card px-4 text-sm font-medium text-sidebar-foreground transition-colors duration-200 hover:bg-sidebar-accent"
          title="Logout"
          @click="$emit('logout')"
      >
        <LogOut class="h-5 w-5 shrink-0 text-sidebar-foreground" />

        <span class="font-semibold">
          Logout
        </span>
      </button>
    </footer>
  </aside>
</template>

<script setup>
import { Cloud, LogOut } from "lucide-vue-next";
import SidebarNavItem from "../../molecules/SidebarNavItem/SidebarNavItem.vue";

defineProps({
  userName: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  userInitials: {
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
});

defineEmits(["select", "logout"]);
</script>