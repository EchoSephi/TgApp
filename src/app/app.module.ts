import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LocalStorage } from './local.storage';
import { SharedMaterialModule } from './sharedMaterial-module';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CityComponent } from './city/city.component';
import { AreaComponent } from './area/area.component';
import { HospitalComponent, HospitalDialogDialog } from './hospital/hospital.component';
import { ScheduleComponent, ScheduleDialogDialog } from './schedule/schedule.component';
import { RegisteredComponent } from './registered/registered.component';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { PersonComponent } from './person/person.component';
import { CompleteComponent } from './complete/complete.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { ReglistComponent, RegListDialogDialog } from './reglist/reglist.component';
import { ReglistallComponent, RegListAllDialogDialog } from './reglistall/reglistall.component';
import { VisitingComponent } from './visiting/visiting.component';
import { FavoriteComponent, FavoriteDialogDialog } from './favorite/favorite.component';

@NgModule({
  declarations: [
    AppComponent,
    CityComponent,
    AreaComponent,
    HospitalComponent,
    ScheduleComponent,
    RegisteredComponent,
    PersonComponent,
    CompleteComponent,
    ScheduleDialogDialog,
    HospitalDialogDialog,
    ReglistComponent,
    RegListDialogDialog,
    ReglistallComponent,
    RegListAllDialogDialog,
    VisitingComponent,
    FavoriteComponent,
    FavoriteDialogDialog,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedMaterialModule,
    CdkTableModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    DataService,
    LocalStorage,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ScheduleComponent,
    ScheduleDialogDialog,
    HospitalDialogDialog,
    RegListDialogDialog,
    RegListAllDialogDialog,
    FavoriteDialogDialog
  ],
})
export class AppModule { }
