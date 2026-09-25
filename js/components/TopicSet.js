/* Набор тем */
DCLite.define("TopicSet", (function () {
class Component extends DCLogic {
renderVals() {
const ME = 'Волкова А. (вы)';
const BASE = [
{ n: 1, title: 'Этика искусственного интеллекта', st: 'pending', who: 'Петров И. · ждём: Волкова А.' },
{ n: 2, title: 'Сознание и свобода воли', st: 'taken', who: 'Ковалёва М., Жуков Н.' },
{ n: 3, title: 'Философия техники Хайдеггера', st: 'free' },
{ n: 4, title: 'Античный скептицизм', st: 'taken', who: 'Егорова Д., Белов А., Тихонов Е.' },
{ n: 5, title: 'Проблема индукции у Юма', st: 'free' },
{ n: 6, title: 'Экзистенциализм Сартра', st: 'free' },
{ n: 7, title: 'Философия языка Витгенштейна', st: 'taken', who: 'Сидорова О.' },
{ n: 8, title: 'Утилитаризм и его критика', st: 'free' },
{ n: 9, title: 'Категорический императив Канта', st: 'pending', who: 'Лебедев К. · ждём: Морозова П.' },
{ n: 10, title: 'Русская религиозная философия', st: 'free' },
{ n: 11, title: 'Фальсификационизм Поппера', st: 'free' },
{ n: 12, title: 'Стоицизм сегодня', st: 'free' }
];
const PEOPLE = [
{ id: 'g', name: 'Гришин Максим', short: 'Гришин М.', ok: true },
{ id: 'f', name: 'Фёдорова Алина', short: 'Фёдорова А.', ok: true },
{ id: 'n', name: 'Никитин Роман', short: 'Никитин Р.', ok: true },
{ id: 's', name: 'Соколова Вера', short: 'Соколова В.', ok: true },
{ id: 'm', name: 'Морозова Полина', note: 'приглашена в другую тему' },
{ id: 'z', name: 'Жуков Никита', note: 'уже в теме «Сознание и свобода воли»' },
{ id: 'k', name: 'Ковалёва Мария', note: 'уже в теме «Сознание и свобода воли»' },
{ id: 'l', name: 'Лебедев Кирилл', note: 'уже в теме «Категорический императив…»' },
{ id: 'p', name: 'Петров Иван', note: 'уже в теме «Этика искусственного интеллекта»' }
];
const MODES = { 'без темы': 'none', 'жду напарника': 'waiting', 'в команде': 'member' };
const SHEETS = { 'закрыта': null, 'выбор': 'choose', 'занята': 'taken', 'пригласить ещё': 'choose' };
const st = this.state || {};
const mode = st.mode || MODES[this.props.mode] || 'none';
const sheet = st.sheet !== undefined ? st.sheet : (SHEETS[this.props.sheet] || null);
const sheetTopicN = st.sheetTopic || (this.props.sheet === 'занята' ? 5 : 6);
const sheetKind = st.sheetKind || (this.props.sheet === 'пригласить ещё' ? 'invite' : 'book');
const picked = st.picked || ((this.props.sheet === 'выбор' || this.props.sheet === 'пригласить ещё') ? ['f'] : []);
const myTopic = st.myTopic || (mode === 'member' ? 1 : 3);
const myPartners = st.myPartners || ['g'];
const inviteDismissed = !!st.inviteDismissed;
const memberInvites = st.memberInvites || [];
const closed = this.props.closed ?? false;
const offline = this.props.offline ?? false;
const actionsOff = closed || offline;
const filter = st.filter || 'all';
const init = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');
const shortOf = (id) => (PEOPLE.find((p) => p.id === id) || {}).short;

const topicsAll = BASE.map((t) => {
let s = t.st, who = t.who || '', mine = false;
if (t.n === 1 && (mode !== 'none' || inviteDismissed)) {
if (mode === 'member') { mine = true; if (memberInvites.length) { s = 'pending'; who = 'Петров И., ' + ME + ' · ждём: ' + memberInvites.map(shortOf).join(', '); } else { s = 'taken'; who = 'Петров И., ' + ME; } }
else { s = 'taken'; who = 'Петров И.'; }
}
if (t.n === 5 && (st.raceTaken || this.props.sheet === 'занята')) { s = 'taken'; who = 'Орлова Е., Смирнов Д.'; }
if (mode === 'waiting' && t.n === myTopic) {
mine = true;
if (myPartners.length) { s = 'pending'; who = ME + ' · ждём: ' + myPartners.map(shortOf).join(', '); }
else { s = 'taken'; who = ME; }
}
return Object.assign({}, t, { s: s, who: who, mine: mine });
});
const takenCount = topicsAll.filter((t) => t.s !== 'free').length;
const BADGE = { free: ['свободна', '#E8F5EE', '#235937', '#009A49'], taken: ['занята', '#F0F2F5', '#4A515C', '#A9B1BD'], pending: ['ждём напарника', '#FFF1E8', '#9C3022', '#FF6418'] };
const canBook = mode === 'none' && !closed;
const visible = topicsAll.filter((t) => filter === 'all' || (filter === 'free' ? t.s === 'free' : t.s !== 'free'));
const topics = visible.map((t, idx) => {
const b = t.mine ? ['ваша тема', '#EAF2FB', '#005AAA', '#005AAA'] : BADGE[t.s];
return {
n: t.n, title: t.title, members: t.s === 'free' ? '' : t.who,
badge: b[0], badgeBg: b[1], badgeColor: b[2], badgeDot: b[3],
rowBorder: idx === 0 ? 'none' : '1px solid #EEF1F5',
rowBg: t.mine ? '#F2F7FD' : '#ffffff',
canPick: t.s === 'free' && canBook,
pickOff: offline,
pickBg: offline ? '#F0F2F5' : '#EAF2FB',
pickColor: offline ? '#7A8391' : '#005AAA',
pick: () => this.setState({ sheet: 'choose', sheetKind: 'book', sheetTopic: t.n, picked: [] })
};
});
const filters = [['all', 'Все'], ['free', 'Свободные'], ['busy', 'Занятые']].map(([k, l]) => ({
label: l, on: filter === k,
bg: filter === k ? '#005AAA' : '#ffffff', color: filter === k ? '#ffffff' : '#2B2F36',
border: filter === k ? '1px solid #005AAA' : '1px solid #C9D5E3',
pick: () => this.setState({ filter: k })
}));

let mineMembers = [], mineTitle = '', mineCaption = '', mineBadge = '', mineBadgeBg = '', mineBadgeColor = '', mineBadgeDot = '', leaveLabel = '', leaveHint = '';
if (mode === 'waiting') {
mineTitle = BASE[myTopic - 1].title;
mineCaption = 'Ваша бронь';
const waiting = myPartners.length > 0;
mineBadge = waiting ? 'ждём ответа' : 'забронирована';
mineBadgeBg = waiting ? '#FFF1E8' : '#E8F5EE'; mineBadgeColor = waiting ? '#9C3022' : '#235937'; mineBadgeDot = waiting ? '#FF6418' : '#009A49';
mineMembers = [{ initials: 'ВА', name: 'Волкова Анна (вы)', state: 'автор брони', stateColor: '#5E6673', avatarBg: '#005AAA', avatarColor: '#ffffff' }]
.concat(myPartners.map((id) => { const p = PEOPLE.find((x) => x.id === id); return { initials: init(p.name), name: p.name, state: 'ждём ответа', stateColor: '#9C3022', avatarBg: '#EAF2FB', avatarColor: '#005AAA' }; }));
leaveLabel = 'Отменить бронь';
leaveHint = closed ? 'После дедлайна отменить бронь может только администратор.' : 'Тема освободится, приглашения отзовутся. Можно до 30 сентября.';
}
if (mode === 'member') {
mineTitle = BASE[0].title;
mineCaption = 'Ваша команда';
mineBadge = 'занята'; mineBadgeBg = '#E8F5EE'; mineBadgeColor = '#235937'; mineBadgeDot = '#009A49';
mineMembers = [
{ initials: 'ИП', name: 'Петров Иван', state: 'автор брони', stateColor: '#5E6673', avatarBg: '#EAF2FB', avatarColor: '#005AAA' },
{ initials: 'ВА', name: 'Волкова Анна (вы)', state: 'в команде', stateColor: '#235937', avatarBg: '#005AAA', avatarColor: '#ffffff' }
];
mineMembers = mineMembers.concat(memberInvites.map((id) => { const p = PEOPLE.find((x) => x.id === id); return { initials: init(p.name), name: p.name, state: 'ждём ответа', stateColor: '#9C3022', avatarBg: '#EAF2FB', avatarColor: '#005AAA' }; }));
if (memberInvites.length) { mineBadge = 'ждём ответа'; mineBadgeBg = '#FFF1E8'; mineBadgeColor = '#9C3022'; mineBadgeDot = '#FF6418'; }
leaveLabel = 'Выйти из темы';
leaveHint = closed ? 'После дедлайна выйти из темы можно только через администратора.' : 'Тема останется за Иваном. Выйти можно до 30 сентября.';
}

const teamUsed = mode === 'waiting' ? 1 + myPartners.length : (mode === 'member' ? 2 + memberInvites.length : 0);
const freeSlots = Math.max(0, 3 - teamUsed);
const alreadyInvited = mode === 'waiting' ? myPartners : (mode === 'member' ? memberInvites : []);
const pickLimit = sheetKind === 'invite' ? Math.max(1, freeSlots) : 2;
const people = PEOPLE.map((p) => {
const on = picked.indexOf(p.id) !== -1;
const full = picked.length >= pickLimit && !on;
const invitedAlready = sheetKind === 'invite' && alreadyInvited.indexOf(p.id) !== -1;
return {
name: p.name, initials: init(p.name), note: invitedAlready ? 'уже приглашён(а) в вашу команду' : (p.note || ''),
available: !!p.ok && !invitedAlready, unavailable: !p.ok || invitedAlready,
picked: on, lockOff: full,
opacity: full ? '0.45' : '1',
bg: on ? '#F2F7FD' : 'transparent',
boxBorder: on ? 'none' : '2px solid #8792A2',
boxBg: on ? '#005AAA' : '#ffffff',
toggle: () => this.setState({ picked: on ? picked.filter((x) => x !== p.id) : picked.concat([p.id]) })
};
});
const n = picked.length;
const confirmLabel = sheetKind === 'invite' ? (n === 0 ? 'Выберите, кого пригласить' : 'Пригласить ' + n) : (n === 0 ? 'Забронировать одному' : (n === 1 ? 'Забронировать и пригласить 1' : 'Забронировать и пригласить 2'));
const confirmOff = sheetKind === 'invite' && n === 0;
const inviteOff = actionsOff;

return {
screenHeight: this.props.screenHeight ?? 844,
offline: offline, closed: closed, actionsOff: actionsOff,
deadlineLabel: closed ? 'выбор закрыт 30 сен' : 'выбор до 30 сен, 23:59',
deadlineBg: closed ? '#FDEBEF' : '#FFF1E8', deadlineColor: closed ? '#8B2346' : '#9C3022',
takenCount: takenCount,
showInvite: mode === 'none' && !inviteDismissed && !closed,
showNoTopic: mode === 'none' && (inviteDismissed || closed),
noTopicText: closed ? 'Вы остались без темы — напишите администратору группы.' : 'Вы пока без темы. Выберите свободную ниже.',
acceptInvite: () => this.setState({ mode: 'member', toast: 'Вы в команде «Этика искусственного интеллекта»' }),
declineInvite: () => this.setState({ inviteDismissed: true, toast: 'Приглашение отклонено' }),
primaryBg: actionsOff ? '#E3E8EF' : '#005AAA', primaryColor: actionsOff ? '#7A8391' : '#ffffff',
secondaryBorder: actionsOff ? '#E3E8EF' : '#005AAA', secondaryColor: actionsOff ? '#7A8391' : '#005AAA',
hasMine: mode !== 'none',
mineTitle: mineTitle, mineCaption: mineCaption, mineMembers: mineMembers,
mineBadge: mineBadge, mineBadgeBg: mineBadgeBg, mineBadgeColor: mineBadgeColor, mineBadgeDot: mineBadgeDot,
leaveLabel: leaveLabel, leaveHint: leaveHint,
dangerBorder: actionsOff ? '#E3E8EF' : '#E70F47', dangerColor: actionsOff ? '#7A8391' : '#B0123D',
leaveMine: () => this.setState({ mode: 'none', inviteDismissed: true, toast: mode === 'member' ? 'Вы вышли из темы' : 'Бронь отменена, тема свободна' }),
filters: filters, topics: topics,
showToast: !!st.toast && !sheet, toastText: st.toast || '',
sheetOpen: !!sheet, sheetChoose: sheet === 'choose', sheetTaken: sheet === 'taken',
sheetTopic: sheetKind === 'invite' ? mineTitle : BASE[sheetTopicN - 1].title,
sheetCaption: sheetKind === 'invite' ? 'Пригласить в команду' : 'Бронь темы',
sheetListTitle: sheetKind === 'invite' ? 'Кого позвать' : 'Позвать напарников',
sheetInfo: sheetKind === 'invite' ? 'В команде свободно мест: ' + freeSlots + '. Приглашённые получат уведомление и смогут принять или отклонить его.' : 'Тема закрепится за вами сразу, а напарники получат приглашение. Можно никого не звать.',
pickLimit: pickLimit,
confirmOff: confirmOff, confirmBg: confirmOff ? '#E3E8EF' : '#005AAA', confirmColor: confirmOff ? '#7A8391' : '#ffffff',
canInviteMore: mode !== 'none' && !closed && freeSlots > 0,
teamFull: mode !== 'none' && freeSlots === 0,
freeSlotsLabel: freeSlots === 1 ? 'осталось 1 место' : 'осталось ' + freeSlots + ' места',
inviteOff: inviteOff, inviteBg: inviteOff ? '#F0F2F5' : '#EAF2FB', inviteColor: inviteOff ? '#7A8391' : '#005AAA',
openInvite: () => this.setState({ sheet: 'choose', sheetKind: 'invite', picked: [] }),
closeSheet: () => this.setState({ sheet: null }),
people: people, pickedCount: n, counterColor: n >= 2 ? '#005AAA' : '#5E6673',
confirmLabel: confirmLabel,
confirmBooking: () => {
if (sheetKind === 'invite') {
if (mode === 'member') this.setState({ sheet: null, memberInvites: memberInvites.concat(picked), toast: 'Приглашение отправлено' });
else this.setState({ sheet: null, myPartners: myPartners.concat(picked), toast: 'Приглашение отправлено' });
return;
}
if (sheetTopicN === 5) { this.setState({ sheet: 'taken', raceTaken: true }); return; }
this.setState({ sheet: null, mode: 'waiting', myTopic: sheetTopicN, myPartners: picked, toast: n ? 'Тема ваша · приглашения отправлены' : 'Тема забронирована' });
}
};
}
}
return Component;
})());
