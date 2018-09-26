import { Injectable, PACKAGE_ROOT_URL } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorage } from './local.storage';
import { Info } from './model/info';
import { Person } from './model/person';
import { Registed } from './model/registed';
import { Router } from '@angular/router';


@Injectable()
export class DataService {
  public webApiUrl = 'https://www.techgroup.com.tw/';
  /** default 初始資料,避免api出錯或網路錯誤而沒畫面 */
  public initdata = [
    {
      'Citys': [
        {
          'Id': 'c1',
          'Name': '台北市'
        },
        {
          'Id': 'c2',
          'Name': '新北市'
        }
      ],
      'Areas': [
        {
          'Id': 'a1',
          'Cityid': 'c1',
          'Name': '大安區'
        },
        {
          'Id': 'a5',
          'Cityid': 'c2',
          'Name': '永和區'
        },
        {
          'Id': 'a6',
          'Cityid': 'c2',
          'Name': '中和區'
        }
      ],
      'Cins': [
        {
          'Id': 'd1',
          'Name': '婦產科'
        },
        {
          'Id': 'd2',
          'Name': '小兒科'
        }
      ],
      'Hps': [
        {
          'Id': '3501108008',
          'Name': '四季和安婦幼診所',
          'Cityid': 'c1',
          'Areaid': 'a1',
          'Adds': '台北市大安區仁愛路233號',
          'Tel': '02-89890101',
          'Cin': [
            'd1',
            'd2'
          ]
        },
        {
          'Id': '3522024285',
          'Name': '嘉安婦幼診所',
          'Cityid': 'c2',
          'Areaid': 'a5',
          'Adds': '新北市永和區民權路24號',
          'Tel': '02-12348956',
          'Cin': [
            'd1',
            'd2'
          ]
        },
        {
          'Id': '1505310011',
          'Name': '璟馨婦幼醫院',
          'Cityid': 'c2',
          'Areaid': 'a6',
          'Adds': '新北市中和區光明路30號',
          'Tel': '02-89572644',
          'Cin': [
            'd1',
            'd2'
          ]
        }
      ]
    }
  ];

  /** api給的資料 **/
  public citys: Info[];
  public areas: Info[];
  public hps: Info[];

  /** 使用者選擇的資料 **/
  public cityInfo: Info;
  public areaInfo: Info;
  public hpsInfo: Info;
  public reginfo: Info;

  /** 使用者單獨進入院所選擇的資料 **/
  public hpsSingleInfo;

  public regAPIData: Registed;
  public regSearchHpsId;

  public visitHpsId;
  public visitHpsName;

  constructor(private http: HttpClient, private ls: LocalStorage,
    private router: Router) {
  }

  emptyOrNot(object): boolean {
    if (typeof object === 'object' && !(object instanceof Array)) {
      let hasProp = false;
      // tslint:disable-next-line:prefer-const
      for (let prop in object) {
        hasProp = true;
        break;
      }
      if (hasProp) {
        object = [object];
      } else {
        return false;
      }
    }
    return true;
  }

  getData(url) {
    return this.http.get(url);
  }

  createCode() {

    let code1 = '';
    let code2 = 0;

    function RndNum(n) {
      let rnd = '';
      for (let i = 0; i < n; i++) {
        rnd += Math.floor(Math.random() * 10);
      }
      return rnd;
    }

    const num1 = RndNum(2);
    const num2 = RndNum(2);

    code1 = num1 + ' + ' + num2 + ' = ';
    // tslint:disable-next-line:radix
    code2 = parseInt(num1) + parseInt(num2);

    return { code1: code1, code2: code2 };

  }

  checkPersonSetting(person: Person) {

    let errMsg = '';

    if (person.userName === undefined || person.userName === '') {
      errMsg = '請輸入您的姓名';
      return errMsg;
    }

    if (person.userName.length < 2) {
      errMsg = '姓名長度至少2碼';
      return errMsg;
    }

    if (person.userName.length > 20) {
      errMsg = '姓名長度不可以大於20個字';
      return errMsg;
    }

    if (person.userId === undefined || person.userId === '') {
      errMsg = '請輸入您的身分證字號';
      return errMsg;
    }

    if (person.userId.length > 0) {
      const id: string = person.userId.substring(0, 1);
      const result = id.match(/^.*[A-Z]+.*$/);
      if (result === null) {
        errMsg = '身分證字號第一碼須為英文大寫字母';
        return errMsg;
      }
    }

    if (person.userId.length !== 10) {
      errMsg = '身分證字號長度需於10個字元';
      return errMsg;
    }

    if (person.birthday === undefined || person.birthday === '') {
      errMsg = '請輸入您的生日';
      return errMsg;
    }

    if (isNaN(person.birthday)) {
      errMsg = '生日需輸入數字字元';
      return errMsg;
    }

    if (person.birthday.length !== 8) {
      errMsg = '生日字數長度需於8個字元';
      return errMsg;
    }

    if (person.cellPhone === undefined) {

    } else if (person.cellPhone === '') {

    } else {
      if (person.cellPhone.length !== 10) {
        errMsg = '手機字數長度需於10個字元';
        return errMsg;
      }

      if (isNaN(person.cellPhone)) {
        errMsg = '手機需輸入數字';
        return errMsg;
      }
    }

    if (person.meno === undefined) {

    } else if (person.meno === '') {

    } else {
      if (person.meno.length > 20) {
        errMsg = '備註長度不可以大於20個字';
        return errMsg;
      }
    }

    return '';
  }

