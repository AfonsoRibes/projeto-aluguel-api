import { PaymentDueDateEnum } from '../enums/payment-due-date.enum';

export const PaymentDueDateLabels: Record<PaymentDueDateEnum, string> = {
  [PaymentDueDateEnum.TEN_MINUTES]: '10 minutos',
  [PaymentDueDateEnum.THIRTY_MINUTES]: '30 minutos',
  [PaymentDueDateEnum.ONE_HOUR]: '1 hora',
  [PaymentDueDateEnum.ONE_DAY]: '1 dia',
  [PaymentDueDateEnum.THREE_DAYS]: '3 dias',
};
