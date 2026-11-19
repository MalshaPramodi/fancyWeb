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

// PLACEHOLDER unit prices and order limits. Confirm with the owner before launch.
export const extraProducts = [
  {
    id: 'danish-butter-cookies',
    name: 'Danish Butter Cookies',
    description: 'A simple buttery treat, lovely with a warm cup of tea.',
    unitPrice: 0,
    priceIsPlaceholder: true,
    maxQuantity: 20,
    limitIsPlaceholder: true,
    image: '/placeholders/danish-butter-cookies.svg',
  },
  {
    id: 'mini-christmas-pack',
    name: 'Mini Christmas Cookie Packs',
    description: 'A little Christmas treat to share, one pack at a time.',
    unitPrice: 0,
    priceIsPlaceholder: true,
    maxQuantity: 20,
    limitIsPlaceholder: true,
    image: '/placeholders/mini-christmas-pack.svg',
  },
] as const
export type ExtraProductId = (typeof extraProducts)[number]['id']
export const extrasCopy = {
  title: 'Add more treats',
  description: 'Enjoy these on their own, or alongside your gift box.',
  placeholderPrice: 'Placeholder price',
  lineTotal: 'Line total',
  quantity: 'Quantity',
  limit: 'Maximum per order',
  selectionHelp: 'Choose at least one treat, or fill a gift box to continue.',
  partialBox: 'Finish filling your box, or remove its cookies to order extras only.',
  emptyBox: 'Your gift box is optional. Choose extras below, or start filling it.',
}
