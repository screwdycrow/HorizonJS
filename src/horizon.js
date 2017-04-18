/**
 * Created by Dimitris on 4/14/2017.
 */
let Utils = {
    getParams: (params) => {
        if (typeof params === 'object') {

            return query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');
        }
    },
    addEventTo: (type, element, callback) => {
        if (typeof element === "string" && typeof type === "string" && typeof callback === "function") {
            let nodelist = null;
            const firstChar = element.charAt(0);
            element = element.substring(1);
            switch (firstChar) {
                case '.':
                    nodelist = document.getElementsByClassName(element);
                    break;
                case'#':
                    let el = document.getElementById(element);
                    el.addEventListener(type, () => callback(el));
            }
            if (nodelist !== null) {
                for (i = 0; i < nodelist.length; i++) {
                    let el = nodelist[i];
                    el.addEventListener(type, () => callback(el));

                }
            }
        }
    }

};

let templates = {
    bootstrap_card: item => {
    },
    selects: item => {
    },
    bootstrap_list: item => {
    }
};
class Horizon {
    constructor(api) {
        if (typeof api === "string") {
            this.api = api;
        }
    }

    _getData(obj) {
        if (typeof obj === "string") {
            let objApi = this[obj].api ? this[obj].api : this.api;
            let objGet = this[obj].get ? this[obj].get : '';
            return fetch(objApi + Utils.getParams(objGet), {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then((resp) => {
                    this[obj].data = resp.json();
                    return this[obj].data
                });
        }

    }

    _bindEvents(obj) {
        if (typeof obj === "string") {
            if (typeof this[obj].events !== 'undefined') {
                console.log(this[obj].events);
                this[obj].events.map(event => Utils.addEventTo(event.on, event.to, event.do))
            }
        }


    };

    _fill(obj, data, options) {
        if (typeof obj === "string") {
            if (this[obj].tmpl) {
                const template = this._getTemplate(obj);
                data = this[obj].fill(data);//if template, .fill  is expected to return an array of objects.
                this._fillTemplate(obj, template, data, options);
            } else {
                typeof this[obj].fill !== 'undefined' ? this[obj].fill(data) : '';
                //if not template .fill is expected to be a void callback function.
            }
            this._bindEvents(obj);
        }
    }

    _getThenFill(obj, options) {
        if (typeof obj === "string") {
            const _this = this;
            this._getData(obj).then(function (data) {
                return new Promise(function (resolve, reject) {
                    _this._fill(obj, data, options);
                    options.shouldFillDepedants ? _this._fillDepedants(obj, data, options) : '';
                });
            })
        }
    }

    _fillDepedants(obj, data, options) {
        if (typeof obj === 'string' && typeof  this[obj].depedants !== 'undefined') {
            this[obj].depedants.map(item => {
                    this._fill(item, data, options)
                }
            );

        }
    }

    _getTemplate(obj) {
        if (typeof obj === "string") {
            return this[obj].tmpl;
        }
    }

    _fillTemplate(obj, template, data, options) {
        const parent = document.getElementById(obj);
        if (options.overwrite) {
            parent.innerHTML = '';
        }
        data.map((item, index) => {
            parent.innerHTML += template(item)
        });
    }
}



