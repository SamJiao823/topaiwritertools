/* 《大道之行也》教学课件重建生成器 —— pptxgenjs
 * 视觉基调：宣纸米黄 + 朱红强调 + 水墨桃花源意境 + 楷/宋 古风
 * 共 33 页：课件页(1-25 按原图) + 收尾讲义页(26-33)
 */
const pptxgen = require("pptxgenjs");
const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";            // 10 x 5.625 in
pptx.author = "大道之行也 · 教学课件";
pptx.title = "《大道之行也》——是桃花源，但也不是桃花源";
pptx.lang = "zh-CN";

/* ---------- 设计令牌 ---------- */
const C = {
  BG: "F6EFDF",          // 宣纸米黄底
  PANEL: "FFFCF2",       // 面板米白
  BAND: "EFE3C8",        // 深一档的米色带
  BAND2: "F1E7CF",
  LINE: "C9A25B",        // 古金细线
  INK: "34281C",
  BODY: "4E4034",
  MUTE: "8A7761",
  RED: "B23B2F",         // 强调朱红
  RED_D: "8A2B22",       // 标题深红
  RED_HEAD: "9E2E24",
  REDFILL: "F6E1D9",     // 浅朱底
  PINK: "E9A9BC", PINK_D: "D8849B", LEAF: "97B087", STEM: "8A6A4A",
  GOLD: "B9893B",
  GREEN: "4E7A55", GREEN_DK: "3E6B4A", GREENFILL: "E2EAD9",
  YELL: "F6E8A4", TEAL: "D8E4CC",
  ORANGE: "B8862F", ORANGEFILL: "F3E2BE",
  WHITE: "FFFFFF",
};
const FS = "楷体";   // 标题/古文
const FB = "宋体";   // 正文/译文/注释

/* ---------- 小工具 ---------- */
const s16 = (x, y, w, h) => ({ x, y, w, h });
function run(t, o = {}) { return { text: t, options: o }; }
// 简易强调：文本中用 *红* 表示朱红强调；__强调__ 表示下划线红；%%弱%% 表示浅灰
function rich(t, base = {}) {
  const out = [];
  const re = /\*([^*]+)\*|__([^_]+)__|%%([^%]+)%%/g;
  let last = 0, m;
  while ((m = re.exec(t)) !== null) {
    if (m.index > last) out.push({ text: t.slice(last, m.index), options: { ...base } });
    if (m[1] !== undefined) out.push({ text: m[1], options: { ...base, color: C.RED, bold: true } });
    else if (m[2] !== undefined) out.push({ text: m[2], options: { ...base, color: C.RED, bold: true, underline: true } });
    else out.push({ text: m[3], options: { ...base, color: C.MUTE } });
    last = m.index + m[0].length;
  }
  if (last < t.length) out.push({ text: t.slice(last), options: { ...base } });
  return out;
}
// 底色强调块：用 ★★★...★★★ 包住要整句高亮的红字? 不用，直接 run 列表。

function addTextR(s, arr, opts) { s.addText(arr, { margin: 0, ...opts }); return s; }

function chip(s, x, y, w, h, term, fill = "FFFDF4", txtColor = C.RED_D, lw = 1) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.045, fill: { color: fill }, line: { color: C.RED, width: lw } });
  s.addText(term, { x, y, w, h, align: "center", valign: "middle", color: txtColor, bold: true, fontFace: FS, fontSize: 10.5, margin: 0 });
}
// 古文标题(红) 位于页面顶部居左/中
function headC(s, text, color = C.RED_HEAD, fs = 20, y = 0.32) {
  s.addText(text, { x: 0.6, y, w: 8.9, h: 0.55, align: "left", valign: "middle", color, bold: true, fontFace: FS, fontSize: fs, margin: 0 });
  return y + 0.6;
}
function headCenter(s, text, y = 0.34, fs = 21) {
  s.addText(text, { x: 0.4, y, w: 9.2, h: 0.6, align: "center", color: C.RED_HEAD, bold: true, fontFace: FS, fontSize: fs, margin: 0 });
  return y + 0.72;
}
// 右上角章节标签（红色小方块 + 章名）左上角
function chap(s, tag, x = 0.55, y = 0.3, fs = 15) {
  s.addShape("rect", { x, y: y + 0.03, w: 0.16, h: 0.16, fill: { color: C.RED }, line: { type: "none" } });
  s.addText(tag, { x: x + 0.3, y: y - 0.05, w: 6.4, h: 0.36, align: "left", valign: "middle", color: C.RED_D, bold: true, fontFace: FS, fontSize: fs, margin: 0 });
  return y + 0.5;
}
function foot(s, idx, total) {
  s.addText(`《大道之行也》 · ${idx} / ${total}`, { x: 0.5, y: 5.32, w: 3.6, h: 0.26, fontSize: 8.5, color: C.MUTE, fontFace: FB, margin: 0 });
  // 右侧小印章数字（两位数自动加宽，防挤压）
  const w = String(idx).length >= 2 ? 0.48 : 0.34;
  const x = 9.6 - w;
  s.addShape("rect", { x, y: 5.26, w, h: 0.26, fill: { color: C.RED_D }, line: { type: "none" } });
  s.addText(String(idx), { x, y: 5.26, w, h: 0.26, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 8.5, fontFace: FS, margin: 0, fit: "shrink" });
}
// 柔和远山（底部水墨剪影）
function hills(s) {
  s.addShape("ellipse", { x: -1.6, y: 4.95, w: 7, h: 1.5, fill: { color: "B9B79C", transparency: 62 }, line: { type: "none" } });
  s.addShape("ellipse", { x: 4.2, y: 4.9, w: 8, h: 1.7, fill: { color: "AEB293", transparency: 66 }, line: { type: "none" } });
  s.addShape("ellipse", { x: -2.5, y: 5.0, w: 5.5, h: 1.1, fill: { color: "C5C4A6", transparency: 70 }, line: { type: "none" } });
}
// 桃花枝（左上角斜伸；默认较小，避免压到章节标题文字）
function peach(s, x0 = 0.14, y0 = 0.3, dx = 0.56, dy = 0.0) {
  s.addShape("rect", { x: x0, y: y0 + 0.18, w: dx, h: 0.012, fill: { color: C.STEM }, line: { type: "none" }, rotate: -16 });
  const b = (bx, by, r, fill) => s.addShape("ellipse", { x: bx, y: by, w: r, h: r, fill: { color: fill }, line: { type: "none" } });
  b(x0 + dx * 0.10, y0 + 0.14, 0.10, C.PINK); b(x0 + dx * 0.24, y0 + 0.03, 0.13, C.PINK);
  b(x0 + dx * 0.38, y0 + 0.16, 0.11, C.PINK_D); b(x0 + dx * 0.6, y0 + 0.0, 0.13, C.PINK); b(x0 + dx * 0.74, y0 + 0.15, 0.11, C.PINK);
  b(x0 + dx * 0.9, y0 + 0.05, 0.12, C.PINK_D);
  // 花心与叶
  b(x0 + dx * 0.24 + 0.04, y0 + 0.075, 0.03, C.GOLD);
  b(x0 + dx * 0.6 + 0.04, y0 + 0.045, 0.03, C.GOLD);
  s.addShape("ellipse", { x: x0 + dx * 0.47, y: y0 + 0.22, w: 0.16, h: 0.06, fill: { color: C.LEAF }, line: { type: "none" }, rotate: 22 });
  s.addShape("ellipse", { x: x0 + dx * 0.85, y: y0 + 0.22, w: 0.15, h: 0.06, fill: { color: C.LEAF }, line: { type: "none" }, rotate: -18 });
}
// 朱红印章
function seal(s, x, y, txt, size = 0.34, color = C.RED_D) {
  s.addShape("rect", { x, y, w: size, h: size, fill: { color }, line: { type: "none" }, rotate: 6 });
  s.addText(txt, { x, y, w: size, h: size, align: "center", valign: "middle", color: C.WHITE, bold: true, fontFace: FS, fontSize: size * 1.9, margin: 0, rotate: 6 });
}
// 圆角提示框（顶部引导语）
function promptBox(s, text, x = 0.5, y = 0.92, w = 9.0, h = 0.5, redText = true, fs = 13) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.09, fill: { color: C.PANEL }, line: { color: C.RED, width: 1.25 } });
  addTextR(s, (redText ? rich(text) : [{ text, options: {} }]), { x: x + 0.25, y, w: w - 0.5, h, align: "left", valign: "middle", fontFace: FB, fontSize: fs, color: redText ? C.RED_D : C.INK, bold: redText });
  return y + h + 0.18;
}

const TOTAL = 33;

