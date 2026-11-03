// PLACEHOLDER catalogue and zero-value mock prices. Replace before taking real orders.
export const products = [
  { id: 'choco', name: 'Choco Chip', image: '/placeholders/cookie-choco.svg' },
  {
    id: 'gingerbread',
    name: 'Gingerbread',
    image: '/placeholders/cookie-gingerbread.svg',
  },
  {
    id: 'butter',
    name: 'Butter Star',
    image: '/placeholders/cookie-butter.svg',
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    image: '/placeholders/cookie-red-velvet.svg',
  },
  {
    id: 'cashew',
    name: 'Cashew Crunch',
    image: '/placeholders/cookie-cashew.svg',
  },
  {
    id: 'coconut',
    name: 'Coconut Snow',
    image: '/placeholders/cookie-coconut.svg',
  },
] as const

export type ProductId = (typeof products)[number]['id']
export const boxSizes = [6, 9, 12] as const
export type BoxSize = (typeof boxSizes)[number]
export const productConfig = {
  defaultSize: 12 as BoxSize,
  prices: { 6: 0, 9: 0, 12: 0 } satisfies Record<BoxSize, number>,
  pricesArePlaceholders: true,
  priceNotice: 'Preview only. All prices are placeholders.',
}
