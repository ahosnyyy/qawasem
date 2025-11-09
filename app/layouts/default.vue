<template>
  <AppHeader />
  <UMain class="min-h-0">
    <AppSubheader />
    <AppBackground />
    <SocialIcons />
    <UContainer>
      <slot />
    </UContainer>
  </UMain>
  <AppFooter />
</template>
