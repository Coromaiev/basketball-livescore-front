import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlayersComponent } from './view-players.component';

describe('PlayerTransferComponent', () => {
  let component: ViewPlayersComponent;
  let fixture: ComponentFixture<ViewPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPlayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
