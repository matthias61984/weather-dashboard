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
                temperature: result.main.temp,
                humidity: result.main.humidity,
                windSpeed: result.wind.speed,
                uvIndex: result.visibility
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
    $("#selectedCityInfo").html(cityWeatherData.cityName + " 2/7/2020");
    $("#todayTemp").html(cityWeatherData.temperature);
    $("#todayHumidity").html(cityWeatherData.humidity);
    $("#todayWind").html(cityWeatherData.windSpeed);
    $("#todayVisibility").html(cityWeatherData.uvIndex);

    // Provide and show data for the five-day forecast
    // Day One
    $("#dayOneDate").html(cityWeatherData.fiveDayForecast.dayOne.date);
    $("#dayOneWeather").html(cityWeatherData.fiveDayForecast.dayOne.weather);
    $("#dayOneTemperature").html(cityWeatherData.fiveDayForecast.dayOne.temperature);
    $("#dayOneHumidity").html(cityWeatherData.fiveDayForecast.dayOne.humidity);
    // Day One
    $("#dayTwoDate").html(cityWeatherData.fiveDayForecast.dayTwo.date);
    $("#dayTwoWeather").html(cityWeatherData.fiveDayForecast.dayTwo.weather);
    $("#dayTwoTemperature").html(cityWeatherData.fiveDayForecast.dayTwo.temperature);
    $("#dayTwoHumidity").html(cityWeatherData.fiveDayForecast.dayTwo.humidity);
    // Day One
    $("#dayThreeDate").html(cityWeatherData.fiveDayForecast.dayThree.date);
    $("#dayThreeWeather").html(cityWeatherData.fiveDayForecast.dayThree.weather);
    $("#dayThreeTemperature").html(cityWeatherData.fiveDayForecast.dayThree.temperature);
    $("#dayThreeHumidity").html(cityWeatherData.fiveDayForecast.dayThree.humidity);
    // Day One
    $("#dayFourDate").html(cityWeatherData.fiveDayForecast.dayFour.date);
    $("#dayFourWeather").html(cityWeatherData.fiveDayForecast.dayFour.weather);
    $("#dayFourTemperature").html(cityWeatherData.fiveDayForecast.dayFour.temperature);
    $("#dayFourHumidity").html(cityWeatherData.fiveDayForecast.dayFour.humidity);
    // Day One
    $("#dayFiveDate").html(cityWeatherData.fiveDayForecast.dayFive.date);
    $("#dayFiveWeather").html(cityWeatherData.fiveDayForecast.dayFive.weather);
    $("#dayFiveTemperature").html(cityWeatherData.fiveDayForecast.dayFive.temperature);
    $("#dayFiveHumidity").html(cityWeatherData.fiveDayForecast.dayFive.humidity);

}
