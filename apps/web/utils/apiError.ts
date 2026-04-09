import axios from 'axios'

/**
 * Extracts a human-readable message from an API error response.
 * NestJS returns { message: string | string[], statusCode, error }.
 */
export function extractApiError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.message
    if (typeof msg === 'string' && msg.length) return msg
    if (Array.isArray(msg) && msg.length) return msg[0]
  }
  return fallback
}
