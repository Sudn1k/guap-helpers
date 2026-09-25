/* Выбор себя из списка группы */
DCLite.define("Auth-PickSelf", (function () {
class Component extends DCLogic {
renderVals() {
const all = [
{ id: 1, name: 'Белов Артём Игоревич', taken: true },
{ id: 2, name: 'Волкова Анна Сергеевна', taken: false },
{ id: 3, name: 'Гришин Максим Олегович', taken: false },
{ id: 4, name: 'Егорова Дарья Андреевна', taken: true },
{ id: 5, name: 'Жуков Никита Павлович', taken: false },
{ id: 6, name: 'Ковалёва Мария Дмитриевна', taken: true },
{ id: 7, name: 'Лебедев Кирилл Андреевич', taken: false },
{ id: 8, name: 'Морозова Полина Викторовна', taken: false },
{ id: 9, name: 'Петров Иван Алексеевич', taken: true },
{ id: 10, name: 'Сидорова Ольга Романовна', taken: true },
{ id: 11, name: 'Тихонов Егор Сергеевич', taken: false },
{ id: 12, name: 'Фёдорова Алина Максимовна', taken: false }
];
const st = this.state || {};
const q = st.q !== undefined ? st.q : '';
const selected = st.selected !== undefined ? st.selected : 2;
const needle = q.trim().toLowerCase();
const filtered = all.filter((p) => !needle || p.name.toLowerCase().indexOf(needle) !== -1);
const people = filtered.map((p) => {
const parts = p.name.split(' ');
return {
name: p.name,
initials: (parts[0][0] || '') + (parts[1] ? parts[1][0] : ''),
isTaken: p.taken,
isSelected: !p.taken && p.id === selected,
isFree: !p.taken && p.id !== selected,
pick: () => this.setState({ selected: p.id === selected ? null : p.id })
};
});
const sel = all.find((p) => p.id === selected);
let selectedShort = '';
if (sel) {
const parts = sel.name.split(' ');
selectedShort = parts[0] + ' ' + parts[1][0] + '.' + (parts[2] ? ' ' + parts[2][0] + '.' : '');
}
return {
q: q,
onSearch: (e) => this.setState({ q: e.target.value }),
people: people,
isEmpty: people.length === 0,
countLabel: needle ? 'Найдено: ' + people.length : 'В группе ' + all.length + ' человек',
hasSelection: !!sel,
noSelection: !sel,
selectedShort: selectedShort
};
}
}
return Component;
})());
