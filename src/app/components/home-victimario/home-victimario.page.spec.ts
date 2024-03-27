import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVictimarioPage } from './home-victimario.page';

describe('HomeVictimarioPage', () => {
  let component: HomeVictimarioPage;
  let fixture: ComponentFixture<HomeVictimarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeVictimarioPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeVictimarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
