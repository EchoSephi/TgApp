import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorage } from './local.storage';
import { Info } from './model/info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy {
  mobileQuery: MediaQueryList;
  title = 'app';
  nowIn;
  backTo;
  showBack = false;
  backWere;

  private _mobileQueryListener: () => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datasvc: DataService,
    private ls: LocalStorage,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const hpsdata = this.ls.get('hps');
      if (hpsdata !== 'false') {
        const hps = this.ls.getObject('hps');
        const result = hps.map(function (item) {
          return item.Id;
        }).indexOf(params.id);

        if (result >= 0) {
          const p = hps[result];
          this.gotoDefault(p);
        }
      }
    });

    const hp = this.ls.get('defaultHP');
    if (hp !== 'false') {
      const p = this.ls.getObject('defaultHP');
      this.gotoDefault(p);
    }
  }

  gotoDefault(p) {
    const iDatacity: Info = { id: p.Cityid, name: '', data: {} };
    this.datasvc.cityInfo = iDatacity;
    this.ls.setObject('cityInfo', iDatacity);

    const iDataarea: Info = { id: p.Areaid, name: '', data: {} };
    this.datasvc.areaInfo = iDataarea;
    this.ls.setObject('areaInfo', iDataarea);

    this.datasvc.hpsSingleInfo = p;
    this.ls.setObject('hpsSingleInfo', p);

    this.ls.setObject('defaultHP', p);

    this.router.navigate(['hps']);
  }

  isBackTo(): boolean {
    // console.log(this.backTo);
    return this.backTo;
  }

  // 取得目前router在哪一頁
  doModify(post) {
    this.nowIn = post.nowIn;
    this.backTo = post.backTo;
    if (this.nowIn === '' || this.nowIn === 'complete' || this.nowIn === 'city' || this.nowIn === 'favorite') {
      this.showBack = false;
    } else {
      this.showBack = true;
    }

  }

}
