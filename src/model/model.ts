export interface Card {
  number: string
  suits: string
  symbol: string
  numbValue: number
  suitValue: number
  color: string
}

export interface Player {
  card: Card[]
  type: string
  name: string
}

export interface CardCount {
  numbValue: number
  highestSuit: number
  count: number
}

export interface Rank {
  player: string
  rank: number
  name: string
  highNumb: number
  highSuit: number
}
