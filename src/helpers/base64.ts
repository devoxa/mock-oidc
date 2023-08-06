export function base64Encode(value: string) {
  return Buffer.from(value).toString('base64')
}

export function base64Decode(value: string) {
  return Buffer.from(value, 'base64').toString()
}

export function base64Refine(value: string) {
  try {
    base64Decode(value)
    return true
  } catch (_) {
    return false
  }
}
