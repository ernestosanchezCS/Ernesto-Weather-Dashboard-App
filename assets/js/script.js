var timeDisplayEl = $(".time-display");
var searchButton = $(".btn-primary");
var cityInput = $("#cityInput");
var displayData = $(".info-display");
var cityName = $("#cityName");
var currentTemp = $("#currentTemp");
var currentWind = $("#currentWind");
var currentHumidity = $("#currentHumidity");
var currentUV = $("#currentUV");
var infoColumn = $("#infoColumn");

var rightNow;
var lon, lat;

var searchedCities = [];

function displayTime() {
    rightNow = moment().format("MMM DD, YYYY");
    timeDisplayEl.text(rightNow);
}

function searchCity(event) {
    event.preventDefault();
    console.log(searchedCities.length);
    searchedCities[searchedCities.length] = $.trim(cityInput.val());
    console.log($.trim(cityInput.val()));
    console.log(searchedCities.length - 1);
    //need to do some input verification here although api kind of does this for me?
    //we can go as far as using city codes for 200 000 cities because of things like city name
    //repeats to be really accurate... but i think the idea here is working with apis more then
    //string analyzing
    var apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchedCities[searchedCities.length - 1] +
        "&appid=68741e918f212970066212619bde266b&units=metric";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    //data contains object of all weather info on city searched
                    featuredCity(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
}

function extraCall() {
    var apiUrl2 =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=68741e918f212970066212619bde266b&units=metric";

    fetch(apiUrl2)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data2) {
                    console.log(data2);
                    forcastSection(data2);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
}

function featuredCity(data) {
    //need to clear all the weather data here in case they run this more then once or just tacks on to last search
    console.log(data.main.temp_min);
    infoColumn.attr("hidden", false);
    //add h4 to currentInfo id class with city name
    //name found in data.name
    //icons are at this address by name http://openweathermap.org/img/wn/01d@2x.png
    // gives icon code for selection from icons console.log(data.weather[0].icon);
    var image = new Image();
    image.src = "./assets/icons/" + data.weather[0].icon + "@2x.png";
    cityName.text("");
    cityName.text(data.name + "  (");
    cityName.append($("<span>" + rightNow + "</span>"));
    cityName.append(")");
    cityName.append(image);
    currentTemp.text("Temp: ");
    currentTemp.append(data.main.temp + "°C");
    //2.237 to get mph in wind speed we get in m/s
    currentWind.text("Wind: ");
    currentWind.append(data.wind.speed + " M/S");

    currentHumidity.text("Humidity: ");
    currentHumidity.append(data.main.humidity + "%");
    //currentUV.append(data.)
    //we can get Lat and Long from data
    console.log(data.coord.lon);
    console.log(data.coord.lat);
    lon = data.coord.lon;
    lat = data.coord.lat;
    extraCall();
}

function forcastSection(data2) {
    //since needed two api calls for all info needed
    //we get uv data
    console.log(data2);
    currentUV.text("UV Index: ");
    currentUV.append(data2.current.uvi);
    //need to add code to check if uv index is green or orange or yello depending on value set background
    currentUV.css("background-color", "green");

    //now we want to display 5 day forcast in the card group

    //seting date header
    var day1 = new Date();

    day1.setDate(day1.getDate() + 1);
    $("#day1 .card-header").text("");
    $("#day1 .card-header").text(day1.toDateString());
    //icon
    var image = new Image();
    image.src = "./assets/icons/" + data2.daily[0].weather[0].icon + "@2x.png";
    $("#day1 .card-title").text("");
    $("#day1 .card-title").append(image);
    //Temp
    $("#day1 #currentTemp").text("Temp: ");
    $("#day1 #currentTemp").append(data2.daily[0].temp.day + "°C");
    //Wind
    $("#day1 #currentWind").text("Wind: ");
    $("#day1 #currentWind").append(data2.daily[0].wind_speed + "M/S");
    //Humidity
    $("#day1 #currentHumidity").text("Humidity: ");
    $("#day1 #currentHumidity").append(data2.daily[0].humidity + "%");
}

setInterval(displayTime, 1000);

searchButton.on("click", searchCity);
