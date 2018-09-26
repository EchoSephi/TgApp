import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CityComponent } from './city/city.component';
import { AreaComponent } from './area/area.component';
import { HospitalComponent } from './hospital/hospital.component';
import { RegisteredComponent } from './registered/registered.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { PersonComponent } from './person/person.component';
import { CompleteComponent } from './complete/complete.component';
import { ReglistComponent } from './reglist/reglist.component';
import { ReglistallComponent } from './reglistall/reglistall.component';
import { VisitingComponent } from './visiting/visiting.component';
import { FavoriteComponent } from './favorite/favorite.component';

const routes: Routes = [
  { path: '', component: CityComponent },
  { path: 'city', component: CityComponent},
  { path: 'area', component: AreaComponent},
  { path: 'hps', component: HospitalComponent },
  { path: 'hps/?l', component: HospitalComponent},
  { path: 'schedule', component: ScheduleComponent},
  { path: 'visit', component: VisitingComponent},
  { path: 'reg', component: RegisteredComponent},
  { path: 'per', component: PersonComponent},
  { path: 'complete', component: CompleteComponent },
  { path: 'reglist', component: ReglistComponent},
  { path: 'reglistall', component: ReglistallComponent },
  { path: 'favorite', component: FavoriteComponent},
  { path: '**', component: CityComponent },
  // { path: '', redirectTo: '/', pathMatch: 'full'},
  { path: '', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: true })],
  // imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
