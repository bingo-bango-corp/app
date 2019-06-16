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
import { Vue, Component, Watch } from 'vue-property-decorator'
import { JobCard } from 'simsalabim-design'
import store from '@/store'
import { Route } from 'vue-router'
import { mapState } from 'vuex'
import { updateCurrentJobStore, dropJob } from '@/helpers/jobs'
import { Job } from '../../store/models/job'

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
      onClick: async (event: any) => {
        await dropJob(this.$store.getters.uid, this.$store.state.currentJob.data.id)
        await updateCurrentJobStore(this.$store.getters.uid)
        this.$router.push('/make-money')
      }
    },
  ]

  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    await updateCurrentJobStore(store.getters.uid)
    if (!store.state.currentJob.data.state) next('/make-money')
    next()
  }
  
  cardShouldBeCollapsed = false

  handleScrollUpdate(scrollStatus: boolean) {
    this.cardShouldBeCollapsed = !scrollStatus
  }

  scrollChatToTop() {
    (this.$refs.chat as any).scrollToTop()
  }

  @Watch('data')
  onDataChanged(val: Job, oldVal: Job) {
    if (val.state != 'assigned') this.$router.push('/make-money')
  }
}
</script>

<style scoped lang="sass" src="./currentJob.sass">