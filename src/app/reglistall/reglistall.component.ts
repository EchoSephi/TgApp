import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorage } from '../local.storage';
import { DataService } from '../data.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-reglistall',
  templateUrl: './reglistall.component.html',
  styleUrls: ['./reglistall.component.css']
})
export class ReglistallComponent implements OnInit {
  nowIn = 'reglistall';
  backTo = 'hps';
  spinner = true;
  reglist = [];

  userinfo;

  panelOpenState = false;
  isNoData = false;

  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.datasvc.cleanTempData(this.nowIn);
    this.getStartWithAsync();
  }

  async getStartWithAsync() {
    const info = this.ls.get('perInfo');
    if (info === 'false') {
      this.router.navigate(['per']);
    } else {
      this.userinfo = this.ls.getObject('perInfo');
      this.getData();
    }
  }

  getData() {
    this.reglist = [];

    const url = this.datasvc.webApiUrl + 'tgappreg/Home/平台預約掛號查詢?PID=Tgss' +
      '&ID=' + this.userinfo.userId +
      '&BDate=' + this.userinfo.birthday;
    console.log(url);
    this.datasvc.getData(url)
      .subscribe(
      (results) => {
          const data = results['平台掛號清單'];
          if (data === 'null' || data === null) {
            this.isNoData = true;
          } else if (data.length === 0) {
            this.isNoData = true;
          } else {
            this.isNoData = false;

            data.forEach(p => {
              const hpsId = p.院所代號;
              let hpsName = '';
              const hps = this.ls.getObject('hps');

              hps.some(function (p1) {
                if (p1.Id === hpsId) {
                  hpsName = p1.Name;
                  return true;
                } else {
                  return false;
                }
              });

              const newData = {
                hpsName: hpsName,
                hpsId: p.院所代號,
                date: p.日期,
                cin: p.科別,
                des: p.診別,
                class: p.班別,
                doctor: p.醫師,
                regno: p.看診序號,
                // regIdenyiNo: p.排班識別碼,
                regIdenyiNo: p.rid,
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
      '&CCode=' + element.hpsId +
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
    const dialogRef = this.dialog.open(RegListAllDialogDialog, {
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
  selector: 'app-reglistall-dialog',
  templateUrl: 'reglistall-dialog.html',
  styleUrls: ['reglistall-dialog.css']
})

// tslint:disable-next-line:component-class-suffix
export class RegListAllDialogDialog {
  // constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  constructor(
    public dialogRef: MatDialogRef<RegListAllDialogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
