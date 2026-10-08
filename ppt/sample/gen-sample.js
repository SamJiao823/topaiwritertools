const pptxgen = require("pptxgenjs");
const pptx = new pptxgen();

pptx.layout = "LAYOUT_16x9"; // 10" x 5.625"
pptx.author = "恒毅的小酒馆";
pptx.title = "读毛选不是学方法，是练思维（风格样张）";
pptx.lang = "zh-CN";

// ---- 设计令牌：经典红 × 现代极简 ----
const RED = "9E2B25";        // 主色 · 毛选红
const RED_DEEP = "7A1F1A";   // 深红（装饰/文字）
const CREAM = "F7F1E3";      // 辅色 · 宣纸米白
const INK = "1F1F1F";        // 墨黑
const GOLD = "C9A227";       // 点缀 · 书童金（浅底用）
const GOLD_ON_RED = "E9C25C"; // 书童金（红底用，提亮对比度）
const MUTED = "6B6B6B";      // 次级灰
const LIGHTRED = "F0D9D5";   // 红底上的浅粉白
const SOFT_RED = "C89B94";   // 红底上的弱红
const BODY = "3A3A3A";       // 正文深灰
const CARDLINE = "E3D9C4";   // 卡片描边
const FOOT = "6B5F52";       // 米白底上的页脚（深暖灰）
const WARM_INK = "55443A";   // 底部引用（加深对比度）
const F_SANS = "PingFang SC";
const F_SERIF = "Songti SC";

// ================= 第 1 页 · 封面 =================
const s1 = pptx.addSlide();
s1.background = { color: RED };

// 装饰圆（半透明，制造层次）
s1.addShape("ellipse", { x: 6.0, y: 1.2, w: 5.2, h: 5.2, fill: { color: RED_DEEP, transparency: 55 }, line: { type: "none" } });
s1.addShape("ellipse", { x: 7.5, y: 3.3, w: 1.7, h: 1.7, fill: { color: RED_DEEP, transparency: 62 }, line: { type: "none" } });

// 印章「练」（核心视觉母题，贯穿全稿）
s1.addText("练", { x: 7.75, y: 3.7, w: 1.2, h: 1.2, shape: "rect", rotate: 8,
  fill: { color: CREAM }, line: { color: GOLD, width: 1.75 },
  color: RED_DEEP, fontSize: 38, bold: true, fontFace: F_SERIF,
  align: "center", valign: "middle", margin: 0 });

// 标题
s1.addText([
  { text: "读毛选不是学方法，", options: { breakLine: true, fontSize: 44, bold: true, color: "FFFFFF", fontFace: F_SANS } },
  { text: "是练思维", options: { fontSize: 44, bold: true, color: "FFFFFF", fontFace: F_SANS } }
], { x: 0.9, y: 1.45, w: 8.4, h: 1.75, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.05 });

// 副标题（收窄换行，避开右侧装饰圆）
s1.addText("创业者的实践论修炼手册 —— 从毛选到海外 AI 网站业务的践行",
  { x: 0.9, y: 3.3, w: 5.1, h: 0.85, fontSize: 15, color: LIGHTRED, fontFace: F_SERIF,
    align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.25 });

// 结构预告
s1.addText("破局 · 求是 · 践行 · AI 书童", { x: 0.9, y: 4.3, w: 6, h: 0.35, fontSize: 13.5, bold: true, color: GOLD_ON_RED, fontFace: F_SANS, margin: 0 });

// 页脚（12pt 加粗纯白，红底小字必须高对比）
s1.addText("恒毅的小酒馆 · 内部交流", { x: 0.9, y: 4.98, w: 4.2, h: 0.36, fontSize: 12, bold: true, color: "FFFFFF", fontFace: F_SANS, margin: 0 });
s1.addText("1 / 12", { x: 8.8, y: 4.98, w: 0.9, h: 0.36, fontSize: 12, bold: true, color: "FFFFFF", fontFace: F_SANS, align: "right", margin: 0 });

s1.addNotes("开场定调：今天不讲方法论，讲三个思维动作，和一个走完一遍的真实案例。");

// ================= 第 2 页 · 破题 + 核心观点 =================
const s2 = pptx.addSlide();
s2.background = { color: CREAM };

// 章节标签（小方印 = 母题延续）
s2.addShape("rect", { x: 0.4, y: 0.44, w: 0.2, h: 0.2, fill: { color: RED }, line: { type: "none" } });
s2.addText("01 · 开场破题", { x: 0.68, y: 0.4, w: 3.4, h: 0.32, fontSize: 13, bold: true, color: RED_DEEP, fontFace: F_SANS, margin: 0 });
s2.addShape("rect", { x: 5.78, y: 0.44, w: 0.2, h: 0.2, fill: { color: GOLD }, line: { type: "none" } });
s2.addText("02 · 核心观点", { x: 6.06, y: 0.4, w: 3.4, h: 0.32, fontSize: 13, bold: true, color: RED_DEEP, fontFace: F_SANS, margin: 0 });

