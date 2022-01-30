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
var prevCities = $("#prevCities");

var rightNow;
var lon, lat;

var searchedCities = [];
//we need to load previous searches on page load with for loop for searchedCities length

function displayTime() {
    rightNow = moment().format("MMM DD, YYYY");
    timeDisplayEl.text(rightNow);
}

infoColumn.attr("hidden", true);

//we need to load saved activites when open the page
if (!(localStorage.getItem("searchedCities") == null)) {
    //have stored data
    searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
    //searchedCities now has the object stored
    for (i = 0; i < searchedCities.length; i++) {
        var cityNamed = searchedCities[i];
        var button = $("<button></button>").text(cityNamed);
        button.addClass("btn-block btn-secondary mt-2");
        prevCities.append(button);
        console.log(searchedCities);
    }
    //we update to localStorage\
}

function searchCity(event) {
    //if event.target is search we do below if not we need to get the value diff way since not input but button

    event.preventDefault();

    if (!(event.target.value == "Search")) {
        //here we clicked button of prev search
        var buttonName = event.target.innerHTML;
        //var buttonName = $.trim(event.target.val());
        console.log(buttonName);

        var apiUrl =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            buttonName +
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
    } else {
        //here we searchin through main search
        console.log(searchedCities);
        searchedCities[searchedCities.length] = $.trim(cityInput.val());
        var cityName = $.trim(cityInput.val());
        var button = $("<button></button>").text(cityName);
        button.addClass("btn-block btn-secondary mt-2");
        prevCities.append(button);
        console.log(searchedCities);
        //we update to localStorage\
        localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

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

    lon = data.coord.lon;
    lat = data.coord.lat;
    extraCall();
}

function forcastSection(data2) {
    //since needed two api calls for all info needed

    currentUV.text("UV Index: ");
    currentUV.append(data2.current.uvi);

    //sets uvi index background depending on value
    if (data2.current.uvi < 3) {
        currentUV.css("background-color", "green");
    } else if (data2.current.uvi < 6) {
        currentUV.css("background-color", "yellow");
    } else if (data2.current.uvi < 8) {
        currentUV.css("background-color", "orange");
    } else if (data2.current.uvi < 11) {
        currentUV.css("background-color", "red");
    } else {
        currentUV.css("background-color", "purple");
    }

    //loop to set the 5 day forcast values
    for (i = 0; i < 5; i++) {
        var day = new Date();
        day.setDate(day.getDate() + (1 + i));
        $("#day" + i + " .card-header").text("");
        $("#day" + i + " .card-header").text(day.toDateString());
        //icon
        var image = new Image();
        image.src =
            "./assets/icons/" + data2.daily[i].weather[0].icon + "@2x.png";
        $("#day" + i + " .card-title").text("");
        $("#day" + i + " .card-title").append(image);
        //Temp
        $("#day" + i + " #currentTemp").text("Temp: ");
        $("#day" + i + " #currentTemp").append(data2.daily[i].temp.day + "°C");
        //Wind
        $("#day" + i + " #currentWind").text("Wind: ");
        $("#day" + i + " #currentWind").append(
            data2.daily[i].wind_speed + "M/S"
        );
        //Humidity
        $("#day" + i + " #currentHumidity").text("Humidity: ");
        $("#day" + i + " #currentHumidity").append(
            data2.daily[i].humidity + "%"
        );
    }
}

setInterval(displayTime, 1000);

searchButton.on("click", searchCity);
prevCities.on("click", searchCity);
