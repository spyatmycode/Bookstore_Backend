const data = {
  event: 'charge.success',
  data: {
    id: 3416397204,
    domain: 'live',
    status: 'success',
    reference: 'T499197441345383',
    amount: 10000,
    message: null,
    gateway_response: 'Approved',
    paid_at: '2023-12-29T15:08:47.000Z',
    created_at: '2023-12-29T15:07:17.000Z',
    channel: 'bank_transfer',
    currency: 'NGN',
    ip_address: '41.58.223.183',
    metadata: {
      name: 'Adeola',
      phone: '7051807727',
      referrer: 'http://localhost:5173/'
    },
    fees_breakdown: { amount: '150', formula: null, type: 'paystack' },
    log: null,
    fees: 150,
    fees_split: null,
    authorization: {
      authorization_code: 'AUTH_ecoso8p0sv',
      bin: null,
      last4: null,
      exp_month: '12',
      exp_year: '2023',
      channel: 'bank_transfer',
      card_type: 'transfer',
      bank: 'OPay Digital Services Limited (OPay)',
      country_code: 'NG',
      brand: 'Managed Account',
      reusable: false,
      signature: null,
      account_name: null,
      sender_country: 'NG',
      sender_bank: 'OPay Digital Services Limited (OPay)',
      sender_bank_account_number: 'XXXXXXXXXX',
      sender_name: 'Adeola Adeola Akeju',
      narration: 'NIP:Adeola Adeola Akeju-8204876690/PAYSTACK CHECK',
      receiver_bank_account_number: null,
      receiver_bank: null
    },
    customer: {
      id: 150876747,
      first_name: 'Adeola',
      last_name: 'Akeju',
      email: 'akejunifemi11@gmail.com',
      customer_code: 'CUS_4ohragj1p4c4fay',
      phone: '7051807727',
      metadata: [Object],
      risk_action: 'default',
      international_format_phone: '+7051807727'
    },
    plan: {},
    subaccount: {},
    split: {},
    order_id: null,
    paidAt: '2023-12-29T15:08:47.000Z',
    requested_amount: 10000,
    pos_transaction_data: null,
    source: {
      type: 'web',
      source: 'checkout',
      entry_point: 'request_inline',
      identifier: null
    }
  }
}
  
export default data