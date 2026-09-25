/* Бесплатные курсы */
DCLite.define("Courses", (function () {
class Component extends DCLogic {
renderVals() {
const C = [
{ title: 'Основы Python', platform: 'Stepik', logo: 'S', dir: 'Программирование', level: 'Начальный', lang: 'Русский', length: '≈ 20 ч', why: 'Короткие уроки с задачами прямо в браузере — хороший старт перед лабораторными.' },
{ title: 'Алгоритмы и структуры данных', platform: 'Stepik', logo: 'S', dir: 'Алгоритмы', level: 'Средний', lang: 'Русский', length: '≈ 40 ч', why: 'Разбирает ровно то, что спрашивают на собеседованиях на стажировку.' },
{ title: 'Введение в машинное обучение', platform: 'Coursera', logo: 'C', dir: 'ML', level: 'Средний', lang: 'Английский', length: '≈ 30 ч', why: 'Даёт интуицию без тяжёлой математики. Бесплатно в режиме аудита.' },
{ title: 'SQL для начинающих', platform: 'Stepik', logo: 'S', dir: 'Базы данных', level: 'Начальный', lang: 'Русский', length: '≈ 12 ч', why: 'Пригодится к курсовой по БД: запросы на реальных данных с автопроверкой.' },
{ title: 'Introduction to Computer Science', platform: 'edX', logo: 'e', dir: 'Программирование', level: 'Начальный', lang: 'Английский', length: '≈ 60 ч', why: 'Одно из лучших введений в CS, есть субтитры на русском.' },
{ title: 'Git и GitHub с нуля', platform: 'YouTube', logo: '▶', dir: 'Инструменты', level: 'Начальный', lang: 'Русский', length: '≈ 3 ч', why: 'За вечер научит работать с репозиторием — Андреев принимает работы только так.' },
{ title: 'Linux для разработчика', platform: 'Stepik', logo: 'S', dir: 'ОС и Linux', level: 'Средний', lang: 'Русский', length: '≈ 15 ч', why: 'Командная строка, процессы и права — прямо помогает с лабами по ОС.' }
];
const LOGO = { 'Stepik': ['#EAF2FB', '#005AAA'], 'Coursera': ['#F6EAF3', '#8C2D73'], 'edX': ['#E3F5FC', '#005F7F'], 'YouTube': ['#FDEBEF', '#8B2346'] };
const DIRS = ['Все', 'Программирование', 'Алгоритмы', 'ML', 'Базы данных', 'ОС и Linux', 'Инструменты'];
const LEVELS = ['Любой', 'Начальный', 'Средний', 'Продвинутый'];
const LANGS = ['Любой', 'Русский', 'Английский'];
const st = this.state || {};
const dir = st.dir || this.props.direction || 'Все';
const level = st.level || this.props.level || 'Любой';
const lang = st.lang || this.props.language || 'Любой';
const sheet = st.sheet !== undefined ? st.sheet : (this.props.sheet ?? false);
const match = (c, d, l, g) => (d === 'Все' || c.dir === d) && (l === 'Любой' || c.level === l) && (g === 'Любой' || c.lang === g);
const list = C.filter((c) => match(c, dir, level, lang));
const chip = (on) => ({ bg: on ? '#005AAA' : '#ffffff', color: on ? '#ffffff' : '#2B2F36', border: on ? '1px solid #005AAA' : '1px solid #C9D5E3' });
const dirs = DIRS.map((d) => Object.assign({ label: d === 'Все' ? 'Все направления' : d, on: d === dir, pick: () => this.setState({ dir: d }) }, chip(d === dir)));
const levels = LEVELS.map((l) => Object.assign({ label: l, on: l === level, pick: () => this.setState({ level: l }) }, chip(l === level)));
const langs = LANGS.map((g) => Object.assign({ label: g, on: g === lang, pick: () => this.setState({ lang: g }) }, chip(g === lang)));
const extraCount = (level !== 'Любой' ? 1 : 0) + (lang !== 'Любой' ? 1 : 0);
const parts = [];
if (level !== 'Любой') parts.push(level + ' уровень');
if (lang !== 'Любой') parts.push(lang === 'Русский' ? 'на русском' : 'на английском');
const n = list.length;
const word = (k) => (k % 10 === 1 && k % 100 !== 11) ? 'курс' : ((k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14)) ? 'курса' : 'курсов');
const courses = list.map((c) => {
const lv = LEVELS.indexOf(c.level);
return Object.assign({}, c, {
logoBg: LOGO[c.platform][0], logoColor: LOGO[c.platform][1],
lang: c.lang === 'Русский' ? 'RU · на русском' : 'EN · на английском',
bar2: lv >= 2 ? '#005AAA' : '#B9D0EA', bar3: lv >= 3 ? '#005AAA' : '#B9D0EA'
});
});
return {
screenHeight: this.props.screenHeight ?? 844,
dirs: dirs, levels: levels, langs: langs,
hasExtra: extraCount > 0, extraCount: extraCount,
extraLabel: parts.join(' · '),
filterBtnBg: extraCount ? '#005AAA' : '#ffffff', filterBtnColor: extraCount ? '#ffffff' : '#2B2F36',
filterBtnBorder: extraCount ? '1px solid #005AAA' : '1px solid #C9D5E3',
resetExtra: () => this.setState({ level: 'Любой', lang: 'Любой' }),
resetAll: () => this.setState({ level: 'Любой', lang: 'Любой', dir: 'Все' }),
countLabel: n ? n + ' ' + word(n) : '',
courses: courses, isEmpty: n === 0,
sheetOpen: !!sheet,
openSheet: () => this.setState({ sheet: true }), closeSheet: () => this.setState({ sheet: false }),
showOff: n === 0,
showBg: n === 0 ? '#E3E8EF' : '#005AAA', showColor: n === 0 ? '#7A8391' : '#ffffff',
showLabel: n === 0 ? 'Нет подходящих курсов' : 'Показать ' + n + ' ' + word(n)
};
}
}
return Component;
})());
