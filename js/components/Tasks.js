/* Задания */
DCLite.define("Tasks", (function () {
class Component extends DCLogic {
renderVals() {
const SUBJ = ['Базы данных', 'Теория вероятностей', 'Философия', 'Web-программирование', 'Операционные системы', 'Иностранный язык'];
const SHORTS = { 'Базы данных': 'Базы данных', 'Теория вероятностей': 'ТВиМС', 'Философия': 'Философия', 'Web-программирование': 'Web', 'Операционные системы': 'ОС', 'Иностранный язык': 'Ин. язык' };
const ALL = [
{ id: 1, subj: 'Базы данных', title: 'Лабораторная №2: нормализация', g: 'today', pill: 'Сегодня, 23:59', urg: 'red', file: true },
{ id: 2, subj: 'Теория вероятностей', title: 'ДЗ 3: задачи 1–12', g: 'tomorrow', pill: 'Завтра, 09:30', urg: 'orange', file: true },
{ id: 3, subj: 'Философия', title: 'Эссе к семинару', g: 'week', pill: 'пт, 25 сен', link: true },
{ id: 4, subj: 'Web-программирование', title: 'Вёрстка лендинга', g: 'later', pill: 'пн, 28 сен', link: true, done: true },
{ id: 5, subj: 'Операционные системы', title: 'Лабораторная №1: процессы и потоки', g: 'later', pill: 'ср, 30 сен', link: true },
{ id: 6, subj: 'Иностранный язык', title: 'Эссе «My future profession»', g: 'later', pill: 'чт, 1 окт' },
{ id: 7, subj: 'Базы данных', title: 'Тест по главе 2', g: 'later', pill: 'пн, 5 окт', link: true }
];
const ARCH = [
{ id: 11, subj: 'Теория вероятностей', title: 'ДЗ 2: комбинаторика', g: 'sep', pill: '17 сен', done: true, file: true },
{ id: 12, subj: 'Web-программирование', title: 'Лабораторная №1: HTML-разметка', g: 'sep', pill: '16 сен', done: true, link: true },
{ id: 13, subj: 'Философия', title: 'Конспект первой лекции', g: 'sep', pill: 'Не сдано', missed: true },
{ id: 14, subj: 'Базы данных', title: 'Лабораторная №1: ER-диаграмма', g: 'sep', pill: '10 сен', done: true, file: true }
];
const st = this.state || {};
const tab = st.tab || (this.props.tab === 'архив' ? 'archive' : 'active');
const subject = st.subject || this.props.subject || 'Все';
const mode = this.props.state || 'данные';
const doneMap = st.doneMap || {};
const isDone = (t) => doneMap[t.id] !== undefined ? doneMap[t.id] : !!t.done;
const src = mode === 'данные' ? (tab === 'archive' ? ARCH : ALL) : [];
const list = src.filter((t) => subject === 'Все' || t.subj === subject);
const GROUPS = tab === 'archive'
? [['sep', 'Сентябрь', '']]
: [['today', 'Сегодня', 'ср, 23 сентября'], ['tomorrow', 'Завтра', 'чт, 24 сентября'], ['week', 'На этой неделе', 'до 27 сентября'], ['later', 'Позже', '']];
const pillStyle = (t, done) => {
if (t.missed) return ['#FDEBEF', '#8B2346'];
if (done && tab === 'archive') return ['#E8F5EE', '#235937'];
if (done) return ['#F4F7FB', '#5E6673'];
if (t.urg === 'red') return ['#FDEBEF', '#8B2346'];
if (t.urg === 'orange') return ['#FFF1E8', '#9C3022'];
return ['#F4F7FB', '#4A515C'];
};
const groups = GROUPS.map(([key, title, note]) => {
const items = list.filter((t) => t.g === key).map((t, idx) => {
const done = isDone(t);
const ps = pillStyle(t, done);
return {
subj: SHORTS[t.subj] === t.subj ? t.subj : t.subj,
title: t.title,
pill: tab === 'archive' && done ? 'Выполнено · ' + t.pill : t.pill,
pillBg: ps[0], pillColor: ps[1],
done: done,
canCheck: !t.missed,
isMissed: !!t.missed,
checkLabel: done ? 'Снять отметку «выполнено»' : 'Отметить выполненным',
checkBorder: done ? 'none' : '2px solid #8792A2',
checkBg: done ? '#009A49' : 'transparent',
titleWeight: done ? '300' : '400',
titleColor: done ? '#5E6673' : '#2B2F36',
titleDeco: done ? 'line-through' : 'none',
hasFile: !!t.file, hasLink: !!t.link,
rowBorder: idx === 0 ? 'none' : '1px solid #EEF1F5',
toggle: () => this.setState({ doneMap: Object.assign({}, doneMap, { [t.id]: !done }) })
};
});
return { title: title, note: items.length ? note : '', items: items };
}).filter((g) => g.items.length > 0);
const openCount = mode === 'данные' ? ALL.filter((t) => !isDone(t)).length : 0;
const chips = ['Все'].concat(SUBJ).map((s) => {
const on = s === subject;
return {
label: s === 'Все' ? 'Все предметы' : s,
on: on,
bg: on ? '#005AAA' : '#ffffff',
color: on ? '#ffffff' : '#2B2F36',
border: on ? '1px solid #005AAA' : '1px solid #C9D5E3',
pick: () => this.setState({ subject: s })
};
});
const on = { bg: '#ffffff', color: '#005AAA', shadow: '0 1px 3px rgba(0, 40, 90, 0.12)' };
const off = { bg: 'transparent', color: '#4A515C', shadow: 'none' };
const a = tab === 'active' ? on : off;
const r = tab === 'archive' ? on : off;
return {
screenHeight: this.props.screenHeight ?? 844,
isActive: tab === 'active', isArchive: tab === 'archive',
showActive: () => this.setState({ tab: 'active' }), showArchive: () => this.setState({ tab: 'archive' }),
activeTabBg: a.bg, activeTabColor: a.color, activeTabShadow: a.shadow,
archiveTabBg: r.bg, archiveTabColor: r.color, archiveTabShadow: r.shadow,
activeCountBg: tab === 'active' ? '#005AAA' : '#DCE3EC',
activeCountColor: tab === 'active' ? '#ffffff' : '#4A515C',
openCount: openCount,
chips: chips,
loading: mode === 'загрузка',
groups: groups,
filteredEmpty: mode === 'данные' && groups.length === 0 && subject !== 'Все',
allEmpty: mode === 'пусто' || (mode === 'данные' && groups.length === 0 && subject === 'Все'),
subjectLabel: subject,
resetFilter: () => this.setState({ subject: 'Все' }),
showArchiveNote: tab === 'archive' && mode === 'данные' && groups.length > 0
};
}
}
return Component;
})());
