class Calendar {
  /**
   * 
   * @returns 获取今天日期 yyyy-MM-dd
   */
  getCurDate() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const dd = String(date.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`;
    return formatted;
  }
  // 判断是否为当天
  isToday(data: { day: string | number | Date }) {
    const today = new Date();
    const date = new Date(data.day);
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  }
  // 获取今年第一天, 格式yyyy年MM月dd日
  getFirtDayOfYear() {
    const firstDay = new Date(new Date().getFullYear(), 0, 1);
    const yyyy = firstDay.getFullYear();
    const mm = String(firstDay.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const dd = String(firstDay.getDate()).padStart(2, '0');
    return `${yyyy}年${mm}月${dd}日`;
  }
  // 获取当月最后一天, 格式yyyy年MM月dd日
  getLastDayOfMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const yyyy = lastDay.getFullYear();
    const mm = String(lastDay.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const dd = String(lastDay.getDate()).padStart(2, '0');
    return `${yyyy}年${mm}月${dd}日`;
  }
}
export default new Calendar();
