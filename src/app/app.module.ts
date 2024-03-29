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
import { VanillaComponent } from './vanilla/vanilla.component';

@NgModule({
  declarations: [AppComponent, VanillaComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CodeEditorModule.forRoot(),
    CommonModule,
    FormsModule,
    CodemirrorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
