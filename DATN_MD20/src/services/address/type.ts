export interface AddressType {
  recipient_name: string;
  phone: string;
  address_line: string;
  province: string;
  district: string;
  ward: string;
  is_default?: boolean;
}
