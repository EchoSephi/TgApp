import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '../local.storage';
import { DataService } from '../data.service';

@Component({
  selector: 'app-visiting',
  templateUrl: './visiting.component.html',
  styleUrls: ['./visiting.component.css']
})
/** 看診進度 */
export class VisitingComponent implements OnInit {
  nowIn = 'visit';
  backTo = 'hps';
  spinner = true;
  visitlist = [];
  hpsId;
  hpsName;

  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params.id === '1') {
        this.backTo = 'favorite';
      }
    });
  }

  ngOnInit() {


    this.getStartWithAsync();
  }

  async getStartWithAsync() {
    // 沒有醫院的資料就返回醫院頁面
    const _hpsId = <boolean>await this.datasvc.getVisitInfo();
    if (_hpsId === false) {
      this.router.navigate(['hps']);
    } else {
      this.hpsId = this.datasvc.visitHpsId;
      this.hpsName = this.datasvc.visitHpsName;
    }
    this.getData();
  }

  getData() {
    // PID=Tgss
    // CCode=院所代號
    this.visitlist = [];
    const url = this.datasvc.webApiUrl + 'tgappreg/Home/目前看診號查詢?PID=Tgss' +
      '&CCode=' + this.hpsId;
    console.log(url);
    this.datasvc.getData(url)
      .subscribe(
        (results) => {
          const data = results['目前看診號清單'];
          data.forEach(p => {
            const newData = {
              cCode: p.院所代號,
              date: p.日期,
              cin: p.科別,
              des: p.診別,
              class: p.班別,
              doctor: p.醫師名,
              visitNoNow: p.目前看診號,
            };
            this.visitlist.push(newData);
          });
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

}
