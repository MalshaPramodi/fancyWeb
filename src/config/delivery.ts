export type DeliveryAreaId = 'colombo' | 'other' | 'pickup'
type DeliveryArea = {
  id: DeliveryAreaId
  label: string
  fee: number
  pickup: boolean
}

// PLACEHOLDER fees and example dates only. These are not confirmed business terms.
const areas: DeliveryArea[] = [
  { id: 'colombo', label: 'Colombo and suburbs', fee: 0, pickup: false },
  { id: 'other', label: 'Other areas', fee: 0, pickup: false },
  { id: 'pickup', label: 'Self pickup', fee: 0, pickup: true },
]

export const deliveryConfig = {
  isPlaceholder: true,
  timezone: 'Asia/Colombo',
  areas,
  dates: ['2026-12-20', '2026-12-21', '2026-12-22'],
  lastOrderDate: '2026-12-18',
  giftMessageLimit: 200,
  title: 'Delivery details',
  description: 'A few details for your Christmas box.',
  limits: { name: 100, address: 600 },
  copy: {
    name: 'Full name',
    phone: 'WhatsApp or phone number',
    phoneHint:
      'Use a Sri Lankan mobile number, such as 07XXXXXXXX or +947XXXXXXXX.',
    address: 'Delivery address',
    addressHint: 'Include your house number, street and town.',
    reviewTitle: 'Ready for the next step',
    reviewDescription:
      'Your delivery details are saved for this preview. Payment and slip upload come in Phase 4.',
    errorsSummary: 'Please check the marked fields.',
    placeholderNotice:
      'Preview only. Dates and delivery fees are placeholders, not confirmed availability.',
    area: 'Delivery area',
    areaPrompt: 'Choose an area',
    feePlaceholder: 'placeholder fee',
    pickupAddressHint: 'An address is not needed for self pickup.',
    preferredDate: 'Preferred delivery or pickup date',
    datesHint: 'Available dates',
    exampleDatesHint: 'Example dates only',
    deadlineHint: 'Last order date',
    exampleDeadlineHint: 'Example order deadline',
    gift: 'This is a gift',
    giftHint: 'Add a personal note for the recipient.',
    giftMessage: 'Gift message (optional)',
    characterLimit: 'characters maximum',
  },
  errors: {
    name: 'Enter your full name, using at least two characters.',
    nameLength: 'Keep your name to 100 characters or fewer.',
    phone:
      'Enter a valid Sri Lankan mobile number: 07XXXXXXXX or +947XXXXXXXX.',
    address:
      'Enter your house number, street and town, using at least 10 characters.',
    addressLength: 'Keep the address to 600 characters or fewer.',
    areaId: 'Choose Colombo and suburbs, other areas, or self pickup.',
    date: 'Choose one of the available dates listed below.',
    dateClosed: 'Ordering for these dates has closed.',
    giftMessage:
      'Shorten your gift message to the character limit shown below.',
  },
}
