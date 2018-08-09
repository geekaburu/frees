#include <ArduinoJson.h> 
#include <SoftwareSerial.h>
#include "ESP8266WiFi.h"
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

#include "env.h"
#include "nodetrait.h"

#define RXPin D2
#define TXPin D3

// Connect to WiFi
char* ssid = "Gichira";
char* password = "kaburu123";

// Google API parameters
const char* geolocationHost = "www.googleapis.com";
String geolocationPage = "/geolocation/v1/geolocate?key=";

// Storage API parameters
const char* apiHost = "project-solar.herokuapp.com";
String storagePage = "/api/panel/data";
String settingsPage = "/api/panel/settings/receive";

String buffer = "";
String response;

SoftwareSerial NodeSerial(RXPin, TXPin);

void getSettings() {
    // String response = getRequest(apiHost, settingsPage);
    //JsonObject& root = parseJson(2 * JSON_OBJECT_SIZE(2) + 60, response);
    // String mode = root["m"];
    // String runtime = root["r"];
    String mode = "1";
    String runtime = "15";
    delay(5000);

    for (int i = 0; i < 10; i++) {
        NodeSerial.print(" {\"m\":" + mode + ",");
        delay(500);
        NodeSerial.print(" \"r\":" + runtime + "}");
        delay(1000);
        NodeSerial.print("\n");
        Serial.println("Sent Configurations....");
        delay(1000);
    }
}

void setup() {
    pinMode(RXPin, INPUT);
    pinMode(TXPin, OUTPUT);
    Serial.begin(115200);
    NodeSerial.begin(9600);
    connectToWIFI(ssid, password);
    getSettings();
}

void loop() {
    Serial.println("Main Loop");
    if (Serial.available() > 0) {
        // {"m":2, "r":40} 
        String buffer = Serial.readString();
        Serial.println(buffer);
        JsonObject& root = parseJson(JSON_OBJECT_SIZE(2) + 10 + 10, buffer);
        String mode = root["m"];
        String runtime = root["r"];

        // Send to serial
        NodeSerial.print(" {\"m\":" + mode + ",");
        delay(500);
        NodeSerial.print(" \"r\":" + runtime + "}");
        delay(1000);
        NodeSerial.print("\n");
        Serial.println("Sent Manual Configurations....");
        delay(1000);
    }
    if (WiFi.status() == WL_CONNECTED) {
        while (NodeSerial.available() > 0) {
            if (NodeSerial.read() == '\n') {

                Serial.println("SENDING DATA TO SERVER");
                delay(5000);

                //----------Get the current state and location of the device---------------//
                // response = postRequest(geolocationHost, geolocationPage, geolocationKey, "{\n\n}");
                // Serial.println(response);
                // delay(500);

                //JsonObject& root = parseJson(2 * JSON_OBJECT_SIZE(2) + 60, response);
                // double latitude = root["location"]["lat"];
                // double longitude = root["location"]["lng"];
                double latitude = -1.2980124;
                double longitude = 36.8842065;

                buffer += " \"device\":\"888888\",";
                buffer += " \"latitude\":" + String(latitude, 7) + ",";
                buffer += " \"longitude\":" + String(longitude, 7) + "\n}";

                Serial.println(buffer);

                // response = postRequest(apiHost, storagePage, "", buffer);
                // Serial.println(response);
                delay(5000);
                Serial.println("Received connection...");
                buffer = "";
                getSettings();
            } else {
                buffer += NodeSerial.readString();
            }
        }
    }
}