$(document).ready(function() {
  getWeatherAndPositionData();
});

function getWeatherAndPositionData() {
  if (navigator.geolocation) {
    position = navigator.geolocation.getCurrentPosition(displayPosition);
   } 
 }

function displayPosition(position) {
      $.getJSON("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude+ "&sensor=false", function(json) {
     var addressCity = JSON.stringify(json.results[0].address_components[3].long_name);
     addressCity = addressCity.replace(/"/g, "");
     var addressCountry = JSON.stringify(json.results[0].address_components[5].long_name);
     addressCountry = addressCountry.replace(/"/g, "");
     $("#geo-data").html(addressCity + ", " + addressCountry);
      });
      getWeather(position);
    }

function getWeather(position) {
  var weatherInfo = '';
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=5f7bcf238dc7056a7325948af9cb61be", function(json) {
    displayWeather(json);
  });
}

function displayWeather(json) {
  var weatherId = JSON.stringify(json.weather[0].id);
  var weatherDesc = JSON.stringify(json.weather[0].main);
  var temperature = JSON.stringify(json.main.temp);
  var weatherPressure = JSON.stringify(json.main.pressure);
  var windSpeed = JSON.stringify(json.wind.speed);
  var humidity = JSON.stringify(json.main.humidity);
  var currentDate = new Date();
  var sunriseTime = convertDate(JSON.stringify(json.sys.sunrise));
  var sunsetTime = convertDate(JSON.stringify(json.sys.sunset));
  var timeOfDay = getTimeOfDay(currentDate, sunriseTime, sunsetTime);
  displayCurrentDateAndTime(currentDate);
  displayGeneralInfo(weatherDesc);
  displaySunsetSunrise(sunriseTime, sunsetTime);
  displayWindPressHum(windSpeed, weatherPressure, humidity);
  displayTemperature(temperature);
  chooseBackImg(weatherId, timeOfDay);
}

function displayCurrentDateAndTime(d) {
  var dayOfWeek = parseDayOfWeek(d);
  var date = dayOfWeek + ", " + parseDate(d);
  var time = parseTime(d);
  $("#date").html(date);
  $("#current-time").html(time);
}

function parseTime(d) {
  var hour = d.getHours();
  if (hour < 10) hour = "0" + hour;
  var minutes = d.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  return hour + ":" + minutes;
}

function parseDayOfWeek(d) {
  var daysOfWeekArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeekArray[d.getDay()];
}

function parseDate(d) {
  var dateDay = parseInt(d.getDate());
  if (dateDay < 10 ) dateDay = "0" + dateDay;
  var dateMonth = parseInt(d.getMonth())+1;
  if (dateMonth < 10 ) dateMonth = "0" + dateMonth;
  var dateYear = d.getFullYear();
  return dateDay + "." + dateMonth + "." + dateYear;
}

function convertDate(time) {
    var d = new Date(0);
    d.setUTCSeconds(time);
    return d;
}

function covertKelvinToCelcius(kelvin) {
  return Math.floor(kelvin - 273.15);
}

function covertKelvinFahrenheit(kelvin) {
  return Math.floor(1.8*(kelvin-273.15)+32);
}

function fahrToCel(fahr) {
  return Math.floor((fahr-32)*(5/9));
}

function celToFahr(cel) {
  return Math.ceil((cel*(9/5))+32);
}

