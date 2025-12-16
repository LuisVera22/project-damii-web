import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartjsRegister } from './chartjs-register';

describe('ChartjsRegister', () => {
  let component: ChartjsRegister;
  let fixture: ComponentFixture<ChartjsRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartjsRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartjsRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