/* =====================================================
 *  第 1 页 · 封面提问（对应原图 1）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  // 右下水墨门洞意象（用细线门框示意，弱化）
  const gx = 6.9;
  s.addShape("rect", { x: gx, y: 1.5, w: 0.03, h: 2.6, fill: { color: "5A4632", transparency: 30 }, line: { type: "none" } });
  s.addShape("rect", { x: gx + 2.3, y: 1.5, w: 0.03, h: 2.6, fill: { color: "5A4632", transparency: 30 }, line: { type: "none" } });
  s.addShape("rect", { x: gx - 0.25, y: 1.42, w: 2.85, h: 0.05, fill: { color: "5A4632", transparency: 25 }, line: { type: "none" } });
  s.addText("门", { x: gx + 0.55, y: 2.5, w: 0.6, h: 0.6, align: "center", color: "7A5A3A", fontSize: 34, fontFace: FS, transparency: 0 });
  s.addText("?  ", { x: gx + 2.0, y: 1.05, w: 0.5, h: 0.5, align: "center", color: C.RED, fontSize: 30, bold: true, fontFace: FS, rotate: 8 });
  seal(s, 8.9, 4.6, "同");
  // 左侧提问正文
  let y = 0.9;
  const ask = (q, big, underline = false) => {
    s.addText(q, { x: 0.75, y, w: 6.4, h: 0.4, align: "left", fontSize: 15, color: C.INK, fontFace: FB, bold: true });
    y += 0.42;
    s.addText(big, { x: 0.95, y, w: 6.4, h: 0.62, align: "left", fontSize: 26, bold: true, color: C.RED_D, fontFace: FS, underline, margin: 0 });
    y += 0.75;
  };
  ask("《大道之行也》描述的是一个怎样的社会？", "是谓大同", true);
  ask("你联想到以前学过的哪一篇课文？", "《桃花源记》", true);
  // 底部浅黄方框核心问题
  s.addShape("roundRect", { x: 0.6, y: 3.7, w: 8.8, h: 0.85, rectRadius: 0.12, fill: { color: C.YELL }, line: { color: C.GOLD, width: 1 } });
  addTextR(s, rich("*《大道之行也》*中的大同社会，和*《桃花源记》*中的桃花源，是__一样__的社会吗？"),
    { x: 0.85, y: 3.7, w: 8.3, h: 0.85, align: "center", valign: "middle", fontSize: 15, color: C.INK, fontFace: FB, bold: true });
  s.addText("—— 是桃花源，但也不是桃花源 ——", { x: 0.6, y: 4.78, w: 8.8, h: 0.4, align: "center", color: C.MUTE, fontFace: FS, fontSize: 12 });
  foot(s, 1, TOTAL);
}

/* =====================================================
 *  第 2 页 · 副题页（对应原图 2）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s, 6.7, 4.2, -1.1, 0.0); // 右下桃枝（镜像简化）
  s.addShape("ellipse", { x: 6.2, y: 1.1, w: 3.6, h: 3.6, fill: { color: "AEB293", transparency: 82 }, line: { type: "none" } });
  s.addShape("ellipse", { x: 7.1, y: 2.2, w: 1.9, h: 1.9, fill: { color: "B5B79A", transparency: 86 }, line: { type: "none" } });
  // 左侧
  s.addText([
    run("是桃花源，", { breakLine: true, color: C.INK, bold: true, fontSize: 38, fontFace: FS }),
    run("但也不是", { color: C.INK, bold: true, fontSize: 38, fontFace: FS }),
    run("桃花源", { color: C.RED, bold: true, fontSize: 40, fontFace: FS }),
  ], { x: 0.85, y: 0.85, w: 7, h: 2.0, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.02 });
  s.addShape("rect", { x: 0.95, y: 3.02, w: 2.6, h: 0.018, fill: { color: C.GOLD }, line: { type: "none" } });
  s.addText("大道之行也 / 《礼记》", { x: 0.9, y: 3.2, w: 5, h: 0.42, align: "left", fontSize: 17, color: C.BODY, fontFace: FS, bold: true });
  s.addText([
    run("一条迷失的路，", { color: C.RED_D, bold: true, fontSize: 15, fontFace: FS }),
    run("一扇打开的门", { color: C.RED_D, bold: true, fontSize: 15, fontFace: FS }),
  ], { x: 0.9, y: 4.05, w: 5, h: 0.6, align: "left", fontSize: 15, color: C.RED_D, fontFace: FS, margin: 0 });
  // 提示注释（避/行预告小字）
  s.addText("关键词：“避” · “行” —— 桃花源靠避乱而安宁，大同靠大道运行而安宁", { x: 0.9, y: 4.62, w: 6.4, h: 0.4, align: "left", fontSize: 10.5, color: C.MUTE, fontFace: FB, italic: true });
  foot(s, 2, TOTAL);
}

/* =====================================================
 *  第 3 页 · 课文原文（对应原图 3）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  seal(s, 8.82, 0.35, "大同");
  s.addText("大道之行也 / 《礼记》", { x: 0.5, y: 0.42, w: 6, h: 0.5, align: "left", bold: true, fontSize: 20, color: C.RED_HEAD, fontFace: FS });
  s.addShape("rect", { x: 0.52, y: 0.98, w: 1.6, h: 0.014, fill: { color: C.GOLD }, line: { type: "none" } });
  const text =
    "大道之行也，天下为公。选贤与能，讲信修睦。故人不独亲其亲，不独子其子，使老有所终，壮有所用，幼有所长，矜、寡、孤、独、废疾者皆有所养，男有分，女有归。货，恶其弃于地也，不必藏于己；力，恶其不出于身也，不必为己。是故谋闭而不兴，盗窃乱贼而不作，故外户而不闭。是谓大同。";
  addTextR(s, rich(text.replace(/不必藏于己/,"__不必藏于己__").replace(/不必为己/,"__不必为己__")),
    { x: 0.75, y: 1.25, w: 8.6, h: 2.7, align: "left", valign: "top", fontSize: 17.5, lineSpacingMultiple: 1.6, color: C.INK, fontFace: FS, bold: true });
  s.addShape("roundRect", { x: 0.75, y: 4.12, w: 8.5, h: 0.8, rectRadius: 0.08, fill: { color: C.YELL }, line: { color: C.GOLD, width: 0.75 } });
  addTextR(s, rich("注音：为 wéi　·　与 jǔ（通“举”）　·　矜 guān（通“鳏”）　·　分 fèn　·　恶 wù（两处）"),
    { x: 1.0, y: 4.12, w: 8.0, h: 0.4, align: "center", valign: "middle", fontSize: 12.5, color: C.RED_D, bold: true, fontFace: FB });
  s.addText("（读准多音字：天下为(wéi)公 / 选贤与(jǔ)能 / 矜(guān)寡孤独 / 男有分(fèn) / 恶(wù)其弃于地）",
    { x: 0.75, y: 4.5, w: 8.5, h: 0.4, align: "center", fontSize: 10.5, color: C.MUTE, fontFace: FB });
  foot(s, 3, TOTAL);
}

/* ---------- 通用：词义注释小框 排布工具 ----------
 * items: [ [术语, 释义], ... ]；cols 列数，每格为术语 chip + 释义 */
function glossaryBlock(s, items, x, y, w, cols = 3, rowH = 0.44, gap = 0.12, labelL = 0.14, fs = 9.5, chipW = 1.02) {
  const cellW = (w - (cols - 1) * gap) / cols;
  items.forEach((it, i) => {
    const cx = x + (i % cols) * (cellW + gap);
    const cy = y + Math.floor(i / cols) * (rowH + gap * 0.8);
    s.addShape("rect", { x: cx, y: cy + 0.02, w: labelL, h: rowH - 0.04, fill: { color: C.REDFILL }, line: { type: "none" } });
    s.addText(it[0], { x: cx, y: cy + 0.02, w: labelL, h: rowH - 0.04, align: "center", valign: "middle", fontSize: fs, bold: true, color: C.RED_D, fontFace: FB, margin: 0 });
    s.addText(it[1], { x: cx + labelL + 0.06, y: cy, w: cellW - labelL - 0.06, h: rowH, align: "left", valign: "middle", fontSize: fs, color: C.BODY, fontFace: FB, margin: 0, lineSpacingMultiple: 0.95 });
  });
  return y + (Math.ceil(items.length / cols)) * (rowH + gap * 0.8);
}
// 白话翻译带
function transBand(s, text, y, x = 0.55, w = 8.9, h = 0.55, fs = 11.5) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.07, fill: { color: C.BAND2 }, line: { type: "none" } });
  s.addText("【译文】", { x: x + 0.16, y: y + h / 2 - 0.12, w: 0.8, h: 0.26, align: "left", color: C.RED_D, bold: true, fontSize: 10, fontFace: FB, margin: 0 });
  s.addText(text, { x: x + 0.92, y, w: w - 1.1, h, align: "left", valign: "middle", fontSize: fs, color: C.BODY, fontFace: FB, margin: 0, lineSpacingMultiple: 1.0 });
  return y + h + 0.16;
}
// 行内词义批注：每项 = 术语：释义，逐项换行自动折行
function glossPara(s, items, opts) {
  const arr = [];
  items.forEach((it, i) => {
    arr.push(run(it[0], { color: C.RED_D, bold: true, fontFace: FS, fontSize: opts.fontSize || 10 }));
    arr.push(run("：" + it[1], { color: C.BODY, fontFace: FB, fontSize: opts.fontSize || 10 }));
    if (i < items.length - 1) arr.push(run("\n", {}));
  });
  s.addText(arr, { x: opts.x, y: opts.y, w: opts.w, h: opts.h, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.25 });
  return opts.y + opts.h;
}
// 词义批注带（浅米色小条 + 红字标签）
function glossBand(s, items, y, x = 0.55, w = 8.9, h = 1.05, fs = 9.5) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.06, fill: { color: "FBF3E2" }, line: { color: C.LINE, width: 0.75 } });
  s.addText("【词义】", { x: x + 0.14, y: y + 0.06, w: 0.85, h: 0.26, align: "left", color: C.RED_D, bold: true, fontSize: 9.5, fontFace: FB, margin: 0 });
  glossPara(s, items, { x: x + 0.9, y: y + 0.1, w: w - 1.05, h: h - 0.2, fontSize: fs });
  return y + h + 0.14;
}

