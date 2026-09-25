/* Расписание */
DCLite.define("Schedule", (function () {
class Component extends DCLogic {
renderVals() {
const TIMES = { 1: ['09:30', '11:00'], 2: ['11:10', '12:40'], 3: ['13:00', '14:30'], 4: ['15:00', '16:30'], 5: ['16:40', '18:10'] };
const BM = 'Б. Морская, 67', GS = 'Гастелло, 15', LS = 'Ленсовета, 14';
const L = (n, subj, type, teacher, room, bld, w) => ({ n, subj, type, teacher, room: room === 'спортзал' ? room : 'ауд. ' + room, bld, w: w || 'both' });
const DATA = [
[L(2, 'Теория вероятностей', 'Л', 'Кузнецов В. П.', '23-10', BM), L(3, 'Теория вероятностей', 'ПР', 'Кузнецов В. П.', '23-10', BM, 'up'), L(4, 'Иностранный язык', 'ПР', 'Белова Н. С.', '32-08', LS, 'down')],
[L(1, 'Web-программирование', 'Л', 'Андреев П. Н.', '52-14', BM), L(2, 'Web-программирование', 'ЛР', 'Андреев П. Н.', '52-14', BM, 'up'), L(3, 'Философия', 'ПР', 'Орлов Д. А.', '13-02', GS, 'down')],
[L(2, 'Базы данных', 'ЛР', 'Смирнова Е. В.', '52-18', BM, 'up'), L(2, 'Базы данных', 'Л', 'Смирнова Е. В.', '22-12', BM, 'down'), L(3, 'Философия', 'Л', 'Орлов Д. А.', '13-02', GS), L(4, 'Иностранный язык', 'ПР', 'Белова Н. С.', '32-08', LS, 'up')],
[L(1, 'Теория вероятностей', 'Л', 'Кузнецов В. П.', '23-10', BM), L(2, 'Теория вероятностей', 'ПР', 'Кузнецов В. П.', '23-10', BM, 'up'), L(2, 'Операционные системы', 'Л', 'Зайцев М. Ю.', '14-05', GS, 'down'), L(3, 'Web-программирование', 'ЛР', 'Андреев П. Н.', '52-14', BM, 'up')],
[L(2, 'Операционные системы', 'ЛР', 'Зайцев М. Ю.', '14-05', GS, 'up'), L(3, 'Базы данных', 'Л', 'Смирнова Е. В.', '22-12', BM), L(4, 'Операционные системы', 'Л', 'Зайцев М. Ю.', '14-05', GS, 'down')],
[L(2, 'Физическая культура', 'ПР', 'Громов С. А.', 'спортзал', LS, 'down')]
];
const SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const TYPE = { 'Л': ['#EAF2FB', '#005AAA'], 'ПР': ['#F6EAF3', '#8C2D73'], 'ЛР': ['#E3F5FC', '#005F7F'] };
const st = this.state || {};
const view = st.view || (this.props.view === 'неделя' ? 'week' : 'day');
const week = st.week || (this.props.week === 'нижняя' ? 'down' : 'up');
const startIdx = Math.max(0, SHORT.indexOf(this.props.startDay || 'Ср'));
const day = st.day !== undefined ? st.day : startIdx;
const offline = this.props.offline ?? false;
const isCurrent = week === 'up';
const base = isCurrent ? 21 : 28;
const dateOf = (i) => {
const d = base + i;
return d <= 30 ? { num: d, label: d + ' сентября', short: d + ' сен' } : { num: d - 30, label: (d - 30) + ' октября', short: (d - 30) + ' окт' };
};
const lessonsFor = (i) => DATA[i].filter((l) => l.w === 'both' || l.w === week).sort((a, b) => a.n - b.n);
const TODAY = 2;
const decorate = (l, i, idx) => {
const now = isCurrent && i === TODAY && l.n === 2;
const t = TYPE[l.type];
return {
n: l.n, subj: l.subj, type: l.type, teacher: l.teacher, room: l.room, bld: l.bld,
start: TIMES[l.n][0], end: TIMES[l.n][1],
isNow: now,
onlyThisWeek: l.w !== 'both',
weekMark: l.w === 'up' ? '▲ только по верхней' : '▼ только по нижней',
cardBg: now ? '#F2F7FD' : '#ffffff',
cardBorder: now ? '1px solid #CFE0F3' : '1px solid transparent',
cardShadow: now ? 'none' : '0 1px 2px rgba(0, 40, 90, 0.06), 0 4px 14px rgba(0, 40, 90, 0.06)',
divider: now ? '#CFE0F3' : '#E3E8EF',
timeColor: now ? '#005AAA' : '#2B2F36',
rowBg: now ? '#F2F7FD' : '#ffffff',
rowBorder: idx === 0 ? 'none' : '1px solid #EEF1F5',
typeBg: t[0], typeColor: t[1]
};
};
const plural = (n) => n === 1 ? 'пара' : (n >= 2 && n <= 4 ? 'пары' : 'пар');
const days = SHORT.map((s, i) => {
const sel = i === day;
const today = isCurrent && i === TODAY;
const has = lessonsFor(i).length > 0;
return {
short: s, num: dateOf(i).num, full: FULL[i] + ', ' + dateOf(i).label,
selected: sel,
bg: sel ? '#005AAA' : '#ffffff',
color: sel ? '#ffffff' : (today ? '#005AAA' : '#2B2F36'),
border: sel ? '1.5px solid #005AAA' : (today ? '1.5px solid #9CC0E6' : '1.5px solid #E3E8EF'),
dot: has ? (sel ? '#ffffff' : '#00B8EE') : 'transparent',
pick: () => this.setState({ day: i })
};
});
const dl = lessonsFor(day).map((l, idx) => decorate(l, day, idx));
const weekDays = SHORT.map((s, i) => {
const ls = lessonsFor(i).map((l, idx) => decorate(l, i, idx));
return { full: FULL[i], date: dateOf(i).short, isToday: isCurrent && i === TODAY, lessons: ls, hasLessons: ls.length > 0, isEmpty: ls.length === 0 };
});
const segOn = { bg: '#ffffff', color: '#005AAA', shadow: '0 1px 3px rgba(0, 40, 90, 0.12)' };
const segOff = { bg: 'transparent', color: '#4A515C', shadow: 'none' };
const dv = view === 'day' ? segOn : segOff;
const wv = view === 'week' ? segOn : segOff;
return {
screenHeight: this.props.screenHeight ?? 844,
offline: offline, online: !offline,
isDay: view === 'day', isWeek: view === 'week',
showDay: () => this.setState({ view: 'day' }), showWeek: () => this.setState({ view: 'week' }),
dayTabBg: dv.bg, dayTabColor: dv.color, dayTabShadow: dv.shadow,
weekTabBg: wv.bg, weekTabColor: wv.color, weekTabShadow: wv.shadow,
isUp: week === 'up', isDown: week === 'down',
pickUp: () => this.setState({ week: 'up' }), pickDown: () => this.setState({ week: 'down' }),
upBg: week === 'up' ? '#005AAA' : 'transparent', upColor: week === 'up' ? '#ffffff' : '#4A515C',
downBg: week === 'down' ? '#AB3A8D' : 'transparent', downColor: week === 'down' ? '#ffffff' : '#4A515C',
rangeLabel: isCurrent ? '21–26 сентября' : '28 сентября – 3 октября',
rangeNote: isCurrent ? 'текущая неделя' : 'следующая неделя',
days: days,
dayTitle: (isCurrent && day === TODAY ? 'Сегодня, ' : FULL[day] + ', ') + dateOf(day).label,
dayCount: dl.length ? dl.length + ' ' + plural(dl.length) : '',
dayLessons: dl, dayEmpty: dl.length === 0,
weekDays: weekDays
};
}
}
return Component;
})());
