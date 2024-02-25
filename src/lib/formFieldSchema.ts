import { z } from 'zod';

export const currencyField = z
  .preprocess(
    val => (val === '' ? undefined : val),
    z.string({ required_error: 'Required field' })
  )
  .pipe(z.coerce.number().multipleOf(0.01).positive().min(1));

export const optionalCurrencyField = z
  .preprocess(val => (val === '' ? undefined : val), z.string().optional())
  .pipe(z.coerce.number().multipleOf(0.01).positive().min(0).optional());