/* =====================================================
 *  第 4 页 · 注解① 大道为公 / 人不独亲其亲（对应原图 4）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "逐句细读 · ①②");
  const bodyX = 0.62, bodyW = 8.76;
  // ---- 段一：总纲领 ----
  s.addText([
    run("大道之行也，天下为公。", { color: C.RED, bold: true, fontSize: 15, fontFace: FS }),
    run("选贤与能，讲信修睦。", { color: C.INK, bold: true, fontSize: 15, fontFace: FS }),
  ], { x: bodyX, y: 0.78, w: bodyW, h: 0.34, align: "left", margin: 0 });
  let yy = 1.12;
  yy = glossBand(s, [
    ["大道", "古代指政治上的最高理想，这里用作名词，指这种理想的政治"],
    ["为", "是"],
    ["天下为公", "天下是公共的（天下是大家的）"],
    ["选贤与能", "选拔推举品德高尚、有才干的人"],
    ["与", "同“举”，推举"],
    ["修", "培养、使趋于完善"],
  ], yy, bodyX, bodyW, 0.86, 9);
  yy = transBand(s, "在大道施行的时候，天下是公共的。选拔推举品德高尚、有才干的人，讲求诚信，培养和睦的气氛。", yy, bodyX, bodyW, 0.4, 10.5);
  // 金线分隔 + 段间标签
  s.addShape("rect", { x: bodyX, y: yy + 0.02, w: bodyW, h: 0.012, fill: { color: C.GOLD }, line: { type: "none" } });
  s.addText("第二层 · 人的安顿：推己及人，各得其所", { x: bodyX, y: yy + 0.1, w: bodyW, h: 0.3, align: "left", color: C.MUTE, fontSize: 10.5, fontFace: FB, bold: true });
  // ---- 段二 ----
  const y2 = yy + 0.46;
  s.addText([
    run("故人不独", { fontSize: 14.5, fontFace: FS, bold: true, color: C.INK }),
    run("亲", { fontSize: 14.5, fontFace: FS, bold: true, color: C.RED }),
    run("其", { fontSize: 14.5, fontFace: FS, bold: true, color: C.INK }),
    run("亲", { fontSize: 14.5, fontFace: FS, bold: true, color: C.RED }),
    run("，不独", { fontSize: 14.5, fontFace: FS, bold: true, color: C.INK }),
    run("子", { fontSize: 14.5, fontFace: FS, bold: true, color: C.RED }),
    run("其", { fontSize: 14.5, fontFace: FS, bold: true, color: C.INK }),
    run("子", { fontSize: 14.5, fontFace: FS, bold: true, color: C.RED }),
    run("，使", { fontSize: 14.5, fontFace: FS, bold: true, color: C.INK }),
    run("老", { fontSize: 14.5, fontFace: FS, bold: true, color: C.RED }),
    run("有所终，", { fontSize: 14.5, fontFace: FS, bold: true, color: C.INK }),
    run("壮", { fontSize: 14.5, fontFace: FS, bold: true, color: C.RED }),
    run("有所用，", { fontSize: 14.5, fontFace: FS, bold: true, color: C.INK }),
    run("幼", { fontSize: 14.5, fontFace: FS, bold: true, color: C.RED }),
    run("有所长", { fontSize: 14.5, fontFace: FS, bold: true, color: C.INK }),
  ], { x: bodyX, y: y2, w: bodyW, h: 0.32, align: "left", margin: 0 });
  glossBand(s, [
    ["亲 / 子", "名词作动词：亲，以……为亲（敬爱）；子，以……为子（疼爱）"],
    ["其亲 / 其子", "自己的父母 / 自己的子女"],
    ["老 · 壮 · 幼", "老年人 · 壮年人 · 幼童"],
    ["有所终 · 有所用 · 有所长", "有终老的保障 · 能发挥才能（有用武之地） · 能健康成长"],
  ], y2 + 0.36, bodyX, bodyW, 0.74, 8.8);
  foot(s, 4, TOTAL);
}

/* =====================================================
 *  第 5 页 · 注解② 矜寡孤独废疾（对应原图 5）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "逐句细读 · ③");
  s.addText("矜、寡、孤、独、废疾者，皆有所养", { x: 0.5, y: 0.92, w: 9.0, h: 0.66, align: "center", bold: true, fontSize: 24, color: C.RED_D, fontFace: FS });
  s.addShape("rect", { x: 2.1, y: 1.58, w: 5.8, h: 0.015, fill: { color: C.GOLD }, line: { type: "none" } });
  // 五类人 环形注释
  const cards = [
    ["矜", "同“鳏”guān，老而无妻", 0.8, 1.95],
    ["孤", "幼而无父", 3.75, 1.95],
    ["废疾", "有残疾而不能做事的人", 6.7, 1.95],
    ["寡", "老而无夫", 1.9, 2.75],
    ["独", "老而无子", 4.9, 2.75],
  ];
  cards.forEach(c => {
    s.addShape("roundRect", { x: c[2], y: c[3], w: 2.7, h: 0.62, rectRadius: 0.08, fill: { color: C.PANEL }, line: { color: C.RED, width: 1 } });
    s.addText(c[0], { x: c[2] + 0.1, y: c[3], w: 0.72, h: 0.62, align: "center", valign: "middle", color: C.RED_D, bold: true, fontSize: 14, fontFace: FS, margin: 0 });
    s.addShape("rect", { x: c[2] + 0.8, y: c[3] + 0.1, w: 0.012, h: 0.42, fill: { color: C.LINE }, line: { type: "none" } });
    s.addText(c[1], { x: c[2] + 0.95, y: c[3], w: 1.7, h: 0.62, align: "left", valign: "middle", color: C.BODY, fontSize: 9.5, fontFace: FB, margin: 0, lineSpacingMultiple: 0.9 });
  });
  s.addText("“者皆有所养” —— 都能得到供养、有人照顾", { x: 0.5, y: 3.0, w: 9, h: 0.3, align: "center", color: C.MUTE, fontSize: 11, fontFace: FB, italic: true });
  transBand(s, "使老而无妻、老而无夫、幼而无父、老而无子、有残疾而不能做事的人，都能得到供养。", 3.62, 0.6, 8.8, 0.62, 12);
  foot(s, 5, TOTAL);
}

/* =====================================================
 *  第 6 页 · 注解③ 男有分 女有归（对应原图 6）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "逐句细读 · ④");
  // 中央色带古文
  s.addShape("roundRect", { x: 1.6, y: 1.05, w: 6.8, h: 0.95, rectRadius: 0.1, fill: { color: C.PANEL }, line: { color: C.GOLD, width: 1 } });
  s.addText([
    run("男有", { color: C.INK, bold: true, fontSize: 27, fontFace: FS }),
    run("分", { color: C.RED, bold: true, fontSize: 30, fontFace: FS }),
    run("，女有", { color: C.INK, bold: true, fontSize: 27, fontFace: FS }),
    run("归", { color: C.RED, bold: true, fontSize: 30, fontFace: FS }),
  ], { x: 1.6, y: 1.05, w: 6.8, h: 0.95, align: "center", valign: "middle", margin: 0 });
  // 两侧注释框
  chip(s, 0.75, 1.22, 1.15, 0.62, "分：职分，职守", C.PANEL, C.RED_D); s.addText("每个男子都要有自己的职分、职守", { x: 0.72, y: 1.9, w: 1.9, h: 0.55, align: "center", fontSize: 9.5, color: C.BODY, fontFace: FB, margin: 0 });
  chip(s, 8.15, 1.22, 1.5, 0.62, "归：出嫁（适时）", C.PANEL, C.RED_D); s.addText("这里指女子适时出嫁", { x: 8.1, y: 1.9, w: 1.7, h: 0.55, align: "center", fontSize: 9.5, color: C.BODY, fontFace: FB, margin: 0 });
  transBand(s, "男子要有职分、职守（各安其业），女子要适时出嫁（各有归宿）。", 2.75, 0.6, 8.8, 0.55, 12);
  // 释义小段
  s.addText([
    run("“分”是职分，是人在社会中的位置；“归”是归宿，是“有家可归”。", { color: C.INK, fontFace: FB, fontSize: 12.5, bold: true }),
    run("人人不漂泊、人人有安顿，这就是安居乐业。", { color: C.RED, fontFace: FS, fontSize: 12.5, bold: true }),
  ], { x: 0.8, y: 3.7, w: 8.4, h: 0.7, align: "center", margin: 0, lineSpacingMultiple: 1.3 });
  s.addText("这与桃花源里“男女衣着，悉如外人；其中往来种作”的安宁生活相通。", { x: 0.8, y: 4.5, w: 8.4, h: 0.4, align: "center", fontSize: 11, color: C.MUTE, fontFace: FB });
  foot(s, 6, TOTAL);
}

/* =====================================================
 *  第 7 页 · 注解④ 货恶其弃于地也（对应原图 7）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "逐句细读 · ⑤");
  chip(s, 4.05, 0.9, 1.7, 0.48, "恶 wù：厌恶", C.PANEL, C.RED_D);
  s.addText([
    run("货，恶其弃于地也，不必藏于己；", { fontSize: 18, fontFace: FS, bold: true, color: C.INK }),
    run("力，恶其不出于身也，不必为己。", { fontSize: 18, fontFace: FS, bold: true, color: C.INK }),
  ], { x: 0.75, y: 1.42, w: 8.5, h: 0.66, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.3 });
  // 强调色带：两个“不必”
  s.addText([
    run("“货不藏于己” —— ", { fontFace: FB, fontSize: 11.5, color: C.BODY, bold: true }),
    run("财物不必占为己有，厌弃浪费", { fontFace: FB, fontSize: 11.5, color: C.RED, bold: true }),
    run("　　“力不必为己” —— ", { fontFace: FB, fontSize: 11.5, color: C.BODY, bold: true }),
    run("力气不必只为自己，乐于奉献", { fontFace: FB, fontSize: 11.5, color: C.RED, bold: true }),
  ], { x: 0.6, y: 2.0, w: 8.8, h: 0.4, align: "center", margin: 0 });
  glossBand(s, [
    ["货", "财物"],
    ["恶", "厌恶"],
    ["弃于地", "被扔弃在地上（得不到充分利用）"],
    ["藏于己", "收藏在自己这里（占为己有）"],
    ["力", "力气、能力"],
    ["出于身", "从自己身上使出（愿意出力）"],
    ["为己", "只为了自己"],
  ], 2.55, 0.62, 8.76, 1.28, 9.2);
  transBand(s, "财物，厌恶它被弃置在地上（得不到充分利用），但不是一定要藏在自己家里；力气，厌恶它不是从自己身上使出（意思是自己愿意多出力），但不是一定要为了自己。", 4.05, 0.62, 8.76, 0.66, 10.5);
  s.addText("“货尽其用，人尽其力”：财物要充分使用，力量要尽情付出 —— 这为“老有所终、幼有所长、弱者皆有所养”提供了真实的物质与劳动投入。", { x: 0.62, y: 4.86, w: 8.76, h: 0.4, align: "center", fontSize: 10.5, color: C.MUTE, fontFace: FB });
  foot(s, 7, TOTAL);
}

/* =====================================================
 *  第 8 页 · 注解⑤ 谋闭不兴（对应原图 8）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "逐句细读 · ⑥");
  s.addShape("roundRect", { x: 0.6, y: 0.9, w: 8.8, h: 0.72, rectRadius: 0.1, fill: { color: C.PANEL }, line: { color: C.GOLD, width: 1 } });
  s.addText([
    run("是故", { fontSize: 17, fontFace: FS, bold: true, color: C.RED }),
    run("谋闭而不兴，盗窃乱贼而不作，故外户而不闭。", { fontSize: 17, fontFace: FS, bold: true, color: C.INK }),
    run("是谓大同。", { fontSize: 19, fontFace: FS, bold: true, color: C.RED_D }),
  ], { x: 0.6, y: 0.9, w: 8.8, h: 0.72, align: "center", valign: "middle", margin: 0 });
  glossBand(s, [
    ["谋", "奸诈的心计、图谋"],
    ["闭", "杜绝、堵塞"],
    ["兴 / 作", "发生、兴起"],
    ["乱", "造反、作乱"],
    ["贼", "害人（名词作动词）"],
    ["外户", "从外面把门合上"],
    ["闭（外户而不闭）", "用门闩插上门"],
  ], 1.85, 0.62, 8.76, 1.06, 9.2);
  transBand(s, "这样一来，图谋不轨的心计被杜绝而不会兴起，盗窃、作乱、害人的事不会发生，所以家家户户门从外面合上、不必从里面闩上 —— 这就叫“大同”社会。", 3.06, 0.62, 8.76, 0.66, 10.5);
  s.addShape("roundRect", { x: 0.62, y: 3.95, w: 8.76, h: 0.9, rectRadius: 0.1, fill: { color: C.REDFILL }, line: { color: C.RED, width: 1 } });
  addTextR(s, rich("“外户而不闭”，是因为“谋闭而不兴、盗窃乱贼而不作” —— *门打开的背后，是社会被安顿好了。*"),
    { x: 0.9, y: 3.95, w: 8.2, h: 0.9, align: "center", valign: "middle", fontSize: 13, color: C.INK, bold: true, fontFace: FS, lineSpacingMultiple: 1.15 });
  s.addText("大同的安宁 = 天下为公（制度）＋ 人人有养（保障）＋ 路不拾遗（人心） → 外户而不闭", { x: 0.6, y: 5.0, w: 8.8, h: 0.3, align: "center", fontSize: 11, color: C.RED_D, bold: true, fontFace: FB });
  foot(s, 8, TOTAL);
}

/* =====================================================
 *  第 9 页 · 一、它像桃花源 · 桃花源的美好（对应原图 10）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "一、它像桃花源");
  promptBox(s, "*桃花源的美好体现在哪里？*", 1.0, 0.92, 8.0, 0.52, true, 14);
  const lines = [
    "土地平旷，屋舍俨然，有良田、美池、桑竹之属。",
    "阡陌交通，鸡犬相闻。",
    "其中往来种作。",
    "黄发垂髫，并怡然自乐。",
    "便要还家，设酒杀鸡作食。",
    "自云先世避秦时乱。",
  ];
  s.addShape("roundRect", { x: 1.6, y: 1.78, w: 6.8, h: 2.6, rectRadius: 0.06, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.9 } });
  let ly = 1.95;
  lines.forEach((ln, i) => {
    s.addText((i + 1) + ". ", { x: 2.0, y: ly, w: 0.45, h: 0.36, color: C.RED, bold: true, fontSize: 12.5, fontFace: FS, margin: 0 });
    addTextR(s, rich(ln), { x: 2.45, y: ly, w: 5.7, h: 0.36, align: "left", fontSize: 12.5, color: C.BODY, fontFace: FS, bold: true, margin: 0 });
    ly += 0.38;
  });
  s.addShape("roundRect", { x: 1.2, y: 4.62, w: 7.6, h: 0.55, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 0.9 } });
  addTextR(s, rich("*大同社会与桃花源有何相似之处？*"), { x: 1.2, y: 4.62, w: 7.6, h: 0.55, align: "center", valign: "middle", fontSize: 14, bold: true, color: C.RED_D, fontFace: FS });
  foot(s, 9, TOTAL);
}

/* =====================================================
 *  第 10 页 · 一它像 · 再读勾画（对应原图 11）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "一、它像桃花源");
  promptBox(s, "*再读《大道之行也》，勾画其中与桃花源相似的内容。*", 0.7, 0.92, 8.6, 0.5, true, 13.5);
  const body = [
    ["大道之行也，天下为公。选贤与", "能", "，讲信", "修睦", "。"],
    ["故人不独亲其亲，不独子其子，使", "老有所终，壮有所用，幼有所长", "，"],
    ["矜、寡、孤、独、废疾者皆有所养", "，男有分，女有归。"],
    ["货，恶其弃于地也，不必藏于己；力，恶其不出于身也，不必为己。"],
    ["是故谋闭而不兴，盗窃乱贼而不作", "，故外户而不闭。是谓大同。"],
  ];
  // 高亮词：修睦 / 老有所终壮有所用幼有所长 / 矜寡孤独废疾者皆有所养 / 盗窃乱贼而不作
  s.addShape("roundRect", { x: 0.8, y: 1.7, w: 8.4, h: 2.5, rectRadius: 0.05, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.8 } });
  const runs = [
    run("大道之行也，天下为公。选贤与能，讲信", { color: C.INK, bold: true }),
    run("修睦", { color: C.RED, bold: true }),
    run("。故人不独亲其亲，不独子其子，使", { color: C.INK, bold: true }),
    run("老有所终，壮有所用，幼有所长", { color: C.RED, bold: true }),
    run("，矜、寡、孤、独、废疾者皆有所养", { color: C.RED, bold: true }),
    run("，男有分，女有归。货，恶其弃于地也，不必藏于己；力，恶其不出于身也，不必为己。是故谋闭而不兴，", { color: C.INK, bold: true }),
    run("盗窃乱贼而不作", { color: C.RED, bold: true }),
    run("，故外户而不闭。是谓大同。", { color: C.INK, bold: true }),
  ];
  s.addText(runs, { x: 1.1, y: 1.9, w: 7.8, h: 2.15, align: "left", valign: "middle", fontSize: 14.5, lineSpacingMultiple: 1.7, fontFace: FS, margin: 0 });
  s.addText("像桃花源的地方，其实都藏在“红字”里", { x: 0.8, y: 4.4, w: 8.4, h: 0.4, align: "center", color: C.MUTE, fontSize: 11.5, fontFace: FB, italic: true });
  foot(s, 10, TOTAL);
}

/* =====================================================
 *  第 11 页 · 一它像 · 对比表（对应原图 12/13）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "一、它像桃花源");
  // 两栏头
  const colW = 4.05, xL = 0.6, xR = 5.35, y0 = 0.95;
  const headTag = (x, t) => {
    s.addShape("roundRect", { x, y: y0, w: colW, h: 0.44, rectRadius: 0.08, fill: { color: C.RED_D }, line: { type: "none" } });
    s.addText(t, { x, y: y0, w: colW, h: 0.44, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 15, fontFace: FS, margin: 0 });
  };
  headTag(xL, "桃 花 源"); headTag(xR, "大 同 社 会");
  const rowsL = ["便要还家，设酒杀鸡作食", "黄发垂髫，并怡然自乐", "其中往来种作", "土地平旷，屋舍俨然，\n有良田美池桑竹之属", "自云先世避秦时乱"];
  const rowsR = ["讲信修睦", "老有所终……幼有所长", "壮有所用", "男有分，女有归", "盗窃乱贼而不作"];
  const mkCol = (x, rows) => {
    s.addShape("roundRect", { x, y: y0 + 0.55, w: colW, h: 2.35, rectRadius: 0.05, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.8 } });
    rows.forEach((r, i) => {
      const yy = y0 + 0.55 + 0.05 + i * 0.46;
      s.addShape("ellipse", { x: x + 0.18, y: yy + 0.06, w: 0.1, h: 0.1, fill: { color: C.RED }, line: { type: "none" } });
      s.addText(r, { x: x + 0.4, y: yy, w: colW - 0.6, h: 0.42, align: "left", valign: "middle", fontSize: 10.5, color: C.BODY, fontFace: FB, margin: 0, lineSpacingMultiple: 0.9, bold: true });
    });
  };
  mkCol(xL, rowsL); mkCol(xR, rowsR);
  // 中间连接箭头与“相似”语
  s.addText("≌", { x: 4.68, y: 1.6, w: 0.65, h: 0.4, align: "center", color: C.GOLD, bold: true, fontSize: 18, fontFace: FS });
  s.addText("人 心 相 通", { x: 4.6, y: 2.15, w: 0.8, h: 1.2, align: "center", color: C.MUTE, fontSize: 10.5, fontFace: FS, bold: true });
  s.addText("相似：村民热情友好，人情温暖；老幼安顿、各得其乐；人人劳作、各安其位；人们远离战乱、不被惊扰。", { x: 0.6, y: 3.75, w: 8.8, h: 0.4, align: "center", fontSize: 11, color: C.MUTE, fontFace: FB });
  s.addShape("roundRect", { x: 0.85, y: 4.28, w: 8.3, h: 0.72, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 1 } });
  addTextR(s, rich("他们相似的不是漂亮风景，而是——*人的和谐、安心*"),
    { x: 0.85, y: 4.28, w: 8.3, h: 0.72, align: "center", valign: "middle", fontSize: 17, bold: true, color: C.INK, fontFace: FS });
  foot(s, 11, TOTAL);
}

/* =====================================================
 *  第 12 页 · 一它像 · 出处与背景（对应原图 14）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "一、它像桃花源");
  const bx = 0.6, bw = 6.4;
  // 左米黄圆角框
  s.addShape("roundRect", { x: bx, y: 0.98, w: bw, h: 2.6, rectRadius: 0.06, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.8 } });
  s.addText([
    run("《大道之行也》是《礼记·礼运》开头中", { color: C.INK, fontFace: FB, fontSize: 12.5, bold: true }),
    run("孔子", { color: C.RED, fontFace: FB, fontSize: 12.5, bold: true }),
    run("的一段话，为阐明儒家理想中“大同”社会的", { color: C.INK, fontFace: FB, fontSize: 12.5, bold: true }),
    run("基本特征", { color: C.RED, fontFace: FB, fontSize: 12.5, bold: true }),
    run("。", { color: C.INK, fontFace: FB, fontSize: 12.5 }),
  ], { x: bx + 0.22, y: 1.16, w: bw - 0.44, h: 0.7, align: "left", margin: 0, lineSpacingMultiple: 1.3 });
  s.addShape("rect", { x: bx + 0.22, y: 1.95, w: bw - 0.44, h: 0.012, fill: { color: C.LINE }, line: { type: "none" } });
  s.addText([
    run("这段文字背后指向", { color: C.INK, fontFace: FB, fontSize: 12.5, bold: true }),
    run("春秋末期礼崩乐坏、社会动荡的现实", { color: C.RED, fontFace: FB, fontSize: 12.5, bold: true }),
    run("：诸侯纷争、秩序瓦解、人心不安。", { color: C.INK, fontFace: FB, fontSize: 12.5, bold: true }),
  ], { x: bx + 0.22, y: 2.1, w: bw - 0.44, h: 1.35, align: "left", margin: 0, lineSpacingMultiple: 1.32 });
  s.addShape("roundRect", { x: 0.6, y: 3.85, w: 8.8, h: 0.8, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 1 } });
  addTextR(s, rich("桃花源与大同社会，都是在描述一种理想的社会，是对*现实不安与混乱*的回应。"),
    { x: 0.8, y: 3.85, w: 8.4, h: 0.8, align: "center", valign: "middle", fontSize: 14.5, color: C.INK, bold: true, fontFace: FS, lineSpacingMultiple: 1.1 });
  // 右侧年代意象框（弱化示意礼崩乐坏）
  s.addShape("roundRect", { x: 7.25, y: 0.98, w: 2.35, h: 2.6, rectRadius: 0.06, fill: { color: C.REDFILL }, line: { color: C.RED, width: 0.8 } });
  s.addText("春秋·礼崩乐坏", { x: 7.25, y: 1.1, w: 2.35, h: 0.34, align: "center", color: C.RED_D, bold: true, fontSize: 12, fontFace: FS });
  s.addShape("rect", { x: 7.5, y: 1.55, w: 1.85, h: 0.014, fill: { color: C.RED }, line: { type: "none" } });
  const chaos = ["诸侯纷争 · 争地以战", "礼崩乐坏 · 人心不古", "制度失序 · 民不聊生"];
  chaos.forEach((t, i) => s.addText("· " + t, { x: 7.42, y: 1.7 + i * 0.46, w: 2.15, h: 0.4, align: "left", fontSize: 10.5, color: C.BODY, fontFace: FB, margin: 0 }));
  s.addText("理想社会，是对乱世的回答", { x: 7.25, y: 3.0, w: 2.35, h: 0.5, align: "center", fontSize: 10.5, italic: true, color: C.RED_D, fontFace: FS });
  foot(s, 12, TOTAL);
}

/* =====================================================
 *  第 13 页 · 一它像 · 愿望（对应原图 15）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "一、它像桃花源");
  const bx = 0.75, bw = 8.5;
  addTextR(s, rich("桃花源的“怡然自乐”，《大道之行也》的“外户而不闭”，其实都指向同一个愿望："),
    { x: bx, y: 0.95, w: bw, h: 0.42, align: "left", fontSize: 15, color: C.INK, bold: true, fontFace: FB });
  s.addShape("roundRect", { x: 0.95, y: 1.62, w: 8.1, h: 0.78, rectRadius: 0.12, fill: { color: C.REDFILL }, line: { color: C.RED, width: 1.2 } });
  addTextR(s, rich("*人可以安安稳稳地生活，不必把别人想成危险。*"),
    { x: 0.95, y: 1.62, w: 8.1, h: 0.78, align: "center", valign: "middle", fontSize: 20, bold: true, color: C.RED_D, fontFace: FS });
  s.addText([
    run("所以，说《大道之行也》“是桃花源”，并不是说它有山洞、溪流和桑竹，", { color: C.BODY, fontFace: FB, fontSize: 13 }),
    run("而是说它和桃花源一样，保存了中国古人关于理想生活的温柔想象：", { color: C.BODY, fontFace: FB, fontSize: 13 }),
    run("老人有晚年，孩子有未来，邻里有往来，门外没有随时逼近的危险。", { color: C.RED_D, fontFace: FS, fontSize: 14, bold: true }),
  ], { x: bx, y: 2.75, w: bw, h: 1.7, align: "left", margin: 0, lineSpacingMultiple: 1.5 });
  s.addShape("roundRect", { x: 1.2, y: 4.7, w: 7.6, h: 0.5, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 0.9 } });
  addTextR(s, rich("*但大同社会和桃花源完全一样吗？*"), { x: 1.2, y: 4.7, w: 7.6, h: 0.5, align: "center", valign: "middle", fontSize: 14, bold: true, color: C.RED_D, fontFace: FS });
  foot(s, 13, TOTAL);
}

/* =====================================================
 *  第 14 页 · 二它不是 · 安宁属于谁（对应原图 16）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "二、它不是桃花源");
  const qY = 0.95, qH = 0.52;
  s.addShape("roundRect", { x: 0.6, y: qY, w: 8.8, h: qH, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 1 } });
  addTextR(s, rich("*桃花源里的安宁属于谁？*《大道之行也》的安宁，又要给谁？"),
    { x: 0.6, y: qY, w: 8.8, h: qH, align: "center", valign: "middle", fontSize: 14.5, bold: true, color: C.INK, fontFace: FB });
  const colDef = [
    { x: 0.6, w: 4.28, tag: "桃 花 源", quote: ["“自云先世避秦时乱，率妻子邑人来此绝境，不复出焉，遂与外人间隔。”", "“不足为外人道也。”"], note: "它是一个*村*中世界——安顿的，是一群*避*乱而来的亲人、乡邻。" },
    { x: 5.12, w: 4.28, tag: "大 同 社 会", quote: ["大道之“行”也，天下为公。", "使老有所终，壮有所用，幼有所长。"], note: "它不是只问一个村庄怎样安稳，而是问：*整*个社会怎样共同安顿。" },
  ];
  const topY = 1.72;
  colDef.forEach(c => {
    s.addShape("roundRect", { x: c.x, y: topY, w: c.w, h: 0.44, rectRadius: 0.09, fill: { color: C.RED_D }, line: { type: "none" } });
    s.addText(c.tag, { x: c.x, y: topY, w: c.w, h: 0.44, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 14.5, fontFace: FS });
    s.addShape("roundRect", { x: c.x, y: topY + 0.54, w: c.w, h: 1.55, rectRadius: 0.05, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.8 } });
    addTextR(s, c.quote.map((q, i) => run((i ? "\n" : "") + q, { color: C.INK, bold: true, fontFace: FS, fontSize: 12 })).reduce((a, b) => a.concat(b), []),
      { x: c.x + 0.2, y: topY + 0.66, w: c.w - 0.4, h: 1.35, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.28 });
    s.addShape("roundRect", { x: c.x, y: topY + 2.22, w: c.w, h: 1.15, rectRadius: 0.07, fill: { color: C.YELL }, line: { color: C.GOLD, width: 0.7 } });
    addTextR(s, rich(c.note), { x: c.x + 0.18, y: topY + 2.22, w: c.w - 0.36, h: 1.15, align: "left", valign: "middle", fontSize: 11.5, color: C.BODY, fontFace: FB, bold: true, lineSpacingMultiple: 1.12 });
  });
  foot(s, 14, TOTAL);
}

/* =====================================================
 *  第 15 页 · 二它不是 · 桃花源人为何安宁 · “避”（对应原图 17）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "二、它不是桃花源");
  promptBox(s, "*桃花源人为何能获得安宁？*", 0.7, 0.92, 8.6, 0.5, true, 14);
  s.addShape("roundRect", { x: 1.5, y: 1.6, w: 7.0, h: 0.62, rectRadius: 0.1, fill: { color: C.PANEL }, line: { color: C.GOLD, width: 1 } });
  s.addText("“自云先世避秦时乱，率妻子邑人来此绝境。”", { x: 1.5, y: 1.6, w: 7.0, h: 0.62, align: "center", valign: "middle", fontSize: 15, bold: true, color: C.INK, fontFace: FS });
  // “避”字牌
  s.addShape("roundRect", { x: 0.6, y: 2.42, w: 1.6, h: 1.05, rectRadius: 0.12, fill: { color: C.RED_D }, line: { type: "none" } });
  s.addText("避", { x: 0.6, y: 2.42, w: 1.6, h: 0.62, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 40, fontFace: FS });
  s.addText("逃开乱世 · 退守一隅", { x: 0.6, y: 3.06, w: 1.6, h: 0.34, align: "center", color: C.WHITE, fontSize: 8.5, fontFace: FB });
  s.addText("桃花源的安宁，来自“避”。", { x: 2.4, y: 2.5, w: 6.8, h: 0.5, align: "left", valign: "middle", fontSize: 17, bold: true, color: C.RED_D, fontFace: FS });
  s.addShape("roundRect", { x: 0.6, y: 3.55, w: 8.8, h: 1.5, rectRadius: 0.07, fill: { color: C.PANEL }, line: { color: C.RED, width: 1.1 } });
  s.addText([
    run("桃花源的安全，是靠远离乱世换来的；它的美好，是靠“不为外人道”保护的。“不知有汉，无论魏晋”——这里的安宁，与外部历史之间隔着厚厚的壁垒。", { color: C.BODY, fontFace: FB, fontSize: 12 }),
    run("渔人离开后“遂迷，不复得路”，太守派人寻找也找不到。桃花源像一个惊鸿一瞥的梦：", { color: C.BODY, fontFace: FB, fontSize: 12 }),
    run("美丽，却难以抵达；安宁，却不能推开给天下人共享。", { color: C.RED_D, fontFace: FS, fontSize: 13, bold: true }),
  ], { x: 0.85, y: 3.7, w: 8.3, h: 1.28, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.3 });
  foot(s, 15, TOTAL);
}

/* =====================================================
 *  第 16 页 · 二它不是 · 大同为何安宁 · “行”（对应原图 18）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "二、它不是桃花源");
  promptBox(s, "*大同社会为何能获得安宁？*", 0.7, 0.92, 8.6, 0.5, true, 14);
  s.addShape("roundRect", { x: 1.2, y: 1.6, w: 7.6, h: 0.66, rectRadius: 0.1, fill: { color: C.PANEL }, line: { color: C.GOLD, width: 1 } });
  addTextR(s, rich("大道之“行”也 —— __施行、运行、推行__"),
    { x: 1.2, y: 1.6, w: 7.6, h: 0.66, align: "center", valign: "middle", fontSize: 18, bold: true, color: C.INK, fontFace: FS });
  s.addShape("roundRect", { x: 0.6, y: 2.42, w: 1.6, h: 1.05, rectRadius: 0.12, fill: { color: C.GREEN_DK }, line: { type: "none" } });
  s.addText("行", { x: 0.6, y: 2.42, w: 1.6, h: 0.62, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 40, fontFace: FS });
  s.addText("面向天下 · 制度运行", { x: 0.6, y: 3.06, w: 1.6, h: 0.34, align: "center", color: C.WHITE, fontSize: 8.5, fontFace: FB });
  addTextR(s, rich("大同社会的安宁，来自*制度的运行*。它问的不是“怎样找一个不受乱世打扰的地方”，而是问：*怎样让整个天下按更公正的原则运行起来*。"),
    { x: 2.4, y: 2.45, w: 7.0, h: 1.0, align: "left", valign: "top", fontSize: 13.5, color: C.BODY, fontFace: FB, bold: true, lineSpacingMultiple: 1.3 });
  addTextR(s, rich("一个关键词是*“避”*，一个关键词是*“行”*。《桃花源记》是从乱世中退出来，退到一个隐秘的小世界；《大道之行也》是面对天下，把现实世界重新安排。"),
    { x: 0.6, y: 3.62, w: 8.8, h: 0.85, align: "left", valign: "top", fontSize: 13, color: C.BODY, fontFace: FB, bold: true, lineSpacingMultiple: 1.35 });
  s.addShape("roundRect", { x: 0.6, y: 4.55, w: 8.8, h: 0.6, rectRadius: 0.1, fill: { color: C.REDFILL }, line: { color: C.RED, width: 1 } });
  addTextR(s, rich("《大道之行也》不是另一个桃花源 —— 它比桃花源*更难，也更开阔*。"),
    { x: 0.6, y: 4.55, w: 8.8, h: 0.6, align: "center", valign: "middle", fontSize: 15, bold: true, color: C.RED_D, fontFace: FS });
  foot(s, 16, TOTAL);
}

/* =====================================================
 *  第 17 页 · 三 · 写结果 / 写条件（对应原图 19）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  headCenter(s, "三、桃花源写“结果”，大同写“条件”", 0.3, 21);
  const qY = 0.98, qH = 0.5;
  s.addShape("roundRect", { x: 0.75, y: qY, w: 8.5, h: qH, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 1 } });
  s.addText("《桃花源记》有没有告诉我们，这个理想世界是怎样治理出来的？", { x: 0.75, y: qY, w: 8.5, h: qH, align: "center", valign: "middle", fontSize: 13.5, bold: true, color: C.INK, fontFace: FB });
  s.addShape("roundRect", { x: 0.75, y: 1.72, w: 8.5, h: 2.35, rectRadius: 0.05, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.8 } });
  addTextR(s, rich("基本没有。陶渊明让我们看见*结果*：土地平旷，屋舍俨然，男女衣着，往来种作，黄发垂髫，并怡然自乐。"),
    { x: 1.0, y: 1.9, w: 8.0, h: 1.05, align: "left", valign: "top", fontSize: 14, color: C.INK, bold: true, fontFace: FS, lineSpacingMultiple: 1.5 });
  s.addText([
    run("我们看见了生活的美好，却很少看见——这个社会如何选人、如何处理公共事务、如何安顿弱者、如何分配财货与劳动。", { color: C.BODY, fontFace: FB, fontSize: 12.5, bold: true }),
  ], { x: 1.0, y: 3.0, w: 8.0, h: 0.95, align: "left", valign: "top", fontSize: 12.5, color: C.BODY, fontFace: FB, lineSpacingMultiple: 1.4 });
  addTextR(s, rich("陶渊明写出了理想的*“结果”*，却没有写出它的*“条件”* —— 治理方法。"),
    { x: 0.75, y: 4.35, w: 8.5, h: 0.4, align: "center", fontSize: 13.5, color: C.RED_D, bold: true, fontFace: FS });
  addTextR(s, rich("那《大道之行也》呢？它把条件一层一层说了出来。"), { x: 0.75, y: 4.85, w: 8.5, h: 0.4, align: "center", fontSize: 12.5, color: C.MUTE, fontFace: FB, italic: true });
  foot(s, 17, TOTAL);
}

/* =====================================================
 *  第 18 页 · 三 · 分为几层（对应原图 20）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  headCenter(s, "三、桃花源写“结果”，大同写“条件”", 0.3, 21);
  s.addShape("roundRect", { x: 0.7, y: 1.0, w: 8.6, h: 0.56, rectRadius: 0.1, fill: { color: C.PANEL }, line: { color: C.RED, width: 1.1 } });
  addTextR(s, rich("*《大道之行也》则是把理想社会的条件，一层一层说出来。文章对理想社会的描述，分为几层呢？*"),
    { x: 0.95, y: 1.0, w: 8.1, h: 0.56, align: "center", valign: "middle", fontSize: 13, color: C.RED_D, bold: true, fontFace: FB });
  const layers = [
    { tag: "社会纲领", quote: [run("大道之行也，天下为公。", { color: C.INK, bold: true, fontFace: FS, fontSize: 14 }), run("选贤与能，讲信修睦。", { color: C.RED_D, bold: true, fontFace: FS, fontSize: 14 })], note: "先立总纲：天下归公，选贤任能，讲信修睦" },
    { tag: "具体表现", quote: [run("故", { color: C.RED, bold: true, fontFace: FS, fontSize: 14 }), run("人不独亲其亲，不独子其子……男有分，女有归。货，恶其弃于地也，不必藏于己；力，恶其不出于身也，不必为己。", { color: C.INK, bold: true, fontFace: FS, fontSize: 13 })], note: "再说做法：人人有养、安居乐业、货尽其用、人尽其力" },
    { tag: "理想蓝图", quote: [run("是故", { color: C.RED, bold: true, fontFace: FS, fontSize: 14 }), run("谋闭而不兴，盗窃乱贼而不作，故外户而不闭。", { color: C.INK, bold: true, fontFace: FS, fontSize: 14 }), run("是谓大同。", { color: C.RED_D, bold: true, fontFace: FS, fontSize: 14 })], note: "终成蓝图：太平无乱，外户不闭，是为“大同”" },
  ];
  let ly = 1.66;
  layers.forEach(l => {
    s.addShape("roundRect", { x: 0.7, y: ly, w: 1.7, h: 0.94, rectRadius: 0.08, fill: { color: C.REDFILL }, line: { color: C.RED, width: 1 } });
    s.addText(l.tag, { x: 0.7, y: ly, w: 1.7, h: 0.94, align: "center", valign: "middle", color: C.RED_D, bold: true, fontSize: 15, fontFace: FS });
    s.addShape("roundRect", { x: 2.55, y: ly, w: 6.75, h: 0.94, rectRadius: 0.06, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.75 } });
    s.addText(l.quote, { x: 2.8, y: ly + 0.05, w: 6.3, h: 0.58, align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.22 });
    s.addText("· " + l.note, { x: 2.8, y: ly + 0.68, w: 6.3, h: 0.24, align: "left", fontSize: 9, color: C.MUTE, fontFace: FB });
    ly += 1.06;
  });
  s.addText("纵看：总（纲领）→ 分（表现）→ 合（蓝图）　——　这就是大同社会的“骨架”。", { x: 0.7, y: 4.78, w: 8.6, h: 0.3, align: "center", fontSize: 11, color: C.RED_D, bold: true, fontFace: FB });
  foot(s, 18, TOTAL);
}

/* ---------- 泛用：中段小节页（标题 + 绿色标签 + 引文 + 解说） ---------- */
function sectionPage(label, quoteRuns, explainRuns, headerTxt, labelColor = C.GREEN_DK) {
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "三、桃花源写“结果”，大同写“条件”");
  s.addText(headerTxt, { x: 0.5, y: 0.85, w: 9, h: 0.46, align: "left", color: C.RED_D, bold: true, fontSize: 15, fontFace: FS });
  s.addShape("roundRect", { x: 0.62, y: 1.42, w: 2.2, h: 0.56, rectRadius: 0.1, fill: { color: labelColor }, line: { type: "none" } });
  s.addText(label, { x: 0.62, y: 1.42, w: 2.2, h: 0.56, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 15, fontFace: FS });
  s.addShape("roundRect", { x: 0.62, y: 2.16, w: 8.76, h: 1.5, rectRadius: 0.06, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.9 } });
  s.addText(quoteRuns, { x: 0.95, y: 2.36, w: 8.1, h: 1.1, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.5 });
  addTextR(s, explainRuns, { x: 0.95, y: 4.02, w: 8.1, h: 0.9, align: "left", valign: "top", fontSize: 12.5, color: C.BODY, fontFace: FB, lineSpacingMultiple: 1.4 });
  return s;
}

