import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';

import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { JsRendererVariableCollection } from 'src/shared/models/JsRendererVariableCollection';
import { CursorPostion } from '../../shared/models/CursorPostion';

@Component({
  selector: 'app-ngstack',
  templateUrl: './ngstack.component.html',
  styleUrls: ['./ngstack.component.scss'],
})
export class NgstackComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') editor!: CodeEditorComponent;
  cursor!: any;
  cursorPosition: CursorPostion = { x: 0, y: 0, line: 0, column: 0 };
  observer!: MutationObserver;
  code!: string[];

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
            this.cursorPosition.column = possibleXIndexes.findIndex(
              (x) => x == currentLeft
            );
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
    value: `<h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1><h1>This is some fake things</h1>
<p>Here is a list of things</p>
<ul>
  <li>Thing 1</li>
  <li>Thing 2</li>
  <li>Thing 3</li>
</ul>
    `,
  };

  editorOptions = {
    tabindex: 1,
    cursorWidth: 1,
  };

  cursorIndex!: number;

  appendCode(code: string) {
    // strange workaround to update the code model
    // https://github.com/ngstack/code-editor/issues/476
    const newCodeModel: CodeModel = {
      ...this.codeModel,
      value:
        this.codeModel.value.slice(0, this.cursorIndex) +
        code +
        this.codeModel.value.slice(this.cursorIndex),
    };
    this.codeModel = newCodeModel;
  }

  updateCodeModel(event: string) {
    this.codeModel.value = event;
    this.code = this.codeModel.value.split('\n');
    console.log(this.code);
  }
  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}

