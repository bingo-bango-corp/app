<template>
  <div class="currentJob">
    <JobChatView
      :actions="jobActions"
      :job="data"
      :forceLoading="forceLoading"
      @actionClicked="handleActionClicked"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import store from '@/store'
import { Route } from 'vue-router'
import { mapState } from 'vuex'
import { updateCurrentJobStore, dropJob } from '@/helpers/jobs'
import { Job } from '../../store/models/job'

import JobChatView from '@/components/JobChatView'

import Chat from '@/components/Chat'

Component.registerHooks([
  'beforeRouteEnter'
])

@Component({
  computed: mapState('currentJob', ['data']),
  components: {
    JobChatView
  }
})
export default class currentJob extends Vue {
  forceLoading: boolean = false

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
        this.forceLoading = true
        await dropJob(this.$store.getters.uid, this.$store.state.currentJob.data.id)
        await updateCurrentJobStore(this.$store.getters.uid)
        this.$router.push('/make-money')
      }
    },
  ]

  handleActionClicked(): void {
    this.forceLoading = true
  }

  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    await updateCurrentJobStore(store.getters.uid)
    if (!store.state.currentJob.data.state) next('/make-money')
    next()
  }

  @Watch('data')
  onDataChanged(val: Job, oldVal: Job) {
    if (val.state !== 'assigned') this.$router.push('/make-money')
  }
}
</script>

<style scoped lang="sass" src="./currentJob.sass">