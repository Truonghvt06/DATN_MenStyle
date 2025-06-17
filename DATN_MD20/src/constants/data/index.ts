import {colors} from '../../themes/colors';

export const dataBanner = [
  {title: 'Slide 1', image: require('../../assets/images/slide1.png')},
  {title: 'Slide 2', image: require('../../assets/images/slide2.png')},
  {title: 'Slide 3', image: require('../../assets/images/slide3.png')},
  {title: 'Slide 4', image: require('../../assets/images/slide4.png')},
  {title: 'Slide 5', image: require('../../assets/images/slide5.png')},
  {title: 'Slide 6', image: require('../../assets/images/slide1.png')},
  {title: 'Slide 7', image: require('../../assets/images/slide1.png')},
];

export const dataProduct = [
  {
    id: 1,
    name: 'Sản phẩm 1Sản phẩm 1Sản phẩm 1Sản phẩm 1Sản phẩm 1Sản phẩm 1Sản phẩm 1',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    star: 5,
    size: ['S', 'M', 'L', 'XL'],
    color: 'Xanh',
    checked: true,
    favorite: false,
    quantity: '1',
    quantity_kho: 123,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 2,

    name: 'Sản phẩm 2',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: ['S', 'M', 'L'],
    color: 'Xanh dương',
    star: 4.5,
    checked: true,
    quantity: '4',
    favorite: false,
    quantity_kho: 123,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 3,

    name: 'Sản phẩm 3',
    price: 30000,
    image: require('../../assets/images/img2.jpg'),
    size: ['M', 'L', 'XL'],
    color: 'Đỏ',
    star: 3,
    checked: true,
    quantity: '1',
    quantity_kho: 123,
    favorite: false,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 4,

    name: 'Sản phẩm 4',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: ['S', 'M', 'L', 'XL'],
    color: 'Xanh',
    star: 5,
    checked: true,
    quantity: '1',
    favorite: false,
    quantity_kho: 123,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 5,
    name: 'Sản phẩm 5',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: ['S', 'M', 'L', 'XL'],
    color: 'Xanh',
    star: 2,
    checked: true,
    quantity: '1',
    favorite: false,
    quantity_kho: 123,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 6,
    name: 'Sản phẩm 6',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: ['S', 'M', 'L', 'XL'],
    color: 'Xanh',
    star: 4.5,
    checked: true,
    quantity: '1',
    favorite: false,
    quantity_kho: 123,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 7,

    name: 'Sản phẩm 7',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: ['S', 'M', 'L', 'XL'],
    color: 'Xanh',
    star: 4.5,
    checked: true,
    quantity: '1',
    favorite: false,
    quantity_kho: 123,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 8,

    name: 'Sản phẩm 8',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: ['S', 'M', 'L', 'XL'],
    color: 'Xanh',
    star: 4.5,
    checked: true,
    quantity: '1',
    favorite: false,
    quantity_kho: 123,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 9,
    name: 'Sản phẩm 9',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: ['S', 'M', 'L', 'XL'],
    color: 'Xanh',
    star: 4.5,
    checked: true,
    quantity: '1',
    favorite: false,
    quantity_kho: 123,
    colors: ['#000', '#fff', '#FF6B6B'],

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
];
export const notifications = [
  {
    id: '1',
    title: '🧾 Đơn hàng mới',
    content: 'Khách hàng A vừa đặt đơn hàng #123',
    type: 'order',
    time: '2025-06-17 21:30',
    read: false,
  },
  {
    id: '2',
    title: '🎁 Voucher mới',
    content: 'Voucher MEN2025 giảm 25% đã được cập nhật!',
    type: 'voucher',
    time: '2025-06-17 20:00',
    read: false,
  },
];
