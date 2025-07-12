import {axiosInstance} from '..';

const bannerService = {
  getBanner: async () => {
    try {
      const res = await axiosInstance.get('/banner');
      //   console.log('BANNER: ', res.data);

      return res.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bannerService;
