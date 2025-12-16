import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryList } from './library-list';

describe('LibraryList', () => {
  let component: LibraryList;
  let fixture: ComponentFixture<LibraryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
