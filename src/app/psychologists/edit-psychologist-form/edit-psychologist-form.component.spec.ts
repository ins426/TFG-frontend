import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPsychologistFormComponent } from './edit-psychologist-form.component';

describe('EditPsychologistFormComponent', () => {
  let component: EditPsychologistFormComponent;
  let fixture: ComponentFixture<EditPsychologistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPsychologistFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPsychologistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
