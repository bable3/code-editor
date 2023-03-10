import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { JsRendererVariableCollection } from 'src/shared/models/JsRendererVariableCollection';

@Component({
  selector: 'app-ngstack',
  templateUrl: './ngstack.component.html',
  styleUrls: ['./ngstack.component.scss'],
})
export class NgstackComponent implements AfterViewInit {
  @ViewChild('editor') editor!: CodeEditorComponent;
  cursor!: HTMLElement | null;

  ngAfterViewInit(): void {
    this.cursor = this.editor.editorContent.nativeElement.querySelector(
      '.cursor.monaco-mouse-cursor-text'
    );
  }

  variables: JsRendererVariableCollection[] = [
    {
      title: 'Content',
      variables: [
        {
          name: '@bill',
          value: '{{:clientName}}',
        },
        {
          name: '@clientEmail',
          value: '{{:clientEmail}}',
        },
      ],
    },
    {
      title: 'Local',
      variables: [
        {
          name: 'name',
          value: 'John Doe',
        },
        {
          name: 'age',
          value: 30,
        },
      ],
    },
  ];
  codeModel: CodeModel = {
    language: 'twig',
    uri: 'main.html',
    value: `<h1>This is some fake things</h1>
<p>Here is a list of things</p>
<ul>
  <li>Thing 1</li>
  <li>Thing 2</li>
  <li>Thing 3\u200B</li>
</ul>
    `,
  };

  editorOptions = {
    tabindex: 1,
  };

  cursorIndex!: number;

  appendCode(code: string) {
    // strange workaround to update the code model
    // https://github.com/ngstack/code-editor/issues/476
    this.findU200B();
    const newCodeModel: CodeModel = {
      ...this.codeModel,
      value:
        this.codeModel.value.slice(0, this.cursorIndex) +
        code +
        this.codeModel.value.slice(this.cursorIndex),
    };
    this.codeModel = newCodeModel;
  }

  findU200B() {
    const u200B = '\u200B';
    const u200BIndex = this.codeModel.value.indexOf(u200B);
    this.cursorIndex = u200BIndex;
  }

  insertU200B() {
    this.findCursorPosition();
  }

  findCursorPosition() {
    const styleString = this.cursor?.getAttribute('style');
    if (!styleString) {
      return;
    }
    const styleObject: { [key: string]: string } = styleString
      .split(';')
      .reduce((result: any, pair) => {
        const [key, value] = pair.trim().split(':');
        if (key && value) {
          result[key.trim()] = value.trim();
        }
        return result;
      }, {});
    console.log(styleObject);
  }

  updateCodeModel(event: string) {
    this.codeModel.value = event;
  }
}
