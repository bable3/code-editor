import { Component, ViewChild } from '@angular/core';

import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { JsRendererVariableCollection } from 'src/shared/models/JsRendererVariableCollection';

@Component({
  selector: 'app-codemiror',
  templateUrl: './codemiror.component.html',
  styleUrls: ['./codemiror.component.scss'],
})
export class CodemirorComponent {
  @ViewChild('mirror') mirror!: CodemirrorComponent;

  disabled = false;
  themes = ['vs', 'vs-dark', 'hc-black'];
  value = '<h1>Title</h1>';
  cursorPosition: CodeMirror.Position = { line: 0, ch: 0 };
  content = '<h1>Title</h1>';
  options = { theme: 'vs-dark' };
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

  appendCode(code: string) {
    this.value += code;
    this.content += code;
  }
  onEvent($event: any) {
    console.log($event);
  }

  editorOptions = { theme: 'vs-dark', language: 'javascript' };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';

  onCursorActivity(editor: CodeMirror.Editor) {
    this.cursorPosition = editor.getCursor();
  }

  appendCodeMirror(code: string) {
    console.log(this.mirror);
    console.log(this.cursorPosition);
    if (this.cursorPosition) {
      this.code =
        this.code.slice(0, this.cursorPosition.ch) +
        code +
        this.code.slice(this.cursorPosition.ch);
    } else {
      this.code += code;
    }
  }
}
