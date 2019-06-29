<template>
  <div class="JobCardWithActions" v-if="propsForState">
    <JobCard 
      class="jobCard"
      v-bind="{
        title,
        jobId,
        tip,
        actions,
        ...propsForState
      }"
      :callActions="false"
      :collapsed="false"
      :locale="$i18n.locale"
      @actionClicked="handleActionClicked($event)"
      @click.native="$emit('cardClick', $event)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { JobCard, BingoAction } from 'simsalabim-design'
import { State, Job, JobRelationship } from '@/store/models/job'

import { ownerActionsForStates } from './ownerActionsForStates'
import { assigneeActionsForStates } from './assigneeActionsForStates'
import ownerPropsForStates from './ownerPropsForStates'
import assigneePropsForStates from './assigneePropsForStates'
import { JobCardProps } from './types';

@Component({
  components: {
    JobCard
  }
})
export default class JobCardWithActions extends Vue {
  propsForState: JobCardProps | null = null

  @Prop({
    type: String,
    required: true
  }) readonly state!: State

  @Prop({
    type: String
  }) readonly title!: string | undefined

  @Prop({
    type: String,
    required: true
  }) readonly role!: JobRelationship

  @Prop({
    type: String,
  }) readonly description!: string | undefined

  @Prop({
    type: String,
    required: true
  }) readonly jobId!: string

  @Prop({
    type: Object,
    required: true
  }) readonly job!: Job

  @Prop({
    type: Object,
  }) readonly tip!: {
    cents: number,
    currency: string
  } | undefined

  get actions(): BingoAction[] | null {
    return this.role === 'owner'
      ? ownerActionsForStates[this.state]
      : assigneeActionsForStates[this.state]
  }

  async setPropsForState() {
    this.propsForState = this.role === 'owner'
      ? await ownerPropsForStates(this.state, this)
      : await assigneePropsForStates(this.state, this)
  }

  async handleActionClicked(action: Function): Promise<void> {
    this.$emit('shouldGoToLoading')
    await action(this)
    this.$emit('shouldUpdateJobs')
  }

  mounted() {
    this.setPropsForState()
  }
}
</script>

<style scoped lang="sass" src="./JobCardWithActions.sass" />
