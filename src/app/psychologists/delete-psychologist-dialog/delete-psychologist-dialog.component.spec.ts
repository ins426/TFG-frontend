import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePsychologistDialogComponent } from './delete-psychologist-dialog.component';

describe('DeletePsychologistDialogComponent', () => {
  let component: DeletePsychologistDialogComponent;
  let fixture: ComponentFixture<DeletePsychologistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePsychologistDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePsychologistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
