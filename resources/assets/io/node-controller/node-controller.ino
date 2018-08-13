// **********************************************************
//  Include libraries and define constants
// **********************************************************
#include <ArduinoJson.h> 
#include "ESP8266WiFi.h"
#include <SoftwareSerial.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>

#include "env.h"
#include "trait.h"

#define RXPin D2
#define TXPin D3

// **********************************************************
//  Define variables
// **********************************************************
// WiFI Parameters
char* ssid = "Gichira";
char* password = "kaburu123";

// Google API parameters
const char* geolocationHost = "www.googleapis.com";
String geolocationPage = "/geolocation/v1/geolocate?key=";

// Storage API parameters
const char* apiHost = "gichirakaburu.amprest.co.ke";
String storageLink = "/api/panel/receive-panel-data";
String settingsPage = "/api/panel/settings/receive";

String buffer = "";
String response;

SoftwareSerial NodeSerial(RXPin, TXPin);

// **********************************************************
//  Define the loop method
// **********************************************************
void setup() {
    Serial.begin(115200);
    NodeSerial.begin(9600);

    pinMode(RXPin, INPUT);
    pinMode(TXPin, OUTPUT);
    connectToWIFI(ssid, password);
}
// **********************************************************
//  Define the loop method
// **********************************************************
void loop() {

    // -------------------------------------------------------
    // Action if WiFi is connected
    // -------------------------------------------------------
    if (WiFi.status() == WL_CONNECTED) {

        // -------------------------------------------------------
        // Listen for incoming data
        // -------------------------------------------------------
        while (NodeSerial.available() > 0) {
            if (NodeSerial.read() == '\n') {
                Serial.println("Sending data to server...");
                delay(5000);

                // -------------------------------------------------------
                // Action if WiFi is connected
                // -------------------------------------------------------
                response = postRequest(geolocationHost, geolocationPage, geolocationKey, "{\n\n}");
                Serial.println(response);
                delay(500);

                // -------------------------------------------------------
                // Get the logitude and latitude
                // -------------------------------------------------------
                JsonObject& root = parseJson(2 * JSON_OBJECT_SIZE(2) + 60, response);
                double latitude = root["location"]["lat"];
                double longitude = root["location"]["lng"];

                buffer += " \"device\":\"888888\",";
                buffer += " \"latitude\":" + String(latitude, 7) + ",";
                buffer += " \"longitude\":" + String(longitude, 7) + "\n}";
                Serial.println(buffer);

                // -------------------------------------------------------
                // Post data to the server
                // -------------------------------------------------------
                response = postRequest(apiHost, storageLink, "", buffer);
                Serial.println(response);
                delay(1000);
                Serial.println("Received connection...");
                buffer = "";
            } else {
                buffer += NodeSerial.readString();
            }
        }
    }
}