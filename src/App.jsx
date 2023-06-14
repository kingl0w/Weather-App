import './styles/styles.scss';
import Descriptions from './components/descriptions';
import Cold from './assests/cold.jpg';
import Hot from './assests/hot.jpg';
import Rainy from './assests/rainy.jpg';
import Windy from './assests/windy.jpg';
import Cloudy from './assests/cloudy.jpg';
import { useEffect, useState } from 'react';
import { getFormattedWeatherData } from './weatherService';

function App() {
  const [city, setCity] = useState('Paris');
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('imperial');
  const [bg, setBg] = useState(Hot);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      //dynamic bg
      const threshold = units === 'imperial' ? 70 : ((70 - 32) * 5) / 9;

      if (data.temp <= threshold) setBg(Cloudy);
      else setBg(Hot);
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isFahrenheit = currentUnit === 'F';
    button.innerText = isFahrenheit ? '°C' : '°F';
    setUnits(isFahrenheit ? 'imperial' : 'metric');
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div
      className='app'
      style={{ backgroundImage: `url(${bg})` }}>
      <div className='overlay'>
        {weather && (
          <div className='container'>
            <div className='section section__inputs'>
              <input
                onKeyDown={enterKeyPressed}
                type='text'
                name='city'
                placeholder='Enter City...'
              />
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>
            <div className='section section__temp'>
              <div className='icon'>
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img
                  src={weather.iconURL}
                  alt='weatherIcon'
                />
                <h3>{weather.description}</h3>
              </div>
              <div className='temperature'>
                <h1>{`${weather.temp.toFixed()} °${
                  units === 'imperial' ? 'F' : 'C'
                }`}</h1>
              </div>
            </div>
            {/* bottom description */}
            <Descriptions
              weather={weather}
              units={units}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
