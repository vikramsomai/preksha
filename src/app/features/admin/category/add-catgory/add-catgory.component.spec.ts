import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCatgoryComponent } from './add-catgory.component';

describe('AddCatgoryComponent', () => {
  let component: AddCatgoryComponent;
  let fixture: ComponentFixture<AddCatgoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCatgoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCatgoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
