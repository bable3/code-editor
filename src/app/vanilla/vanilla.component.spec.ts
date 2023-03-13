import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanillaComponent } from './vanilla.component';

describe('VanillaComponent', () => {
  let component: VanillaComponent;
  let fixture: ComponentFixture<VanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
