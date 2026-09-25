/* Главная */
DCLite.define("Main", (function () {
class Component extends DCLogic {
renderVals() {
const week = this.props.week ?? 'верхняя';
const offline = this.props.offline ?? false;
return {
screenHeight: this.props.screenHeight ?? 844,
isUpper: week !== 'нижняя',
isLower: week === 'нижняя',
showBanner: this.props.showBanner ?? true,
offline: offline,
online: !offline
};
}
}
return Component;
})());
