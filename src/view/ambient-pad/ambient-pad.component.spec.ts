import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbientPadComponent } from './ambient-pad.component';

describe('AmbientPadComponent', () => {
  let component: AmbientPadComponent;
  let fixture: ComponentFixture<AmbientPadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbientPadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmbientPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
