<template ref="chat">
  <div class="chatContainer" ref="chat"> 
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
          <transition name="list">
            <TypingIndicator v-if="isOtherPersonTyping" :pictureURL="otherPersonsPublicProfile.pictureURL" />
          </transition>
        </div>
        <div class="inputBar"
          :style="{
            width: containerWidth,
            left: containerLeft,
            opacity: 1
          }"
        >
          <BingoInput
            class="input"
            v-model="messageText"
            @input="typing"
          />
          <BingoButton @clicked="sendMessage">Send</BingoButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { 
  BingoInput,
  ChatMessage,
  BingoButton,
  TypingIndicator,
} from 'simsalabim-design'

import { Job } from '../../store/models/job';
import { PublicProfile } from '../../store/models/profile';

@Component({
  components: {
    BingoInput,
    ChatMessage,
    BingoButton,
    TypingIndicator
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
    if (!this.$store.getters['chat/typing']) return false
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
      seconds: new Date()
    })

    this.messageText = ''

    await this.$nextTick

    document.getElementById('app')!.scrollTo(0,document.getElementById('app')!.scrollHeight)
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

  get containerWidth() {
    return this.$refs.chat ? `${(this.$refs.chat as HTMLDivElement).offsetWidth}px` : '0px'
  }

  get containerLeft() {
    return this.$refs.chat ? `${(this.$refs.chat as HTMLDivElement).getBoundingClientRect().left}px` : '0px'
  }
}
</script>

<style scoped lang="sass" src="./Chat.sass">
