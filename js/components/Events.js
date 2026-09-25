/* IT-мероприятия */
DCLite.define("Events", (function () {
class Component extends DCLogic {
renderVals() {
const COVERS = [
{ bg: '#005AAA', c1: '#00B8EE', c2: '#AB3A8D', p1: 'M-20 140 C 80 110, 200 50, 350 30', p2: 'M40 190 C 120 110, 220 50, 300 -20', p3: 'M-10 60 C 90 70, 200 120, 340 150', lc: '#ffffff' },
{ bg: '#EAF2FB', c1: '#005AAA', c2: '#00B8EE', p1: 'M-20 40 C 100 60, 220 140, 350 130', p2: 'M-20 150 C 100 130, 200 80, 350 90', p3: 'M200 -10 C 230 60, 250 120, 240 190', lc: '#005AAA' },
{ bg: '#AB3A8D', c1: '#005AAA', c2: '#E72B70', p1: 'M-20 160 C 90 130, 180 40, 350 20', p2: 'M-20 90 C 90 110, 220 100, 350 60', p3: 'M100 -10 C 130 70, 180 130, 260 190', lc: '#ffffff' },
{ bg: '#E3F5FC', c1: '#005AAA', c2: '#AB3A8D', p1: 'M-20 100 C 60 40, 200 40, 350 110', p2: 'M60 190 C 110 120, 200 90, 350 100', p3: 'M-20 30 C 100 50, 220 30, 350 10', lc: '#005AAA' }
];
const ALL = [
{ id: 1, title: 'Хакатон «Цифровой кампус»', date: 'Сб–вс, 3–4 октября · 10:00', place: 'Б. Морская, 67 · ауд. 22-12', format: 'очно', tags: ['хакатон', 'web'], cover: 0, isNew: true },
{ id: 2, title: 'Митап: как попасть на стажировку в ML', date: 'Ср, 7 октября · 19:00', place: 'Онлайн-трансляция', format: 'онлайн', tags: ['митап', 'ML', 'карьера'], cover: 1, isNew: true },
{ id: 3, title: 'Открытая лекция: как устроены языковые модели', date: 'Сб, 10 октября · 18:30', place: 'Гастелло, 15 · ауд. 13-01', format: 'очно', tags: ['лекция', 'ML'], cover: 2 },
{ id: 4, title: 'Конференция фронтенд-разработчиков', date: 'Сб, 24 октября · 11:00', place: 'Онлайн-трансляция', format: 'онлайн', tags: ['web', 'карьера'], cover: 3 }
];
const PAST = [
{ id: 11, title: 'Олимпиада по спортивному программированию', date: 'Сб, 19 сентября', place: 'Б. Морская, 67', format: 'очно', tags: ['олимпиада'], cover: 2 },
{ id: 12, title: 'Воркшоп: Git для командной работы', date: 'Ср, 16 сентября', place: 'Онлайн', format: 'онлайн', tags: ['web', 'лекция'], cover: 1 }
];
const CHIPS = ['Все', 'очно', 'онлайн', 'хакатон', 'митап', 'лекция', 'ML', 'web', 'карьера', 'олимпиада'];
const st = this.state || {};
const tab = st.tab || (this.props.tab === 'прошедшие' ? 'past' : 'up');
const tag = st.tag || this.props.tag || 'Все';
const src = tab === 'past' ? PAST : ALL;
const match = (e) => tag === 'Все' || e.format === tag || e.tags.indexOf(tag) !== -1;
const events = src.filter(match).map((e) => {
const c = COVERS[e.cover];
const past = tab === 'past';
return {
title: e.title, date: past ? e.date + ' · прошло' : e.date, place: e.place, format: e.format, tags: e.tags,
isNew: !!e.isNew && !past,
labelColor: c.lc, bg: c.bg, c1: c.c1, c2: c.c2, p1: c.p1, p2: c.p2, p3: c.p3,
coverOpacity: past ? '0.55' : '1',
formatColor: e.format === 'онлайн' ? '#005F7F' : '#005AAA',
formatDot: e.format === 'онлайн' ? '#00B8EE' : '#005AAA',
dateColor: past ? '#5E6673' : '#005AAA',
titleColor: past ? '#4A515C' : '#2B2F36'
};
});
const chips = CHIPS.map((c) => {
const on = c === tag;
return {
label: c === 'Все' ? 'Все' : (c === 'очно' || c === 'онлайн' ? c : '#' + c),
on: on,
bg: on ? '#005AAA' : '#ffffff', color: on ? '#ffffff' : '#2B2F36',
border: on ? '1px solid #005AAA' : '1px solid #C9D5E3',
pick: () => this.setState({ tag: c })
};
});
const on = { bg: '#ffffff', color: '#005AAA', shadow: '0 1px 3px rgba(0, 40, 90, 0.12)' };
const off = { bg: 'transparent', color: '#4A515C', shadow: 'none' };
const u = tab === 'up' ? on : off, p = tab === 'past' ? on : off;
return {
screenHeight: this.props.screenHeight ?? 844,
isUp: tab === 'up', isPast: tab === 'past',
showUp: () => this.setState({ tab: 'up' }), showPast: () => this.setState({ tab: 'past' }),
upBg: u.bg, upColor: u.color, upShadow: u.shadow, pastBg: p.bg, pastColor: p.color, pastShadow: p.shadow,
chips: chips, events: events,
isEmpty: events.length === 0, tagLabel: tag,
resetTag: () => this.setState({ tag: 'Все' })
};
}
}
return Component;
})());
