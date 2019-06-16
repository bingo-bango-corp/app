<template>
  <div class="currentJob">
    <JobCard class="jobCard"
      :title="data.thing"
      :jobId="data.id"
      :description="data.description"
      :actions="jobActions"
      :tip="{
        cents: data.tip.cents,
        currency: data.tip.currency
      }"
      :locale="$i18n.locale"
      :collapsed="cardShouldBeCollapsed"
      @click.native="scrollChatToTop"
    />
    <Chat 
      :jobData="data"
      iAm="assignee"
      ref="chat"
      @scrollStatus="handleScrollUpdate"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { JobCard } from 'simsalabim-design'
import store from '@/store'
import { Route } from 'vue-router'
import { mapState } from 'vuex'

import Chat from '@/components/Chat'

Component.registerHooks([
  'beforeRouteEnter'
])

@Component({
  computed: mapState('currentJob', ['data']),
  components: {
    JobCard,
    Chat
  }
})
export default class currentJob extends Vue {
  jobActions = [
    {
      title: '✅ Delivered',
      backgroundColor: 'var(--primary)',
      onClick: (event: any) => {
        event.event.stopPropagation()
      }
    },
    {
      title: '🚫 I can\'t pick it up',
      backgroundColor: '#EB5757',
      onClick: (event: any) => {
        event.event.stopPropagation()
      }
    },
  ]

  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    if (!store.state.currentJob.data.state) next('/')
    next()
  }
  
  cardShouldBeCollapsed = false

  handleScrollUpdate(scrollStatus: boolean) {
    this.cardShouldBeCollapsed = !scrollStatus
  }

  scrollChatToTop() {
    (this.$refs.chat as any).scrollToTop()
  }
}
</script>

<style scoped lang="sass" src="./currentJob.sass">