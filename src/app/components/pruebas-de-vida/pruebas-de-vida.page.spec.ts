import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasDeVidaPage } from './pruebas-de-vida.page';

describe('PruebasDeVidaPage', () => {
  let component: PruebasDeVidaPage;
  let fixture: ComponentFixture<PruebasDeVidaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PruebasDeVidaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebasDeVidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
