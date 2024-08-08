/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */

const Deck: Card[] = []
const CroupierDeck: Card[] = []

interface Card {
  name: string
  value: number
}

const Cards: Card[] = [
  { name: '2', value: 2 },
  { name: '3', value: 3 },
  { name: '4', value: 4 },
  { name: '5', value: 5 },
  { name: '6', value: 6 },
  { name: '7', value: 7 },
  { name: '8', value: 8 },
  { name: '9', value: 9 },
  { name: '10', value: 10 },
  { name: 'Jack', value: 10 },
  { name: 'Queen', value: 10 },
  { name: 'King', value: 10 },
  { name: 'Ace', value: 0 },
]

const PickCard = (deck: Card[], n = 1) => {
  for (let i = 0; i < n; i++)
    deck.push(Cards[Math.floor(Math.random() * Cards.length)])
}

const Calculete = (deck: Card[]): number => {
  let sum = 0
  for (const i in deck) {
    sum += deck[i].value
  }

  const aces = deck.filter((e) => e.name == 'Ace')
  for (const _ in aces) {
    sum += sum < 11 ? 11 : 1
  }

  if (sum == 21) console.log('Black Jack!')

  return sum <= 21 ? sum : 0
}

PickCard(Deck, 2)
PickCard(CroupierDeck, 1)

document.getElementById('deck')!.innerHTML = String(Deck.map((e) => e.name))
document.getElementById('sumadeck')!.innerHTML = String(Calculete(Deck))
document.getElementById('deckkrupier')!.innerHTML = String(
  CroupierDeck.map((e) => e.name)
)
document.getElementById('sumadeckkrupier')!.innerHTML = String(
  Calculete(CroupierDeck)
)

const hit = () => {
  PickCard(Deck)
  document.getElementById('deck')!.innerHTML = String(Deck.map((e) => e.name))
  document.getElementById('sumadeck')!.innerHTML = String(Calculete(Deck))
  if (Calculete(Deck) == 0) {
    document.getElementById('score')!.innerHTML = 'PRZEGRANA'
  }
}

const stand = () => {
  if (Calculete(Deck) != 0) {
    while (true) {
      if (Calculete(CroupierDeck) == 0) {
        document.getElementById('score')!.innerHTML = 'WYGRANA'
        break
      }

      if (
        Calculete(CroupierDeck) < 17 ||
        Calculete(CroupierDeck) < Calculete(Deck)
      ) {
        PickCard(CroupierDeck)

        document.getElementById('deckkrupier')!.innerHTML = String(
          CroupierDeck.map((e) => e.name)
        )

        document.getElementById('sumadeckkrupier')!.innerHTML = String(
          Calculete(CroupierDeck)
        )
      }

      if (Calculete(CroupierDeck) > Calculete(Deck)) {
        document.getElementById('score')!.innerHTML = 'PRZEGRANA'
        break
      }

      if (
        Calculete(CroupierDeck) == Calculete(Deck) &&
        Calculete(CroupierDeck) >= 17
      ) {
        document.getElementById('score')!.innerHTML = 'REMIS'
        break
      }
    }
  }
}
