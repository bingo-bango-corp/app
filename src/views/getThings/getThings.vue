<template>
  <div class="getThings">
    <BingoButton class="newRequestButton" @clicked="handleNewClick">{{ $t('getThings.newRequest') }}</BingoButton>
    <div class="yourJobs">
      <JobListView :loading="loading">
        <div class="open" v-if="openJobs.length > 0">
          <h3>Current Jobs</h3>
          <div class="job" v-for="(job) in openJobs" :key="job.id">
            <JobCard class="jobCard"
              :title="job.thing"
              :jobId="job.id"
              :description="job.description"
              :actions="actionsForJobState(job.state)"
              :tip="{
                cents: job.tip.cents,
                currency: job.tip.currency
              }"
              :collapsed="false"
              :locale="$i18n.locale"
              @click.native="handleCardClick(job.id)"
            />
          </div>
        </div>
        <div class="settled" v-if="settledJobs.length > 0">
          <h3>Past Jobs</h3>
          <div class="job" v-for="(job) in settledJobs" :key="job.id">
            <JobCard class="jobCard"
              :title="job.thing"
              :jobId="job.id"
              :description="job.description"
              :actions="actionsForJobState(job.state)"
              :tip="{
                cents: job.tip.cents,
                currency: job.tip.currency
              }"
              :collapsed="false"
              :elevated="false"
              :locale="$i18n.locale"
              @click.native="handleCardClick(job.id)"
            />
          </div>
        </div>
      </JobListView>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getOwnJobs, JobList, cancelJob } from '@/helpers/jobs'
import JobListView from '@/components/JobListView'
import router from '@/router'
import { BingoButton, JobCard } from 'simsalabim-design'
import { Job, OPEN_STATES, SETTLED_STATES, State } from '../../store/models/job'

@Component({
  components: {
    BingoButton,
    JobCard,
    JobListView
  }
})
export default class getThings extends Vue {
  myJobs: Job[] = []
  loading: boolean = true

  assignedJobActions = [
    {
      title: '💬 Go to chat',
      backgroundColor: 'var(--secondary)',
      onClick: (event: any) => {
        event.event.stopPropagation()
        router.push(`/get-things/${event.meta.jobId}`)
      }
    },
    {
      title: '🚫 Cancel job',
      backgroundColor: '#EB5757',
      onClick: (event: any) => {
        event.event.stopPropagation()
        this.cancelJob(event)
      }
    },
  ]

  unassingedJobActions = [
    {
      title: '🚫 Cancel job',
      backgroundColor: '#EB5757',
      onClick: (event: any) => {
        event.event.stopPropagation()
        this.cancelJob(event)
      }
    },
  ]

  actionsForJobState(state: State) {
    switch (state) {
      case 'unassigned':
        return this.unassingedJobActions
      case 'assigned':
        return this.assignedJobActions
      default:
        return null
    } 
  }

  handleNewClick(): void {
    this.$router.push('get-things/new')
  }

  handleCardClick(id: string): void {
    this.$router.push(`/get-things/${id}`)
  }

  get openJobs(): Job[] {
    return this.myJobs.filter((j: Job) => {
      return OPEN_STATES.includes(j.state)
    })
  }

  get settledJobs(): Job[] {
    return this.myJobs.filter((j: Job) => {
      return SETTLED_STATES.includes(j.state)
    })
  }

  jobArrayFromJobList(jobList: JobList): Array<Job> {
    return Object.keys(jobList).map((k) => {
      return {
        id: k,
        ...jobList[k]
      }
    })
  }

  async cancelJob(e: any): Promise<void> {
    await cancelJob(e.meta.jobId, this.$store.getters.uid)
    this.updateJobs()
  }

  async updateJobs(): Promise<void> {
    this.loading = true
    this.myJobs = this.jobArrayFromJobList(await getOwnJobs(this.$store.getters.uid))
    this.loading = false
  }

  async mounted(): Promise<void> {
    await this.updateJobs()
  }
} 
</script>

<style scoped lang="sass" src="./getThings.sass">