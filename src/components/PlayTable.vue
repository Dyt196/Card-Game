<script setup lang="ts">
import { cardStore } from '@/stores/card'
import CardsComponent from './CardsComponent.vue'
import { ref } from 'vue'
import { type Player, type Card, type Rank } from '@/model/model'

const theCardStore = cardStore()
// const fullDeck = computed(() => theCardStore.fullDeck)
const playingDeck = ref<Card[]>(theCardStore.getFullDeck())
const isShuffled = ref(false)
const isPlayed = ref(false)
const isShown = ref(false)
const cardPerPlayer = ref(5)
// const numberOfPlayer = ref(4)
const mainPlayer = ref<Player>({
  name: 'Player',
  card: [],
  type: 'Player',
})
const leftPlayer = ref<Player>({
  name: 'Lefty',
  card: [],
  type: 'Computer',
})
const topPlayer = ref<Player>({
  name: 'Toppy',
  card: [],
  type: 'Computer',
})
const rightPlayer = ref<Player>({
  name: 'Righty',
  card: [],
  type: 'Computer',
})

const theWinner = ref<Rank | null>(null)

function shuffleDeck() {
  console.info('Shuffling Deck')
  playingDeck.value = theCardStore.shuffleDeck(playingDeck.value)
  isShuffled.value = true
}

async function dealCard() {
  console.info('Dealing Card')
  const totalToDeal = cardPerPlayer.value
  console.info('Total Deal', totalToDeal)
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
  for (let i = 0; i < totalToDeal; i++) {
    console.info('Dealing Card', i)
    let theCard: Card | undefined = playingDeck.value.shift()
    if (theCard != undefined) {
      mainPlayer.value.card.push(theCard)
    }
    await delay(200)
    theCard = playingDeck.value.shift()
    if (theCard != undefined) {
      leftPlayer.value.card.push(theCard)
    }
    await delay(200)
    theCard = playingDeck.value.shift()
    if (theCard != undefined) {
      topPlayer.value.card.push(theCard)
    }
    await delay(200)
    theCard = playingDeck.value.shift()
    if (theCard != undefined) {
      rightPlayer.value.card.push(theCard)
    }
  }
  isPlayed.value = true
}

async function showWinning() {
  isShown.value = true
  let rankingBoard: Rank[] = []
  const playerToRank = []
  playerToRank.push(mainPlayer.value)
  playerToRank.push(leftPlayer.value)
  playerToRank.push(topPlayer.value)
  playerToRank.push(rightPlayer.value)
  for (const player of playerToRank) {
    let playerEvaluated = false
    for (const rule of theCardStore.gameLogic) {
      const logicData = rule.logic(player.card)
      if (logicData.check) {
        rankingBoard.push({
          player: player.name,
          rank: rule.rank,
          name: rule.name,
          highNumb: logicData.highNumb,
          highSuit: logicData.highSuit,
        })
        playerEvaluated = true
        break
      }
    }
    if (playerEvaluated) continue
  }
  rankingBoard = rankingBoard.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank // ascending Rank
    if (a.highNumb !== b.highNumb) return b.highNumb - a.highNumb // descending Number
    return b.highSuit - a.highSuit // descending Suit
  })
  console.info('Ranking', rankingBoard)
  theWinner.value = rankingBoard[0]
}

function resetPlay() {
  isShuffled.value = false
  isPlayed.value = false
  isShown.value = false
  playingDeck.value = theCardStore.getFullDeck()
  mainPlayer.value.card = []
  leftPlayer.value.card = []
  topPlayer.value.card = []
  rightPlayer.value.card = []
  theWinner.value = null
}
</script>

