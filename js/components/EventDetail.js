/* Мероприятие */
DCLite.define("EventDetail", (function () {
class Component extends DCLogic {
renderVals() {
const past = this.props.past ?? false;
const offline = this.props.offline ?? false;
return {
screenHeight: this.props.screenHeight ?? 844,
offline: offline,
coverOpacity: past ? '0.55' : '1',
whenNote: past ? 'мероприятие прошло' : 'через 10 дней',
canRegister: !past && !offline,
cannotRegister: past || offline,
disabledLabel: past ? 'Мероприятие прошло' : 'Регистрация · нужна сеть',
ctaNote: past ? 'Посмотрите ближайшие мероприятия в списке' : (offline ? 'Откроется сайт организатора, когда появится интернет' : 'Регистрация до 1 октября на сайте организатора')
};
}
}
return Component;
})());
