import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JsRendererVariableCollection } from 'src/shared/models/JsRendererVariableCollection';

@Component({
  selector: 'app-vanilla',
  templateUrl: './vanilla.component.html',
  styleUrls: ['./vanilla.component.scss'],
})
export class VanillaComponent implements AfterViewInit {
  private _editor: any;

  code$ = new BehaviorSubject(`<h1>This is some fake things</h1>
<p>Here is a list of things</p>
<ul>
    <li>Thing 1</li>
    <li>Thing 2</li>
    <li>Thing 3</li>
</ul>`);

  @ViewChild('editor', { static: true })
  editorContent!: ElementRef<HTMLDivElement>;
  position: any;

  ngAfterViewInit(): void {
    this.setupEditor();
  }

  private setupEditor() {
    const domElement = this.editorContent.nativeElement;

    this._editor = monaco.editor.create(domElement);
    this._editor.onDidChangeCursorPosition((event: any) => {
      this.position = event.position;
    });
    this._editor.onDidChangeModelContent((event: any) => {
      this.code$.next(this._editor.getValue());
    });
  }

  appendCode(code: string) {
    let codeByLine = this._editor.getValue().split('\n');
    let line = codeByLine[this.position.lineNumber - 1];
    line =
      line.slice(0, this.position.column - 1) +
      code +
      line.slice(this.position.column - 1);
    codeByLine[this.position.lineNumber - 1] = line;
    const previousCursorPosition = { ...this.position };
    this._editor.setValue(codeByLine.join('\n'));
    this._editor.setPosition({
      ...previousCursorPosition,
      column: previousCursorPosition.column + code.length,
    });
    this._editor.focus();
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
}