<template>
  <div class="h-dvh flex flex-col items-center justify-between p-6" style="width: 100%">
    <!-- Opponent (Top) -->
    <div class="content-center mb-4">
      <div class="flex gap-1">
        <template v-for="(card, c) in topPlayer.card" :key="c">
          <CardsComponent
            :color="card.color"
            :number="card.number"
            :suit="card.suits"
            :symbol="card.symbol"
            :hide="!isShown"
          />
        </template>
      </div>
      <div class="text-center">{{ topPlayer.name }}</div>
      <div
        v-if="theWinner?.player == topPlayer.name"
        class="text-center animate-bounce text-2xl font-bold text-yellow-500"
      >
        ♛♛♛ Winner ♛♛♛
      </div>
    </div>

    <!-- Middle Section (Left, Center, Right) -->
    <div class="flex flex-row w-full justify-between items-center flex-1">
      <!-- Left Player -->
      <div class="rotate-90 content-center">
        <div
          v-if="theWinner?.player == leftPlayer.name"
          class="text-center animate-bounce text-2xl font-bold text-yellow-500"
        >
          ♛♛♛ Winner ♛♛♛
        </div>
        <div class="text-center">
          {{ leftPlayer.name }}
        </div>
        <div class="flex gap-1">
          <template v-for="(card, c) in leftPlayer.card" :key="c">
            <CardsComponent
              class="rotate-[-90deg]"
              :color="card.color"
              :number="card.number"
              :suit="card.suits"
              :symbol="card.symbol"
              :hide="!isShown"
            />
          </template>
        </div>
      </div>

      <!-- Center Table -->
      <div class="flex flex-col items-center justify-center gap-4">
        <!-- Deck Display -->
        <div class="relative w-[100px] h-[140px] mb-4">
          <template v-for="(card, c) in playingDeck" :key="c">
            <div
              class="absolute transition-all duration-300"
              :style="{
                top: `${c * 0.25}px`,
                left: `${c * 0.25}px`,
                zIndex: -c,
              }"
            >
              <CardsComponent
                :color="card.color"
                :number="card.number"
                :suit="card.suits"
                :symbol="card.symbol"
                hide
              />
            </div>
          </template>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4">
          <button
            class="bg-blue-500 text-white cursor-pointer px-6 py-2 rounded-lg font-bold hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            @click="shuffleDeck()"
            :disabled="isPlayed"
          >
            Shuffle
          </button>
          <button
            class="bg-green-500 text-white cursor-pointer px-6 py-2 rounded-lg font-bold hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            @click="dealCard()"
            :disabled="!isShuffled || isPlayed"
          >
            Play
          </button>
          <button
            class="bg-green-500 text-white cursor-pointer px-6 py-2 rounded-lg font-bold hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            @click="showWinning()"
            :disabled="!isPlayed || isShown"
          >
            Show
          </button>

          <button
            class="bg-green-500 text-white cursor-pointer px-6 py-2 rounded-lg font-bold hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            @click="resetPlay()"
            :disabled="!isShown"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Right Player -->
      <div class="content-center rotate-[-90deg]">
        <div
          v-if="theWinner?.player == rightPlayer.name"
          class="text-center animate-bounce text-2xl font-bold text-yellow-500"
        >
          ♛♛♛ Winner ♛♛♛
        </div>
        <div class="text-center">
          {{ rightPlayer.name }}
        </div>
        <div class="flex gap-1">
          <template v-for="(card, c) in rightPlayer.card" :key="c">
            <CardsComponent
              class="rotate-90"
              :color="card.color"
              :number="card.number"
              :suit="card.suits"
              :symbol="card.symbol"
              :hide="!isShown"
            />
          </template>
        </div>
      </div>
    </div>

    <!-- Main Player (Bottom) -->
    <div class="content-center mt-4">
      <div
        v-if="theWinner?.player == mainPlayer.name"
        class="text-center animate-bounce text-2xl font-bold text-yellow-500"
      >
        ♛♛♛ Winner ♛♛♛
      </div>
      <div class="text-center">
        {{ mainPlayer.name }}
      </div>
      <div class="flex gap-1">
        <template v-for="(card, c) in mainPlayer.card" :key="c">
          <CardsComponent
            :color="card.color"
            :number="card.number"
            :suit="card.suits"
            :symbol="card.symbol"
            :hide="false"
          />
        </template>
      </div>
    </div>
  </div>
</template>
