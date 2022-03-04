/* eslint-disable @typescript-eslint/no-explicit-any */
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';
import { InvalidSiteError } from './invalidSiteError';
type coordinate = { lat: number; lng: number; };
export class Site {
  private id: number;
  private panels: number;
  private capacity: number;
  private _coordinate: coordinate;
  private countryCode?: string;
  private postalCode: string;
  private city?: string;
  private state?: string;
  private address?: string;
  public get coordinate() { return this._coordinate; }
  public get Id() { return this.id; }
  constructor(siteToMap: any) {
    this.id = parseInt(siteToMap.id, 10);
    this.panels = parseInt(siteToMap.panels, 10);
    this.capacity = parseFloat(siteToMap.capacity);
    this.countryCode = siteToMap.countryCode
    this.state = siteToMap.state;
    this.city = siteToMap.city;
    this.postalCode = siteToMap.postalCode;
    this.address = siteToMap.address;
    if (siteToMap.lat && siteToMap.lng) {
      this._coordinate = {
        lat: parseFloat(siteToMap.lat),
        lng: parseFloat(siteToMap.lng)
      }
    }
    if (Object.prototype.hasOwnProperty.call(siteToMap, 'coordinate')) {
      this._coordinate = {
        lat: parseFloat(siteToMap.coordinate.lat),
        lng: parseFloat(siteToMap.coordinate.lng)
      }
    }
    if (!this.id) throw new InvalidSiteError('id should be >0');
    if (!this.panels) throw new InvalidSiteError('panels should be >0');
    if (this.countryCode)
      if (!postcodeValidatorExistsForCountry(this.countryCode)) {
        throw new InvalidSiteError('country_code should exist');
      }
    if (!this.capacity) throw new InvalidSiteError('capacity should be provided');
    if (this.postalCode && this.countryCode)
      if (!postcodeValidator(this.postalCode, this.countryCode))
        throw new InvalidSiteError('postalCode should be valid')
    if (this.coordinate)
      if (!this.geoValidator(this.coordinate.lat, this.coordinate.lng))
        throw new InvalidSiteError('coordinate should be valid')

  }
  private geoValidator(lat: number, lng: number): boolean {
    return (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)
  }
  toFlat(): any {
    const site = this as any;
    const flattenedSite = { ...site };
    if (Object.prototype.hasOwnProperty.call(flattenedSite, '_coordinate')) {
      flattenedSite.lat = flattenedSite._coordinate.lat;
      flattenedSite.lng = flattenedSite._coordinate.lng;
      delete flattenedSite._coordinate;
    }
    return flattenedSite
  }

}