const possibleXIndexes = [
  6, 0, 13, 21, 28, 35, 42, 50, 57, 64, 71, 78, 86, 93, 100, 107, 115, 122, 129,
  136, 144, 151, 158, 165, 172, 180, 187, 194, 201, 209, 216, 223, 230, 237,
  245, 252, 259, 266, 274, 281, 288, 295, 303, 310, 317, 324, 331, 339, 346,
  353, 360, 368, 375, 382, 389, 396, 404, 411, 418, 425, 433, 440, 447, 454,
  462, 469, 476, 483, 490, 498, 505, 512, 519, 527, 534, 541, 548, 555, 563,
  570, 577, 584, 592, 599, 606, 613, 620, 628, 635, 642, 649, 657, 664, 671,
  678, 686, 693, 700, 707, 714, 722, 729, 736, 743, 751, 758, 765, 772, 779,
  787, 794, 801, 808, 816, 823, 830, 837, 845, 852, 859, 866, 873, 881, 888,
  895, 902, 910, 917, 924, 931, 938, 946, 953, 960, 967, 975, 982, 989, 996,
  1003, 1011, 1018, 1025, 1032, 1040, 1047, 1054, 1061, 1069, 1076, 1083, 1090,
  1097, 1105, 1112, 1119, 1126, 1134, 1141, 1148, 1155, 1162, 1170, 1177, 1184,
  1191, 1199, 1206, 1213, 1220, 1228, 1235, 1242, 1249, 1256, 1264, 1271, 1278,
  1285, 1293, 1300, 1307, 1314, 1321, 1329, 1336, 1343, 1350, 1358, 1365, 1372,
  1379, 1387, 1394, 1401, 1408, 1415, 1423, 1430, 1437, 1444, 1452, 1459, 1466,
  1473, 1480, 1488, 1495, 1502, 1509, 1517, 1524, 1531, 1538, 1545, 1553, 1560,
  1567, 1574, 1582, 1589, 1596, 1603, 1611, 1618, 1625, 1632, 1639, 1647, 1654,
  1661, 1668, 1676, 1683, 1690, 1697, 1704, 1712, 1719, 1726, 1733, 1741, 1748,
  1755, 1762, 1770, 1777, 1784, 1791, 1798, 1806, 1813, 1820, 1827, 1835, 1842,
  1849, 1856, 1863, 1871, 1878, 1885, 1892, 1900, 1907, 1914, 1921, 1928, 1936,
  1943, 1950, 1957, 1965, 1972, 1979, 1986, 1994, 2001, 2008, 2015, 2022, 2030,
  2037, 2044, 2051, 2059, 2066, 2073, 2080, 2087, 2095, 2102, 2109, 2116, 2124,
  2131, 2138, 2145, 2153, 2160, 2167, 2174, 2181, 2188, 2196, 2203, 2210, 2217,
  2224, 2232, 2239, 2246, 2253, 2261, 2268, 2275, 2282, 2289, 2297, 2304, 2311,
  2318, 2326, 2333, 2340, 2347, 2355, 2362, 2369, 2376, 2383, 2391, 2398, 2405,
  2412, 2420, 2427, 2434, 2441, 2448, 2456, 2463, 2470, 2477, 2485, 2492, 2499,
  2506, 2514, 2521, 2528, 2535, 2542, 2550, 2557, 2564, 2571, 2579, 2586, 2593,
  2600, 2607, 2615, 2622, 2629, 2636, 2644, 2651, 2658, 2665, 2672, 2680, 2687,
  2694, 2701, 2709, 2716, 2723, 2730, 2738, 2745, 2752, 2759, 2766, 2774, 2781,
  2788, 2795, 2803, 2810, 2817, 2824, 2831, 2839, 2846, 2853, 2860, 2868, 2875,
  2882, 2889, 2897, 2904, 2911, 2918, 2925, 2933, 2940, 2947, 2954, 2962, 2969,
  2976, 2983, 2990, 2998, 3005, 3012, 3019, 3027, 3034, 3041, 3055, 3063, 3070,
  3077, 3084, 3092, 3099, 3106, 3113, 3121, 3128, 3135, 3142, 3149, 3157, 3164,
  3171, 3178, 3186, 3193, 3200, 3207, 3214, 3222, 3229, 3236, 3243, 3251, 3258,
  3265, 3272, 3280, 3287, 3294, 3301, 3308, 3316, 3323, 3330, 3337, 3345, 3352,
  3359, 3366, 3373, 3381, 3388, 3395, 3402, 3410, 3417, 3424, 3431, 3439, 3446,
  3453, 3460, 3467, 3475, 3482, 3489, 3496, 3504, 3511, 3518, 3525, 3532, 3540,
  3547, 3554, 3561, 3569, 3576, 3583, 3590, 3597, 3605, 3612, 3619, 3626, 3634,
  3641, 3648, 3655, 3663, 3670, 3677, 3684, 3691, 3699, 3706, 3713, 3720, 3728,
  3735, 3742, 3749, 3756, 3764, 3771, 3778, 3785, 3793, 3800, 3807, 3814, 3822,
  3829, 3836, 3843, 3850, 3858, 3865, 3872, 3879, 3887, 3894, 3901, 3908, 3915,
  3923, 3930, 3937, 3944, 3952, 3959, 3966, 3973, 3980, 3988, 3995, 4002, 4009,
  4017, 4024, 4031, 4038, 4046, 4053, 4060, 4067, 4074, 4082, 4089, 4096, 4103,
  4111, 4118, 4125, 4132, 4139, 4147, 4154, 4161, 4168, 4176, 4183, 4190, 4197,
  4205, 4212, 4219, 4226, 4233, 4241, 4248, 4255, 4262, 4270, 4277, 4284, 4291,
  4298, 4313, 4320, 4327, 4334, 4341, 4349, 4356, 4363, 4370, 4378, 4385, 4392,
  4399, 4407, 4414, 4428, 4435, 4443, 4450, 4457, 4464, 4472, 4479, 4486, 4493,
  4500, 4508, 4515, 4522, 4529, 4537, 4544, 4551, 4558, 4565, 4573, 4580, 4587,
  4594, 4602, 4609, 4616, 4623, 4631, 4638, 4645, 4652, 4659, 4667, 4674, 4681,
  4688, 4696, 4703, 4710, 4717, 4724, 4732, 4739, 4746, 4753, 4761, 4768, 4775,
  4782, 4790, 4797, 4804, 4811, 4818, 4826, 4833, 4840, 4847, 4855, 4862, 4869,
  4876, 4883, 4891, 4898, 4905, 4912, 4920, 4927, 4934, 4941, 4948, 4956, 4963,
  4970, 4977, 4985, 4992, 4999, 5006, 5014, 5021, 5028, 5035, 5042, 5050, 5057,
  5064, 5071, 5079, 5086, 5093, 5100, 5107, 5115, 5122, 5129, 5136, 5144, 5151,
  5158, 5165, 5173, 5180, 5187, 5194, 5201, 5209, 5216, 5223, 5230, 5238, 5245,
  5252, 5259, 5266, 5274, 5281, 5288, 5295, 5303, 5310, 5317, 5324, 5332, 5339,
  5346, 5353, 5360, 5368, 5375, 5382, 5389, 5397, 5404, 5411, 5418, 5425, 5433,
  5440, 5447, 5454, 5462, 5469, 5476, 5483, 5490, 5498, 5505, 5512, 5519, 5527,
  5534, 5541, 5548, 5556, 5563, 5570, 5577, 5584, 5592, 5599, 5606, 5613, 5621,
  5628, 5635, 5642, 5649, 5657, 5664, 5671, 5678, 5686, 5693, 5700, 5707, 5715,
  5722, 5729, 5736, 5743, 5751, 5758, 5765, 5772, 5780, 5787, 5794, 5801, 5808,
  5816, 5823, 5830, 5837, 5845, 5852, 5859, 5866, 5873, 5881, 5888, 5895, 5902,
  5910, 5917, 5924, 5931, 5939, 5946, 5953, 5960, 5967, 5975, 5982, 5989, 5996,
  6004, 6011, 6018, 6025, 6032, 6040, 6047, 6054, 6061, 6069, 6076, 6083, 6090,
  6098, 6105, 6112, 6119, 6126, 6134, 6141, 6148, 6155, 6163, 6170, 6177, 6184,
  6191, 6199,
];
