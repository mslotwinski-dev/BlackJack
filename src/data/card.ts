export interface Card {
  name: string
  suit: string
  value: number
  short?: string
}

const GetCards = () => {
  const cards = [
    { name: '2', short: '2', value: 2 },
    { name: '3', short: '3', value: 3 },
    { name: '4', short: '4', value: 4 },
    { name: '5', short: '5', value: 5 },
    { name: '6', short: '6', value: 6 },
    { name: '7', short: '7', value: 7 },
    { name: '8', short: '8', value: 8 },
    { name: '9', short: '9', value: 9 },
    { name: '10', short: '10', value: 10 },
    { name: 'Jack', short: 'J', value: 10 },
    { name: 'Queen', short: 'Q', value: 10 },
    { name: 'King', short: 'K', value: 10 },
    { name: 'Ace', short: 'A', value: 0 },
  ]

  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']

  return cards.flatMap((card) => suits.map((suit) => ({ ...card, suit })))
}

export const Cards: Card[] = GetCards()
