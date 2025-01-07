import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchEncodingComponent } from './match-encoding.component';

describe('MatchEncodingComponent', () => {
  let component: MatchEncodingComponent;
  let fixture: ComponentFixture<MatchEncodingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchEncodingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchEncodingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
