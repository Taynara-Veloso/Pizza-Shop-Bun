export class DeleteUnavailableCookieError extends Error {
  constructor() {
    super(' 🍪 Cookie deleted but nothing related was found')
  }
}
