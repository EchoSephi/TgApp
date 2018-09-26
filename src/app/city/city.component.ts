import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';
import { LocalStorage } from '../local.storage';
import { Router } from '@angular/router';
import { Info } from '../model/info';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  nowIn = 'city';
  backTo = '';
  spinner = true;

  cityInfo;

  constructor(private datasvc: DataService,
    private ls: LocalStorage,
    private router: Router) {
  }

  ngOnInit() {

    this.datasvc.cleanTempData(this.nowIn);

    this.getData();
  }

  getData() {
    const url =  this.datasvc.webApiUrl + 'tgAppAPI/api/GetHospList';
    console.log(url);
    this.datasvc.getData(url)
      .subscribe(
        (results) => {
          this.cityInfo = results[0].Citys;
          this.ls.setObject('citys', results[0].Citys);
          this.ls.setObject('areas', results[0].Areas);
          this.ls.setObject('hps', results[0].Hps);
          this.datasvc.citys = results[0].Citys;
          this.datasvc.areas = results[0].Areas;
          this.datasvc.hps = results[0].Hps;

        },
        (error) => {
          console.log(error);
          const isLocalCityInfo = this.ls.get('citys');

          if (isLocalCityInfo === 'false') {
            this.datasvc.initial();
            this.cityInfo = this.ls.getObject('citys');
          } else {
            this.cityInfo = this.ls.getObject('citys');
          }
          this.spinner = false;
        },
        () => {
          this.spinner = false;
        }
      );
  }

  cityClick(id, name) {
    const iData: Info = { id: id, name: name, data: {} };
    this.datasvc.cityInfo = iData;
    this.ls.setObject('cityInfo', iData);
    this.router.navigate(['area']);
  }

}
