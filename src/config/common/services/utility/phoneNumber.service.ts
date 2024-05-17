import { Injectable } from '@nestjs/common';
import * as libphonenumber from 'google-libphonenumber';
import { getCountryMetaDataByDialCode } from 'src/config/utils/countryCode.data';

@Injectable()
export class PhoneNumberService {
  private phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

  extractCountryDetails(phoneNumber: string): {
    countryCode: string;
    countryName: string;
    regionCode: string;
  } {
    try {
      const parsedNumber = this.phoneUtil.parse(phoneNumber);
      const countryCode = `+${parsedNumber.getCountryCode()}`;
      const regionCode = this.phoneUtil.getRegionCodeForNumber(parsedNumber);
      const countryName = getCountryMetaDataByDialCode(countryCode);
      return {
        countryCode,
        countryName: countryName?.name,
        regionCode,
      };
    } catch (error) {
      throw new Error(`Invalid phone number: ${error.message}`);
    }
  }
}