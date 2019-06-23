
<template>
  <div class="JobCardWithActions">
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
import { State, Job } from '../../store/models/job'

import { actionsForStates } from './actionsForStates'
import propsForStates from './propsForStates'

@Component({
  components: {
    JobCard
  }
})
export default class JobCardWithActions extends Vue {
  propsForState = {}

  @Prop({
    type: String,
    required: true
  }) readonly state!: State

  @Prop({
    type: String,
  }) readonly title!: string | undefined

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

  get actions(): BingoAction[] {
    return actionsForStates[this.state]
      ? actionsForStates[this.state]
      : []
  }

  async setPropsForState() {
    this.propsForState = await propsForStates(this.state, this)
  }

  handleActionClicked(action: Function): void {
    action(this)
  }

  mounted() {
    this.setPropsForState()
  }
}
</script>

<style scoped lang="sass" src="./JobCardWithActions.sass" />
