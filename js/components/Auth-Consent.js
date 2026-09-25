/* Согласие на обработку данных */
DCLite.define("Auth-Consent", (function () {
class Component extends DCLogic {
renderVals() {
const agreed = (this.state && this.state.agreed !== undefined) ? this.state.agreed : (this.props.startChecked ?? false);
return {
agreed: agreed,
notAgreed: !agreed,
boxBorder: agreed ? '#005AAA' : '#E3E8EF',
boxBg: agreed ? '#F2F7FD' : '#ffffff',
toggle: () => this.setState({ agreed: !agreed })
};
}
}
return Component;
})());
