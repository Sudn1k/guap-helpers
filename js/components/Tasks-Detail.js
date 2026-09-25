/* Задание */
DCLite.define("Tasks-Detail", (function () {
class Component extends DCLogic {
renderVals() {
const st = this.state || {};
const done = st.done !== undefined ? st.done : (this.props.startDone ?? false);
return {
done: done,
notDone: !done,
toggle: () => this.setState({ done: !done })
};
}
}
return Component;
})());
