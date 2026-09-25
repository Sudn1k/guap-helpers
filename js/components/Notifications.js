/* Уведомления */
DCLite.define("Notifications", (function () {
class Component extends DCLogic {
renderVals() {
const ICON = {
invite: [['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3 19a6 6 0 0 1 10-4.5', 'M16 5.5a3 3 0 0 1 0 5.5M17 15a6 6 0 0 1 4 4'], '#F6EAF3', '#8C2D73'],
schedule: [['M20 12.5V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8', 'M17.5 20h.5a2 2 0 0 0 2-2v-1.5', 'M8 3v4M16 3v4M4 10h16'], '#EAF2FB', '#005AAA'],
bday: [['M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z', '', ''], 'linear-gradient(to top right, #005AAA, #AB3A8D 80%, #E72B70)', '#ffffff'],
due: [['M20 12a8 8 0 1 0-8 8', 'M12 8v4l3 2', ''], '#FFF1E8', '#9C3022'],
hw: [['M4 7l2 2 3.5-3.5', 'M4 16.5l2 2L9.5 15', 'M13 7.5h7M13 17h7'], '#EAF2FB', '#005AAA'],
topics: [['M18 14.5V21l-6-4-6 4V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5.5', '', ''], '#F6EAF3', '#8C2D73'],
event: [['M5 19c1-4 3-6.5 5.5-8.5', 'M13 8.5C15.5 6 18 5 20 4.5c-.5 2-1.5 4.5-4 7-1.5 1.5-3.5 2.5-5 3', 'M9 10.5 6 10l2-3h4'], '#E3F5FC', '#005F7F'],
accepted: [['M5 12.5l4.5 4.5L19 7.5', '', ''], '#E8F5EE', '#235937']
};
const DATA = [
{ id: 1, g: 'Сегодня', type: 'invite', title: 'Иван Петров зовёт вас в тему', body: '«Этика искусственного интеллекта» · Рефераты по философии', time: '10:42', unread: true, href: 'TopicSet.html' },
{ id: 2, g: 'Сегодня', type: 'schedule', title: 'Изменение в расписании', body: 'Чт, 24 сен: Web-программирование перенесли в ауд. 52-14', time: '08:12', unread: true, href: 'Schedule.html' },
{ id: 3, g: 'Сегодня', type: 'bday', title: 'Сегодня день рождения у Марии Ковалёвой', body: 'Не забудьте поздравить одногруппницу', time: '08:00', unread: true, href: 'Main.html' },
{ id: 4, g: 'Сегодня', type: 'due', title: 'Завтра дедлайн', body: 'Теория вероятностей · ДЗ 3: задачи 1–12, до 09:30', time: '07:00', href: 'Tasks.html' },
{ id: 5, g: 'Вчера', type: 'hw', title: 'Новое задание по базам данных', body: 'Лабораторная №2: нормализация · сдать до 23 сен', time: '18:30', href: 'Tasks-Detail.html' },
{ id: 6, g: 'Вчера', type: 'topics', title: 'Открыт набор тем', body: 'Курсовые по базам данных · выбор до 2 октября', time: '12:00', href: 'Topics.html' },
{ id: 7, g: 'Вчера', type: 'event', title: 'Новое мероприятие', body: 'Хакатон «Цифровой кампус» · 3–4 октября', time: '11:20', href: 'EventDetail.html' },
{ id: 8, g: 'Ранее', type: 'accepted', title: 'Вера Соколова приняла приглашение', body: '«Smart cities» · Доклады по английскому', time: '12 сен', href: 'Topics.html' },
{ id: 9, g: 'Ранее', type: 'topics', title: 'Завтра закрывается выбор темы', body: 'Доклады по английскому · до 15 сентября', time: '14 сен', href: 'Topics.html' }
];
const st = this.state || {};
const push = st.push || this.props.push || 'выключены';
const filter = st.filter || (this.props.filter === 'непрочитанные' ? 'unread' : 'all');
const empty = this.props.empty ?? false;
const allRead = !!st.allRead;
const src = empty ? [] : DATA;
const isUnread = (n) => !!n.unread && !allRead;
const unreadCount = src.filter(isUnread).length;
const visible = src.filter((n) => filter === 'all' || isUnread(n));
const groups = ['Сегодня', 'Вчера', 'Ранее'].map((title) => {
const items = visible.filter((n) => n.g === title).map((n, i) => {
const ic = ICON[n.type];
const u = isUnread(n);
return {
title: n.title, body: n.body, time: n.time, href: n.href,
aria: (u ? 'Непрочитанное: ' : '') + n.title,
d1: ic[0][0], d2: ic[0][1], d3: ic[0][2], iconBg: ic[1], iconColor: ic[2],
bg: u ? '#F2F7FD' : '#ffffff',
border: i === 0 ? 'none' : '1px solid #EEF1F5',
titleWeight: u ? '400' : '300',
dot: u ? '#005AAA' : 'transparent'
};
});
return { title: title, items: items };
}).filter((g) => g.items.length > 0);
const on = { bg: '#ffffff', color: '#005AAA', shadow: '0 1px 3px rgba(0, 40, 90, 0.12)' };
const off = { bg: 'transparent', color: '#4A515C', shadow: 'none' };
const a = filter === 'all' ? on : off, b = filter === 'unread' ? on : off;
return {
screenHeight: this.props.screenHeight ?? 844,
noUnread: unreadCount === 0, hasUnread: unreadCount > 0, unreadCount: unreadCount,
readAllColor: unreadCount === 0 ? '#7A8391' : '#005AAA',
readAll: () => this.setState({ allRead: true }),
isAll: filter === 'all', isUnread: filter === 'unread',
showAll: () => this.setState({ filter: 'all' }), showUnread: () => this.setState({ filter: 'unread' }),
allBg: a.bg, allColor: a.color, allShadow: a.shadow, unBg: b.bg, unColor: b.color, unShadow: b.shadow,
showPushBanner: push !== 'включены' && !st.pushHidden,
pushCanEnable: push === 'выключены', pushIphone: push === 'iPhone без установки',
pushText: push === 'iPhone без установки' ? 'На iPhone push приходят только из установленного приложения. Добавьте его на экран «Домой».' : 'Узнавайте об изменениях в расписании и дедлайнах, даже когда приложение закрыто.',
enablePush: () => this.setState({ push: 'включены' }),
hidePush: () => this.setState({ pushHidden: true }),
groups: groups,
isEmpty: groups.length === 0,
emptyTitle: filter === 'unread' && !empty ? 'Всё прочитано' : 'Уведомлений пока нет',
emptyText: filter === 'unread' && !empty ? 'Новые уведомления появятся здесь.' : 'Здесь появятся изменения расписания, новые задания, приглашения в темы и другое.'
};
}
}
return Component;
})());