function displayGeneralInfo(info) {
  info = info.replace(/"/g, '');
  $("#general-info").html(info);
}

function displaySunsetSunrise(sunriseTime, sunsetTime) {
  var sunrise = parseTime(sunriseTime);
  var sunset = parseTime(sunsetTime);
  var html = "<br>" + sunrise;
  $("#sunrise-info").append(html);
  html = "<br>" + sunset;
  $("#sunset-info").append(html);
}

function displayWindPressHum(wind, pressure, humidity) {
  var windSpeed = wind + " m/s";
  var pressure = pressure + " hPa";
  var humidity = humidity + "%";
  $("#wind-info").append("<br>" + windSpeed);
  $("#pressure-info").append("<br>" + pressure);
  $("#humidity-info").append("<br>" + humidity);
}

function displayTemperature(temperature) {
  var html = '';
  var weatherTempCelcius = covertKelvinToCelcius(parseFloat(temperature));  
  html = "<div>" + weatherTempCelcius + "&deg;C <span id='inact'>&deg;F</span></div>";
  $("#temp-wraper").html(html);
}

function getTimeOfDay(currentDate, sunriseTime, sunsetTime) {
  var currentTime = parseTime(currentDate);
  var sunrise = parseTime(sunriseTime);
  var sunset = parseTime(sunsetTime);
  if (currentTime > sunrise && currentTime < sunset) return "day";
  return "night";
}

function chooseBackImg(weatherId, timeOfDay) {
  if (timeOfDay == "day") chooseBackImgDay(weatherId);
  chooseBackImgNight(weatherId);
}

function chooseBackImgDay(weatherId){
    if (weatherId >= 200 && weatherId < 300) {
        $('body').css("background-image", "url(http://feelgrafix.com/data_images/out/10/842709-lightning.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/chance-of-storm-xxl.png");
    } else if (weatherId >= 300 && weatherId < 400) {
        $('body').css("background-image", "url(http://i4.tietuku.cn/2b8c0ba9e08a44f1.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/rain-xxl.png");
    } else if (weatherId >= 500 && weatherId < 600) {
        $('body').css("background-image", "url(https://images5.alphacoders.com/312/312372.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/rain-xxl.png");
    } else if (weatherId >= 600 && weatherId < 700) {
        $('body').css("background-image", "url(http://www.ambwallpapers.com/wp-content/uploads/2015/05/fruits_snowflakes_falling-Download.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/snow-xxl.png");
    } else if (weatherId >= 700 && weatherId < 800) {
        $('body').css("background-image", "url(https://becauseblogdotcom.files.wordpress.com/2011/11/foggy-day-but-climbing-was-ok4.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/fog-day-xxl.png");
    } else if (weatherId == 800) {
        $('body').css("background-image", "url(https://solodialogue.files.wordpress.com/2011/02/bright-blue-sky-with-a-few-tiny-white-clouds.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/sun-xxl.png");
    } else if (weatherId > 800 && weatherId < 900) {
        $('body').css("background-image", "url(http://openwalls.com/image/17483/sunrays_on_a_cloudy_day_1680x1050.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/clouds-xxl.png");
    } else if (weatherId >= 900 && weatherId < 950) {
        $('body').css("background-image", "url(https://nccoskywarn.files.wordpress.com/2015/05/tornado-widescreen-wallpaper-tv00t.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/chance-of-storm-xxl.png");
    } else {
        $('body').css("background-image", "url(http://www.win10themes.com/wp-content/uploads/2016/03/Weather-Wallpaper-Pictures.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/sun-with-grey-cloud.png");
    }
  $("#overlay").hide();
}

function chooseBackImgNight(weatherId){
    if (weatherId >= 200 && weatherId < 300) {
        $('body').css("background-image", "url(http://feelgrafix.com/data_images/out/10/842709-lightning.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/chance-of-storm-xxl.png");
    } else if (weatherId >= 300 && weatherId < 400) {
        $('body').css("background-image", "url(http://i4.tietuku.cn/2b8c0ba9e08a44f1.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/rain-xxl.png");
    } else if (weatherId >= 500 && weatherId < 600) {
        $('body').css("background-image", "url(https://images5.alphacoders.com/312/312372.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/rain-xxl.png");
    } else if (weatherId >= 600 && weatherId < 700) {
        $('body').css("background-image", "url(http://www.ambwallpapers.com/wp-content/uploads/2015/05/fruits_snowflakes_falling-Download.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/snow-xxl.png");
    } else if (weatherId >= 700 && weatherId < 800) {
        $('body').css("background-image", "url(https://becauseblogdotcom.files.wordpress.com/2011/11/foggy-day-but-climbing-was-ok4.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/fog-day-xxl.png");
    } else if (weatherId == 800) {
        $('body').css("background-image", "url(https://solodialogue.files.wordpress.com/2011/02/bright-blue-sky-with-a-few-tiny-white-clouds.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/sun-xxl.png");
    } else if (weatherId > 800 && weatherId < 900) {
        $('body').css("background-image", "url(http://openwalls.com/image/17483/sunrays_on_a_cloudy_day_1680x1050.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/clouds-xxl.png");
    } else if (weatherId >= 900 && weatherId < 950) {
        $('body').css("background-image", "url(https://nccoskywarn.files.wordpress.com/2015/05/tornado-widescreen-wallpaper-tv00t.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/chance-of-storm-xxl.png");
    } else {
        $('body').css("background-image", "url(http://www.win10themes.com/wp-content/uploads/2016/03/Weather-Wallpaper-Pictures.jpg)");
        $("#weather-icon").attr("src","https://s3-us-west-2.amazonaws.com/s.cdpn.io/559464/sun-with-grey-cloud.png");
    }
  $("#overlay").hide();
}

$("#temp-wraper").click(function(){
  var currentTemp = $("#temp-wraper").html();
  if (currentTemp.match(/[0-9][0-9]*.C/)) {
    currentTemp = parseInt(currentTemp.replace(/[^0-9]/g, ''));
    currentTemp = celToFahr(currentTemp);
    html = "<div>" + currentTemp + "&deg;F <span id='inact'>&deg;C</span></div>";;
    $("#temp-wraper").html(html);
  } else {
    currentTemp = parseInt(currentTemp.replace(/[^0-9]/g, ''));
    currentTemp = fahrToCel(currentTemp);
    html = "<div>" + currentTemp + "&deg;C <span id='inact'>&deg;F</span></div>";
    $("#temp-wraper").html(html);
  }
});