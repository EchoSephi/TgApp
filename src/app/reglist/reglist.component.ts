import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '../local.storage';
import { DataService } from '../data.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-reglist',
  templateUrl: './reglist.component.html',
  styleUrls: ['./reglist.component.css']
})
export class ReglistComponent implements OnInit {
  nowIn = 'reglist';
  backTo = 'hps';
  spinner = true;
  reglist = [];

  hpsId;
  userinfo;

  panelOpenState = false;

  isNoData = false;

  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getStartWithAsync();
  }

  async getStartWithAsync() {
    // 沒有使用者資料就返回醫院頁面
    const info = this.ls.get('perInfo');
    if (info === 'false') {
      this.router.navigate(['hps']);
    } else {
      this.userinfo = this.ls.getObject('perInfo');
    }

    // 沒有醫院的資料就返回醫院頁面
    const _hpsId = <boolean>await this.datasvc.getregSearchInfo();
    if (_hpsId === false) {
      this.router.navigate(['hps']);
    } else {
      this.hpsId = this.datasvc.regSearchHpsId;
    }
    this.getData();

  }

  getTestData() {
    this.reglist = [
      {
        'date': '1070101',
        'cin': '小兒科',
        'des': '兒科一診',
        'class': '早',
        'doctor': '許韻純',
        'regno': '0002',
      },
      {
        'date': '1070101',
        'cin': '小兒科',
        'des': '兒科一診',
        'class': '早',
        'doctor': '許韻純',
        'regno': '0002',
      },
    ];
  }

  getData() {
    // PID=Tgss
    // CCode=院所代號
    // ID=患者身份證字號
    // BDate=患者生日
    this.reglist = [];
    const url = this.datasvc.webApiUrl + 'tgappreg/Home/預約掛號查詢?PID=Tgss' +
      '&CCode=' + this.hpsId +
      '&ID=' + this.userinfo.userId +
      '&BDate=' + this.userinfo.birthday;
    console.log(url);
    this.datasvc.getData(url)
      .subscribe(
        (results) => {
          const data = results['預掛資訊清單'];
          if (data === 'null' || data === null) {
            this.isNoData = true;
          } else if (data.length === 0) {
            this.isNoData = true;
          } else {
            this.isNoData = false;

            data.forEach(p => {
              const newData = {
                date: p.日期,
                cin: p.科別,
                des: p.診別,
                class: p.班別,
                doctor: p.醫師名,
                regno: p.掛號序號,
                regIdenyiNo: p.預掛識別碼,
              };
              this.reglist.push(newData);
            });
          }
        },
        (error) => {
          console.log(error);
          this.spinner = false;
        },
        () => {
          this.spinner = false;
        }
      );
  }

  cancelReg(element) {
    const url = this.datasvc.webApiUrl + 'tgappreg/Home/預約掛號取消?PID=Tgss' +
      '&CCode=' + this.hpsId +
      '&ID=' + this.userinfo.userId +
      '&BDate=' + this.userinfo.birthday +
      '&rid=' + element.regIdenyiNo;

    console.log(url);
    this.datasvc.getData(url)
      .subscribe(
        (results) => {
          const data = results['回傳資訊'];
          if (data.Success === true) {
            this.openDialog({ title: '掛號已取消', text: '' }, 0);
          } else {
            this.openDialog({ title: '取消掛號失敗', text: data.Message }, 0);
          }
        },
        (error) => {
          console.log(error);
          this.spinner = false;
        },
        () => {
          this.spinner = false;
          this.ngOnInit();
        }
      );
  }

  openDialog(element, del: number): void {
    const dialogRef = this.dialog.open(RegListDialogDialog, {
      width: '250px',
      data: { element: element, del: del }
    });
    if (del === 1) {
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.cancelReg(result);
        }
      });
    }
  }
}

@Component({
  selector: 'app-reglist-dialog',
  templateUrl: 'reglist-dialog.html',
  styleUrls: ['reglist-dialog.css']
})

// tslint:disable-next-line:component-class-suffix
export class RegListDialogDialog {
  // constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  constructor(
    public dialogRef: MatDialogRef<RegListDialogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
