<template>
  <div class="you">
    <HeadlineContentPair
      :headline="$t('you.displayName.headline')"
      :description="$t('you.displayName.description')"
      class="displayName"
    >
      <BingoInput type="text" v-model="displayName" @blur="handleDisplayNameBlur" />
    </HeadlineContentPair>
    <HeadlineContentPair
      headline="🔗 Linked Accounts"
      description="These are the accounts you've used to sign into Bingo Bango."
      class="linkedAccounts"
    >
      <AccountListItem 
        class="account"
        v-for="(account, index) in accounts"
        :key="index"
        :accountType="account.providerId"
        :label="account.email"
      />
    </HeadlineContentPair>
    <HeadlineContentPair
      :headline="$t('you.theme.headline')"
      :description="$t('you.theme.description')"
      class="theme"
    >
      <div class="themeButtons">
        <BingoButton class="themeSwitcher" :class="{active : currentTheme === 'light'}" @clicked="switchLight">
          {{ $t('you.theme.themeButtons.light') }}
        </BingoButton>
        <BingoButton class="themeSwitcher" :class="{active : currentTheme === 'dark'}" @clicked="switchDark">
          {{ $t('you.theme.themeButtons.dark') }}
        </BingoButton>
        <BingoButton class="themeSwitcher" :class="{active : currentTheme === 'insane'}" @clicked="switchInsane">
          {{ $t('you.theme.themeButtons.insane') }}
        </BingoButton>
      </div>
    </HeadlineContentPair>
    <BingoButton backgroundColor="var(--cardBackground)" color="var(--foreground)" @clicked="signOut">{{ $t('you.logOut') }}</BingoButton>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { 
  BingoButton,
  HeadlineContentPair,
  BingoInput,
  AccountListItem
} from 'simsalabim-design'

@Component({
  components: {
    BingoButton,
    HeadlineContentPair,
    BingoInput,
    AccountListItem,
  }
})
export default class makeMoney extends Vue {
  get accounts() {
    return this.$store.state.profile.data.byAuthProvider
  }

  get currentTheme() {
    return this.$store.getters.currentTheme
  }

  get displayName() {
    return this.$store.state.profile.data.displayName
  }

  handleDisplayNameBlur() {
    this.$store.dispatch('updateRemoteDisplayName')
  }

  set displayName(value) {
    this.$store.dispatch('setDisplayName', value)
  }

  switchLight() {
    this.$store.dispatch('setCurrentTheme', 'light')
  }

  switchDark() {
    this.$store.dispatch('setCurrentTheme', 'dark')
  }

  switchInsane() {
    this.$store.dispatch('setCurrentTheme', 'insane')
  }

  async signOut() {
    await this.$store.dispatch('signOut')
    this.$router.push('/login')
  }
} 
</script>

<style scoped lang="sass" src="./you.sass">