export class CustomError extends Error {
  constructor(message?: string, public status: number = 500) {
    super(message || 'Something went wrong')
  }
}
