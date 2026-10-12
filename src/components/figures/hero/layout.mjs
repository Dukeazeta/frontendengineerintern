// Where each element of the little web page sits, in page units (y grows down).
// html: the browser's default stacking with no CSS. css: the styled layout.
// Each rect is [x, y, width, height, cornerRadius].
export const PAGE = { w: 170, h: 83 };

export const LAYOUT = {
  ruleY: 13,
  base: { img: [66, 46], button: [30, 10], toast: [56, 10] },
  html: {
    nav0: [4, 4, 16, 1.8, 0],
    nav1: [4, 8, 20, 1.8, 0],
    nav2: [4, 12, 13, 1.8, 0],
    h1: [4, 18, 64, 4.2, 0],
    p0: [4, 27, 150, 1.8, 0],
    p1: [4, 31, 140, 1.8, 0],
    p2: [4, 35, 96, 1.8, 0],
    img: [4, 40, 40, 26],
    button: [4, 70, 26, 8],
    toast: [34, 70, 56, 8],
  },
  css: {
    nav0: [116, 6, 14, 1.8, 0.9],
    nav1: [134, 6, 16, 1.8, 0.9],
    nav2: [154, 6, 12, 1.8, 0.9],
    h1: [4, 22, 88, 7, 1],
    p0: [4, 35, 82, 2, 1],
    p1: [4, 40, 78, 2, 1],
    p2: [4, 45, 54, 2, 1],
    img: [100, 20, 66, 48],
    button: [4, 55, 30, 10],
    toast: [38, 55, 56, 10],
  },
};
