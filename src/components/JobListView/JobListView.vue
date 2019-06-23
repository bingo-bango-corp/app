<template>
  <div class="JobListView">
    <transition name="fade">
      <div class="loading" v-if="loading">
        <Spinner class="spinner"/>
      </div>
    </transition>
    <transition name="fade-translate">
      <div v-if="!loading" class="content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Spinner from '@/components/Spinner'

@Component({
  components: {
    Spinner
  }
})
export default class JobListView extends Vue {
@Prop(Boolean) readonly loading!: boolean | undefined
}
</script>

<style lang="sass" src="./JobListView.sass">