// 左侧三步
function step(y, num, heading, body) {
  s2.addShape("ellipse", { x: 0.6, y: y, w: 0.34, h: 0.34, fill: { color: RED }, line: { type: "none" } });
  s2.addText(String(num), { x: 0.6, y: y, w: 0.34, h: 0.34, align: "center", valign: "middle",
    color: "FFFFFF", bold: true, fontSize: 13, fontFace: F_SANS, margin: 0 });
  s2.addText(heading, { x: 1.05, y: y - 0.03, w: 4.1, h: 0.3, fontSize: 14, bold: true, color: INK, fontFace: F_SANS, margin: 0 });
  s2.addText(body, { x: 1.05, y: y + 0.27, w: 4.5, h: 0.8, fontSize: 11.5, color: BODY, fontFace: F_SERIF, margin: 0, lineSpacingMultiple: 1.15 });
}
step(1.0, 1, "现象", "现场问一圈：《论持久战》《实践论》《矛盾论》《星星之火可以燎原》——读过的寥寥无几，多数人只记得小学课文《吃水不忘挖井人》。");
step(2.42, 2, "误区", "关心的是“读过哪几篇”“哪一篇能用在事业上”——把毛选当谈资、当工具书，按需取用。");
step(3.84, 3, "反问", "也许我们问错问题了——不该问“读没读过”。那该问什么？怎么读毛选，怎么跟教员学创业？");

// 步骤间箭头
s2.addText("↓", { x: 2.3, y: 2.12, w: 0.4, h: 0.3, fontSize: 14, bold: true, color: GOLD, fontFace: F_SANS, align: "center", margin: 0 });
s2.addText("↓", { x: 2.3, y: 3.54, w: 0.4, h: 0.3, fontSize: 14, bold: true, color: GOLD, fontFace: F_SANS, align: "center", margin: 0 });

// 右侧观点卡
const cx = 5.9, cy = 1.0, cw = 3.6, ch = 3.75;
s2.addShape("roundRect", { x: cx, y: cy, w: cw, h: ch, fill: { color: "FFFFFF" },
  line: { color: CARDLINE, width: 1 }, rectRadius: 0.05,
  shadow: { type: "outer", color: "000000", opacity: 0.12, blur: 10, angle: 90, offset: 3 } });

s2.addText([
  { text: "读毛选不是学方法，", options: { breakLine: true, fontSize: 15.5, bold: true, color: RED_DEEP, fontFace: F_SANS } },
  { text: "是练思维", options: { fontSize: 15.5, bold: true, color: RED_DEEP, fontFace: F_SANS } }
], { x: cx + 0.25, y: cy + 0.2, w: 3.1, h: 0.55, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.0 });

s2.addText("练习场，不是方法库", { x: cx + 0.25, y: cy + 0.92, w: 3.1, h: 0.28, fontSize: 12.5, bold: true, color: GOLD, fontFace: F_SANS, margin: 0 });

function thinkRow(y, textA, textB) {
  s2.addShape("ellipse", { x: cx + 0.28, y: y + 0.02, w: 0.2, h: 0.2, fill: { color: GOLD }, line: { type: "none" } });
  s2.addText("✓", { x: cx + 0.28, y: y + 0.02, w: 0.2, h: 0.2, align: "center", valign: "middle",
    color: "FFFFFF", bold: true, fontSize: 9, fontFace: F_SANS, margin: 0 });
  s2.addText([{ text: textA + " ", options: { bold: true, color: INK, fontFace: F_SANS } },
    { text: textB, options: { color: MUTED, fontFace: F_SERIF } }],
    { x: cx + 0.56, y: y - 0.02, w: 2.85, h: 0.28, fontSize: 11.5, align: "left", valign: "middle", margin: 0 });
}
thinkRow(cy + 1.28, "系统思考能力", "—— 见全局变量");
thinkRow(cy + 1.72, "洞察能力", "—— 透过现象抓本质");
thinkRow(cy + 2.16, "识别环境变量", "—— 知道什么能搬");

s2.addText("没练到这三样，等于白读。", { x: cx + 0.25, y: cy + 2.88, w: 3.1, h: 0.4, fontSize: 11, italic: true, color: WARM_INK, fontFace: F_SERIF, margin: 0 });

// 底部引用（金句条用文字而非色带）
s2.addText("我理解的：“99.999% 的人读毛选可能都读错了——不是怎么读的问题，是“为什么”的问题。”",
  { x: 0.6, y: 4.92, w: 8.8, h: 0.35, fontSize: 10.5, italic: true, color: WARM_INK, fontFace: F_SERIF, align: "left", margin: 0 });

// 页脚
s2.addText("恒毅的小酒馆 · 内部交流", { x: 0.6, y: 5.32, w: 3.6, h: 0.28, fontSize: 9.5, color: FOOT, fontFace: F_SANS, margin: 0 });
s2.addText("2 / 12", { x: 9.0, y: 5.32, w: 0.7, h: 0.28, fontSize: 9.5, color: FOOT, fontFace: F_SANS, align: "right", margin: 0 });

s2.addNotes("先抛出三个问题（现象/误区/反问），再亮核心观点：练习场不是方法库。预告：三大修炼 × 一个真实案例。");

pptx.writeFile({ fileName: "毛选-样张-P1-P2.pptx" }).then((f) => console.log("saved:", f));
