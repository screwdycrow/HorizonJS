/**
 * Created by Dimitris on 4/14/2017.
 */
class Horizon {
    constructor(api){
        if(typeof api==="string"){
            this.api= api;
            console.log(this.api);
        }
    }
    getData(obj){
        if(typeof obj ==="string"){
            let  objApi = this[obj].api? this[obj].api:this.api;
            let  objGet = this[obj].get? this[obj].get:'';
            return fetch(objApi+getParams(objGet),{
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'}
            })
                .then((resp)=> {this[obj].data=resp.json(); return this[obj].data});
        }

    }

    getFill(obj,hasTemplate=true){
        if(typeof obj==="string"){
            const _this = this;
            this.getData(obj).then(function (data) {
                if(hasTemplate){
                    const template = _this.getTemplate(obj);
                    data=_this[obj].fill(data);//if template, .fill  is expected to return an array of objects.
                    _this.fillTemplate(obj,template,data);
                }else{
                    _this[obj].fill(data); //if not template .fill is expected to be a void callback function.
                }
            });
        }
    }
    getTemplate(obj){

        if(typeof obj === "string"){
            return this[obj].tmpl;

        }
    }
    fillTemplate(obj,template,data){
        const parent = document.getElementById(obj);
        data.map((item,index)=>{
            parent.innerHTML+=template(item)
        });


    }
}
