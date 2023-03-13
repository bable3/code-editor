import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';

import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { JsRendererVariableCollection } from 'src/shared/models/JsRendererVariableCollection';
import { CursorPostion } from '../../shared/models/CursorPostion';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ngstack',
  templateUrl: './ngstack.component.html',
  styleUrls: ['./ngstack.component.scss'],
})
export class NgstackComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') editor!: CodeEditorComponent;
  cursor!: any;
  lines_container!: any;
  cursorPosition: CursorPostion = { x: 0, y: 0, line: 0, column: 0 };
  observer!: MutationObserver;
  buisy$ = new BehaviorSubject<boolean>(false);

  ngAfterViewInit(): void {
    this.cursor = this.editor.editorContent.nativeElement.querySelector(
      '.cursor.monaco-mouse-cursor-text'
    );

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          this.cursor &&
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          const currentTop = parseInt(this.cursor.style.top);
          const currentLeft = parseInt(this.cursor.style.left);
          if (
            this.cursorPosition.x != currentLeft ||
            this.cursorPosition.y != currentTop
          ) {
            this.cursorPosition.x = currentLeft;
            this.cursorPosition.y = currentTop;
            this.cursorPosition.line = currentTop / 18;
            this.cursorPosition.column = Math.ceil(currentLeft / 7.23);
          }
        }
      });
    });
    const observerConfig = {
      attributes: true,
      attributeFilter: ['style'],
    };
    this.observer.observe(this.cursor, observerConfig);
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
  <li>Thing 3</li>
</ul>`,
  };

  editorOptions = {
    tabindex: 1,
    cursorWidth: 1,
  };

  cursorIndex!: number;

  appendCode(code: string) {
    this.buisy$.next(true);
    // strange workaround to update the code model
    // https://github.com/ngstack/code-editor/issues/476
    let codeByLine = this.codeModel.value.split('\n');
    let line = codeByLine[this.cursorPosition.line];
    const previousCursorPosition: CursorPostion = { ...this.cursorPosition };
    line =
      line.slice(0, this.cursorPosition.column) +
      code +
      line.slice(this.cursorPosition.column);
    codeByLine[this.cursorPosition.line] = line;

    const newCodeModel: CodeModel = {
      ...this.codeModel,
      value: codeByLine.join('\n'),
    };
    this.codeModel = newCodeModel;
    setTimeout(() => {
      this.cursor.style.left = `${
        previousCursorPosition.x + code.length * 7.23
      }px`;
      this.cursor.style.top = `${previousCursorPosition.y}px`;

      this.buisy$.next(false);
    }, 100);
  }

  updateCodeModel(event: string) {
    this.codeModel.value = event;
  }
  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
