import { parseAsBoolean, useQueryStates } from 'nuqs'

export function useCheckoutState() {
  return useQueryStates({
    success: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
    cancel: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  })
}
