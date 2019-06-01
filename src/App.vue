<template>
  <ThemeProvider id="app">
    <component :is="desiredLayout">
      <router-view/>
    </component>
  </ThemeProvider>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {Route} from 'vue-router'
import layouts from '@/layouts'
import { ThemeProvider } from 'simsalabim-design'

@Component({
  components: {
    ThemeProvider,
    ...layouts
  }
})
export default class App extends Vue {
  get desiredLayout() {
    return this.$route.meta ? this.$route.meta.layout || 'plain' : 'plain'
  }
}
</script>

<style lang="sass">
body
  margin: 0
  padding: 0
#app
  height: 100vh
  width: 100vw
  background: var(--background)
</style>
