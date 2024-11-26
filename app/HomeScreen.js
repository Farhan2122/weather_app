import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SimpleLineIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "@/api/weather";
import { weatherImages } from "@/constants";
import * as Progress from "react-native-progress";

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  

  const handleLocation = (loc) => {
    // console.log('location', loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      // console.log('got forecast: ',data)
    });
  };

  const handleSearch = (value) => {
    // fetch locations
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };
  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: "Islamabad",
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/bbb.jpg")}
        style={styles.backgroundImage}
      />

      {loading ? (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Progress.CircleSnail thickness={10} size={140} />
        </View>
      ) : (
        <SafeAreaView style={styles.safeArea}>
          {/* Search Section */}
          <View
            style={[
              styles.searchContainer,
              { backgroundColor: showSearch ? "white" : "transparent" },
            ]}
          >
            <View style={styles.searchInnerContainer}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search City"
                  placeholderTextColor="black"
                  style={styles.searchInput}
                />
              ) : null}

              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={styles.button}
              >
                <SimpleLineIcons name="magnifier" size={24} color="black" />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View style={styles.locationSearch}>
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? { borderBottomWidth: 2, borderBottomColor: "#ccc" }
                    : {};
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      style={[styles.searchHintBtn, borderClass]}
                    >
                      <FontAwesome name="map-marker" size={24} color="black" />
                      <Text style={styles.suggestionText}>
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* forecast section */}

          <View style={styles.forecastSection}>
            {/* location details */}
            <Text style={styles.locationText}>
              {location?.name},
              <Text style={styles.locationDetailsText}>
                {" " + location?.country}
              </Text>
            </Text>
            {/* weather image */}
            <View style={styles.weatherImageContainer}>
              <Image
                source={weatherImages[current?.condition?.text]}
                style={styles.weatherImage}
              />
            </View>
            {/* degree celcious */}
            <View style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <Text style={styles.celciousTemp}>{current?.temp_c}°</Text>
              <Text
                style={styles.humidityText}
              >
                {current?.condition?.text}
              </Text>
            </View>
            {/* other stats */}
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    margin: 0,
                    gap: 8,
                  }}
                >
                  <Image
                    source={require("../assets/icons/wind.png")}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                  />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    {current?.wind_kph}km
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    margin: 0,
                    gap: 8,
                  }}
                >
                  <Image
                    source={require("../assets/icons/drop.png")}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                  />
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    {current?.humidity}%
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    margin: 0,
                    gap: 8,
                  }}
                >
                  <Image
                    source={require("../assets/icons/sun.png")}
                    style={{height: 24,width: 24, }}/>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* forecast for next days */}
          <View style={{ marginBottom: 8 }}>
            <View style={styles.nxtdaysforecastView}>
              <AntDesign name="calendar" size={22} color="white" />
              <Text
                style={{ color: "#FFFFFF", fontSize: 16, marginHorizontal: 10 }}
              >
                Daily forecast
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: "long" };
                let dayname = date.toLocaleDateString("en-US", options);
                return (
                  <View key={index} style={styles.weatherForecastView}>
                    <Image
                      source={weatherImages[item?.day?.condition?.text]}
                      style={{ width: 44, height: 44 }}
                    />
                    <Text style={{ color: "white" }}>{dayname}</Text>
                    <Text style={styles.AvgTemStyle}>
                      {item?.day?.avgtemp_c}°
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    height: "7%",
    marginHorizontal: 16,
    borderRadius: 15,
    opacity: 0.9,
  },
  searchInnerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 50,
  },
  searchInput: {
    paddingLeft: 24,
    height: 40,
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  button: {
    borderRadius: 30,
    margin: 4,
    padding: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  locationSearch: {
    position: "absolute",
    width: "100%",
    backgroundColor: "gray",
    top: 16,
    borderRadius: 12,
  },
  searchHintBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  suggestionText: {
    color: "black",
    fontSize: 18,
    marginLeft: 8,
  },
  forecastSection: {
    marginHorizontal: 16,
    flexDirection: "column",
    justifyContent: "space-around",
    flex: 1,
    marginBottom: 8,
  },
  locationText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  locationDetailsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#C7C5B5",
  },
  weatherImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  weatherImage: {
    width: 208,
    height: 208,
  },
  celciousTemp: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 64,
    marginLeft: 20,
  },
  weatherForecastView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 96,
    borderRadius: 36,
    paddingTop: 12,
    paddingBottom: 12,
    marginHorizontal: 0,
    marginVertical: 0,
    marginRight: 16,
  },

  AvgTemStyle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
  },
  humidityText:{
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 24,
    letterSpacing: 4,
  },
  nxtdaysforecastView:{
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    justifyContent: "flex-start",
  }
});
