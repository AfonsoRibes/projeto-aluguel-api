import { PaymentDueDateEnum } from '../enums/payment-due-date.enum';

export const PaymentDueDateLabels: Record<PaymentDueDateEnum, string> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  [PaymentDueDateEnum.TEN_MINUTES]: '10 minutos',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  [PaymentDueDateEnum.THIRTY_MINUTES]: '30 minutos',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  [PaymentDueDateEnum.ONE_HOUR]: '1 hora',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  [PaymentDueDateEnum.ONE_DAY]: '1 dia',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  [PaymentDueDateEnum.THREE_DAYS]: '3 dias',
};
