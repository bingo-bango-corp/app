<template>
  <transition name="fade-translate">
    <div v-if="!loading" class="Chat">
      <div class="messages">
        <transition-group name="list">
          <ChatMessage 
            v-for="message in $store.getters['chat/messages']"
            class="message"
            :key="message.id"
            :displayName="profileForUid(message.created_by).displayName"
            :photoURL="profileForUid(message.created_by).photoURL"
            :mine="(profileForUid(message.created_by).uid === myProfile.uid)"
            :message="message.message"
          />
        </transition-group>
      </div>
      <BingoInput v-model="messageText" @input="typing"/>
      {{ isOtherPersonTyping }}
      <button @click="sendMessage" @change="typing">send message</button>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { BingoInput, ChatMessage } from 'simsalabim-design'

import { Job } from '../../store/models/job';
import { PublicProfile } from '../../store/models/profile';

@Component({
  components: {
    BingoInput,
    ChatMessage
  }
})
export default class Chat extends Vue {
  messageText = ''
  otherPersonsPublicProfile: PublicProfile | null = null
  isTyping = false
  typingTimeout: number | undefined = undefined
  loading = true

  @Prop({
    type: Object,
    required: true
  }) readonly jobData!: Job

  @Prop({
    type: String,
    required: true
  }) readonly iAm!: 'owner' | 'assignee'

  async created() {
    await this.$store.dispatch('chat/openDBChannel', {
      jobID: this.jobData.id
    })

    const ref = await firebase.firestore()
      .collection('users')
      .doc((this.jobData as any)[this.otherPersonsRole].uid)
      .get()

    const result = ref.data() as PublicProfile

    this.otherPersonsPublicProfile = {
      ...result,
      uid: ref.id
    }

    this.loading = false
  }

  get otherPersonsRole() {
    switch (this.iAm) {
      case 'owner':
        return 'assignee'
      default:
        return 'owner'
    }
  }

  get myProfile() {
    return this.$store.getters.publicProfile
  }

  get isOtherPersonTyping() {
    if (!this.otherPersonsPublicProfile) return false
    return this.$store.getters['chat/typing'][this.otherPersonsPublicProfile.uid] || false
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

  async sendMessage() {
    clearTimeout(this.typingTimeout)
    this.isTyping = false

    this.$store.dispatch('chat/insert', {
      message: this.messageText,
      created_at: {
        seconds: new Date()
      }
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

  async beforeDestroy() {
    await this.$store.dispatch('chat/closeDBChannel', {clearModule: true})
  }
}
</script>

<style scoped lang="sass" src="./Chat.sass">
