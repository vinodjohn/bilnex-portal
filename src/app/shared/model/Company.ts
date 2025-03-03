export class Company {
  id: number;
  name: string;
  regCode: string;
  vatNr: string;
  address: string;
  city: string;
  zipcode: number;
  country: string;
  hasSubscribed: boolean;
  isActive: boolean;

  constructor(id: number, name: string, regCode: string, vatNr: string, address: string, city: string, zipcode: number, country: string, hasSubscribed: boolean, isActive: boolean) {
    this.id = id;
    this.name = name;
    this.regCode = regCode;
    this.vatNr = vatNr;
    this.address = address;
    this.city = city;
    this.zipcode = zipcode;
    this.country = country;
    this.hasSubscribed = hasSubscribed;
    this.isActive = isActive;
  }
}
