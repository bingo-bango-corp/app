<template ref="chat">
  <div class="chatContainer" ref="chat"> 
    <transition name="fade-translate">
      <div v-if="!loading && isThereAnotherPerson" class="Chat">
        <div 
          class="messages" 
          v-chat-scroll="{always: false}"
          @scroll="handleScroll"
          ref="messagesContainer"
        >
          <ChatMessage 
            v-for="message in $store.getters['chat/messages']"
            class="message"
            :notice="message.type === 'notice'"
            :key="message.id"
            :displayName="profileForUid(message.created_by).displayName"
            :photoURL="profileForUid(message.created_by).photoURL"
            :mine="(profileForUid(message.created_by).uid === myProfile.uid)"
            :message="textForMessage(message)"
          />
          <transition name="list">
            <TypingIndicator v-if="isOtherPersonTyping" :pictureURL="otherPersonsPublicProfile.photoURL" />
          </transition>
        </div>
        <div class="inputBar" v-if="jobIsOpen">
          <BingoInput
            class="input"
            v-model="messageText"
            @input="typing"
          />
          <BingoButton @clicked="sendMessage">
            <svg class="sendIcon" width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="sendIconPath" fill-rule="evenodd" clip-rule="evenodd" d="M4 5.66617C4.00001 4.15523 5.60995 3.19214 6.94118 3.90213L22.125 12.0001L6.9417 20.0987C5.6095 20.8093 4.00047 19.8439 4.00041 18.3341L4 5.66617ZM6 5.66618L6.00001 11.0002H13V13.0002H6.00007L6.00041 18.334L17.8752 12.0002L6 5.66618Z"/>
            </svg>
          </BingoButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/firestore'

import textForMessage from './textForMessage'

import { 
  BingoInput,
  ChatMessage,
  BingoButton,
  TypingIndicator,
} from 'simsalabim-design'

import { Job, JobRelationship, OPEN_STATES } from '../../store/models/job';
import { PublicProfile } from '../../store/models/profile';
import { Message, Notice } from './types';

@Component({
  components: {
    BingoInput,
    ChatMessage,
    BingoButton,
    TypingIndicator
  }
})
export default class Chat extends Vue {
  testdata = false
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
  }) readonly iAm!: JobRelationship

  get otherPersonsUid() {
    return (this.jobData as any)[this.otherPersonsRole].uid
  }

  get isThereAnotherPerson() {
    return ((this.jobData as any)[this.otherPersonsRole]) ? true : false
  }

  async created() {
    await this.$store.dispatch('chat/openDBChannel', {
      jobID: this.jobData.id
    })

    if (this.isThereAnotherPerson) await this.populateOtherPersonsPublicProfile()

    this.loading = false
  }

  async populateOtherPersonsPublicProfile() {
    const ref = await firebase.firestore()
      .collection('users')
      .doc(this.otherPersonsUid)
      .get()

    const result = ref.data() as PublicProfile

    this.otherPersonsPublicProfile = {
      ...result,
      uid: ref.id
    }
  }

  get otherPersonsRole() {
    switch (this.iAm) {
      case 'owner':
        return 'assignee'
      default:
        return 'owner'
    }
  }

  get jobIsOpen() {
    return OPEN_STATES.includes(this.jobData.state)
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
      seconds: new Date(),
      [this.myProfile.uid]: val
    })
  }

  previousScrollStatus: boolean | undefined = undefined
  previousHeight: number | undefined = undefined

  handleScroll() {
    const elem = this.$refs.messagesContainer as HTMLDivElement
    const atTop = elem.scrollTop === 0
    const height = elem.getBoundingClientRect().height

    if (this.previousScrollStatus != atTop && this.previousHeight === height) {
      this.$emit('scrollStatus', atTop)
      this.previousScrollStatus = atTop
      this.previousHeight = height
    }
    this.previousHeight = height
  }

  public scrollToTop() {
    const elem = (this.$refs.messagesContainer as HTMLDivElement)
    const c = elem.scrollTop
    if (c > 0) {
      window.requestAnimationFrame(this.scrollToTop)
      elem.scrollTo(0, c - c / 4)
    }
  }

  textForMessage(message: Message | Notice) {
    return textForMessage(
      message,
      message.seconds.seconds * 1000,
      this.iAm,
      this.otherPersonsPublicProfile!
    )
  }

  async beforeDestroy() {
    await this.$store.dispatch('chat/closeDBChannel', {clearModule: true})
  }
}
</script>

<style scoped lang="sass" src="./Chat.sass">