  initial() {
    this.ls.setObject('citys', this.initdata[0].Citys);
    this.ls.setObject('areas', this.initdata[0].Areas);
    this.ls.setObject('hps', this.initdata[0].Hps);

    this.citys = <any>this.initdata[0].Citys;
    this.areas = <any>this.initdata[0].Areas;
    this.hps = <any>this.initdata[0].Hps;
  }

  showNow() {
    const now = new Date();
    return now.getFullYear() + '/' +
      ('00' + (now.getMonth() + 1)).slice(-2) + '/' +
      ('00' + now.getDate()).slice(-2) + ' ' +
      ('00' + now.getHours()).slice(-2) + ':' +
      ('00' + now.getMinutes()).slice(-2) + ':' +
      ('00' + now.getSeconds()).slice(-2) + ' ' +
      ('000' + now.getMilliseconds()).slice(-3);
  }

  // 清除暫存資料
  cleanTempData(nowIn) {
    if (nowIn === 'reg' ||
      nowIn === 'schedule' ||
      nowIn === 'hps' ||
      nowIn === 'area' ||
      nowIn === 'city' ||
      nowIn === 'per' ||
      nowIn === 'reglistall'
    ) {
      this.regAPIData = undefined;
      this.ls.remove('regAPIData');

      this.regSearchHpsId = undefined;
      this.ls.remove('regSearchHpsId');

      this.visitHpsId = undefined;
      this.ls.remove('visitHpsId');

      this.visitHpsName = undefined;
      this.ls.remove('visitHpsName');


    }

    if (nowIn === 'schedule' ||
      nowIn === 'hps' ||
      nowIn === 'area' ||
      nowIn === 'city' ||
      nowIn === 'per' ||
      nowIn === 'reglistall') {
      this.reginfo = undefined;
      this.ls.remove('reginfo');
    }

    if (nowIn === 'hps' ||
      nowIn === 'area' ||
      nowIn === 'city' ||
      nowIn === 'per' ||
      nowIn === 'reglistall') {
      this.hpsInfo = undefined;
      this.ls.remove('hpsInfo');
    }

    if (nowIn === 'area' ||
      nowIn === 'city' ||
      nowIn === 'per' ||
      nowIn === 'reglistall') {
      this.areaInfo = undefined;
      this.ls.remove('areaInfo');
    }

    if (nowIn === 'city' ||
      nowIn === 'per' ||
      nowIn === 'reglistall') {
      this.cityInfo = undefined;
      this.ls.remove('cityInfo');
    }

    if (nowIn === 'city' ||
      nowIn === 'area') {
      this.hpsSingleInfo = undefined;
      this.ls.remove('hpsSingleInfo');
    }

  }

  /** 以下做這麼多是因為：
   * 1.頁面重新整理後(F5),dataService的資料會清除
   * 所以變成要去抓localstorage的資料
   * 2.若使用者手動刪除localstorage的資料再按f5
   * 那畫面就會有錯,因為不知道要顯示什麼
   * 所以會判斷返回上一頁或是首頁
   */

  /** 使用者選擇的資料 **/
  getCityInfo() {
    return new Promise(resolve => {
      if (this.cityInfo === undefined) {
        if (this.ls.get('cityInfo') === 'false') {
          resolve(false);
        } else {
          this.cityInfo = this.ls.getObject('cityInfo');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  /** 頁面所需要的暫存資料 **/
  getArea() {
    return new Promise(resolve => {
      if (this.areas === undefined) {
        if (this.ls.get('areas') === 'false') {
          resolve(false);
        } else {
          this.areas = this.ls.getObject('areas');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  /** 使用者選擇的資料 **/
  getAreayInfo() {
    return new Promise(resolve => {
      if (this.areaInfo === undefined) {
        if (this.ls.get('areaInfo') === 'false') {
          resolve(false);
        } else {
          this.areaInfo = this.ls.getObject('areaInfo');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  /** 頁面所需要的暫存資料 **/
  getHps() {
    return new Promise(resolve => {
      if (this.hps === undefined) {
        if (this.ls.get('hps') === 'false') {
          resolve(false);
        } else {
          this.hps = this.ls.getObject('hps');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  /** 使用者選擇的資料 **/
  getHpsInfo() {
    return new Promise(resolve => {
      if (this.hpsInfo === undefined) {
        if (this.ls.get('hpsInfo') === 'false') {
          resolve(false);
        } else {
          this.hpsInfo = this.ls.getObject('hpsInfo');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  /** 使用者選擇的資料 **/
  getRegInfo() {
    return new Promise(resolve => {
      if (this.reginfo === undefined) {
        if (this.ls.get('reginfo') === 'false') {
          resolve(false);
        } else {
          this.reginfo = this.ls.getObject('reginfo');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  /** 使用者選擇的資料 **/
  getregAPIInfo() {
    return new Promise(resolve => {
      if (this.regAPIData === undefined) {
        if (this.ls.get('regAPIData') === 'false') {
          resolve(false);
        } else {
          this.regAPIData = this.ls.getObject('regAPIData');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  getregSearchInfo() {
    return new Promise(resolve => {
      if (this.regSearchHpsId === undefined) {
        if (this.ls.get('regSearchHpsId') === 'false') {
          resolve(false);
        } else {
          this.regSearchHpsId = this.ls.getObject('regSearchHpsId');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }

  getVisitInfo() {
    return new Promise(resolve => {
      if (this.visitHpsId === undefined) {
        if (this.ls.get('visitHpsId') === 'false') {
          resolve(false);
        } else {
          this.visitHpsId = this.ls.getObject('visitHpsId');
          this.visitHpsName = this.ls.getObject('visitHpsName');
          resolve(true);
        }
      } else {
        resolve(true);
      }
    });
  }


}
