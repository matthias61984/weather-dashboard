$(document).ready(function() {
    $("#searchCityForm").submit(function(event) {
        var cityInput = $("#cityInputField").val();
        
        if (cityInput) {
            var newCityButton = $("<button>").addClass("btn btn-outline-info cityPresetBtn").attr("id", cityInput).html(cityInput);
            var lineBreak = $("<br />");
            $("#cityPresetBtnsDiv").append(newCityButton);
            $("#cityPresetBtnsDiv").append(lineBreak);
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

function getTodaysWeatherForCity(city) {
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
        complete: function(result) {
            getForecastForCity(city, apiKey, cityWeatherData);
        }
    });
}

function getForecastForCity(city, apiKey, cityWeatherData) {
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

function renderForecast(cityWeatherData) {
    console.log(cityWeatherData);
    // Provide data to the current day's forecast
    $("#selectedCityInfo").html(cityWeatherData.cityName + " " + formatUnixToDate(cityWeatherData.date));
    $("#todayTemp").html(kelvinToFahrenheit(cityWeatherData.temperature) + "&#176;F");
    $("#todayHumidity").html(cityWeatherData.humidity + "% humidity").css("color", determineHumidityColorDisplay(cityWeatherData.humidity));
    $("#todayWind").html(cityWeatherData.windSpeed + " mph wind speed");

    // Day One
    $("#dayOneDate").html(formatCardDate(cityWeatherData.fiveDayForecast.dayOne.date));
    $("#dayOneWeather").attr("src", determineWeatherIcon(cityWeatherData.fiveDayForecast.dayOne.weather));
    $("#dayOneTemperature").html(kelvinToFahrenheit(cityWeatherData.fiveDayForecast.dayOne.temperature) + "&#176;F");
    $("#dayOneHumidity").html(cityWeatherData.fiveDayForecast.dayOne.humidity + "% humidity").css("color", determineHumidityColorDisplay(cityWeatherData.fiveDayForecast.dayOne.humidity));

    // Day One
    $("#dayTwoDate").html(formatCardDate(cityWeatherData.fiveDayForecast.dayTwo.date));
    $("#dayTwoWeather").attr("src", determineWeatherIcon(cityWeatherData.fiveDayForecast.dayTwo.weather));
    $("#dayTwoTemperature").html(kelvinToFahrenheit(cityWeatherData.fiveDayForecast.dayTwo.temperature) + "&#176;F");
    $("#dayTwoHumidity").html(cityWeatherData.fiveDayForecast.dayTwo.humidity + "% humidity").css("color", determineHumidityColorDisplay(cityWeatherData.fiveDayForecast.dayTwo.humidity));

    // Day One
    $("#dayThreeDate").html(formatCardDate(cityWeatherData.fiveDayForecast.dayThree.date));
    $("#dayThreeWeather").attr("src", determineWeatherIcon(cityWeatherData.fiveDayForecast.dayThree.weather));
    $("#dayThreeTemperature").html(kelvinToFahrenheit(cityWeatherData.fiveDayForecast.dayThree.temperature) + "&#176;F");
    $("#dayThreeHumidity").html(cityWeatherData.fiveDayForecast.dayThree.humidity + "% humidity").css("color", determineHumidityColorDisplay(cityWeatherData.fiveDayForecast.dayThree.humidity));

    // Day One
    $("#dayFourDate").html(formatCardDate(cityWeatherData.fiveDayForecast.dayFour.date));
    $("#dayFourWeather").attr("src", determineWeatherIcon(cityWeatherData.fiveDayForecast.dayFour.weather));
    $("#dayFourTemperature").html(kelvinToFahrenheit(cityWeatherData.fiveDayForecast.dayFour.temperature) + "&#176;F");
    $("#dayFourHumidity").html(cityWeatherData.fiveDayForecast.dayFour.humidity + "% humidity").css("color", determineHumidityColorDisplay(cityWeatherData.fiveDayForecast.dayFour.humidity));
    
    // Day One
    $("#dayFiveDate").html(formatCardDate(cityWeatherData.fiveDayForecast.dayFive.date));
    $("#dayFiveWeather").attr("src", determineWeatherIcon(cityWeatherData.fiveDayForecast.dayFive.weather));
    $("#dayFiveTemperature").html(kelvinToFahrenheit(cityWeatherData.fiveDayForecast.dayFive.temperature) + "&#176;F");
    $("#dayFiveHumidity").html(cityWeatherData.fiveDayForecast.dayFive.humidity + "% humidity").css("color", determineHumidityColorDisplay(cityWeatherData.fiveDayForecast.dayFive.humidity));

    $("#forecastWindow").show();
}

// Helper functions
function determineWeatherIcon(weather) {
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

function formatCardDate(dateString) {
    var newDate;
    var removeHours = dateString.slice(0, 10);
    var dateArray = removeHours.split("-")
    newDate = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
    return newDate;
}

function formatUnixToDate(timestamp) {
    var a = new Date(timestamp * 1000);
    var date = a.getDate();
    var month = a.getMonth() + 1;
    var year = a.getFullYear();
    var timeString = month + "/" + date + "/" + year;
    return timeString; 
}

function kelvinToFahrenheit(k) {
    var f = Math.round(((k - 273.15) * 9/5) + 32);
    return f;
}

function determineHumidityColorDisplay(humidity) {
    if (humidity >= 85) {
        return 'red';
    } else if (humidity >= 50) {
        return 'orange';
    } else {
        return 'green';
    }
}
