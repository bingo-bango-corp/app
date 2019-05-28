<template>
  <div class="default">
    <Button @click="signOut">Log out</Button>
    <slot></slot>
    <BottomNav :routes="routes" :currentRouteName="$route.name" @navigate="handleNavigation"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { BottomNav, BingoRoute } from 'simsalabim-design'
import { routes } from '@/router'

@Component({
  components: {
    BottomNav
  }
})
export default class Default extends Vue {
  routes = routes

  handleNavigation(route: BingoRoute) {
    this.$router.push(route.path)
  }

  async signOut() {
    await this.$store.dispatch('signOut')
    this.$router.push('/login')
  }
}
</script>

<style lang="sass" scoped src="./default.sass"/>
