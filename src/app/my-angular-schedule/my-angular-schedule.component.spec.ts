import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAngularScheduleComponent } from './my-angular-schedule.component';

describe('MyAngularScheduleComponent', () => {
  let component: MyAngularScheduleComponent;
  let fixture: ComponentFixture<MyAngularScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAngularScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAngularScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
