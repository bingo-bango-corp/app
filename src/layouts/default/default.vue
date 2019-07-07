<template>
  <div class="default">
    <div class="gradientToBackground" />
    <slot></slot>
    <transition name="move">
      <div
        class="currentJob"
        v-if="shouldDisplayJobBadge"
      >
        <JobBadge
          class="JobBadge"
          headline="Your current job"
          :title="job.thing"
          @click="$router.push('make-money/current-job')"
          :pictureUrl="ownerPictureUrl"
        />
      </div>
    </transition>
    <transition name="fade">
      <div
        class="background"
        v-if="shouldDisplayJobBadge"
      />
    </transition>
    <BottomNav
      :routes="routes" 
      :currentRouteName="$route.name" 
      @navigate="handleNavigation"
      :i18n="this._i18n"
    />
    <div
        class="spacer"
        v-if="shouldDisplayJobBadge"
      />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { BottomNav, BingoRoute, JobBadge } from 'simsalabim-design'
import { routes } from '@/router'
import { Job, OPEN_STATES } from '@/store/models/job'

@Component({
  components: {
    BottomNav,
    JobBadge
  }
})
export default class Default extends Vue {
  routes = routes
  currentJob = true

  handleNavigation(route: BingoRoute) {
    this.$router.push(route.path)
  }

  get job(): Job {
    return this.$store.getters['currentJob/job']
  }

  get shouldDisplayJobBadge(): boolean {
    return this.$route.meta.hideJobBadge ? false : (OPEN_STATES.includes(this.job.state))
  }

  get ownerPictureUrl(): string {
    return this.$store.state.currentJob.ownerPictureUrl
  }
}
</script>

<style lang="sass" scoped src="./default.sass"/>
