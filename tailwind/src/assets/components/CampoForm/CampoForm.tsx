/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

function CampoForm() {
    const [local, setLocal] = useState("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastDay[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [unit, setUnit] = useState<'C' | 'F'>('C');
    const [lang, setLang] = useState<'pt' | 'en'>('pt');

    type WeatherData = {
        location: {
            name: string;
            country: string;
        };
        current: {
            temp_c: number;
            temp_f: number;
            condition: {
                text: string;
                icon: string;
            };
        };
    };

    type ForecastDay = {
        date: string;
        day: {
            maxtemp_c: number;
            maxtemp_f: number;
            mintemp_c: number;
            mintemp_f: number;
            condition: {
                text: string;
                icon: string;
            };
        };
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                await fetchWeather(`${lat},${lon}`);
            });
        }
    }, [fetchWeather]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (local) fetchWeather(local);
        }, 600000); // 600.000 = 10min? sla
        return () => clearInterval(interval);
    }, [local, unit, lang, fetchWeather]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocal(e.target.value);
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(e.target.value as 'C' | 'F');
    };

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLang(e.target.value as 'pt' | 'en');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetchWeather(local);
    };

    async function fetchWeather(query: string) {
        setLoading(true);
        setError("");
        try {
            const apiKey = "5a2b22bcd91a40b7a4c141247250311";
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=5&lang=${lang}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Local não encontrado ou erro na API.");
            }
            const data = await response.json();
            setWeather(data);
            setForecast(data.forecast.forecastday);
        } catch {
            setError("Local não encontrado ou erro na API.");
            setWeather(null);
            setForecast([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="w-full bg-[#008080] flex flex-col items-center py-4">
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
                    <label className="text-[#FFF]">Insira o País/Estado/Cidade:</label>
                    <input type="text" value={local} onChange={handleChange} className="px-2 py-1 rounded" placeholder="Ex: São Paulo" />
                    <div className="flex gap-2">
                        <label className="text-white">Unidade:</label>
                        <select value={unit} onChange={handleUnitChange} className="rounded px-2">
                            <option value="C">Celsius</option>
                            <option value="F">Fahrenheit</option>
                        </select>
                        <label className="text-white">Idioma:</label>
                        <select value={lang} onChange={handleLangChange} className="rounded px-2">
                            <option value="pt">Português</option>
                            <option value="en">Inglês</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary">Buscar clima</button>
                </form>
                {loading && <p className="text-white mt-2">Carregando...</p>}
                {error && <p className="text-red-200 mt-2">{error}</p>}
                {weather && (
                    <div className="bg-white rounded shadow p-4 mt-4 w-full max-w-xs text-center">
                        <h2 className="text-lg font-bold mb-2">{weather.location.name}, {weather.location.country}</h2>
                        <p className="text-gray-700">Temperatura: {unit === 'C' ? weather.current.temp_c : weather.current.temp_f}°{unit}</p>
                        <p className="text-gray-700">Condição: {weather.current.condition.text}</p>
                        <img src={weather.current.condition.icon} alt="Ícone do clima" className="mx-auto" />
                    </div>
                )}
                {forecast.length > 0 && (
                    <div className="bg-white rounded shadow p-4 mt-4 w-full max-w-md text-center">
                        <h3 className="text-lg font-bold mb-2">Previsão para os próximos dias</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {forecast.map((day) => (
                                <div key={day.date} className="border rounded p-2 flex flex-col items-center">
                                    <span className="font-semibold">{day.date}</span>
                                    <img src={day.day.condition.icon} alt="" />
                                    <span>{day.day.condition.text}</span>
                                    <span>Máx: {unit === 'C' ? day.day.maxtemp_c : day.day.maxtemp_f}°{unit}</span>
                                    <span>Mín: {unit === 'C' ? day.day.mintemp_c : day.day.mintemp_f}°{unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CampoForm