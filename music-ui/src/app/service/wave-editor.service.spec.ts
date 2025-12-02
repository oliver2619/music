import { TestBed } from '@angular/core/testing';

import { WaveEditorService } from './wave-editor.service';

describe('WaveEditorService', () => {
  let service: WaveEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaveEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
