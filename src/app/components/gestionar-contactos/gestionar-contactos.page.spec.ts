import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarContactosPage } from './gestionar-contactos.page';

describe('GestionarContactosPage', () => {
  let component: GestionarContactosPage;
  let fixture: ComponentFixture<GestionarContactosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarContactosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarContactosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
