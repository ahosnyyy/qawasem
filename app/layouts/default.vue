<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <AppSubheader />
    <AppBackground />
    <SocialIcons />
    <!-- Main content - flex-grow pushes footer to bottom -->
    <UMain class="min-h-0 flex-1 p-0">
      <slot />
    </UMain>
    <AppFooter />
  </div>
</template>
