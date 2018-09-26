import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '../local.storage';
import { Person } from '../model/person';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  nowIn = 'per';
  backTo = 'city';
  spinner = true;
  myInfo: Person;
  errMsg;

  isShowNotify = false;
  isNotify = false;

  constructor(private datasvc: DataService, private ls: LocalStorage, private router: Router) { }

  ngOnInit() {
    this.datasvc.cleanTempData(this.nowIn);

    this.getStartWithAsync();

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push is supported');
      this.isShowNotify = true;
    } else {
      this.isShowNotify = false;
      console.warn('Push messaging is not supported');
    }
  }

  async getStartWithAsync() {
    this.myInfo = this.ls.getObject('perInfo');
    this.spinner = false;
  }

  async saveMe() {

    this.ls.setObject('perInfo', this.myInfo);

    let endpoint = '';
    let p256dh = '';
    let auth = '';

    // 取得Subscription
    if (this.isNotify === true) {
      this.getSubscription();
      const isLogin = <SubscriptionData>await this.getSubscription();
      endpoint = isLogin.endpoint;
      p256dh = isLogin.p256dh;
      auth = isLogin.auth;
    } else {
      endpoint = '';
      p256dh = '';
      auth = '';
    }

    const url = this.datasvc.webApiUrl + 'tgappreg/Home/平台推播資訊接收?PID=Tgss&DATA=' +
      '{"userName":"' + this.myInfo.userName +
      '","userId":"' + this.myInfo.userId +
      '","birthday":"' + this.myInfo.birthday +
      '","cellPhone":"' + this.myInfo.cellPhone +
      '","endpoint":"' + endpoint +
      '","p256dh":"' + p256dh +
      '","auth":"' + auth +
      '"}';
    console.log(url);
    this.datasvc.getData(url)
      .subscribe(
        (res) => {
          // console.log(res);
        },
        (error) => {
          console.log(error);
        },
        () => {
          this.router.navigate(['']);
        }
      );

  }

  returnHome() {
    this.router.navigate(['']);
  }

  getSubscription() {
    return new Promise(resolve => {
      navigator.serviceWorker.register('ngsw-worker.js')
        .then(function (swReg) {
          const applicationServerPublicKey = 'BHGoDPR7BMjTUNguX4q56KkwdEe_317HisQ6iLnAQQrY3iHtk18vnSt9bwSiVnIOWnJiaHHj1HkTzYc-GvpcGY8';
          const swRegistration = swReg;

          const padding = '='.repeat((4 - applicationServerPublicKey.length % 4) % 4);
          const base64 = (applicationServerPublicKey + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);

          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }

          const applicationServerKey = outputArray;

          swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          })
            .then(function (subscription) {
              // todo 在此取得 subscription
              const _subscription = JSON.stringify(subscription);
              console.log(_subscription);
              const sd1 = JSON.parse(_subscription);
              const sd: SubscriptionData = {
                endpoint: sd1['endpoint'],
                p256dh: sd1['keys'].p256dh,
                auth: sd1['keys'].auth,
              };
              resolve(sd);

            })
            .catch(function (err) {
              console.log('Failed to subscribe the user: ', err);
              const sd: SubscriptionData = {
                endpoint: '',
                p256dh: '',
                auth: '',
              };
              resolve(sd);
            });

        });
    });

  }

  inComplete(): boolean {
    this.errMsg = this.datasvc.checkPersonSetting(this.myInfo);
    if (this.errMsg !== '') {
      return false;
    }

    this.errMsg = '';
    return true;
  }
}

export interface SubscriptionData {
  endpoint: any;
  p256dh: any;
  auth: any;
}
