import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePatientDialogComponent } from './delete-patient-dialog.component';

describe('DeletePatientDialogComponent', () => {
  let component: DeletePatientDialogComponent;
  let fixture: ComponentFixture<DeletePatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePatientDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
