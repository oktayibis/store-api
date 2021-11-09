export const SIZES = ["xs", "s", "m", "l", "xl"];
export const ORDER_STATUS = [
  "paymentWaiting",
  "paymentSuccess",
  "paymentFail",
  "orderPrep",
  "inCargo",
  "delivered",
  "error",
];

export const STATUS_EXPLAINATION = {
  paymentWaiting: "Ödeme sonucu bekleniyor",
  paymentSuccess: "Ödeme Onaylandı",
  paymentFail: "Ödeme Başarısız.",
  orderPrep: "Sipariş Hazırlanıyor.",
  inCargo: "Siparişler Kargoya Verildi.",
  delivered: "Siparişler ulaştırıldı.",
  error: "Siparişte bir aksaklık var, lütfen bizimle iletişime geçiniz.",
};
export const PAYMENT_METHODS = ["credit-card", "transfer", "paypal", "cash"];
