import { TestBed } from '@angular/core/testing';

import { PdfPropiedadService } from './pdf-propiedad.service';

describe('PdfPropiedadService', () => {
  let service: PdfPropiedadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfPropiedadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
