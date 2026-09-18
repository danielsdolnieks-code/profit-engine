const initial = () => ({common:18000, allocation:'equal', capacity:2000, products:[{name:'Bags',price:50,volume:1000,variable:30,fixed:0,avoidable:0,hours:1,active:true},{name:'Shoes',price:80,volume:0,variable:50,fixed:0,avoidable:0,hours:2,active:false}]});
function calculate(s){
 const products=s.products.map(p=>{const units=p.active?p.volume:0;const revenue=p.price*units;const variable=p.variable*units;const contribution=revenue-variable;const retainedFixed=p.active?p.fixed:p.fixed*(1-p.avoidable/100);return {...p,units,revenue,totalVariable:variable,contribution,unitContribution:p.price-p.variable,ratio:revenue>0?contribution/revenue:null,retainedFixed,resource:units*p.hours,perHour:p.hours>0?(p.price-p.variable)/p.hours:null};});
 const revenue=products.reduce((t,p)=>t+p.revenue,0),contribution=products.reduce((t,p)=>t+p.contribution,0),fixed=s.common+products.reduce((t,p)=>t+p.retainedFixed,0),ratio=revenue>0?contribution/revenue:null;
 const weights=products.map(p=>!p.active?0:s.allocation==='revenue'?p.revenue:s.allocation==='units'?p.units:1);const sum=weights.reduce((a,b)=>a+b,0);
 products.forEach((p,i)=>{p.overhead=sum>0?s.common*weights[i]/sum:0;p.reported=p.contribution-p.retainedFixed-p.overhead;});
 const breakEven=ratio>0?fixed/ratio:fixed===0&&contribution===0?0:null;
 return {products,revenue,contribution,fixed,ratio,profit:contribution-fixed,breakEven,safety:breakEven===null?null:revenue-breakEven,hours:products.reduce((t,p)=>t+p.resource,0),unallocated:sum===0?s.common:0};
}
if(typeof module!=='undefined')module.exports={initial,calculate};
