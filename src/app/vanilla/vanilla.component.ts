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

  code$ = new BehaviorSubject(`<!DOCTYPE html>
<html>
<head>
  <title>Monarch Workbench</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!----
  -- -- -- a comment -- -- --
  ---->
  <style bah="bah">
    body { font-family: Consolas; } /* nice */
  </style>
</head>
<body>
  <br/>
  <div class="test">
    <ul>
      {{for people}}
        <li>
          {{:name}}
          {{if foo}}
            ( {{:foo.bar}} )
          {{/if}}
          {{if nickname}}
            ( {{:nickname}} )
          {{/if}}
        </li>
      {{/for}}
    </ul>
  </div>
</body>
</html>`);
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
    const EMPTY_ELEMENTS: string[] = [
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'keygen',
      'link',
      'menuitem',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ];
    const conf: monaco.languages.LanguageConfiguration = {
      wordPattern:
        /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,

      comments: {
        blockComment: ['<!--', '-->'],
      },

      brackets: [
        ['<!--', '-->'],
        ['<', '>'],
        ['{{', '}}'],
        ['{{for', '}}'],
        ['{{if', '}}'],
        ['{{else', '}}'],
        ['{{/if', '}}'],
        ['{{/for', '}}'],
        ['{{:', '}}'],
        ['{', '}'],
        ['(', ')'],
      ],

      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],

      surroundingPairs: [
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '<', close: '>' },
      ],

      onEnterRules: [
        {
          beforeText: new RegExp(
            `<(?!(?:${EMPTY_ELEMENTS.join(
              '|'
            )}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`,
            'i'
          ),
          afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
          action: {
            indentAction: monaco.languages.IndentAction.IndentOutdent,
          },
        },
        {
          beforeText: new RegExp(
            `<(?!(?:${EMPTY_ELEMENTS.join(
              '|'
            )}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
            'i'
          ),
          action: { indentAction: monaco.languages.IndentAction.Indent },
        },
      ],

      folding: {
        markers: {
          start: new RegExp('^\\s*<!--\\s*#region\\b.*-->'),
          end: new RegExp('^\\s*<!--\\s*#endregion\\b.*-->'),
        },
      },
    };

    const language = <monaco.languages.IMonarchLanguage>{
      defaultToken: '',
      tokenPostfix: '.jsRender',
      ignoreCase: true,

      keywords: [
        // (opening) tags
        'apply',
        'autoescape',
        'block',
        'deprecated',
        'do',
        'embed',
        'extends',
        'flush',
        'for',
        'from',
        'if',
        'import',
        'include',
        'macro',
        'sandbox',
        'set',
        'use',
        'verbatim',
        'with',
        // closing tags
        'endapply',
        'endautoescape',
        'endblock',
        'endembed',
        'endfor',
        'endif',
        'endmacro',
        'endsandbox',
        'endset',
        'endwith',
        // literals
        'true',
        'false',
      ],

      // The main tokenizer for our languages
      tokenizer: {
        root: [
          [/{{[-~]?/, 'delimiter.twig', '@blockState'],
          [/{{:[-~]?/, 'delimiter.twig', '@variableState'],

          [/<!DOCTYPE/, 'metatag', '@doctype'],
          [/<!--/, 'comment', '@comment'],
          [
            /(<)((?:[\w\-]+:)?[\w\-]+)(\s*)(\/>)/,
            ['delimiter', 'tag', '', 'delimiter'],
          ],
          [/(<)(script)/, ['delimiter', { token: 'tag', next: '@script' }]],
          [/(<)(style)/, ['delimiter', { token: 'tag', next: '@style' }]],
          [
            /(<)((?:[\w\-]+:)?[\w\-]+)/,
            ['delimiter', { token: 'tag', next: '@otherTag' }],
          ],
          [
            /(<\/)((?:[\w\-]+:)?[\w\-]+)/,
            ['delimiter', { token: 'tag', next: '@otherTag' }],
          ],
          [/</, 'delimiter'],
          [/[^<]+/], // text
        ],

        blockState: [
          [/[-~]?}}/, 'delimiter.twig', '@pop'],
          // whitespace
          [/\s+/],
          // verbatim
          // Unlike other blocks, verbatim ehas its own state
          // transition to ensure we mark its contents as strings.
          [
            /(verbatim)(\s*)([-~]?%})/,
            [
              'keyword.twig',
              '',
              { token: 'delimiter.twig', next: '@rawDataState' },
            ],
          ],
          { include: 'expression' },
        ],

        rawDataState: [
          // endverbatim
          [
            /({%[-~]?)(\s*)(endverbatim)(\s*)([-~]?%})/,
            [
              'delimiter.twig',
              '',
              'keyword.twig',
              '',
              { token: 'delimiter.twig', next: '@popall' },
            ],
          ],
          [/./, 'string.twig'],
        ],

        /**
         * Variable Tag Handling
         */
        variableState: [
          [/[-~]?}}/, 'delimiter.twig', '@pop'],
          { include: 'expression' },
        ],

        stringState: [
          // closing double quoted string
          [/"/, 'string.twig', '@pop'],
          // interpolation start
          [/#{\s*/, 'string.twig', '@interpolationState'],
          // string part
          [/[^#"\\]*(?:(?:\\.|#(?!\{))[^#"\\]*)*/, 'string.twig'],
        ],

        interpolationState: [
          // interpolation end
          [/}/, 'string.twig', '@pop'],
          { include: 'expression' },
        ],

        /**
         * Expression Handling
         */
        expression: [
          // whitespace
          [/\s+/],
          // operators - math
          [/\+|-|\/{1,2}|%|\*{1,2}/, 'operators.twig'],
          // operators - logic
          [/(and|or|not|b-and|b-xor|b-or)(\s+)/, ['operators.twig', '']],
          // operators - comparison (symbols)
          [/==|!=|<|>|>=|<=/, 'operators.twig'],
          // operators - comparison (words)
          [/(starts with|ends with|matches)(\s+)/, ['operators.twig', '']],
          // operators - containment
          [/(in)(\s+)/, ['operators.twig', '']],
          // operators - test
          [/(is)(\s+)/, ['operators.twig', '']],
          // operators - misc
          [/\||~|:|\.{1,2}|\?{1,2}/, 'operators.twig'],
          // names
          [
            /[^\W\d][\w]*/,
            {
              cases: {
                '@keywords': 'keyword.twig',
                '@default': 'variable.twig',
              },
            },
          ],
          // numbers
          [/\d+(\.\d+)?/, 'number.twig'],
          // punctuation
          [/\(|\)|\[|\]|{|}|,/, 'delimiter.twig'],
          // strings
          [
            /"([^#"\\]*(?:\\.[^#"\\]*)*)"|\'([^\'\\]*(?:\\.[^\'\\]*)*)\'/,
            'string.twig',
          ],
          // opening double quoted string
          [/"/, 'string.twig', '@stringState'],

          // misc syntactic constructs
          // These are not operators per se, but for the purposes of lexical analysis we
          // can treat them as such.
          // arrow functions
          [/=>/, 'operators.twig'],
          // assignment
          [/=/, 'operators.twig'],
        ],

        doctype: [
          [/[^>]+/, 'metatag.content'],
          [/>/, 'metatag', '@pop'],
        ],

        comment: [
          [/-->/, 'comment', '@pop'],
          [/[^-]+/, 'comment.content'],
          [/./, 'comment.content'],
        ],

        otherTag: [
          [/\/?>/, 'delimiter', '@pop'],
          [/"([^"]*)"/, 'attribute.value'],
          [/'([^']*)'/, 'attribute.value'],
          [/[\w\-]+/, 'attribute.name'],
          [/=/, 'delimiter'],
          [/[ \t\r\n]+/], // whitespace
        ],

        // -- BEGIN <script> tags handling

        // After <script
        script: [
          [/type/, 'attribute.name', '@scriptAfterType'],
          [/"([^"]*)"/, 'attribute.value'],
          [/'([^']*)'/, 'attribute.value'],
          [/[\w\-]+/, 'attribute.name'],
          [/=/, 'delimiter'],
          [
            />/,
            {
              token: 'delimiter',
              next: '@scriptEmbedded',
              nextEmbedded: 'text/javascript',
            },
          ],
          [/[ \t\r\n]+/], // whitespace
          [
            /(<\/)(script\s*)(>)/,
            ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }],
          ],
        ],

        // After <script ... type
        scriptAfterType: [
          [/=/, 'delimiter', '@scriptAfterTypeEquals'],
          [
            />/,
            {
              token: 'delimiter',
              next: '@scriptEmbedded',
              nextEmbedded: 'text/javascript',
            },
          ], // cover invalid e.g. <script type>
          [/[ \t\r\n]+/], // whitespace
          [/<\/script\s*>/, { token: '@rematch', next: '@pop' }],
        ],

        // After <script ... type =
        scriptAfterTypeEquals: [
          [
            /"module"/,
            {
              token: 'attribute.value',
              switchTo: '@scriptWithCustomType.text/javascript',
            },
          ],
          [
            /'module'/,
            {
              token: 'attribute.value',
              switchTo: '@scriptWithCustomType.text/javascript',
            },
          ],
          [
            /"([^"]*)"/,
            {
              token: 'attribute.value',
              switchTo: '@scriptWithCustomType.$1',
            },
          ],
          [
            /'([^']*)'/,
            {
              token: 'attribute.value',
              switchTo: '@scriptWithCustomType.$1',
            },
          ],
          [
            />/,
            {
              token: 'delimiter',
              next: '@scriptEmbedded',
              nextEmbedded: 'text/javascript',
            },
          ], // cover invalid e.g. <script type=>
          [/[ \t\r\n]+/], // whitespace
          [/<\/script\s*>/, { token: '@rematch', next: '@pop' }],
        ],

        // After <script ... type = $S2
        scriptWithCustomType: [
          [
            />/,
            {
              token: 'delimiter',
              next: '@scriptEmbedded.$S2',
              nextEmbedded: '$S2',
            },
          ],
          [/"([^"]*)"/, 'attribute.value'],
          [/'([^']*)'/, 'attribute.value'],
          [/[\w\-]+/, 'attribute.name'],
          [/=/, 'delimiter'],
          [/[ \t\r\n]+/], // whitespace
          [/<\/script\s*>/, { token: '@rematch', next: '@pop' }],
        ],

        scriptEmbedded: [
          [
            /<\/script/,
            { token: '@rematch', next: '@pop', nextEmbedded: '@pop' },
          ],
          [/[^<]+/, ''],
        ],

        // -- END <script> tags handling

        // -- BEGIN <style> tags handling

        // After <style
        style: [
          [/type/, 'attribute.name', '@styleAfterType'],
          [/"([^"]*)"/, 'attribute.value'],
          [/'([^']*)'/, 'attribute.value'],
          [/[\w\-]+/, 'attribute.name'],
          [/=/, 'delimiter'],
          [
            />/,
            {
              token: 'delimiter',
              next: '@styleEmbedded',
              nextEmbedded: 'text/css',
            },
          ],
          [/[ \t\r\n]+/], // whitespace
          [
            /(<\/)(style\s*)(>)/,
            ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }],
          ],
        ],

        // After <style ... type
        styleAfterType: [
          [/=/, 'delimiter', '@styleAfterTypeEquals'],
          [
            />/,
            {
              token: 'delimiter',
              next: '@styleEmbedded',
              nextEmbedded: 'text/css',
            },
          ], // cover invalid e.g. <style type>
          [/[ \t\r\n]+/], // whitespace
          [/<\/style\s*>/, { token: '@rematch', next: '@pop' }],
        ],

        // After <style ... type =
        styleAfterTypeEquals: [
          [
            /"([^"]*)"/,
            {
              token: 'attribute.value',
              switchTo: '@styleWithCustomType.$1',
            },
          ],
          [
            /'([^']*)'/,
            {
              token: 'attribute.value',
              switchTo: '@styleWithCustomType.$1',
            },
          ],
          [
            />/,
            {
              token: 'delimiter',
              next: '@styleEmbedded',
              nextEmbedded: 'text/css',
            },
          ], // cover invalid e.g. <style type=>
          [/[ \t\r\n]+/], // whitespace
          [/<\/style\s*>/, { token: '@rematch', next: '@pop' }],
        ],

        // After <style ... type = $S2
        styleWithCustomType: [
          [
            />/,
            {
              token: 'delimiter',
              next: '@styleEmbedded.$S2',
              nextEmbedded: '$S2',
            },
          ],
          [/"([^"]*)"/, 'attribute.value'],
          [/'([^']*)'/, 'attribute.value'],
          [/[\w\-]+/, 'attribute.name'],
          [/=/, 'delimiter'],
          [/[ \t\r\n]+/], // whitespace
          [/<\/style\s*>/, { token: '@rematch', next: '@pop' }],
        ],

        styleEmbedded: [
          [
            /<\/style/,
            { token: '@rematch', next: '@pop', nextEmbedded: '@pop' },
          ],
          [/[^<]+/, ''],
        ],

        // -- END <style> tags handling
      },
    };

    monaco.languages.register({
      id: 'jsRender',
    });
    monaco.languages.setLanguageConfiguration('jsRender', conf);
    monaco.languages.setMonarchTokensProvider('jsRender', language);
    this._editor = monaco.editor.create(domElement, {
      value: this.code$.value,
      language: 'jsRender',
      automaticLayout: true,
      theme: 'vs-dark',
    });

    monaco.languages.registerCompletionItemProvider('jsRender', {
      provideCompletionItems: () => {
        const suggestions: any[] = [];
        this.variables.forEach((variable) => {
          variable.variables.forEach((variable) => {
            if (!variable.visible) return;
            suggestions.push({
              label: variable.name,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: variable.value,
              range: null,
            });
            if (variable.childs) {
              variable.childs.forEach((variable) => {
                variable.variables.forEach((variable) => {
                  suggestions.push({
                    label: variable.name,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: variable.value,
                    range: null,
                  });
                });
              });
            }
          });
        });
        return {
          suggestions: suggestions,
        };
      },
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
                  name: 'prestation:name',
                  value: '{{ prestation:name }}',
                },
                {
                  name: 'prestation:description',
                  value: '{{ prestation:description }}',
                },
                {
                  name: 'prestation:price',
                  value: '{{ prestation:price }}',
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
                  name: 'contract:name',
                  value: '{{ contract:name }}',
                },
                {
                  name: 'contract:description',
                  value: '{{ contract:description }}',
                },
                {
                  name: 'contract:price',
                  value: '{{ contract:price }}',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}
