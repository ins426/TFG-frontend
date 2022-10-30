import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAngularSchedulerComponent } from './my-angular-scheduler.component';

describe('HomeComponent', () => {
  let component: MyAngularSchedulerComponent;
  let fixture: ComponentFixture<MyAngularSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAngularSchedulerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAngularSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
