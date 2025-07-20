import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Card, CardCount } from '@/model/model'

export const cardStore = defineStore('card', () => {
  const cardNumber = ref([
    {
      number: '2',
      value: 1,
    },
    {
      number: '3',
      value: 2,
    },
    {
      number: '4',
      value: 3,
    },
    {
      number: '5',
      value: 4,
    },
    {
      number: '6',
      value: 5,
    },
    {
      number: '7',
      value: 6,
    },
    {
      number: '8',
      value: 7,
    },
    {
      number: '9',
      value: 8,
    },
    {
      number: '10',
      value: 9,
    },
    {
      number: 'J',
      value: 10,
    },
    {
      number: 'Q',
      value: 11,
    },
    {
      number: 'K',
      value: 12,
    },
    {
      number: 'A',
      value: 13,
    },
  ])
  const cardAlpha = ref([
    {
      symbol: '@',
      suits: '♦',
      value: 1,
      color: 'red',
    },
    {
      symbol: '#',
      suits: '♣',
      value: 2,
      color: 'black',
    },
    {
      symbol: '^',
      suits: '♥',
      value: 3,
      color: 'red',
    },
    {
      symbol: '*',
      suits: '♠',
      value: 4,
      color: 'black',
    },
  ])

  const gameLogic = ref([
    // Setting Game Logic Descending
    {
      name: 'Royal Flush',
      rank: 1,
      logic: (cards: Card[]) => {
        const cardCheck = cards.map((c) => c.numbValue).sort((a, b) => a - b)
        const isFlush = checkFlush(cards)
        return {
          check: isFlush.check && cardCheck.join(',') === '9,10,11,12,13',
          highNumb: 13,
          highSuit: isFlush.highSuit,
        }
      },
    },
    {
      name: 'Straight Flush',
      rank: 2,
      logic: (cards: Card[]) => {
        const isFlush = checkFlush(cards)
        const isStraight = checkStraight(cards)
        return {
          check: isFlush.check && isStraight.check,
          highNumb: isStraight.highNumb,
          highSuit: isFlush.highSuit,
        }
      },
    },
    {
      name: 'Four of a Kind',
      rank: 3,
      logic: (cards: Card[]) => {
        const theCount = cardCount(cards)
        return {
          check: theCount.check == '41',
          highNumb: theCount.highNumb,
          highSuit: theCount.highSuit,
        }
      },
    },
    {
      name: 'Full House',
      rank: 4,
      logic: (cards: Card[]) => {
        const theCount = cardCount(cards)
        return {
          check: theCount.check == '32',
          highNumb: theCount.highNumb,
          highSuit: theCount.highSuit,
        }
      },
    },
    {
      name: 'Flush',
      rank: 5,
      logic: (cards: Card[]) => {
        const isFlush = checkFlush(cards)
        return {
          check: isFlush.check,
          highNumb: isFlush.highNumb,
          highSuit: isFlush.highSuit,
        }
      },
    },
    {
      name: 'Straight',
      rank: 6,
      logic: (cards: Card[]) => {
        const isStraight = checkStraight(cards)
        return {
          check: isStraight.check,
          highNumb: isStraight.highNumb,
          highSuit: isStraight.highSuit,
        }
      },
    },
    {
      name: 'Three of a Kind',
      rank: 7,
      logic: (cards: Card[]) => {
        const theCount = cardCount(cards)
        return {
          check: theCount.check == '311',
          highNumb: theCount.highNumb,
          highSuit: theCount.highSuit,
        }
      },
    },
    {
      name: 'Two Pair',
      rank: 8,
      logic: (cards: Card[]) => {
        const theCount = cardCount(cards)
        return {
          check: theCount.check == '221',
          highNumb: theCount.highNumb,
          highSuit: theCount.highSuit,
        }
      },
    },
    {
      name: 'One Pair',
      rank: 9,
      logic: (cards: Card[]) => {
        const theCount = cardCount(cards)
        return {
          check: theCount.check == '2111',
          highNumb: theCount.highNumb,
          highSuit: theCount.highSuit,
        }
      },
    },
    {
      name: 'High Card',
      rank: 10,
      logic: (cards: Card[]) => {
        const cardRank = cards.sort((a, b) => b.numbValue - a.numbValue)
        return {
          check: true,
          highNumb: cardRank[0].numbValue,
          highSuit: cardRank[0].suitValue,
        }
      },
    },
  ])

  function checkFlush(cards: Card[]) {
    const suit = cards[0].suits
    const checkHigh = cards.sort((a, b) => b.numbValue - a.numbValue)
    return {
      check: cards.every((card) => card.suits === suit),
      highSuit: cards[0].suitValue,
      highNumb: checkHigh[0].numbValue,
    }
  }

  function checkStraight(cards: Card[]) {
    // Sort card in ascending
    const straightCheck = cards.sort((a, b) => a.numbValue - b.numbValue)
    let isStraight = true
    for (let i = 1; i < straightCheck.length; i++) {
      if (straightCheck[i].numbValue - 1 != straightCheck[i - 1].numbValue) {
        isStraight = false
      }
    }
    const checkHigh = cards.sort((a, b) => b.suitValue - a.suitValue)
    return {
      check: isStraight,
      highNumb: straightCheck[straightCheck.length - 1].numbValue,
      highSuit: checkHigh[0].suitValue,
    }
  }

  function cardCount(cards: Card[]) {
    let countCard: CardCount[] = []
    for (const card of cards) {
      const countData = countCard.filter((val) => val.numbValue == card.numbValue)
      if (countData.length > 0) {
        for (const count of countData) {
          if (count.numbValue == card.numbValue) {
            count.count++
            if (card.suitValue > count.highestSuit) {
              count.highestSuit = card.suitValue
            }
          }
        }
      } else {
        const cardCount: CardCount = {
          numbValue: card.numbValue,
          highestSuit: card.suitValue,
          count: 1,
        }
        countCard.push(cardCount)
      }
    }
    // sort by count
    countCard = countCard.sort((a, b) => b.count - a.count)
    const theString = countCard.map((item) => item.count).join('')
    if (theString == '221') {
      const theSingle = countCard.find((val) => val.count === 1)!
      const check = countCard
        .filter((val) => val.count === 2)
        .sort((a, b) => b.numbValue - a.numbValue)

      check.push(theSingle)
      countCard = check
    }
    return {
      check: theString,
      highSuit: countCard[0].highestSuit,
      highNumb: countCard[0].numbValue,
    }
  }

  function getFullDeck() {
    const buildDeck: Card[] = []
    for (const numb of cardNumber.value) {
      for (const suit of cardAlpha.value) {
        buildDeck.push({
          number: numb.number,
          suits: suit.suits,
          symbol: suit.symbol,
          numbValue: numb.value,
          suitValue: suit.value,
          color: suit.color,
        })
      }
    }
    return buildDeck
  }

  function shuffleDeck(deck: Array<Card>) {
    const shuffled = deck
    for (let i = 0; i < shuffled.length; i++) {
      const shuffledNumber = Math.floor(Math.random() * shuffled.length)
      const currentCard = shuffled[i]
      const targetCard = shuffled[shuffledNumber]
      shuffled[shuffledNumber] = currentCard
      shuffled[i] = targetCard
    }
    return shuffled
  }

  return { cardNumber, cardAlpha, shuffleDeck, getFullDeck, gameLogic }
})
