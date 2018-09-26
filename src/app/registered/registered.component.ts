import { Component, ElementRef, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { LocalStorage } from '../local.storage';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Person } from '../model/person';
import { Registed } from '../model/registed';

@Component({
  selector: 'app-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.css']
})

export class RegisteredComponent implements OnInit , AfterViewInit {
  @ViewChild('checkCode') canvasRef: ElementRef;
  code: any; // 驗證碼
  answer;
  nowIn = 'reg';
  backTo = 'schedule';
  spinner = true;

  cityInfo;
  areaInfo;
  hpsInfo;
  reginfo;

  myInfo: Person;

  remeberMe = false;
  errMsg;

  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private router: Router) {
  }

  ngOnInit() {
    this.datasvc.cleanTempData(this.nowIn);
    this.getStartWithAsync();
  }

  async getStartWithAsync() {
    // 沒有使用者選擇的城市的資料就返回城市頁面
    const _cityInfo = <boolean>await this.datasvc.getCityInfo();
    if (_cityInfo === false) {
      this.router.navigate(['city']);
    } else {
      this.cityInfo = this.datasvc.cityInfo;
    }

    // 沒有使用者選擇的區域資料就返回區域頁面
    const _areaInfo = <boolean>await this.datasvc.getAreayInfo();
    if (_areaInfo === false) {
      this.router.navigate(['area']);
    } else {
      this.areaInfo = this.datasvc.areaInfo;
    }

    // 沒有使用者選擇的醫院資料就返回醫院頁面
    const _hps = <boolean>await this.datasvc.getHpsInfo();
    if (_hps === false) {
      this.router.navigate(['hps']);
    } else {
      this.hpsInfo = this.datasvc.hpsInfo;
    }

    // 沒有使用者選擇的排班資料就返回排班頁面
    const _reg = <boolean>await this.datasvc.getRegInfo();
    if (_reg === false) {
      this.router.navigate(['schedule']);
    } else {
      this.reginfo = this.datasvc.reginfo;
    }

    this.myInfo = this.ls.getObject('perInfo');
    this.spinner = false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.clickChange();
    }, 1000);
  }

  // 隨機碼 拿掉 0,1,9,i,j,l,o,q,I,J,L,O,Q 避免老人家看不清楚
  createCode() {
    this.code = '';
    const codeLength = 3;
    // 驗證碼的長度
    const random1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', ' w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X ', 'Y', 'Z'];
    const random = [2, 3, 4, 5, 6, 7, 8,
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'k', 'm', 'n', 'p', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < codeLength; i++) {
      const index = Math.floor(Math.random() * 40);
      // 取得隨機數的索引（0~40)
      this.code += random[index]; // 根據索引取得隨機數加到code上
    } return this.code;
  }

  /*干擾線的隨機x坐標值*/
  lineX() {
    const ranLineX = Math.floor(Math.random() * 80);
    return ranLineX;
  }

  /*干擾線的隨機y坐標值*/
  lineY() {
    const ranLineY = Math.floor(Math.random() * 35);
    return ranLineY;
  }

  // 生成隨機顏色
  rgb() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  clickChange() {
    const cxt: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    cxt.fillStyle = '#fff'; cxt.fillRect(0, 0, 80, 35);
    /*生成乾擾線20條*/
    for (let j = 0; j < 20; j++) {
      cxt.strokeStyle = this.rgb(); cxt.beginPath();
      // 若省略beginPath，則每點擊一次驗證碼會累積干擾線的條數
      cxt.moveTo(this.lineX(), this.lineY());
      cxt.lineTo(this.lineX(), this.lineY());
      cxt.lineWidth = 0.5;
      cxt.closePath();
      cxt.stroke();
    }

    cxt.fillStyle = '#6271a9';
    cxt.font = 'bold 20px Arial';
    cxt.fillText(this.createCode(), 15, 25);
  }

  doModify($event) {
    const checked = $event.checked;
    this.remeberMe = checked;
  }

  returnSchedule() {
    this.router.navigate(['schedule']);
  }

  commitRegist() {

    // this.errMsg = this.datasvc.checkPersonSetting(this.myInfo);
    // if (this.errMsg !== '') {
    //   return;
    // }

    // if (this.code !== this.answer) {
    //   this.errMsg = '驗證碼輸入錯誤';
    //   return;
    // }

    if (this.remeberMe) {
      this.ls.setObject('perInfo', this.myInfo);
    }

    this.errMsg = '';

    const rData: Registed = {
      CCode: this.reginfo.id,
      ID: this.myInfo.userId,
      BDate: this.myInfo.birthday,
      sid: this.reginfo.data.reginfo.limitcode,
      RDate: this.reginfo.data.date,
      Name: this.myInfo.userName,
      Tel: this.myInfo.cellPhone,
      Note: this.myInfo.meno
    };

    this.datasvc.regAPIData = rData;
    this.datasvc.reginfo = this.reginfo;
    this.ls.setObject('regAPIData', this.datasvc.regAPIData);
    this.ls.setObject('reginfo', this.datasvc.reginfo);

    this.router.navigate(['complete']);
  }

  inComplete(): boolean {
    this.errMsg = this.datasvc.checkPersonSetting(this.myInfo);
    if (this.errMsg !== '') {
      return false;
    }

    if (this.code === '' || this.code === undefined) {
      this.errMsg = '請輸入驗證碼';
      return false;
    }

    if (this.code !== this.answer) {
      this.errMsg = '驗證碼輸入錯誤';
      return false;
    }

    this.errMsg = '';
    return true;
  }
}
