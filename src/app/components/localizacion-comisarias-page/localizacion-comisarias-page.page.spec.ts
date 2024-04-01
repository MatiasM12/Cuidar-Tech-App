import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizacionComisariasPagePage } from './localizacion-comisarias-page.page';

describe('LocalizacionComisariasPagePage', () => {
  let component: LocalizacionComisariasPagePage;
  let fixture: ComponentFixture<LocalizacionComisariasPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LocalizacionComisariasPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
