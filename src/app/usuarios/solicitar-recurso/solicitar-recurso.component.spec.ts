import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarRecursoComponent } from './solicitar-recurso.component';

describe('SolicitarRecursoComponent', () => {
  let component: SolicitarRecursoComponent;
  let fixture: ComponentFixture<SolicitarRecursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitarRecursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
