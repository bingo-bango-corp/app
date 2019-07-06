<template>
  <div class="currentJob">
    <JobChatView
      :job="job"
      :forceLoading="forceLoading"
      @actionClicked="handleActionClicked"
      role="assignee"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import store from '@/store'
import { Route } from 'vue-router'
import { mapState } from 'vuex'
import { updateCurrentJobStore, dropJob, unsubscribeFromJob } from '@/helpers/jobs'
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

  created() {
    this.$store.dispatch('notifications/setCurrentViewValidator', (payload: any) => {
      const { type, context } = payload

      if (type === 'new-chat-message' && this.job.id === context) {
        return false
      } else {
        return true
      }
    })
  }

  beforeDestroy() {
    this.$store.dispatch('notifications/purgeCurrentViewValidator')
  }

  get job() {
    return this.$store.state.currentJob.data
  }

  handleActionClicked(): void {
    this.forceLoading = true
  }

  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    await updateCurrentJobStore(store.getters.uid)
    if (!store.state.currentJob.data.state) next('/make-money')
    next()
  }

  @Watch('data.state')
  onDataChanged(val: string, oldVal: string) {
    if (val === 'cancelled' || val === 'lost') {
      this.$router.push('/make-money')
      unsubscribeFromJob()
    }
  }
}
</script>

<style scoped lang="sass" src="./currentJob.sass">