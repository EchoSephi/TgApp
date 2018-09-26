import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '../local.storage';
import { DataService } from '../data.service';
import { Info } from '../model/info';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {
  nowIn = 'hps';
  backTo = 'area';
  spinner = true;

  cityInfo;
  areaInfo;
  hpsInfo = [];

  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private router: Router,
    public dialog: MatDialog) {
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

    // 沒有區域的資料就返回城市頁面
    const _areas = <boolean>await this.datasvc.getArea();
    if (_areas === false) {
      this.router.navigate(['city']);
    } else {
      const areas = this.datasvc.areas;
    }

    // 沒有使用者選擇的區域資料就返回區域頁面
    const _areaInfo = <boolean>await this.datasvc.getAreayInfo();
    if (_areaInfo === false) {
      this.router.navigate(['area']);
    } else {
      this.areaInfo = this.datasvc.areaInfo;
    }

    // 先判斷是否透過querystring進入
    const hpsdata1 = this.datasvc.hpsSingleInfo;
    if (hpsdata1 === undefined) {
      const hpsdata2 = this.ls.get('hpsSingleInfo');
      if (hpsdata2 === 'false') {
        // 並非透過querystring進入

        // 判斷是否由我的最愛進入

        // 沒有醫院的資料就返回區域頁面
        const _hps = <boolean>await this.datasvc.getHps();
        if (_hps === false) {
          this.router.navigate(['area']);
        } else {
          this.getHps(this.datasvc.hps, 1);
        }

      } else {
        // 透過querystring進入
        this.datasvc.hps = [];
        this.datasvc.hps.push(this.ls.getObject('hpsSingleInfo'));
        this.getHps(this.datasvc.hps, 3);
      }
    } else {
      // 透過querystring進入
      this.datasvc.hps = [];
      this.datasvc.hps.push(this.datasvc.hpsSingleInfo);
      this.getHps(this.datasvc.hps, 3);
    }

  }

  getHps(hps, no) {
    if (no === 1) {
      hps.forEach(p => {
        if (this.cityInfo.id === p.Cityid && this.areaInfo.id === p.Areaid) {
          const _tel = 'tel:' + p.Tel;
          const _href = 'http://maps.google.com.tw/maps?q=' + p.Adds;
          p.href = _href;
          p.tels = _tel;
          this.hpsInfo.push(p);
        }
      });
    } else if (no === 3) {
      hps.forEach(p => {
        const _tel = 'tel:' + p.Tel;
        const _href = 'http://maps.google.com.tw/maps?q=' + p.Adds;
        p.href = _href;
        p.tels = _tel;
        this.hpsInfo.push(p);
      });
    }

    this.spinner = false;
  }

  /** 我要掛號 */
  hpClick(id, name, tel) {
    this.datasvc.cityInfo = this.cityInfo;
    this.datasvc.areaInfo = this.areaInfo;
    const iData: Info = { id: id, name: name, data: { tel: tel } };
    this.datasvc.hpsInfo = iData;
    this.ls.setObject('hpsInfo', iData);
    this.router.navigate(['schedule']);
  }

  /** 查詢掛號 */
  regSearch(id) {
    const myInfo = this.ls.get('perInfo');
    if (myInfo === 'false') {
      this.openDialog();
    } else {
      this.datasvc.regSearchHpsId = id;
      this.ls.setObject('regSearchHpsId', id);
      this.router.navigate(['reglist']);
    }
  }

  openDialog() {
    this.dialog.open(HospitalDialogDialog, {
      width: '250px',
      data: {
        message: '請先設定您的基本資訊尚可查詢掛號紀錄,謝謝！'
      }
    });
  }

  /** 看診進度 */
  goVisit(id, name) {
    this.datasvc.visitHpsId = id;
    this.ls.setObject('visitHpsId', id);

    this.datasvc.visitHpsName = name;
    this.ls.setObject('visitHpsName', name);

    this.router.navigate(['visit']);
  }

  /** 加到最愛 */
  addFavorite(hps) {
    const f = {
      Id: hps.Id,
      Name: hps.Name,
      Adds: hps.Adds,
      Tel: hps.Tel,
      Cityid: hps.Cityid,
      Areaid: hps.Areaid
    };

    const favorite = this.ls.get('favorite');
    if (favorite === 'false') {
      const fs = [];
      fs.push(f);
      this.ls.setObject('favorite', fs);
    } else {
      const fs2 = this.ls.getObject('favorite');
      if (fs2.length === 0) {
        fs2.push(f);
      } else {

        const result = fs2.map(function (item) {
          return item.Id;
        }).indexOf(hps.Id);

        if (result < 0) {
          fs2.push(f);
        }
      }

      this.ls.setObject('favorite', fs2);
    }
  }
}


@Component({
  selector: 'app-hospital-dialog',
  templateUrl: 'hospital-dialog.html',
  styleUrls: ['hospital-dialog.css']
})

// tslint:disable-next-line:component-class-suffix
export class HospitalDialogDialog {
  // constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  constructor(
    public dialogRef: MatDialogRef<HospitalDialogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
