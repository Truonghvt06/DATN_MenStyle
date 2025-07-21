import useLanguage from '../../hooks/useLanguage';
import {colors} from '../../themes/colors';

// const {getTranslation} = useLanguage();

export const dataBanner = [
  {title: 'Slide 1', image: require('../../assets/images/Banno5.png')},
  {title: 'Slide 2', image: require('../../assets/images/Banno2.png')},
  {title: 'Slide 3', image: require('../../assets/images/Banno3.png')},
  {title: 'Slide 4', image: require('../../assets/images/Banno4.png')},
  {title: 'Slide 5', image: require('../../assets/images/Banno1.png')},
];
export const dataOrder = [
  {
    id: 'o1',
    name: 'Tất cả',
  },
  {
    id: 'o2',
    name: 'Chờ xác nhận',
  },
  {
    id: 'o3',
    name: 'Đã xác nhận',
  },
  {
    id: 'o4',
    name: 'Chờ giao hàng',
  },
  {
    id: 'o5',
    name: 'Đã giao',
  },
  {
    id: 'o6',
    name: 'Đã huỷ',
  },
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
    status: 'Chờ xác nhận',
    createdAt: '2024-06-01',
    total: 120000,

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
    status: 'Đã xác nhận',
    createdAt: '2024-06-01',
    total: 120000,

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
    status: 'Chờ giao hàng',
    createdAt: '2024-06-01',
    total: 120000,

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
    status: 'Đã giao',
    createdAt: '2024-06-01',
    total: 120000,

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
    status: 'Đã huỷ',
    createdAt: '2024-06-01',
    total: 120000,

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
    status: 'Chờ xác nhận',
    createdAt: '2024-06-01',
    total: 120000,

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
    status: 'Chờ xác nhận',
    createdAt: '2024-06-01',
    total: 120000,
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
    status: 'Chờ xác nhận',
    createdAt: '2024-06-01',
    total: 190000,

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
    status: 'Đã xác nhận',
    createdAt: '2024-06-01',
    total: 120000,

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
];
export const dataItemOrder = [
  {
    id: 1,
    name: 'Sản phẩm 1Sản phẩm 1Sản phẩm 1Sản phẩm 1Sản phẩm 1Sản phẩm 1Sản phẩm 1',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    star: 5,
    size: 'S',
    color: 'Xanh',
    checked: true,
    favorite: false,
    quantity: '1',
    quantity_kho: 123,
    colors: '#FF6B6B',
    status: 'Chờ xác nhận',
    createdAt: '2024-06-01',
    total: 120000,

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 2,

    name: 'Sản phẩm 2',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: 'M',
    color: 'Xanh dương',
    star: 4.5,
    checked: true,
    quantity: '4',
    favorite: false,
    quantity_kho: 123,
    colors: '#fff',
    status: 'Đã xác nhận',
    createdAt: '2024-06-01',
    total: 120000,

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 3,

    name: 'Sản phẩm 3',
    price: 30000,
    image: require('../../assets/images/img2.jpg'),
    size: 'L',
    color: 'Đỏ',
    star: 3,
    checked: true,
    quantity: '1',
    quantity_kho: 123,
    favorite: false,
    colors: '#000',
    status: 'Chờ giao hàng',
    createdAt: '2024-06-01',
    total: 120000,

    description:
      'You are generating images too quickly. To ensure the best experience for everyone, we have rate limits in place. Please wait for an hour before generating more images.',
  },
  {
    id: 4,

    name: 'Sản phẩm 4',
    price: 20000,
    image: require('../../assets/images/img2.jpg'),
    size: 'XL',
    color: 'Xanh',
    star: 5,
    checked: true,
    quantity: '1',
    favorite: false,
    quantity_kho: 123,
    colors: '#FF6B6B',
    status: 'Đã giao',
    createdAt: '2024-06-01',
    total: 120000,

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
    read: true,
  },
  {
    id: '2',
    title: '🎁 Voucher mới',
    content: 'Voucher MEN2025 giảm 25% đã được cập nhật!',
    type: 'voucher',
    time: '2025-06-17 20:00',
    read: true,
  },
  {
    id: '3',
    title: '🧾 Đơn hàng mới',
    content: 'Khách hàng A vừa đặt đơn hàng #123',
    type: 'order',
    time: '2025-06-17 21:30',
    read: false,
  },
  {
    id: '4',
    title: '🎁 Voucher mới',
    content: 'Voucher MEN2025 giảm 25% đã được cập nhật!',
    type: 'voucher',
    time: '2025-06-17 20:00',
    read: false,
  },
];

