import { createQueryClient } from './queryClient'

test('applies the shared query defaults', () => {
  const options = createQueryClient().getDefaultOptions().queries
  expect(options?.staleTime).toBe(30_000)
  expect(options?.retry).toBe(1)
})

test('returns an independent client each call', () => {
  expect(createQueryClient()).not.toBe(createQueryClient())
})
