export function getCsrfToken(): string {
  const meta = document.querySelector('meta[name="csrf_token"]')
  if (meta) {
    return meta.getAttribute('content') || ''
  }
  throw new Error('CSRF token not found')
}
