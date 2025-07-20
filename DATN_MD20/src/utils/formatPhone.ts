// export const formatPhoneNumber = (input?: string | null): string => {
//   if (!input) return ''; // Trả về chuỗi rỗng nếu không có giá trị

//   const cleaned = input.replace(/\D/g, '');

//   if (cleaned.startsWith('0')) {
//     return `(+84) ${cleaned.substring(1)}`;
//   }

//   if (cleaned.startsWith('84')) {
//     return `(+${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
//   }

//   return `(+84) ${cleaned}`;
// };

// Hàm forrmat SDT (+84)

export const formatPhoneNumber = (input?: string): string => {
  if (!input || typeof input !== 'string') return '';

  // Chỉ nhận các số điện thoại bắt đầu bằng 0
  let cleaned = input.replace(/\D/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1); // Bỏ số 0 đầu
  }

  return `(+84) ${cleaned}`;
};

export const normalizePhoneNumber = (input?: string): string => {
  if (!input || typeof input !== 'string') return '';

  let cleaned = input.replace(/\D/g, '');

  // Nếu bắt đầu bằng 84 → đổi thành 0
  if (cleaned.startsWith('84')) {
    return '0' + cleaned.slice(2);
  }

  // Nếu bắt đầu bằng 0, giữ nguyên
  if (cleaned.startsWith('0')) {
    return cleaned;
  }

  // Nếu không bắt đầu bằng 0 hoặc 84 → coi như người nhập số thường → thêm 0
  return '0' + cleaned;
};
