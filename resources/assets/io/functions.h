#include "ESP8266WiFi.h"
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h> 
#include <WiFiClientSecure.h>

// **********************************************************
//  Return string between 2 characters
// **********************************************************

String midString(String str, char start, char finish){
    int locStart = str.indexOf(start);
    if (locStart==-1) return "Start";

    int locFinish = str.lastIndexOf(finish);
    if (locFinish==-1) return "Finish";
    return str.substring(locStart, locFinish+1);
}

// **********************************************************
//  Retain the state of a push down button
// **********************************************************

int buttonPushCounter = 0;
int buttonState = 0;
int lastButtonState = 0;

int edgeDetectionButton(int buttonPin, int ledPin){
    buttonState = digitalRead(buttonPin);
    if (buttonState != lastButtonState) {
        if (buttonState) 
            buttonPushCounter++;
        delay(50);
    }
  
    // save the current state as the last state, for next time through the loop
    lastButtonState = buttonState;
    if (buttonPushCounter % 2 == 0) {
        digitalWrite(ledPin, HIGH);
        return 1;
    } else {
        digitalWrite(ledPin, LOW);
        return 0;
    }
}

// **********************************************************
//  Connect to a wifi network
// **********************************************************

void connectToWIFI(char *myssid, char *mypass){
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();
    delay(100);
    Serial.print("Connecting");
    WiFi.begin(myssid, mypass);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
     Serial.println(".");
}


// **********************************************************
//  Make a post request
// **********************************************************

String postRequest(String host, String page , String key, String JSON){
    String line;
    WiFiClientSecure client;

    //Connect to the client and make the api call
    if (client.connect(host, 443)) {
        client.println("POST " + page + key + " HTTP/1.1");
        client.println("host: " + (String)host);
        client.println("Connection: close");
        client.println("Content-Type: application/json");
        client.println("User-Agent: Arduino/1.0");
        client.print("Content-Length: ");
        client.println(JSON.length());
        client.println();
        client.print(JSON);
        delay(500);
    }

    //Read and parse all the lines of the reply from server
    while (client.available()) {
        line = client.readStringUntil('\r');
    }
    client.stop();
    return line;
}

// **********************************************************
//  Make a get request
// **********************************************************
String getRequest(const char*fingerprint, const char* host, String url)
{
    String line;
    // Use WiFiClientSecure class to create TLS connection
    WiFiClientSecure client;
    if (!client.connect(host, 443)) {
        Serial.println("connection failed");
        return "failed";
    }

    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "User-Agent: BuildFailureDetectorESP8266\r\n" +
               "Connection: close\r\n\r\n");

    while (client.connected()) {
        line += client.readStringUntil('\r');
    }

    return midString(line,'{','}');
}

// **********************************************************
//  Parse JSON Object
// **********************************************************

JsonObject& parseJson(const size_t bufferSize, String JSON)
{
    DynamicJsonBuffer jsonBuffer(bufferSize);
    JsonObject& root = jsonBuffer.parseObject(JSON);
    return root;
}