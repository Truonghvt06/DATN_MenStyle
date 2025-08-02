import moment from 'moment';
import useLanguage from '../hooks/useLanguage';

export const formatExpiryDate = (dateTo: string | Date) => {
  const {getTranslation} = useLanguage();
  const now = new Date();
  const targetDate = new Date(dateTo);

  const diffMs = targetDate.getTime() - now.getTime(); // chênh lệch mili giây
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays > 3) {
    // Nếu còn hơn 3 ngày thì hiển thị ngày hết hạn dạng dd/MM/yyyy
    // return `${targetDate.getDate()}/${
    //   targetDate.getMonth() + 1
    // }/${targetDate.getFullYear()}`;
    return moment(targetDate).format('DD/MM/YYYY');
  } else if (diffDays > 1) {
    // Nếu còn từ 2 đến 3 ngày
    return `Còn ${diffDays} ${getTranslation('ngay')}`;
  } else if (diffDays === 1) {
    // Nếu còn đúng 1 ngày
    const remainingHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    return `Còn 1 ngày ${remainingHours} giờ`;
  } else if (diffHours > 0) {
    // Nếu còn dưới 1 ngày
    return `Còn ${diffHours} giờ`;
  } else {
    return `Hết hạn`;
  }
};

export const formatStartDate = (dateFrom: string | Date) => {
  const {getTranslation} = useLanguage();
  const now = new Date();
  const targetDate = new Date(dateFrom);

  const diffMs = targetDate.getTime() - now.getTime(); // nếu <=0 thì đang hiệu lực
  if (diffMs <= 0) {
    return 'Đang hiệu lực';
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays > 3) {
    return `Hiệu lực sau ${diffDays} ${getTranslation('ngay')}`;
  } else if (diffDays === 1) {
    const remainingHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    return `Hiệu lực sau 1 ${getTranslation('ngay')}${
      remainingHours > 0 ? ` ${remainingHours} giờ` : ''
    }`;
  } else if (diffHours > 0) {
    return `Hiệu lực sau ${diffHours}giờ`;
  } else {
    // Trường hợp rất nhỏ dưới 1 giờ
    return `Hiệu lực sau ${Math.ceil(diffMs / (1000 * 60))} phút`;
  }
};

export const formatMoneyShort = (value: number): string => {
  if (value >= 1_000_000) {
    return `${value / 1_000_000}tr`; // 5,000,000 -> 5tr
  } else if (value >= 1_000) {
    return `${value / 1_000}k`; // 500,000 -> 500k
  }
  return `${value}`; // < 1,000 thì trả nguyên số
};
