import { Component, OnInit, Input } from '@angular/core';
import { LocalStorage } from '../local.storage';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Info } from '../model/info';


@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  nowIn = 'area';
  backTo = 'city';

  spinner = true;

  cityInfo: Info;
  areaInfo  = [];

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

    // 沒有區域的資料就返回城市頁面
    const _areas = <boolean>await this.datasvc.getArea();
    if (_areas === false) {
      this.router.navigate(['city']);
    } else {
      const areas = this.datasvc.areas;
      this.getAreas(areas);
    }

  }

  getAreas(areas) {
    areas.forEach(p => {
      if (this.cityInfo.id === p.Cityid) {
        this.areaInfo.push(p);
      }
    });
    this.spinner = false;
  }

  areaClick(id, name) {
    this.datasvc.cityInfo = this.cityInfo;
    const iData: Info = { id: id, name: name, data: {} };
    this.datasvc.areaInfo = iData;
    this.ls.setObject('areaInfo', iData);
    this.router.navigate(['hps']);
  }
}
