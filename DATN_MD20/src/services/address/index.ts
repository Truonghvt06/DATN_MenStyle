import {axiosInstance} from '..';
import {AddressType} from './type';

const addressService = {
  addAddress: async (data: AddressType) => {
    try {
      const res = await axiosInstance.post('/address/add-address', data);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi thêm địa chỉ'};
    }
  },

  getAddresses: async () => {
    try {
      const res = await axiosInstance.get('/address');
      return res.data.addresses;
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi lấy danh sách địa chỉ'};
    }
  },

  updateAddress: async (id: string, data: AddressType) => {
    try {
      const res = await axiosInstance.put(
        `/address/update-address/${id}`,
        data,
      );
      return res.data;
    } catch (err: any) {
      throw (
        err.response?.data?.message || {message: 'Lỗi khi cập nhật địa chỉ'}
      );
    }
  },

  deleteAddress: async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/address/delete-address/${id}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || {message: 'Lỗi khi xoá địa chỉ'};
    }
  },
};

export default addressService;
