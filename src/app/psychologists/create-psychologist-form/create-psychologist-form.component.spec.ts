import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePsychologistFormComponent } from './create-psychologist-form.component';

describe('CreatePsychologistFormComponent', () => {
  let component: CreatePsychologistFormComponent;
  let fixture: ComponentFixture<CreatePsychologistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePsychologistFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePsychologistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
