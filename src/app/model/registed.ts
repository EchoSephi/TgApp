export interface Registed {
  CCode;
  ID;
  BDate;
  sid;
  RDate;
  Name;
  Tel;
  Note;
}

// 預設API:
// this.datasvc.webApiUrl + tgappreg/Home/預約掛號?PID=Tgss
// &CCode=院所代號
// &ID=畫面.身份證字號
// &BDate=畫面.生日
// &sid=排班表.排班識別碼
// &RDate=排班表.掛號日期
// &Name=畫面.姓名
// &Tel=畫面.手機號碼
// &Note=畫面.備註

