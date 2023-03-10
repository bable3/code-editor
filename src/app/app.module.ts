import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CodeEditorModule } from '@ngstack/code-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NuMonacoEditorModule } from '@ng-util/monaco-editor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { CodemirorComponent } from './codemiror/codemiror.component';
import { NgstackComponent } from './ngstack/ngstack.component';

@NgModule({
  declarations: [AppComponent, CodemirorComponent, NgstackComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CodeEditorModule.forRoot(),
    NuMonacoEditorModule.forRoot(),
    MonacoEditorModule.forRoot(),
    CommonModule,
    FormsModule,
    CodemirrorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
