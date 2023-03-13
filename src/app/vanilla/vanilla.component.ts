import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { JsRendererVariableCollection } from 'src/shared/models/JsRendererVariableCollection';

@Component({
  selector: 'app-vanilla',
  templateUrl: './vanilla.component.html',
  styleUrls: ['./vanilla.component.scss'],
})
export class VanillaComponent implements AfterViewInit {
  private _editor: any;

  code$ = new BehaviorSubject(`
{{ for : bar }}

{{ endfor }}
          
{{ for : foo }}

{{ endfor }}
         `);
  codeByLine$ = this.code$.pipe(
    map((code) => {
      return code.split('\n');
    })
  );

  @ViewChild('editor', { static: true })
  editorContent!: ElementRef<HTMLDivElement>;
  position: any;

  ngAfterViewInit(): void {
    this.setupEditor();
  }

  private setupEditor() {
    const domElement = this.editorContent.nativeElement;

    this._editor = monaco.editor.create(domElement, {
      value: this.code$.value,
      language: 'html',
      automaticLayout: true,
      theme: 'vs-dark',
    });

    this._editor.onDidChangeCursorPosition((event: any) => {
      this.updateVariables(null);
      this.position = event.position;
      let variableName = null;
      const codeLines = this._editor.getValue().split('\n');
      const forLoopPattern = /{{\s*for\s*:\s*(\w+)\s*}}/;
      const endforPattern = /{{\s*endfor\s*}}/;
      const lineIndex = this.position.lineNumber - 1;

      for (let i = lineIndex - 1; i >= 0; i--) {
        const line = codeLines[i];
        const forLoopMatch = line.match(forLoopPattern);
        const endforMatch = line.match(endforPattern);
        if (forLoopMatch) {
          variableName = forLoopMatch[1];
          this.updateVariables(variableName);
          break;
        } else if (endforMatch) {
          break;
        } else {
        }
      }
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

  updateVariables(variableName: string | null) {
    this.variables = this.variables.map((variable) => {
      variable.variables = variable.variables.map((variable) => {
        if (variable.name === variableName) {
          variable.visible = true;
        } else {
          variable.visible = false;
        }
        return variable;
      });
      return variable;
    });
  }
  variables: JsRendererVariableCollection[] = [
    {
      title: 'Prestation',
      variables: [
        {
          name: 'prestations',
          value: `
{{ for : prestations }}

{{ endfor }}
          `,
          visible: false,
          childs: [
            {
              title: 'Prestation',
              variables: [
                {
                  name: 'name',
                  value: 'name',
                },
                {
                  name: 'description',
                  value: 'description',
                },
                {
                  name: 'price',
                  value: 'price',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Contract',
      variables: [
        {
          name: 'contracts',
          value: `
{{ for : contracts }}

{{ endfor }}
          `,
          visible: false,
          childs: [
            {
              title: 'Contracts',
              variables: [
                {
                  name: 'name',
                  value: 'name',
                },
                {
                  name: 'description',
                  value: 'description',
                },
                {
                  name: 'price',
                  value: 'price',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
