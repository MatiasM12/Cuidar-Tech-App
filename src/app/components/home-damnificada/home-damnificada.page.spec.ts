import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDamnificadaPage } from './home-damnificada.page';

describe('HomeDamnificadaPage', () => {
  let component: HomeDamnificadaPage;
  let fixture: ComponentFixture<HomeDamnificadaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeDamnificadaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDamnificadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
