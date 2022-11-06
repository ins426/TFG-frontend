import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientFormComponent } from './edit-patient-form.component';

describe('EditPatientFormComponent', () => {
  let component: EditPatientFormComponent;
  let fixture: ComponentFixture<EditPatientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPatientFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPatientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
