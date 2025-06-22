import {country} from './country';
import React, {useEffect, useState} from 'react';

type SortKey = 'name' | 'currency' | 'language' | 'population' | 'area';
interface CountryListProps {}

const CountryList: React.FC<CountryListProps> = () => {
    const [countries, setCountries] = useState<country[]>([]);

    useEffect(() => {
        async function fetchCountries() {
            let data:any;
            if(!localStorage.getItem('countryList')) {
                const res = await fetch("https://restcountries.com/v3.1/independent?status=true&fields=name,borders,currencies,languages,population,area,flags");
                data = await res.json();
                localStorage.setItem('countryList',JSON.stringify(data));
            }
            else{
                data=JSON.parse(localStorage.getItem('countryList') as string);
            }

            const list = data.map((n: any) =>
                new country(n.name, n.area, n.borders, n.population, n.currencies, n.flags, n.languages)
            );

            setCountries(list);
        }
        fetchCountries();
    }, []);
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [ascending, setAscending] = useState(true);
    const [minPop,setMinPop]=useState(0);
    const [maxPop,setMaxPop]=useState(0);
    const [search,setSearch]=useState('');

    function compare(a:country,b:country){
        let result=0;
        switch (sortKey){
            case 'name':{
                result=a.name.common.localeCompare(b.name.common)
                break;
            }
            case 'currency':{
                result=a.currency.name.localeCompare(b.currency.name);
                break;
            }
            case 'area':{
                result=a.area-b.area;
                break;
            }
            case 'population':{
                result=a.population-b.population;
                break;
            }
            case 'language':{
                result= a.language.localeCompare(b.language);
                break;
            }
        }
        if(ascending) {
            return result;
        }
        else{
            return -result;
        }
    }
    function filt(n:country){
        let minCheck=()=>true,
            maxCheck=()=>true,
            searchCheck=()=>true;
        if(search!==''){
            searchCheck=()=>{
                return(
                    n.name.common.toLowerCase().includes(search)||
                    n.area.toString().includes(search)||
                    n.population.toString().includes(search)||
                    n.currency.name.toLowerCase().includes(search)||
                    n.language.toLowerCase().includes(search)
                )
            };
        }
        if(minPop>0){
            minCheck=()=>n.population>=minPop;
        }
        if(maxPop>0){
            maxCheck=()=>n.population<=maxPop;
        }
        return searchCheck() && maxCheck() && minCheck();
    }
    function filterHandler(key:string){
        switch(key){
            case 'search':{
                const input=document.getElementById('search') as HTMLInputElement;
                if(input) {
                    setSearch(input.value);
                }
                break
            }
            case 'min':{
                const input=document.getElementById('min') as HTMLInputElement;
                if(input) {
                    setMinPop(parseInt(input.value));
                }
                break
            }
            case 'max':{
                const input=document.getElementById('max') as HTMLInputElement;
                if(input) {
                    setMaxPop(parseInt(input.value));
                }
                break
            }
        }
    }
    function sortHandler(key:SortKey){
        if(sortKey===key){
            setAscending(!ascending);
        }
        else {
            setSortKey(key)
            setAscending(true)
        }
    }
    return (
        <div id="countryList" className="p-6">
            <div className="sticky top-20 z-10 bg-blue-200 hover:bg-blue-300 shadow-md rounded-md p-4 flex flex-wrap gap-4 items-center justify-center">
                <input id='search' placeholder='search' onChange={()=>filterHandler('search')} className="px-4 py-2 border rounded w-full sm:w-auto bg-blue-200"></input>
                <input id='min' type='number' min='0' placeholder='min population' onChange={()=>filterHandler('min')} className="bg-blue-200 px-4 py-2 border rounded w-full sm:w-auto"></input>
                <input id='max' type='number' min='0' placeholder='max population' onChange={()=>filterHandler('max')} className="bg-blue-200 px-4 py-2 border rounded w-full sm:w-auto"></input>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-300">
                    <thead className="bg-gray-800 text-white">
                    <tr>
                        <th><button id="nameButton" className="px-4 py-2 w-full text-left" onClick={()=>sortHandler('name')}>Name</button></th>
                        <th><button id="currencyButton" className="px-4 py-2 w-full text-left" onClick={()=>sortHandler('currency')}>Currency</button></th>
                        <th><button id="languageButton" className="px-4 py-2 w-full text-left" onClick={()=>sortHandler('language')}>Language</button></th>
                        <th><button id="populationButton" className="px-4 py-2 w-full text-left" onClick={()=>sortHandler('population')}>Population</button></th>
                        <th><button id="areaButton" className="px-4 py-2 w-full text-left" onClick={()=>sortHandler('area')}>Area</button></th>
                        <th className="px-4 py-2">Flag</th>
                    </tr>
                    </thead>
                    <tbody>
                    {countries.filter(filt).sort(compare).map((n) => (
                        <tr key={n.name.common} className="even:bg-gray-300">
                            <td className="px-4 py-2">{n.name.common}</td>
                            <td className="px-4 py-2">{n.currency.name}</td>
                            <td className="px-4 py-2">{n.language}</td>
                            <td className="px-4 py-2">{n.population}</td>
                            <td className="px-4 py-2">{n.area}</td>
                            <td className="px-4 py-2"><img src={n.flag.png} alt={n.flag.alt} width="40" className="inline-block"/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CountryList;


