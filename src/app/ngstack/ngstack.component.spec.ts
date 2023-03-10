import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgstackComponent } from './ngstack.component';

describe('NgstackComponent', () => {
  let component: NgstackComponent;
  let fixture: ComponentFixture<NgstackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgstackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgstackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
