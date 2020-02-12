$(document).ready(function() {
    $("#searchCityForm").submit(function(event) {
        var cityInput = $("#cityInputField").val();
        
        if (cityInput) {
            var newCityButton = $("<button>").addClass("btn btn-outline-info cityPresetBtn").attr("id", cityInput).html(cityInput);
            $("#cityPresetBtnsDiv").append(newCityButton);
            $("#cityPresetBtnsDiv").append("<br />");
            $("#cityInputField").val("");
            event.preventDefault();
        }

        $(".cityPresetBtn").click(function(event) {
            var city = $(this).attr("id");
            getTodaysWeatherForCity(city);
            event.preventDefault();
        });
    });
});

var getTodaysWeatherForCity = function(city) {
    var apiKey = "2388a216fc6239bbe2df42037a6eadf1";
    var cityWeatherData = {};
    $.ajax({
        method: 'GET',
        dataType: "jsonp",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&APPID=" + apiKey,
        success: function(result) {
            cityWeatherData = {
                cityName: result.name,
                date: result.dt,
                temperature: result.main.temp,
                humidity: result.main.humidity,
                windSpeed: result.wind.speed
            };
        },
        error: function(error) {
            throw(error);
        },
        complete: function() {
            getForecastForCity(city, apiKey, cityWeatherData);
        }
    });
}

var getForecastForCity = function(city, apiKey, cityWeatherData) {
    $.ajax({
        method: 'GET',
        dataType: "jsonp",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&APPID=" + apiKey,
        success: function(result) {
            cityWeatherData.fiveDayForecast = {
                dayOne: {
                    date: result.list[4].dt_txt,
                    weather: result.list[4].weather[0].main,
                    temperature: result.list[4].main.temp,
                    humidity: result.list[4].main.humidity,
                },
                dayTwo: {
                    date: result.list[12].dt_txt,
                    weather: result.list[12].weather[0].main,
                    temperature: result.list[12].main.temp,
                    humidity: result.list[12].main.humidity,
                },
                dayThree: {
                    date: result.list[20].dt_txt,
                    weather: result.list[20].weather[0].main,
                    temperature: result.list[20].main.temp,
                    humidity: result.list[20].main.humidity,
                },
                dayFour: {
                    date: result.list[28].dt_txt,
                    weather: result.list[28].weather[0].main,
                    temperature: result.list[28].main.temp,
                    humidity: result.list[28].main.humidity,
                },
                dayFive: {
                    date: result.list[36].dt_txt,
                    weather: result.list[36].weather[0].main,
                    temperature: result.list[36].main.temp,
                    humidity: result.list[36].main.humidity,
                }
            };
        },
        error: function(error) {
            throw(error);
        },
        complete: function() {
            renderForecast(cityWeatherData);
        }
    });
}

var renderForecast = function(cityWeatherData) {
    
    var dayOne = cityWeatherData.fiveDayForecast.dayOne;
    var dayTwo = cityWeatherData.fiveDayForecast.dayTwo;
    var dayThree = cityWeatherData.fiveDayForecast.dayThree;
    var dayFour = cityWeatherData.fiveDayForecast.dayFour;
    var dayFive = cityWeatherData.fiveDayForecast.dayFive;

    // Current Day
    $("#selectedCityInfo").html(cityWeatherData.cityName + " " + formatUnixToDate(cityWeatherData.date));
    $("#todayTemp").html(kelvinToFahrenheit(cityWeatherData.temperature) + "&#176;F");
    $("#todayHumidity").html(cityWeatherData.humidity + "% humidity").css("color", determineHumidityColorDisplay(cityWeatherData.humidity));
    $("#todayWind").html(cityWeatherData.windSpeed + " mph wind speed");

    // Day One
    renderFiveDayForecastDay("#dayOneDate", "#dayOneWeather", "#dayOneTemperature", "#dayOneHumidity", dayOne);

    // Day Two
    renderFiveDayForecastDay("#dayTwoDate", "#dayTwoWeather", "#dayTwoTemperature", "#dayTwoHumidity", dayTwo);

    // Day Three
    renderFiveDayForecastDay("#dayThreeDate", "#dayThreeWeather", "#dayThreeTemperature", "#dayThreeHumidity", dayThree);

    // Day Four
    renderFiveDayForecastDay("#dayFourDate", "#dayFourWeather", "#dayFourTemperature", "#dayFourHumidity", dayFour);
    
    // Day Five
    renderFiveDayForecastDay("#dayFiveDate", "#dayFiveWeather", "#dayFiveTemperature", "#dayFiveHumidity", dayFive);

    $("#forecastWindow").show();
}

var renderFiveDayForecastDay = function(dateDiv, weatherDiv, temperatureDiv, humidityDiv, dayObj) {
    $(dateDiv).html(formatCardDate(dayObj.date));
    $(weatherDiv).attr("src", determineWeatherIcon(dayObj.weather));
    $(temperatureDiv).html(kelvinToFahrenheit(dayObj.temperature) + "&#176;F");
    $(humidityDiv).html(dayObj.humidity + "% humidity").css("color", determineHumidityColorDisplay(dayObj.humidity));
}

// Helper functions
var determineWeatherIcon = function(weather) {
    switch (weather) {
        case 'Clear':
            return "./assets/images/sunny.png";
        case 'Clouds':
            return "./assets/images/cloudy.png";
        case 'Rain':
            return "./assets/images/rainy.png";
        case 'Snow':
            return "./assets/images/snowy.png"
        default:
            return "";
    }
}

var formatCardDate = function(dateString) {
    var newDate;
    var removeHours = dateString.slice(0, 10);
    var dateArray = removeHours.split("-")
    newDate = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
    return newDate;
}

var formatUnixToDate = function(timestamp) {
    var a = new Date(timestamp * 1000);
    var date = a.getDate();
    var month = a.getMonth() + 1;
    var year = a.getFullYear();
    var timeString = month + "/" + date + "/" + year;
    return timeString; 
}

var kelvinToFahrenheit = function(k) {
    var f = Math.round(((k - 273.15) * 9/5) + 32);
    return f;
}

var determineHumidityColorDisplay = function(humidity) {
    if (humidity >= 85) {
        return 'red';
    } else if (humidity >= 50) {
        return 'orange';
    } else {
        return 'green';
    }
}
