import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodemirorComponent } from './codemiror.component';

describe('CodemirorComponent', () => {
  let component: CodemirorComponent;
  let fixture: ComponentFixture<CodemirorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodemirorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodemirorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
