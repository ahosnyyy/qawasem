<template>
  <AppHeader />
  <UMain class="min-h-0">
    <AppSubheader />
    <AppBackground />
    <!--<SocialIcons />-->
    <UContainer class="min-h-[calc(100vh-var(--ui-header-height)-11.5rem)] md:min-h-[calc(100vh-var(--ui-header-height)-18.5rem)]">
      <slot />
    </UContainer>
  </UMain>
  <!--<AppFooter />-->
</template>
