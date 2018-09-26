import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '../local.storage';
import { DataService } from '../data.service';
import { Info } from '../model/info';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})

export class ScheduleComponent implements OnInit {
  nowIn = 'schedule';
  backTo = 'hps';
  spinner = true;

  cityInfo;
  areaInfo;
  hpsInfo;

  schedule = [];
  networkError = false;
  hpTel;
  hpTelLink;

  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) {
      this.route.queryParams.subscribe(params => {
        if (params.id === '1') {
          this.backTo = 'favorite';
        }
      });
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
      this.getschedule();
    }
  }

  getDay(date: Date) {
    const dat = new Date(date);
    dat.setDate(dat.getDate() + 30);
    return dat;
  }

  getDateString(date: Date) {
    return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);
  }

  // 取得院所排班表
  getschedule() {

    const day1 = new Date();
    const day2 = this.getDay(day1);

    const day1Str = this.getDateString(day1);
    const day2Str = this.getDateString(day2);

    const url = this.datasvc.webApiUrl + 'tgappreg/Home/平台排班表查詢/?PID=Tgss&CCode='
      + this.hpsInfo.id
      + '&sdate=' + day1Str
      + '&edate=' + day2Str;
    // this.datasvc.webApiUrl + tgappreg/Home/平台排班表查詢/?PID=Tgss&CCode=3501108008&sdate=20180501&edate=20180531

    console.log(url);
    this.datasvc.getData(url)
      .subscribe(
        (results) => {
          const data = results['data'];
          // console.log(data);
          if (data === 'null' || data === null) {
            // console.log('no data');
            this.networkError = true;
            this.hpTel = this.hpsInfo.data.tel;
            this.hpTelLink = 'tel:' + this.hpsInfo.data.tel;
          } else if (data.length === 0) {
            this.networkError = true;
            this.hpTel = this.hpsInfo.data.tel;
            this.hpTelLink = 'tel:' + this.hpsInfo.data.tel;
          } else {
            data.forEach(p => {
              const newData = {
                showdate: p.顯示日期,
                date: p.日期,
                cin: p.科別,
                info: [
                  {
                    'name': p.資訊[0].診別,
                    'nameinfo': [
                      {
                        'class': p.資訊[0].診別資訊[0].班別,
                        'classcode': p.資訊[0].診別資訊[0].班別代碼,
                        'doctor': p.資訊[0].診別資訊[0].醫師名,
                        'limit': p.資訊[0].診別資訊[0].限數,
                        'limitcode': p.資訊[0].診別資訊[0].排班識別碼,
                        'refcode': p.資訊[0].診別資訊[0].就診參考序號,
                        'alreadycount': p.資訊[0].診別資訊[0].已掛號人數,
                        'note': p.資訊[0].診別資訊[0].備註,
                        'cando': p.資訊[0].診別資訊[0].可掛號否,
                      },
                      {
                        'class': p.資訊[0].診別資訊[1].班別,
                        'classcode': p.資訊[0].診別資訊[1].班別代碼,
                        'doctor': p.資訊[0].診別資訊[1].醫師名,
                        'limit': p.資訊[0].診別資訊[1].限數,
                        'limitcode': p.資訊[0].診別資訊[1].排班識別碼,
                        'refcode': p.資訊[0].診別資訊[1].就診參考序號,
                        'alreadycount': p.資訊[0].診別資訊[1].已掛號人數,
                        'note': p.資訊[0].診別資訊[1].備註,
                        'cando': p.資訊[0].診別資訊[1].可掛號否,
                      },
                      {
                        'class': p.資訊[0].診別資訊[2].班別,
                        'classcode': p.資訊[0].診別資訊[2].班別代碼,
                        'doctor': p.資訊[0].診別資訊[2].醫師名,
                        'limit': p.資訊[0].診別資訊[2].限數,
                        'limitcode': p.資訊[0].診別資訊[2].排班識別碼,
                        'refcode': p.資訊[0].診別資訊[2].就診參考序號,
                        'alreadycount': p.資訊[0].診別資訊[2].已掛號人數,
                        'note': p.資訊[0].診別資訊[2].備註,
                        'cando': p.資訊[0].診別資訊[2].可掛號否,
                      }
                    ]
                  }
                ]
              };

              // const info = p['資訊'];
              // const info2 = info[0]['診別資訊'];
              // const nameinfo = [];
              // info2.forEach(p1 => {

              //   const canDo = true;
              //   if (p1.可掛號否 == 'N') {
              //     canDo = false;
              //   }
              //   const _info = {
              //     'class': p1.班別,
              //     'classcode': p1.班別代碼,
              //     'doctor': p1.醫師名,
              //     'limit': p1.限數,
              //     'limitcode': p1.排班識別碼,
              //     'refcode': p1.就診參考序號,
              //     'alreadycount': p1.已掛號人數,
              //     'note': p1.備註,
              //     'cando': canDo,
              //   }

              //   nameinfo.push(_info);

              // })

              // newData['info'] = [
              //   {
              //     name: p.資訊[0].診別,
              //     nameinfo: nameinfo
              //   }
              // ]

              this.schedule.push(newData);
              this.networkError = false;
            });
          }
        },
        (error) => {
          console.log(error);

          this.networkError = true;
          this.hpTel = this.hpsInfo.data.tel;
          this.hpTelLink = 'tel:' + this.hpsInfo.data.tel;
          this.spinner = false;
        },
        () => {
          this.spinner = false;
        }
      );
  }

  clickDoctor(item, showdate, date, cin, sname) {
    this.datasvc.cityInfo = this.cityInfo;
    this.datasvc.areaInfo = this.areaInfo;
    this.datasvc.hpsInfo = this.hpsInfo;

    const iData: Info = {
      id: this.hpsInfo.id, name: this.hpsInfo.name,
      data: {
        showdate: showdate,
        date: date,
        cin: cin, // 科別
        sname: sname, // 診別
        reginfo: item
      }
    };

    this.datasvc.reginfo = iData;
    this.ls.setObject('reginfo', iData);
    this.router.navigate(['reg']);

  }

  openDialog(item) {
    this.dialog.open(ScheduleDialogDialog, {
      width: '250px',
      data: {
        message: item.refcode
      }
    });
  }

}

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: 'schedule-dialog.html',
  styleUrls: ['schedule-dialog.css']
})

// tslint:disable-next-line:component-class-suffix
export class ScheduleDialogDialog {
  // constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}



