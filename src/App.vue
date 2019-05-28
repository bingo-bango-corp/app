<template>
  <div id="app">
    <component :is="desiredLayout">
      <router-view/>
    </component>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {Route} from 'vue-router'
import layouts from '@/layouts'

@Component({
  components: layouts
})
export default class App extends Vue {
  get desiredLayout() {
    return this.$route.meta ? this.$route.meta.layout || 'plain' : 'plain'
  }
}
</script>