export const allProducts = [
  // Áo thun
  {
    id: '1',
    name: 'Áo thun A',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo thun',
    createdAt: '2024-06-01',
    sold: 10,
    price: 200000,
  },
  {
    id: '2',
    name: 'Áo thun B',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo thun',
    createdAt: '2024-06-15',
    sold: 25,
    price: 220000,
  },
  {
    id: '3',
    name: 'Áo thun C',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo thun',
    createdAt: '2024-06-10',
    sold: 5,
    price: 180000,
  },

  // Áo polo
  {
    id: '4',
    name: 'Áo polo A',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo polo',
    createdAt: '2024-06-18',
    sold: 30,
    price: 150000,
  },
  {
    id: '5',
    name: 'Áo polo B',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo polo',
    createdAt: '2024-06-20',
    sold: 12,
    price: 170000,
  },
  {
    id: '6',
    name: 'Áo polo C',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo polo',
    createdAt: '2024-06-12',
    sold: 18,
    price: 160000,
  },

  // Áo sơ mi
  {
    id: '7',
    name: 'Áo sơ mi A',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo sơ mi',
    createdAt: '2024-06-10',
    sold: 5,
    price: 100000,
  },
  {
    id: '8',
    name: 'Áo sơ mi B',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo sơ mi',
    createdAt: '2024-06-17',
    sold: 22,
    price: 130000,
  },
  {
    id: '9',
    name: 'Áo sơ mi C',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo sơ mi',
    createdAt: '2024-06-08',
    sold: 9,
    price: 120000,
  },

  // Áo khoác
  {
    id: '10',
    name: 'Áo khoác A',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo khoác',
    createdAt: '2024-06-19',
    sold: 20,
    price: 300000,
  },
  {
    id: '11',
    name: 'Áo khoác B',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo khoác',
    createdAt: '2024-06-13',
    sold: 15,
    price: 280000,
  },
  {
    id: '12',
    name: 'Áo khoác C',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo khoác',
    createdAt: '2024-06-09',
    sold: 7,
    price: 320000,
  },

  // Áo thể thao
  {
    id: '13',
    image: require('../../assets/images/img2.jpg'),
    name: 'Áo thể thao A',
    category: 'Áo thể thao',
    createdAt: '2024-06-12',
    sold: 15,
    price: 250000,
  },
  {
    id: '14',
    image: require('../../assets/images/img2.jpg'),
    name: 'Áo thể thao B',
    category: 'Áo thể thao',
    createdAt: '2024-06-16',
    sold: 21,
    price: 270000,
  },
  {
    id: '15',
    image: require('../../assets/images/img2.jpg'),
    name: 'Áo thể thao C',
    category: 'Áo thể thao',
    createdAt: '2024-06-11',
    sold: 10,
    price: 240000,
  },

  // Áo hoodie
  {
    id: '16',
    name: 'Áo hoodie A',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo hoodie',
    createdAt: '2024-06-05',
    sold: 8,
    price: 350000,
  },
  {
    id: '17',
    name: 'Áo hoodie B',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo hoodie',
    createdAt: '2024-06-14',
    sold: 13,
    price: 330000,
  },
  {
    id: '18',
    name: 'Áo hoodie C',
    image: require('../../assets/images/img2.jpg'),

    category: 'Áo hoodie',
    createdAt: '2024-06-07',
    sold: 6,
    price: 360000,
  },
];

const voucherData = [
  {
    code: 'SALE10',
    description: 'Giảm 10% cho tất cả sản phẩm',
    discount_type: 'percentage',
    discount_value: 10, // 10%
    max_discount_value: 50000, // tối đa giảm 50k
    min_order_amount: 200000, // đơn hàng từ 200k
    quantity: 100,
    used_count: 0,
    usage_limit_per_user: 2,
    date_from: new Date('2025-07-01'),
    date_to: new Date('2025-07-31'),
    is_active: true,
  },
  {
    code: 'FREESHIP',
    description: 'Giảm 30k phí ship cho đơn từ 300k',
    discount_type: 'fixed',
    discount_value: 30000, // giảm 30k
    max_discount_value: null,
    min_order_amount: 300000,
    quantity: 50,
    used_count: 0,
    usage_limit_per_user: 1,
    date_from: new Date('2025-07-01'),
    date_to: new Date('2025-08-01'),
    is_active: true,
  },
  {
    code: 'WELCOME20',
    description: 'Giảm 20% cho khách hàng mới',
    discount_type: 'percentage',
    discount_value: 20, // 20%
    max_discount_value: 100000, // tối đa giảm 100k
    min_order_amount: 0,
    quantity: 200,
    used_count: 0,
    usage_limit_per_user: 1,
    date_from: new Date('2025-07-01'),
    date_to: new Date('2025-12-31'),
    is_active: true,
  },
  {
    code: 'FLASH50',
    description: 'Giảm ngay 50k cho đơn từ 500k',
    discount_type: 'fixed',
    discount_value: 50000,
    max_discount_value: null,
    min_order_amount: 500000,
    quantity: 30,
    used_count: 5,
    usage_limit_per_user: 1,
    date_from: new Date('2025-07-20'),
    date_to: new Date('2025-07-25'),
    is_active: true,
  },
  {
    code: 'OFF90',
    description: 'Giảm 90% nhưng tối đa 200k',
    discount_type: 'percentage',
    discount_value: 90,
    max_discount_value: 200000,
    min_order_amount: 100000,
    quantity: 10,
    used_count: 2,
    usage_limit_per_user: 1,
    date_from: new Date('2025-07-21'),
    date_to: new Date('2025-07-22'),
    is_active: true,
  },
];
