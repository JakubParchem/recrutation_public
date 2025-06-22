interface Name{
    common:string;
    official:string;
}
interface Flag{
    png:string;
    alt:string;
}
interface Currency{
    name:string;
    symbol:string;
}
export class country {
    name:Name={common:'',official:''};
    currency:Currency={name:'',symbol:''};
    language:string='';
    population:number=0;
    area:number=0;
    neighbours:number=0;
    flag: Flag={png:'',alt:''};
    constructor(name:any,area:number,neighbours:any,population:number,currency:any,flag:any,language:any){
        this.name.common=name.common;
        this.name.official=name.official;
        const currencyObj:Currency = Object.values(currency)[0] as Currency;
        this.currency.name=currencyObj.name;
        this.currency.symbol=currencyObj.symbol;

        this.population=population;
        this.area=area;
        this.neighbours=neighbours.length;
        this.language=Object.values(language)[0] as string;

        this.flag.png=flag.png;
        this.flag.alt=flag.alt;
    };
}