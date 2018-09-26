import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglistComponent } from './reglist.component';

describe('ReglistComponent', () => {
  let component: ReglistComponent;
  let fixture: ComponentFixture<ReglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
