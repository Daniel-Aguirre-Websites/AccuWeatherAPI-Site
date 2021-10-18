//#region apiKey
const apikey = "AY5ZIYn4AQCpD2opKRkVDS3nRYBfQ19N";
//#endregion

// This is used so that after the page loads, we can get the users location.
window.addEventListener('load', ()=> {

    // initialize some elements that I'm going to be working with to display the Name and Temperature Data

    // locationName to be able to edit the location name to the LocalizedName received from the API
    let locationName = document.querySelector('.location-LocalizedName');

    // do the same for the temperature-degree and description
    let temperatureSection = document.querySelector('.temperature');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let temperatureDescription = document.querySelector('.temperature-description');
    let weatherIcon = document.querySelector('.weather-icon');
    let degreeType = document.querySelector('.degree-type')

    // this will only work if the user allows the site to access geolocation
    if(navigator.geolocation){
        // this will allow us to use the users current position data
        navigator.geolocation.getCurrentPosition(position => {

            // I used this to view the position data within the console.
            // console.log(position);
            //

            // assign the logitude/latitude to the users location using geolocation.
            let longitude = position.coords.longitude;
            let latitude = position.coords.latitude;

            // the address to send a Get Request to the Accuweather API
            const accuAddr = `http://dataservice.accuweather.com`;

            // the GET request for location Key and Name
            const locationAPI = `${accuAddr}/locations/v1/cities/geoposition/search?apikey=${apikey}&q=${latitude}%2C%20${longitude}&language=en-us&details=true&toplevel=false`;                       
            
            // fetch the location data (results) from the locationAPI
            fetch(locationAPI).then(loc => {
                return loc.json();
            }).then(locationData => {

                // I used console.log(locationData) to view the JSON Object I received from my GET request
                // console.log(locationData);
                //

                // initialize a const for the Key and LocalizedName from the GeoPosition section of the results from the API                
                const locationKey = locationData.Key;
                const localizedName = locationData.LocalizedName
                
                // updated Location Name based on API results
                locationName.textContent = localizedName;
                
                // the GET request to send to AccueWeather API for current Conditions based on the locationKey
                const currentConditionsAPI = `${accuAddr}/currentconditions/v1/${locationKey}?apikey=${apikey}&language=en-us&details=true`;
                
                // fetch the current condition (results) from the CurrentConditionAPI
                fetch(currentConditionsAPI).then(cond => {
                    return cond.json();
                }).then(conditionData => {
    
                    // this console.log will show the results from the currentCondition API for current weather.
                    // console.log(conditionData);
                    //

                    // initialize a const for these values from our conditionData results.
                    const {Temperature, WeatherText, WeatherIcon} = conditionData[0];
                    
                    // update the current temperature on the site using F
                    temperatureDegree.textContent = Temperature.Imperial.Value;

                    // Display a summary received stating what the current weather is.
                    temperatureDescription.textContent = "The weather is currently: " + WeatherText;
                    
                    // Update the icon shown depending on the WeatherIcon data received.
                    // WeatherIcon is a number which is tied to an icon. These are stored in /WeatherIcons
                    weatherIcon.setAttribute('src', '/WeatherIcons/' + WeatherIcon + '.png')

                    // Change the temperature to Celsuis/Farenheit if temp section is clicked.
                    temperatureSection.addEventListener('click', ()=> {
                        
                        // if temperature is 
                        if(degreeType.textContent === "F"){
                            degreeType.textContent = "C";
                            temperatureDegree.textContent = Temperature.Metric.Value;
                        }
                        else {
                            degreeType.textContent = "F";
                            temperatureDegree.textContent = Temperature.Imperial.Value;
                        }
                    })
                });               
            });    
        })
    }
    // if we can't access geolocation then ask change h1 text
    else {
        h1.textContent = "Please allow your location to be accessed to use this site.";
    }
});

