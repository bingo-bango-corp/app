<template>
  <div class="Chat">
    <div class="messages">
      <div class="message" v-for="message in messages" :key="message.id">
        {{ profileForUid(message.created_by).displayName }}
        {{ message.message }}
      </div>
    </div>
    <BingoInput v-model="messageText" @input="typing"/>
    {{ isOtherPersonTyping }}
    <button @click="sendMessage" @change="typing">send message</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { BingoInput } from 'simsalabim-design'

import { Job } from '../../store/models/job';
import { arrayUnion, arrayRemove } from 'vuex-easy-firestore';
import { PublicProfile } from '../../store/models/profile';

@Component({
  components: {
    BingoInput
  }
})
export default class Chat extends Vue {
  messageText = ''
  otherPersonsPublicProfile: PublicProfile | null = null
  isTyping = false
  typingTimeout: number | undefined = undefined

  @Prop({
    type: Object,
    required: true
  }) readonly jobData!: Job

  @Prop({
    type: String,
    required: true
  }) readonly iAm!: 'owner' | 'assignee'

  async mounted() {
    this.$store.dispatch('chat/openDBChannel', {
      jobID: this.jobData.id
    })

    this.otherPersonsPublicProfile = (await firebase.firestore()
      .collection('users')
      .doc((this.jobData as any)[this.otherPersonsRole].uid)
      .get()).data() as PublicProfile
  }

  get otherPersonsRole() {
    switch (this.iAm) {
      case 'owner':
        return 'assignee'
      default:
        return 'owner'
    }
  }

  get messages() {
    return Object.values(this.$store.state.chat.data).filter((m: any) => m.id != 'typing')
  }

  get myProfile() {
    return this.$store.getters.publicProfile
  }

  get isOtherPersonTyping() {
    if (!this.otherPersonsPublicProfile) return false
    return this.$store.state.chat.data.typing[this.otherPersonsPublicProfile.uid] || false
  }

  profileForUid(uid: string) {
    return (uid === this.myProfile.uid)
      ? this.myProfile
      : this.otherPersonsPublicProfile
  }

  typing() {
    this.isTyping = true
    this.updateTypingTimeout()
  }

  updateTypingTimeout() {
    clearTimeout(this.typingTimeout)

    this.typingTimeout = setTimeout(() => {
      this.isTyping = false
    }, 2000)
  }

  sendMessage() {
    clearTimeout(this.typingTimeout)

    this.$store.dispatch('chat/insert', {
      message: this.messageText
    })

    this.messageText = ''
  }

  @Watch('isTyping')
  onTypingChanged(val: boolean) {
    this.$store.dispatch('chat/set', {
      id: 'typing',
      [this.myProfile.uid]: val
    })
  }
}
</script>

<style scoped lang="sass" src="./Chat.sass">
