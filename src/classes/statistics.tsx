import {country} from "./country";
import React, {useEffect, useRef, useState} from 'react';
import {Chart} from "chart.js/auto";
interface LanguageCount{
    name:string;
    count:number;
}

function getTotalNumberOfCountries(countries:country[]):number{
        return countries.length;
}
function getTop5Languages(countries:country[]):string[]{
    const languageMap = new Map<string, number>();
    countries.forEach((n) => {
        languageMap.set(n.language, (languageMap.get(n.language) || 0) + 1);
    });

    return Array.from(languageMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang);
}
function getTop5Currencies(countries:country[]):string[]{
    const CurrencyMap = new Map<string, number>();
    countries.forEach((n) => {
        CurrencyMap.set(n.currency.name, (CurrencyMap.get(n.currency.name) || 0) + 1);
    });

    return Array.from(CurrencyMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([curr]) => curr);
}
function getAvgPopulation(countries:country[]):number{
    const totalPopulation:number= countries.reduce((acc,country)=>acc+=country.population,0);
    return totalPopulation/getTotalNumberOfCountries(countries);
}
function getAvgArea(countries:country[]):number{
    const totalArea:number= countries.reduce((acc,country)=>acc+=country.area,0);
    return totalArea/getTotalNumberOfCountries(countries);
}
function getAvgNumberOfNeighbours(countries:country[]):number{
    const totalNumberOfNeighbours:number= countries.reduce((acc,country)=>acc+=country.neighbours,0);
    return totalNumberOfNeighbours/getTotalNumberOfCountries(countries);
}
function getTop20CountriesBy(countries:country[],metric:string):country[]{
    if(metric==='area'){
        return getTop20CountriesByArea(countries);
    }
    else{
        return getTop20CountriesByPopulation(countries);
    }
}
function getTop20CountriesByPopulation(countries:country[]):country[]{
    return [...countries].sort((a, b) => b.population - a.population).slice(0,20);
}
function getTop20CountriesByArea(countries:country[]):country[]{
    return [...countries].sort((a, b) => b.area - a.area).slice(0,20);
}

export const StatsDisplay: React.FC = () => {
    const [countries, setCountries] = useState<country[]>([]);
    const [chartType,setChartType]=useState('area');
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
    const changeButton = useRef<HTMLButtonElement | null>(null);
    function chartHandler(){
        if(chartType==='area'){
            setChartType('population');
            if(changeButton.current) {
                changeButton.current.textContent = "Area";
            }
        }
        else{
            setChartType('area');
            if(changeButton.current) {
                changeButton.current.textContent = "Population";
            }
        }
        makeCanvas();
    }
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let chart=useRef<Chart | null>(null);
    function makeCanvas(){
        const canvas = canvasRef.current;
        if(canvas) {
            canvas.innerHTML='';
            const ctx=canvas.getContext('2d');
            if(chart.current){
                chart.current.destroy();
            }
            const list: country[] = getTop20CountriesBy(countries, chartType);
            const labels:string[]=list.map((n: country) => n.name.common)
            let values:number[] = [];
            let label:string='';
            if (chartType === 'area') {
                values = list.map((n: country) => n.area);
                label='Area in km^3';
            } else {
                values = list.map((n: country) => n.population);
                label='Population';
            }
            if (ctx) {
                chart.current=new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: label,
                            data: values,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive:true,
                        maintainAspectRatio: true
                    }
                });
            }
        }
    }
    useEffect(() => {
        fetchCountries();
    }, []);
    makeCanvas();
    return (
    <div id='Statistics' className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 lg:col-span-1">
                <div id='basicStats' className="bg-white rounded-2xl shadow-md p-6 space-y-2 space-y-2 hover:bg-gray-100">
                    <h2 className="text-2xl font-bold text-blue-700">Global Stats</h2>
                    <p>Total Countries: {getTotalNumberOfCountries(countries)}</p>
                    <p>Average Population: {getAvgPopulation(countries).toFixed(2)}</p>
                    <p>Average Area: {getAvgArea(countries).toFixed(2)}</p>
                    <p>Average Neighbours: {getAvgNumberOfNeighbours(countries).toFixed(2)}</p>
                </div>
                <div id='topLangs' className="bg-white rounded-2xl shadow-md p-6 space-y-2 hover:bg-gray-100">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">Top 5 Languages</h3>
                    <ol className="list-decimal list-inside space-y-1">
                    {getTop5Languages(countries).map(lang => (
                            <li key={lang}>{lang}</li>
                    ))}
                    </ol>
                </div>
                <div id='topCurrencies' className="bg-white rounded-2xl shadow-md p-6 space-y-2 hover:bg-gray-100">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">Top 5 Currencies</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        {getTop5Currencies(countries).map(curr => (
                            <li key={curr}>{curr}</li>
                        ))}
                    </ol>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center lg:col-span-2">
                <div id='Chart' className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center space-y-4 hover:bg-gray-100">
                    <canvas id="chart" className="w-full h-64 md:h-96 sm:h-50" ref={canvasRef}></canvas>
                    <button id='changeChart' onClick={chartHandler} ref={changeButton} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow">Population</button>
                </div>
            </div>
        </div>
    </div>
);
};

export default StatsDisplay;