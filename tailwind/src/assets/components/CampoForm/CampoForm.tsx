import { useState } from "react";

function CampoForm() {
    const [local, setLocal] = useState("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    type WeatherData = {
        location: {
            name: string;
            country: string;
        };
        current: {
            temp_c: number;
            condition: {
                text: string;
                icon: string;
            };
        };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocal(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const apiKey = "5a2b22bcd91a40b7a4c141247250311";
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${local}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Local não encontrado ou erro na API.");
            }
            const data: WeatherData = await response.json();
            setWeather(data);
        } catch {
            setError("Local não encontrado ou erro na API.");
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-full bg-[#008080] flex flex-col items-center py-4">
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
                    <label className="text-[#FFF]">Insira o País/Estado/Cidade:</label>
                    <input type="text" value={local} onChange={handleChange} className="px-2 py-1 rounded" placeholder="Ex: São Paulo" />
                    <button type="submit" className="btn-primary">Buscar clima</button>
                </form>
                {loading && <p className="text-white mt-2">Carregando...</p>}
                {error && <p className="text-red-200 mt-2">{error}</p>}
                {weather && (
                    <div className="bg-white rounded shadow p-4 mt-4 w-full max-w-xs text-center">
                        <h2 className="text-lg font-bold mb-2">{weather.location.name}, {weather.location.country}</h2>
                        <p className="text-gray-700">Temperatura: {weather.current.temp_c}°C</p>
                        <p className="text-gray-700">Condição: {weather.current.condition.text}</p>
                        <img src={weather.current.condition.icon} alt="Ícone do clima" className="mx-auto" />
                    </div>
                )}
            </div>
        </>
    );
}

export default CampoForm