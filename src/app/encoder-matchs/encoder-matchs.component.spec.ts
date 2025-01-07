import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncoderMatchsComponent } from './encoder-matchs.component';

describe('EncoderMatchsComponent', () => {
  let component: EncoderMatchsComponent;
  let fixture: ComponentFixture<EncoderMatchsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncoderMatchsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncoderMatchsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
