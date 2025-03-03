export class CompanyDto {
  id: string | null = null;
  name: string;
  regCode: string;
  vatNr: string;
  address: string;
  city: string;
  zipcode: string;
  country: string;
  hasSubscribed: boolean;
  isDefault: boolean;
  isActive: boolean;

  constructor(id: string | null, name: string, regCode: string, vatNr: string, address: string, city: string,
              zipcode: string, country: string, hasSubscribed: boolean, isDefault: boolean, isActive: boolean) {
    this.id = id;
    this.name = name;
    this.regCode = regCode;
    this.vatNr = vatNr;
    this.address = address;
    this.city = city;
    this.zipcode = zipcode;
    this.country = country;
    this.hasSubscribed = hasSubscribed;
    this.isDefault = isDefault;
    this.isActive = isActive;
  }
}
