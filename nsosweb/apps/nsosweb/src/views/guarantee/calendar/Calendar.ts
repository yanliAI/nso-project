export interface dateBase {
  isToday: boolean;
  isZuo?: boolean;
  guaranteeInfo: {};
  date: string;
  theDay: number;
  isChosen?: boolean;
  isWeek?: boolean;
  isCurrentMonth: boolean;

  isCurrent?: boolean;//是否为本月
  title?: number;
  isNow?: boolean;//是否为当天
  // term: string | false;//节气
  // solarDay: string | false;//公历日期节日
}

class Calendar{

  guaranteeData: any = {}

  /**
   * 将传进来的数字转为至少两位数
   * @returns {String} 当前时间
   */
  clockFactory(time: number): string {
    //${}：这是模板字符串中嵌入表达式的方式。
    return `${time >= 10 ? time : '0' + time}`;
  }

  // 获取当前日期
  getCurrent() {
    const date = new Date();
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  }

  /**
   * 获取公历某一天是星期几
   * @param {number} y 年
   * @param {number} m 月
   * @param {number} d 日
   * @returns {number} 返回星期数字[0-6]
   */
  solarWeek(y: number, m: number, d: number) {
    let date = new Date(y, m - 1, d);
    let week = date.getDay();
    return week;
  }

  /**
     * 获得当前月份第一天是星期几
     * @param {number} y 年
     * @param {number} m 月
     * @returns {number} 返回星期数字[0-6]
     */
  solarWeeks(y: number, m: number) {
      return this.solarWeek(y, m, 1);
  }

  /**
   * 验证日期是否有效
   * @param date 
   * @returns 
   */
  validateDate(date: number[]) {
    if (date.length === 3 && String(date[0]).length === 4) {
        return date;
    } else {
        return this.getCurrent();
    }
  }

  /**
   * 获取公历月份天数
   * @param {number} y 年
   * @param {number} m 月
   * @returns {number} 返回输入月份天数
   */
  solarMonth(y: number, m: number, d?: number) {
    //每个月份对应的天数
    const solarMonth =  [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (m == 2) return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0 ? 29 : 28;//进行闰年判断
    return solarMonth[m - 1];
  }

  /**
   * 获取当月前面需补齐的数组
   */
  beforDays(date: number[], last: number) {
      const y = date[1] === 1 ? date[0] - 1 : date[0];//确定上月年份
      const m = date[1] === 1 ? 12 : date[1] - 1;//确定上月月份
      let w = this.solarMonth(y, m);//确定上月月份天数

      const arr: dateBase[] = [];
      //i=0表示从星期日开始，将星期日到星期'last'的日期信息放进数组arr
      for (let i = 0; i < last; i++) {

        const todayDate = `${y}-${this.clockFactory(m)}-${this.clockFactory(w - i)}`
        arr.push({
            theDay: w - i,//上月日期
            guaranteeInfo: this.guaranteeData[todayDate],
            isCurrentMonth: false,
            date: todayDate,
            isToday: false,
        });
      }
      return arr;
  }

  /**
   * 获取当月后面需补齐的数组
   */
  afterDays(day: dateBase[], date: number[]) {
    const arr: dateBase[] = [];
    // const arr = [];
    const y = date[1] === 12 ? date[0] + 1 : date[0];
    const m = date[1] === 12 ? 1 : date[1] + 1;

    // 42：一页日历显示的格子数
    for (let i = 1; i < 42 - day.length + 1; i++) {
        const todayDate = `${y}-${this.clockFactory(m)}-${this.clockFactory(i)}`
        arr.push({
            theDay: i,
            isCurrentMonth: false,
            guaranteeInfo: this.guaranteeData[todayDate],
            date: todayDate,
            isToday: false,
        });
    }
    //泛型=================================================================
    return [...day, ...arr];
  }

  transformDate2String(date: Date){
    return `${date.getFullYear()}-${this.clockFactory(date.getMonth() + 1)}-${this.clockFactory(date.getDate())}`
  }


  /**
   * 获取当前月份的数据并与上月拼接
   * @param date 
   * @param beforDays 
   * @returns 
   */
  getDay(date: number[], beforDays: dateBase[]) {
      const dateArray: dateBase[] = [];
      // const dateArray = [];
      const currentDayNumber = this.solarMonth(date[0], date[1], date[2]);
      for (let i = 1; i <= currentDayNumber; i++) {
        const todayDate = `${date[0]}-${this.clockFactory(date[1])}-${this.clockFactory(i)}`
        console.log('ts:' + this.guaranteeData[todayDate])
        dateArray.push({
            theDay: i,
            isCurrentMonth: true,
            guaranteeInfo: this.guaranteeData[todayDate],
            date: todayDate,
            isToday: `${date[0]}-${this.clockFactory(date[1])}-${this.clockFactory(i)}` === this.transformDate2String(new Date()) ? true : false,
        });
      }
      return [...beforDays, ...dateArray];
  }

  getDateParams(day: dateBase[], date: number[]) {
    // el：表示day[]中的每一个元素
    return day.map((el, index) => {
        return {
            theDay: el.theDay,
            isCurrent: el.isCurrentMonth,
            value: 'tCalendar' + new Date().getTime(),
            isWeek: new Date(el.date).getDay() === 6 || new Date(el.date).getDay() === 0,
            date: el.date,
            isToday: el.isToday,
            guaranteeInfo: el.guaranteeInfo
        };
    });
  }

  table(date: number[], guaranteeData: any) {
    console.log("tabledata",guaranteeData)
    this.guaranteeData = guaranteeData
    if (guaranteeData === null){
      this.guaranteeData = {}
    }
    const dateArray = [];

    const result = this.validateDate(date);

    //获得当前月份第一天是星期几
    const currentDay = this.solarWeeks(result[0], result[1]);

    // 获取当月的完整数据

    // reverse：得到的数组为[31号，30号，29号]这样的顺序所以要反转
    const beforDays = this.beforDays(date, currentDay).reverse();
    const m = this.getDay(date, beforDays);
    const afterDays = this.afterDays(m, date);

    // 转化成参数（返回的afterDays已经拼接好这一页所需的日期数组）
    const params = this.getDateParams(afterDays, date);

    // return [];
    if (params.length !== 42) return [];

    // 整理数组转成二维数组
    for (let row = 0; row < 6; row++) {
        dateArray.push(params.splice(0, 7));
    }
    return dateArray;
}

}

export default new Calendar();