/* =====================================================
 *  第 19 页 · 三 · 社会纲领（对应原图 21）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "三、桃花源写“结果”，大同写“条件”");
  s.addShape("roundRect", { x: 0.55, y: 0.9, w: 4.6, h: 0.5, rectRadius: 0.1, fill: { color: C.GREEN_DK }, line: { type: "none" } });
  s.addText("第一层 · 社会纲领", { x: 0.55, y: 0.9, w: 4.6, h: 0.5, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 15, fontFace: FS });
  const cards = [
    { no: "①", name: "政治原则", word: "天下为公", body: "天下不是少数人的私产，而应属于公共生活。" },
    { no: "②", name: "用人原则", word: "选贤与能", body: "承担公共事务的人，不能只凭血缘、门第和私情，而应凭贤德与才能。" },
    { no: "③", name: "人际原则", word: "讲信修睦", body: "社会不能只靠规矩支撑，也需要诚信与和睦。" },
  ];
  const cardY = 1.7, cardH = 2.5;
  cards.forEach((c, i) => {
    const cx = 0.5 + i * 3.06, cw = 2.92;
    s.addShape("roundRect", { x: cx, y: cardY, w: cw, h: cardH, rectRadius: 0.08, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.9 } });
    s.addShape("roundRect", { x: cx, y: cardY, w: cw, h: 0.52, rectRadius: 0.08, fill: { color: C.RED_D }, line: { type: "none" } });
    s.addText(c.no + "　" + c.name, { x: cx, y: cardY, w: cw, h: 0.52, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 14, fontFace: FS });
    s.addShape("rect", { x: cx + 0.18, y: cardY + 0.7, w: 0.7, h: 0.016, fill: { color: C.GOLD }, line: { type: "none" } });
    s.addText(c.word, { x: cx, y: cardY + 0.86, w: cw, h: 0.6, align: "center", valign: "middle", color: C.RED_D, bold: true, fontSize: 20, fontFace: FS });
    s.addText(c.body, { x: cx + 0.2, y: cardY + 1.62, w: cw - 0.4, h: 0.75, align: "left", valign: "top", fontSize: 11, color: C.BODY, fontFace: FB, margin: 0, lineSpacingMultiple: 1.3 });
  });
  addTextR(s, rich("纲领三句，一句一个原则：*凭什么治天下 → 用谁治天下 → 人与人和睦相处*"),
    { x: 0.5, y: 4.45, w: 9, h: 0.5, align: "center", fontSize: 12.5, color: C.MUTE, bold: true, fontFace: FB });
  foot(s, 19, TOTAL);
}

/* =====================================================
 *  第 20 页 · 三 · 社会关爱（对应原图 22）
 * ===================================================== */
{
  const s = sectionPage("社会关爱",
    [run("故人不独亲其亲，不独子其子，使", { color: C.INK, bold: true, fontFace: FS, fontSize: 16 }),
      run("老有所终，壮有所用，幼有所长", { color: C.RED, bold: true, fontFace: FS, fontSize: 16 }),
      run("，", { color: C.INK, bold: true, fontFace: FS, fontSize: 16 }),
      run("矜、寡、孤、独、废疾者", { color: C.RED, bold: true, fontFace: FS, fontSize: 16 }),
      run("皆有所养。", { color: C.INK, bold: true, fontFace: FS, fontSize: 16 })],
    [run("一个社会是否美好，要看它如何对待最容易被抛下的人，为他们提供社会保障。", { color: C.BODY, fontFace: FB, fontSize: 13.5, bold: true }),
      run("　其次推己及人：不只爱自己的亲人子女，也关爱天下的老人、壮者、幼童与鳏寡孤独废疾者。", { color: C.MUTE, fontFace: FB, fontSize: 11.5 })],
    "第二层 · 具体表现");
  foot(s, 20, TOTAL);
}

