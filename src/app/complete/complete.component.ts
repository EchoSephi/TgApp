import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { LocalStorage } from '../local.storage';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})

export class CompleteComponent implements OnInit {
  nowIn = 'complete';
  backTo = '';
  spinner = true;

  reginfo;
  regAPIData;

  success;
  message;
  hpTel;
  hpTelLink;

  regcode;

  title;

  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private router: Router) {
  }

  ngOnInit() {
    this.getStartWithAsync();
  }

  async getStartWithAsync() {

    // 沒有使用者選擇的排班資料就返回排班頁面
    const _reg = <boolean>await this.datasvc.getRegInfo();
    if (_reg === false) {
      this.router.navigate(['schedule']);
    } else {
      this.reginfo = this.datasvc.reginfo;
    }

    const _regApi = <boolean>await this.datasvc.getregAPIInfo();
    if (_regApi === false) {
      this.router.navigate(['schedule']);
    } else {
      this.regAPIData = this.datasvc.regAPIData;
    }

    this.gotoReg();

  }

  gotoReg() {
    const r = this.regAPIData;
    const url = this.datasvc.webApiUrl + 'tgappreg/Home/預約掛號?PID=Tgss&CCode='
      + r.CCode + '&ID='
      + r.ID + '&BDate='
      + r.BDate + '&sid='
      + r.sid + '&RDate='
      + r.RDate + '&Name='
      + r.Name + '&Tel='
      + r.Tel + '&Note='
      + r.Note;

    console.log(url);
    this.datasvc.getData(url)
      .subscribe(
        (results) => {

          const r1 = results['回傳資訊'];
          const r2 = results['預掛識別碼'];
          const code = r1.Code;
          this.success = r1.Success;
          if (this.success) {
            this.title = '掛號成功';
            this.regcode = results['掛號序號'];
            this.cleanTempData();
          } else {
            this.title = '掛號失敗';
            this.message = r1.Message;

            let hpsInfo;
            if (this.datasvc.hpsInfo === undefined) {
              hpsInfo = this.ls.getObject('hpsInfo');
            } else {
              hpsInfo = this.datasvc.hpsInfo;
            }

            this.hpTel = hpsInfo.data.tel;
            this.hpTelLink = 'tel:' + hpsInfo.data.tel;
          }

        },
        (error) => {
          console.log(error);
          this.title = '掛號失敗';
          this.message = '';

          let hpsInfo;
          if (this.datasvc.hpsInfo === undefined) {
            hpsInfo = this.ls.getObject('hpsInfo');
          } else {
            hpsInfo = this.datasvc.hpsInfo;
          }

          this.hpTel = hpsInfo.data.tel;
          this.hpTelLink = 'tel:' + hpsInfo.data.tel;
          this.spinner = false;
        },
        () => {
          this.spinner = false;
        }
      );
  }

  returnHome() {
    this.cleanTempData();
    this.router.navigate(['']);
  }

  returnsShedule() {
    this.cleanTempData();
    this.router.navigate(['schedule']);
  }

  cleanTempData() {
    this.datasvc.reginfo = undefined;
    this.datasvc.regAPIData = undefined;
    this.ls.remove('reginfo');
    this.ls.remove('regAPIData');
  }
}
