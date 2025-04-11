export const getLocalStorage = (key) => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key);
    } else {
      return null;
    }
  };

  export function formatMoney(number) {
    if (number) {
      const formattedNumber = Number(number).toFixed(2);
      const numToString1 = formattedNumber.replace(/\.(\d)(?!\d)/, ".$1"); //  '1700.00'  -> '1700.00'
      const numToString2 = numToString1.replace(/(\d)(?=(\d{3})+\.)/g, "$1,"); // '1700.00' -> '1,700.00'
      return numToString2.replace(/\.0+$|(\.\d*[^0])0+$/, "$1"); // '1,700.00'-> '1,700' or
    } else return 0;
  }

 export function formatDateTime(dateString) {
    const now = new Date(dateString);
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}