/* =====================================================
 *  第 21 页 · 三 · 安居乐业（对应原图 23）
 * ===================================================== */
{
  const s = sectionPage("安居乐业",
    [run("男有分，女有归。", { color: C.INK, bold: true, fontFace: FS, fontSize: 26 })],
    [run("人人不漂泊，人人有安顿——人人能在社会中找到自己的位置，这就是安居乐业。", { color: C.BODY, fontFace: FB, fontSize: 14, bold: true })],
    "第二层 · 具体表现");
  addTextR(s, rich("有“分”＝有职分、被需要；有“归”＝有归宿、有家可归。这与桃花源的“往来种作、怡然自乐”一脉相通。"),
    { x: 0.95, y: 4.62, w: 8.1, h: 0.5, align: "center", fontSize: 12, color: C.RED_D, bold: true, fontFace: FB });
  foot(s, 21, TOTAL);
}

/* =====================================================
 *  第 22 页 · 三 · 货尽其用 人尽其力（对应原图 25）
 * ===================================================== */
{
  const s = sectionPage("货尽其用 · 人尽其力",
    [run("货，恶其弃于地也，不必藏于己；力，恶其不出于身也，不必为己。", { color: C.INK, bold: true, fontFace: FS, fontSize: 16 })],
    [],
    "第二层 · 具体表现");
  // 覆盖下方解说为三段
  addTextR(s, rich("老人要有所终，幼童要有所长，弱者要皆有所养——这些都需要*真实的财物、劳动和公共投入*。"),
    { x: 0.95, y: 3.96, w: 8.1, h: 0.5, align: "left", valign: "top", fontSize: 12.5, color: C.INK, bold: true, fontFace: FB, lineSpacingMultiple: 1.3 });
  s.addShape("roundRect", { x: 0.95, y: 4.52, w: 8.1, h: 0.62, rectRadius: 0.07, fill: { color: C.TEAL }, line: { type: "none" } });
  addTextR(s, rich("“货恶其弃于地也”＝*对浪费的厌恶*；“不必藏于己”＝*人不把占有当唯一目的*。　“力恶其不出于身也”＝不愿让才力白白闲着；“不必为己”＝劳动也可*服务他人、服务共同体*。"),
    { x: 1.15, y: 4.52, w: 7.7, h: 0.62, align: "left", valign: "middle", fontSize: 11, color: C.INK, bold: true, fontFace: FB, lineSpacingMultiple: 1.05 });
  foot(s, 22, TOTAL);
}

