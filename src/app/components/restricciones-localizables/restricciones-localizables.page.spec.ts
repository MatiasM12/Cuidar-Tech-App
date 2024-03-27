import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestriccionesLocalizablesPage } from './restricciones-localizables.page';

describe('RestriccionesLocalizablesPage', () => {
  let component: RestriccionesLocalizablesPage;
  let fixture: ComponentFixture<RestriccionesLocalizablesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestriccionesLocalizablesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestriccionesLocalizablesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
