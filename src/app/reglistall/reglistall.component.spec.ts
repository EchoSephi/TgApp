import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglistallComponent } from './reglistall.component';

describe('ReglistallComponent', () => {
  let component: ReglistallComponent;
  let fixture: ComponentFixture<ReglistallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglistallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglistallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
