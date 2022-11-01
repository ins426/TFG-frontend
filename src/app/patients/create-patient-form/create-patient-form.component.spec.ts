import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientFormComponent } from './create-patient-form.component';

describe('CreatePatientFormComponent', () => {
  let component: CreatePatientFormComponent;
  let fixture: ComponentFixture<CreatePatientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePatientFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePatientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
