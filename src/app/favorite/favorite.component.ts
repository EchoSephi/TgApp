import { Component, OnInit, Inject } from '@angular/core';
import { LocalStorage } from '../local.storage';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Info } from '../model/info';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { cleanSession } from 'selenium-webdriver/safari';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  nowIn = 'favorite';
  spinner = true;
  isNoData = false;
  hpsInfo = [];
  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    // this.datasvc.cleanTempData(this.nowIn);
    this.getData();
  }

  getData() {
    const favorite = this.ls.get('favorite');

    if (favorite === 'false') {
      this.isNoData = true;
    } else {
      const hps = this.ls.getObject('favorite');
      if (hps.length === 0) {
        this.isNoData = true;
      } else {
        hps.forEach(p => {
          const _tel = 'tel:' + p.Tel;
          const _href = 'http://maps.google.com.tw/maps?q=' + p.Adds;
          p.href = _href;
          p.tels = _tel;
          this.hpsInfo.push(p);

        });
        this.isNoData = false;
      }
    }
    this.spinner = false;

  }

  /** 我要掛號 */
  hpClick(hps) {

    const iDatacity: Info = { id: hps.Cityid, name: '', data: {} };
    this.datasvc.cityInfo = iDatacity;
    this.ls.setObject('cityInfo', iDatacity);

    const iDataarea: Info = { id: hps.Areaid, name: '', data: {} };
    this.datasvc.areaInfo = iDataarea;
    this.ls.setObject('areaInfo', iDataarea);

    const iData: Info = { id: hps.Id, name: hps.Name, data: { tel: hps.Tel } };
    this.datasvc.hpsInfo = iData;
    this.ls.setObject('hpsInfo', iData);

    this.router.navigate(['schedule'], { queryParams: { id: '1'} });
  }

  /** 查詢掛號 */
  regSearch(id) {
    const myInfo = this.ls.get('perInfo');
    if (myInfo === 'false') {
      this.openDialog();
    } else {
      this.datasvc.regSearchHpsId = id;
      this.ls.setObject('regSearchHpsId', id);
      this.router.navigate(['reglist'], { queryParams: { id: '1'} });
    }
  }

  openDialog() {
    this.dialog.open(FavoriteDialogDialog, {
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

    this.router.navigate(['visit'], { queryParams: { id: '1'} });
  }

  /** 移除最愛 */
  RemoveFavorite(id) {
    const favorite = this.ls.getObject('favorite');
    const fs = [];
    favorite.forEach(p => {
      if (p.Id !== id) {
        fs.push(p);
      }
    });
    this.ls.setObject('favorite', fs);
    this.ngOnInit();
  }

}
@Component({
  selector: 'app-favorite-dialog',
  templateUrl: 'favorite-dialog.html',
  styleUrls: ['favorite-dialog.css']
})

// tslint:disable-next-line:component-class-suffix
export class FavoriteDialogDialog {
  constructor(
    public dialogRef: MatDialogRef<FavoriteDialogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
