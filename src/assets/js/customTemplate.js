export default class CustomTemplate {
    constructor(el) {
        this.template = el.text().split(/\$\{(.+?)\}/g);
    }

    render(e, i, props, arr) {

        let str = e;
        if (i%2) {
            return props[e];
        }

        return str;
    }

    getEl(props) {
        return this.template.map(
            (e, i)=>this.render(e,i, props)
        ).join('');
    }

}