declare const monaco: any;

export const EMPTY_ELEMENTS: string[] = [
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
export const conf: monaco.languages.LanguageConfiguration = {
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

export const language = <monaco.languages.IMonarchLanguage>{
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
      [/<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
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
      [/<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
      [/[^<]+/, ''],
    ],

    // -- END <style> tags handling
  },
};
