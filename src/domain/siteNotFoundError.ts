export class SiteNotFoundError extends Error {
  constructor() {
    super('site not found');
  }
}
export class SitesNotFoundError extends Error {
  constructor() {
    super('sites not found');
  }
}