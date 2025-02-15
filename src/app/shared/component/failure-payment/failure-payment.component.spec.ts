import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailurePaymentComponent } from './failure-payment.component';

describe('FailurePaymentComponent', () => {
  let component: FailurePaymentComponent;
  let fixture: ComponentFixture<FailurePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailurePaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FailurePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
