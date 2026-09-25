/* Профиль */
DCLite.define("Profile", (function () {
class Component extends DCLogic {
renderVals() {
const st = this.state || {};
const push = st.push || this.props.push || 'включены';
const dialog = st.dialog !== undefined ? st.dialog : (this.props.dialog || 'нет');
const gender = st.gender || 'female';
const DEF = { sched: true, hw: true, due: true, topics: true, topicDue: true, bday: false, events: true };
const flags = Object.assign({}, DEF, st.flags || {});
const LABELS = [['sched', 'Изменения в расписании'], ['hw', 'Новое домашнее задание'], ['due', 'Дедлайн задания завтра'], ['topics', 'Наборы тем и приглашения в команду'], ['topicDue', 'Завтра дедлайн выбора темы'], ['bday', 'Дни рождения и праздники'], ['events', 'Новые IT-мероприятия']];
const toggles = LABELS.map(([k, label], i) => ({
label: label, on: flags[k],
track: flags[k] ? '#005AAA' : '#C9D1DC', knob: flags[k] ? '23px' : '3px',
border: i === 0 ? 'none' : '1px solid #EEF1F5',
toggle: () => this.setState({ flags: Object.assign({}, flags, { [k]: !flags[k] }) })
}));
const genders = [['female', 'Женский'], ['male', 'Мужской'], ['none', 'Не указывать']].map(([k, l]) => ({
label: l, on: gender === k,
bg: gender === k ? '#ffffff' : 'transparent', color: gender === k ? '#005AAA' : '#4A515C',
shadow: gender === k ? '0 1px 3px rgba(0, 40, 90, 0.12)' : 'none',
pick: () => this.setState({ gender: k })
}));
return {
screenHeight: this.props.screenHeight ?? 844,
pushOn: push === 'включены', pushOff: push === 'выключены', pushIphone: push === 'iPhone без установки',
enablePush: () => this.setState({ push: 'включены' }),
toggles: toggles, genders: genders,
dialogOpen: dialog !== 'нет', isDelete: dialog === 'удаление', isLogout: dialog === 'выход',
askDelete: () => this.setState({ dialog: 'удаление' }),
askLogout: () => this.setState({ dialog: 'выход' }),
closeDialog: () => this.setState({ dialog: 'нет' }),
confirmDelete: () => this.setState({ dialog: 'нет' })
};
}
}
return Component;
})());