/* =====================================================
 *  第 23 页 · 三 · 理想蓝图（对应原图 26）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "三、桃花源写“结果”，大同写“条件”");
  s.addShape("roundRect", { x: 0.62, y: 0.9, w: 4.4, h: 0.5, rectRadius: 0.1, fill: { color: C.GREEN_DK }, line: { type: "none" } });
  s.addText("第三层 · 理想蓝图", { x: 0.62, y: 0.9, w: 4.4, h: 0.5, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 15, fontFace: FS });
  s.addShape("roundRect", { x: 0.62, y: 1.62, w: 8.76, h: 0.95, rectRadius: 0.06, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.9 } });
  s.addText([
    run("谋闭而不兴，盗窃乱贼而不作，故外户而不闭。", { color: C.INK, bold: true, fontFace: FS, fontSize: 18 }),
    run("　是谓大同。", { color: C.RED_D, bold: true, fontFace: FS, fontSize: 18 }),
  ], { x: 0.62, y: 1.62, w: 8.76, h: 0.95, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.2 });
  // 问题黄条
  s.addShape("roundRect", { x: 0.62, y: 2.82, w: 8.76, h: 1.0, rectRadius: 0.08, fill: { color: C.YELL }, line: { color: C.GOLD, width: 0.7 } });
  addTextR(s, rich("*先问：为什么天下不安定？*　为什么有阴谋诡计？为什么社会混乱？为什么有人盗窃、作乱、害人？"),
    { x: 0.85, y: 2.82, w: 8.3, h: 1.0, align: "left", valign: "middle", fontSize: 12, color: C.INK, bold: true, fontFace: FB, lineSpacingMultiple: 1.15 });
  // 答案青条
  s.addShape("roundRect", { x: 0.62, y: 3.94, w: 8.76, h: 1.1, rectRadius: 0.08, fill: { color: C.TEAL }, line: { color: C.GREEN, width: 0.7 } });
  addTextR(s, rich("*再答：*因为战乱争夺、治乱失序、人性自私、弱者无人照料、才者无处安身、富者独占资源……"),
    { x: 0.85, y: 3.94, w: 8.3, h: 1.1, align: "left", valign: "middle", fontSize: 12, color: C.INK, bold: true, fontFace: FB, lineSpacingMultiple: 1.15 });
  addTextR(s, rich("而前文的每一条“条件”，恰恰都在为这些“乱”**对症下药**。"), { x: 0.62, y: 5.08, w: 8.76, h: 0.28, align: "center", fontSize: 12, color: C.RED_D, bold: true, fontFace: FB });
  foot(s, 23, TOTAL);
}

/* =====================================================
 *  第 24 页 · 三 · 一一对症（对应原图 27）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  headCenter(s, "三、桃花源写“结果”，大同写“条件”", 0.3, 20);
  s.addText("再回到前文看 —— 《大道之行也》恰恰一一解决了这些“乱”。", { x: 0.55, y: 0.98, w: 8.9, h: 0.4, align: "center", fontSize: 14, color: C.INK, bold: true, fontFace: FB });
  const rows = [
    ["乱之根源（桃花源所逃避的）", "大同社会给出的“条件”"],
    ["争夺私人权力", "天下为公"],
    ["社会治理混乱", "选贤与能"],
    ["人性自私、不讲诚信", "讲信修睦"],
    ["生活没有保障", "老有所终，幼有所长"],
    ["弱者无人照料", "矜、寡、孤、独、废疾者皆有所养"],
    ["有才能的人没有位置", "男有分，女有归"],
    ["富人独占资源", "货不必藏于己，力不必为己"],
  ];
  const top = 1.5, rowH = 0.46;
  rows.forEach((r, i) => {
    const yy = top + i * rowH;
    if (i === 0) {
      s.addShape("rect", { x: 0.7, y: yy, w: 4.1, h: rowH, fill: { color: C.RED_D }, line: { type: "none" } });
      s.addShape("rect", { x: 4.8, y: yy, w: 4.5, h: rowH, fill: { color: C.GREEN_DK }, line: { type: "none" } });
      s.addText(r[0], { x: 0.7, y: yy, w: 4.1, h: rowH, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 11.5, fontFace: FB });
      s.addText(r[1], { x: 4.8, y: yy, w: 4.5, h: rowH, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 11.5, fontFace: FB });
      return;
    }
    s.addShape("roundRect", { x: 0.7, y: yy + 0.03, w: 4.1, h: rowH - 0.06, rectRadius: 0.05, fill: { color: i % 2 ? C.GREENFILL : "F3E8D6" }, line: { color: C.GREEN, width: 0.5 } });
    s.addShape("roundRect", { x: 4.8, y: yy + 0.03, w: 4.5, h: rowH - 0.06, rectRadius: 0.05, fill: { color: i % 2 ? "F6ECDD" : C.PANEL }, line: { color: C.LINE, width: 0.5 } });
    s.addText(r[0], { x: 0.85, y: yy, w: 3.8, h: rowH, align: "left", valign: "middle", fontSize: 11, bold: true, color: C.INK, fontFace: FB });
    addTextR(s, rich(r[1]), { x: 4.95, y: yy, w: 4.2, h: rowH, align: "left", valign: "middle", fontSize: 11.5, color: C.RED_D, bold: true, fontFace: FS });
  });
  foot(s, 24, TOTAL);
}

/* =====================================================
 *  第 25 页 · 三 · 一一解决 · 对照表（对应原图 28）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  headCenter(s, "三、桃花源写“结果”，大同写“条件”", 0.3, 20);
  s.addText("“乱”从何来？——正是《桃花源记》里人们要逃开的一切。", { x: 0.55, y: 0.98, w: 8.9, h: 0.4, align: "center", fontSize: 14, color: C.INK, bold: true, fontFace: FB });
  const pairs = [
    ["桃花源要避开的（乱世之象）", "大同社会安排的（大道之治）"],
    ["争夺与压迫 · 私天下", "天下为公"],
    ["乱世无道 · 秩序崩坏", "选贤与能"],
    ["人心相防 · 不讲诚信", "讲信修睦"],
    ["老人无依 · 幼童失养", "老有所终，幼有所长"],
    ["弱者无人照料", "矜寡孤独废疾者皆有所养"],
    ["才能被埋没 · 居无定所", "男有分，女有归"],
    ["财货独占 · 人人自利", "货不必藏于己，力不必为己"],
  ];
  const top = 1.46, rowH = 0.405;
  pairs.forEach((p, i) => {
    const yy = top + i * rowH;
    s.addShape("roundRect", { x: 0.7, y: yy, w: 4.6, h: rowH - 0.04, rectRadius: 0.05, fill: { color: i ? C.GREENFILL : C.GREEN_DK }, line: { type: "none" } });
    s.addShape("roundRect", { x: 5.3, y: yy, w: 4.0, h: rowH - 0.04, rectRadius: 0.05, fill: { color: i ? C.PANEL : C.RED_D }, line: { color: C.LINE, width: i ? 0.5 : 0 } });
    s.addText(p[0], { x: 0.85, y: yy, w: 4.3, h: rowH, align: "left", valign: "middle", fontSize: i ? 10.5 : 11, bold: true, color: i ? C.INK : C.WHITE, fontFace: FB });
    addTextR(s, rich(p[1]), { x: 5.45, y: yy, w: 3.7, h: rowH, align: "left", valign: "middle", fontSize: i ? 11.5 : 11, color: i ? C.RED_D : C.WHITE, bold: true, fontFace: FS });
  });
  s.addShape("rect", { x: 0.55, y: 1.0, w: 8.9, h: 0.012, fill: { color: C.GOLD }, line: { type: "none" } });
  addTextR(s, rich("桃花源写的是理想*“长成的样子”*；《大道之行也》写的是理想*“必须具备的骨架”*。"),
    { x: 0.55, y: 4.82, w: 8.9, h: 0.34, align: "center", fontSize: 13, color: C.RED_D, bold: true, fontFace: FS });
  foot(s, 25, TOTAL);
}

/* =====================================================
 *  第 26 页 · 三 · 收束 · 门打开的背后（讲义页转幻灯片）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "三、桃花源写“结果”，大同写“条件”");
  addTextR(s, rich("当社会公平、人人有养、人人有用、彼此有信，坏事就没了滋生的土壤，危险不再时时逼近每一户人家，人与人之间的恐惧随之减少，家门也不必时时紧闭。"),
    { x: 0.8, y: 1.0, w: 8.4, h: 1.1, align: "left", valign: "top", fontSize: 14.5, color: C.INK, bold: true, fontFace: FS, lineSpacingMultiple: 1.6 });
  s.addShape("roundRect", { x: 0.8, y: 2.25, w: 8.4, h: 0.75, rectRadius: 0.1, fill: { color: C.REDFILL }, line: { color: C.RED, width: 1.1 } });
  addTextR(s, rich("*“门打开”的背后，是一个社会把人安顿好了。*"),
    { x: 0.8, y: 2.25, w: 8.4, h: 0.75, align: "center", valign: "middle", fontSize: 20, color: C.RED_D, bold: true, fontFace: FS });
  addTextR(s, rich("对照桃花的“结果”与大同的“条件”：桃花源让我们看见理想社会*已经长成的样子*；《大道之行也》让我们看见理想社会*必须具备的骨架*。"),
    { x: 0.8, y: 3.4, w: 8.4, h: 1.15, align: "left", valign: "top", fontSize: 14.5, color: C.BODY, bold: true, fontFace: FB, lineSpacingMultiple: 1.5 });
  addTextR(s, rich("结果近于“画”，条件近于“法”—— 一个给人希望，一个给人方向。"),
    { x: 0.8, y: 4.75, w: 8.4, h: 0.4, align: "center", fontSize: 12.5, color: C.MUTE, fontFace: FB });
  foot(s, 26, TOTAL);
}

/* =====================================================
 *  第 27 页 · 四 · 一条迷失的路（讲义页转幻灯片）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "四、一条迷失的路，一扇打开的门");
  s.addShape("roundRect", { x: 0.7, y: 1.0, w: 8.6, h: 0.8, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 1 } });
  addTextR(s, rich("*《桃花源记》的入口，是一条奇特的路；它的结局是“遂迷，不复得路”。从中我们感受到的是什么？*"),
    { x: 0.95, y: 1.0, w: 8.1, h: 0.8, align: "center", valign: "middle", fontSize: 14, color: C.INK, bold: true, fontFace: FB, lineSpacingMultiple: 1.15 });
  s.addText([
    run("这条路像梦一样突然出现，也像梦一样后来消失。它让人相信世上也许真的有一个安宁之境，却又告诉人们：那条路，已经迷失了。", { color: C.BODY, fontFace: FB, fontSize: 14, bold: true }),
  ], { x: 0.8, y: 2.15, w: 8.4, h: 1.3, align: "left", valign: "top", fontSize: 14, lineSpacingMultiple: 1.6 });
  s.addShape("roundRect", { x: 2.2, y: 3.75, w: 5.6, h: 0.72, rectRadius: 0.12, fill: { color: C.RED_D }, line: { type: "none" } });
  addTextR(s, rich("*是美好而惆怅的失落感。*"), { x: 2.2, y: 3.75, w: 5.6, h: 0.72, align: "center", valign: "middle", fontSize: 18, color: C.WHITE, bold: true, fontFace: FS });
  s.addText("桃花源的路 —— 不可复得的路，外人不得进的路", { x: 0.8, y: 4.62, w: 8.4, h: 0.4, align: "center", fontSize: 13, color: C.MUTE, fontFace: FB, bold: true });
  foot(s, 27, TOTAL);
}

/* =====================================================
 *  第 28 页 · 四 · 一扇打开的门（讲义页转幻灯片）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "四、一条迷失的路，一扇打开的门");
  s.addShape("roundRect", { x: 0.7, y: 1.0, w: 8.6, h: 0.8, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 1 } });
  addTextR(s, rich("*《大道之行也》的结局，是“故外户而不闭”。从中我们感受到的是什么？*"),
    { x: 0.95, y: 1.0, w: 8.1, h: 0.8, align: "center", valign: "middle", fontSize: 14, color: C.INK, bold: true, fontFace: FB, lineSpacingMultiple: 1.15 });
  s.addShape("roundRect", { x: 2.2, y: 2.05, w: 5.6, h: 0.72, rectRadius: 0.12, fill: { color: C.RED_D }, line: { type: "none" } });
  addTextR(s, rich("*是安心与信任，充满希望。*"), { x: 2.2, y: 2.05, w: 5.6, h: 0.72, align: "center", valign: "middle", fontSize: 18, color: C.WHITE, bold: true, fontFace: FS });
  s.addText([
    run("门，是家与外界的边界。", { color: C.INK, fontFace: FS, fontSize: 15, bold: true }),
    run("普通社会里，人们关门，是因为门外可能有盗窃、争斗、伤害；大同社会里，门还在、边界还在，但人不必时时用紧闭的门来防备别人。", { color: C.BODY, fontFace: FB, fontSize: 13, bold: true }),
  ], { x: 0.8, y: 3.05, w: 8.4, h: 1.35, align: "left", valign: "top", lineSpacingMultiple: 1.5 });
  addTextR(s, rich("《大道之行也》的门 —— 在公共世界里，可以放心打开的门。"), { x: 0.8, y: 4.56, w: 8.4, h: 0.4, align: "center", fontSize: 13.5, color: C.RED_D, bold: true, fontFace: FS });
  foot(s, 28, TOTAL);
}

/* =====================================================
 *  第 29 页 · 四 · 对照：山洞与天下（讲义页转幻灯片）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "四、一条迷失的路，一扇打开的门");
  const rows = [
    ["把理想藏进山洞", "把理想带回天下"],
    ["靠一条隐秘的路抵达", "靠公共原则的运行实现"],
    ["一条不可复得的路", "一扇可以放心打开的门"],
    ["惊鸿一瞥，难以抵达", "大道虽难，却有人不断去行"],
  ];
  const top = 1.1, rowH = 0.78;
  s.addShape("roundRect", { x: 0.6, y: 1.0, w: 4.28, h: 0.42, rectRadius: 0.08, fill: { color: C.RED_D }, line: { type: "none" } });
  s.addShape("roundRect", { x: 5.12, y: 1.0, w: 4.28, h: 0.42, rectRadius: 0.08, fill: { color: C.GREEN_DK }, line: { type: "none" } });
  s.addText("桃 花 源 · 一条路", { x: 0.6, y: 1.0, w: 4.28, h: 0.42, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 13, fontFace: FS });
  s.addText("大 同 社 会 · 一扇门", { x: 5.12, y: 1.0, w: 4.28, h: 0.42, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 13, fontFace: FS });
  rows.forEach((r, i) => {
    const yy = top + 0.62 + i * rowH;
    s.addShape("roundRect", { x: 0.6, y: yy, w: 4.28, h: rowH - 0.12, rectRadius: 0.05, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.5 } });
    s.addShape("roundRect", { x: 5.12, y: yy, w: 4.28, h: rowH - 0.12, rectRadius: 0.05, fill: { color: i === 2 ? C.REDFILL : C.PANEL }, line: { color: i === 2 ? C.RED : C.LINE, width: i === 2 ? 1 : 0.5 } });
    addTextR(s, rich("*" + r[0] + "*"), { x: 0.75, y: yy, w: 4.0, h: rowH - 0.12, align: "left", valign: "middle", fontSize: 13.5, color: C.INK, bold: true, fontFace: FS });
    addTextR(s, rich("*" + r[1] + "*"), { x: 5.27, y: yy, w: 4.0, h: rowH - 0.12, align: "left", valign: "middle", fontSize: 13.5, color: i === 2 ? C.RED_D : C.INK, bold: true, fontFace: FS });
  });
  s.addText("左：把安宁藏起来；右：把安宁做出来、推给所有人。", { x: 0.6, y: 4.95, w: 8.8, h: 0.35, align: "center", fontSize: 13, color: C.RED_D, bold: true, fontFace: FB });
  foot(s, 29, TOTAL);
}

/* =====================================================
 *  第 30 页 · 从《礼记》看：礼 · 秩序与责任（讲义页转幻灯片）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  chap(s, "四、一条迷失的路，一扇打开的门");
  s.addShape("roundRect", { x: 0.6, y: 0.98, w: 8.8, h: 0.46, rectRadius: 0.09, fill: { color: C.ORANGEFILL }, line: { color: C.ORANGE, width: 0.8 } });
  addTextR(s, rich("从《大道之行也》看 —— 《礼记》不只是讲“礼貌”“礼节”的书！"),
    { x: 0.6, y: 0.98, w: 8.8, h: 0.46, align: "center", valign: "middle", fontSize: 13.5, color: C.INK, bold: true, fontFace: FB });
  addTextR(s, rich("它真正关心的是：怎样用“礼”，建立一个*有秩序、有责任、有温情的社会*。"),
    { x: 0.6, y: 1.55, w: 8.8, h: 0.42, align: "center", fontSize: 16, color: C.RED_D, bold: true, fontFace: FS });
  s.addText("“礼”不是表面的仪式，而是一整套社会运行原则。", { x: 0.6, y: 2.0, w: 8.8, h: 0.34, align: "center", fontSize: 12, italic: true, color: C.MUTE, fontFace: FB });
  const kw = [
    { t: "关键词一 · 秩序", body: "乱世之所以乱，是因为争权夺利、治理失序、人心互相防备。儒家希望用“礼”重新建立社会秩序——让人各得其所。" },
    { t: "关键词二 · 责任", body: "儒家不是只让人躲到安静的地方过自己的日子，而是要求人回到“天下”之中，承担对他人、对社会、对公共生活的责任。" },
  ];
  kw.forEach((k, i) => {
    const x = 0.6 + i * 4.6;
    s.addShape("roundRect", { x, y: 2.55, w: 4.2, h: 1.55, rectRadius: 0.07, fill: { color: C.PANEL }, line: { color: C.LINE, width: 0.8 } });
    s.addShape("roundRect", { x, y: 2.55, w: 4.2, h: 0.46, rectRadius: 0.07, fill: { color: i ? C.GREEN_DK : C.RED_D }, line: { type: "none" } });
    s.addText(k.t, { x, y: 2.55, w: 4.2, h: 0.46, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 13.5, fontFace: FS });
    s.addText(k.body, { x: x + 0.22, y: 3.12, w: 4.2 - 0.44, h: 0.95, align: "left", valign: "top", fontSize: 11, color: C.BODY, fontFace: FB, margin: 0, lineSpacingMultiple: 1.3 });
  });
  s.addShape("roundRect", { x: 1.2, y: 4.18, w: 7.6, h: 0.62, rectRadius: 0.1, fill: { color: C.YELL }, line: { color: C.GOLD, width: 1 } });
  addTextR(s, rich("用“*礼*”立秩序，以责任行天下，成就一个*有温度的社会*。"),
    { x: 1.2, y: 4.18, w: 7.6, h: 0.62, align: "center", valign: "middle", fontSize: 18, color: C.INK, bold: true, fontFace: FS });
  foot(s, 30, TOTAL);
}

/* =====================================================
 *  第 31 页 · 结语 · 把愿望带回天下（讲义页转幻灯片）
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  seal(s, 0.6, 0.6, "行");
  s.addShape("roundRect", { x: 1.35, y: 0.75, w: 2.6, h: 0.4, rectRadius: 0.1, fill: { color: C.RED_D }, line: { type: "none" } });
  s.addText("结 语", { x: 1.35, y: 0.75, w: 2.6, h: 0.4, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 13, fontFace: FS });
  addTextR(s, rich("《大道之行也》真正动人的地方，不是它又写了一个桃花源，而是它把桃花源式的愿望，从山洞里带出来，放到“天下”面前重新追问：*如果我们真的向往那样的安宁，就不能只寻找一处可逃避的乐土，而要建设一个值得共同生活的世界。*"),
    { x: 0.8, y: 1.4, w: 8.4, h: 1.6, align: "left", valign: "top", fontSize: 15, color: C.BODY, bold: true, fontFace: FB, lineSpacingMultiple: 1.6 });
  s.addShape("roundRect", { x: 0.8, y: 3.25, w: 8.4, h: 1.05, rectRadius: 0.1, fill: { color: C.REDFILL }, line: { color: C.RED, width: 1.1 } });
  addTextR(s, rich("*桃花源让人怅然，因为路不可复得；《大道之行也》让人振作，因为大道虽难行，却必须有人不断去行。*"),
    { x: 1.0, y: 3.25, w: 8.0, h: 1.05, align: "center", valign: "middle", fontSize: 15, color: C.RED_D, bold: true, fontFace: FS, lineSpacingMultiple: 1.2 });
  addTextR(s, rich("*大同不是桃花源的复制，而是桃花源愿望的公共化、现实化和天下化。*"),
    { x: 0.8, y: 4.44, w: 8.4, h: 0.5, align: "center", fontSize: 16, color: C.INK, bold: true, fontFace: FS });
  foot(s, 31, TOTAL);
}

/* =====================================================
 *  第 32 页 · 配套练习（一）· 名句默写与运用
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  s.addText("配套练习（一）· 用课文原句作答", { x: 0.5, y: 0.42, w: 9, h: 0.5, align: "left", bold: true, fontSize: 20, color: C.RED_HEAD, fontFace: FS });
  s.addShape("rect", { x: 0.52, y: 0.95, w: 1.7, h: 0.014, fill: { color: C.GOLD }, line: { type: "none" } });
  const qs = [
    ["1.", "孟子说“老吾老以及人之老，幼吾幼以及人之幼”，《大道之行也》中与之含义相近的句子是：＿＿＿＿＿＿。"],
    ["2.", "对“大同”社会作纲领性说明的句子是：＿＿＿＿＿＿。"],
    ["3.", "希望人人都能安居乐业的句子是：＿＿＿＿＿＿。"],
    ["4.", "描绘大同社会太平景象（外户不闭）的句子是：＿＿＿＿＿＿。"],
    ["5.", "《桃花源记》中“黄发垂髫，并怡然自乐”所对应的大同景象是：＿＿＿＿＿＿。"],
  ];
  let yy = 1.3;
  qs.forEach(q => {
    s.addText(q[0], { x: 0.8, y: yy, w: 0.55, h: 0.42, align: "left", color: C.RED_D, bold: true, fontSize: 14, fontFace: FS });
    s.addText(q[1], { x: 1.45, y: yy, w: 8.0, h: 0.42, align: "left", fontSize: 12.5, color: C.BODY, fontFace: FB, bold: true, margin: 0 });
    yy += 0.62;
  });
  s.addShape("roundRect", { x: 0.7, y: 4.5, w: 8.6, h: 0.5, rectRadius: 0.09, fill: { color: C.ORANGEFILL }, line: { color: C.ORANGE, width: 0.6 } });
  s.addText("答案见本页备注 —— 先默写，再对照订正。", { x: 0.7, y: 4.5, w: 8.6, h: 0.5, align: "center", valign: "middle", fontSize: 11.5, color: C.INK, bold: true, fontFace: FB });
  s.addNotes("1.故人不独亲其亲，不独子其子。 2.大道之行也，天下为公，选贤与能，讲信修睦。 3.男有分，女有归。 4.是故谋闭而不兴，盗窃乱贼而不作，故外户而不闭。 5.老有所终，幼有所长。");
  foot(s, 32, TOTAL);
}

/* =====================================================
 *  第 33 页 · 配套练习（二）· 理解与表达
 * ===================================================== */
{
  const s = pptx.addSlide();
  s.background = { color: C.BG };
  hills(s); peach(s);
  s.addText("配套练习（二）· 比较阅读与思考", { x: 0.5, y: 0.42, w: 9, h: 0.5, align: "left", bold: true, fontSize: 20, color: C.RED_HEAD, fontFace: FS });
  s.addShape("rect", { x: 0.52, y: 0.95, w: 1.7, h: 0.014, fill: { color: C.GOLD }, line: { type: "none" } });
  const qs = [
    ["1.", "桃花源与大同社会“最相像”的地方是什么？（提示：不只是风景）"],
    ["2.", "桃花源的安宁来自“避”，大同的安宁来自“行”——请结合原文说说二者的不同。"],
    ["3.", "孟子有言“老吾老以及人之老”，这与“不独亲其亲，不独子其子”相通。现实生活中我们能为“老有所终、幼有所长”做什么？"],
    ["4.", "小写作：模仿课文句式，写一句属于今天的“大道”，如“使＿＿者有所＿＿”。"],
  ];
  let yy = 1.25;
  qs.forEach(q => {
    s.addShape("ellipse", { x: 0.8, y: yy + 0.06, w: 0.28, h: 0.28, fill: { color: C.RED }, line: { type: "none" } });
    s.addText(q[0], { x: 0.8, y: yy, w: 0.7, h: 0.4, align: "center", valign: "middle", color: C.WHITE, bold: true, fontSize: 13, fontFace: FS });
    s.addText(q[1], { x: 1.55, y: yy, w: 7.9, h: 0.75, align: "left", fontSize: 12.5, color: C.BODY, fontFace: FB, bold: true, margin: 0, lineSpacingMultiple: 1.25 });
    yy += 0.85;
  });
  s.addShape("roundRect", { x: 0.7, y: 4.85, w: 8.6, h: 0.45, rectRadius: 0.09, fill: { color: C.REDFILL }, line: { color: C.RED, width: 0.7 } });
  addTextR(s, rich("落点：桃花源把理想藏进山洞，大同要把理想带回天下——那我们，准备给谁“打开门”？"),
    { x: 0.7, y: 4.85, w: 8.6, h: 0.45, align: "center", valign: "middle", fontSize: 11.5, color: C.RED_D, bold: true, fontFace: FB });
  foot(s, 33, TOTAL);
}

pptx.writeFile({ fileName: "/Users/apple/Desktop/《大道之行也》教学课件.pptx" })
  .then(f => console.log("已生成:", f))
  .catch(e => { console.error("生成失败:", e); process.exit(1); });
