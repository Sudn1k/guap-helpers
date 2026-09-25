/* Преподаватели */
DCLite.define("Teachers", (function () {
class Component extends DCLogic {
renderVals() {
const T = [
{ name: 'Андреев Павел Николаевич', aka: 'Андреев П. Н., Андреев П.', subjects: ['Web-программирование'], diff: 1 },
{ name: 'Белова Наталья Сергеевна', aka: 'Белова Н. С., Belova N.', subjects: ['Иностранный язык'], diff: 1 },
{ name: 'Громов Сергей Андреевич', aka: 'Громов С. А.', subjects: ['Физическая культура'], diff: 1 },
{ name: 'Зайцев Михаил Юрьевич', aka: 'Зайцев М. Ю., Заицев М.', subjects: ['Операционные системы'], diff: 3 },
{ name: 'Кузнецов Виктор Петрович', aka: 'Кузнецов В. П., Кузнецов В.', subjects: ['Теория вероятностей', 'Мат. статистика'], diff: 3 },
{ name: 'Орлов Дмитрий Алексеевич', aka: 'Орлов Д. А.', subjects: ['Философия'], diff: 2 },
{ name: 'Смирнова Елена Викторовна', aka: 'Смирнова Е. В., Смирнова-Лебедева Е. В.', subjects: ['Базы данных', 'Информатика'], diff: 2 }
];
const D = { 1: ['легко', '#E8F5EE', '#235937', '#009A49'], 2: ['средне', '#FFF1E8', '#9C3022', '#FF6418'], 3: ['сложно', '#FDEBEF', '#8B2346', '#E70F47'] };
const st = this.state || {};
const q = st.q !== undefined ? st.q : (this.props.query || '');
const sort = st.sort || (this.props.sort === 'сложность' ? 'diff' : 'name');
const n = q.trim().toLowerCase();
let list = T.filter((t) => !n || (t.name + ' ' + t.aka + ' ' + t.subjects.join(' ')).toLowerCase().indexOf(n) !== -1);
list = list.slice().sort((a, b) => sort === 'diff' ? (b.diff - a.diff) || a.name.localeCompare(b.name, 'ru') : a.name.localeCompare(b.name, 'ru'));
const items = list.map((t) => {
const d = D[t.diff];
const p = t.name.split(' ');
return { name: t.name, aka: t.aka, subjects: t.subjects.join(' · '), initials: p[0][0] + p[1][0], diff: d[0], badgeBg: d[1], badgeColor: d[2], badgeDot: d[3] };
});
const on = { bg: '#ffffff', color: '#005AAA', shadow: '0 1px 3px rgba(0, 40, 90, 0.12)' };
const off = { bg: 'transparent', color: '#4A515C', shadow: 'none' };
const a = sort === 'name' ? on : off, b = sort === 'diff' ? on : off;
const word = (k) => (k % 10 === 1 && k % 100 !== 11) ? 'преподаватель' : ((k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14)) ? 'преподавателя' : 'преподавателей');
return {
screenHeight: this.props.screenHeight ?? 844,
q: q, hasQuery: q.length > 0,
onSearch: (e) => this.setState({ q: e.target.value }),
clearSearch: () => this.setState({ q: '' }),
byName: sort === 'name', byDiff: sort === 'diff',
sortName: () => this.setState({ sort: 'name' }), sortDiff: () => this.setState({ sort: 'diff' }),
nameBg: a.bg, nameColor: a.color, nameShadow: a.shadow, diffBg: b.bg, diffColor: b.color, diffShadow: b.shadow,
countLabel: n ? 'Найдено: ' + items.length : items.length + ' ' + word(items.length),
list: items, isEmpty: items.length === 0
};
}
}
return Component;
})());
