export const paymentMethods = [
  {
    id: "cash",
    name: "Cash after service",
    description: "Pay after the service is completed.",
    active: true,
  },
  {
    id: "bkash",
    name: "bKash",
    description: "Send money manually and enter your transaction ID.",
    active: true,
    merchantNumber: "01XXXXXXXXX",
  },
  {
    id: "nagad",
    name: "Nagad",
    description: "Send money manually and enter your transaction ID.",
    active: true,
    merchantNumber: "01XXXXXXXXX",
  },
  {
    id: "card",
    name: "Card / Online Payment",
    description: "Online card payment will be available later.",
    active: false,
  },
];