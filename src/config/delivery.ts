export const deliveryConfig = {
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
  },
  errors: {
    name: 'Enter your full name, using at least two characters.',
    nameLength: 'Keep your name to 100 characters or fewer.',
    phone:
      'Enter a valid Sri Lankan mobile number: 07XXXXXXXX or +947XXXXXXXX.',
    address:
      'Enter your house number, street and town, using at least 10 characters.',
    addressLength: 'Keep the address to 600 characters or fewer.',
  },
}
