// **********************************************************
//  Connect to WIFI
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
    Serial.println(".\n");

}

// **********************************************************
//  Get the string between 2 characters
// **********************************************************
String midString(String str, char start, char finish){
    int locStart = str.indexOf(start);
    int locFinish = str.lastIndexOf(finish);
    return str.substring(locStart, locFinish+1);
}

// **********************************************************
//  Secured Post Request
// **********************************************************
String postRequest(const char* host, String page, String key, String JSON){
    String line;
    WiFiClientSecure client;

    //Connect to the client and make the api call
    if (client.connect(host, 443)) {
        Serial.println("Connected to " + (String) host);
        client.println("POST " + page + key + " HTTP/1.1");
        client.println("Host: " + (String)host);
        client.println("Connection: close");
        client.println("Content-Type: application/json");
        client.println("User-Agent: Arduino/1.0");
        client.println("Cache-Control: no-cache");
        client.print("Content-Length: ");
        client.println(JSON.length());
        client.println();
        client.print(JSON);
        delay(500);
    } else{
      Serial.println("Not connected");
    }

    //Read and parse all the lines of the reply from server
    while (client.available()) {
        line = client.readString();
    }
    client.stop();
    delay(1000);
    return midString(line, '{', '}');
}

// **********************************************************
//  Make a get request
// **********************************************************
String getRequest(const char* host, String url)
{
    String line = "";
    // Use WiFiClientSecure class to create TLS connection
    WiFiClientSecure client;
    connect:
	    if (!client.connect(host, 443)) {
	    	goto connect;
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
//  Parse a JSON Object
// **********************************************************
JsonObject& parseJson(const size_t bufferSize, String JSON){
  DynamicJsonBuffer jsonBuffer(bufferSize);
  JsonObject& root = jsonBuffer.parseObject(JSON);
  return root;
}

// **********************************************************
//  Generate JSON for Serial
// **********************************************************
void generateSerialJSON(SoftwareSerial NodeSerial,String key, String value, int state = 0){
    String data;
    if(state == 1) data = " {\""+ key +"\":"+ value + ",";
    else data = " \""+ key +"\":"+ value + ",";
 
    Serial.print(data);
    NodeSerial.print(data);
    delay(1500);    
}

// void getSettings() {
//     // String response = getRequest(apiHost, settingsPage);
//     //JsonObject& root = parseJson(2 * JSON_OBJECT_SIZE(2) + 60, response);
//     // String mode = root["m"];
//     // String runtime = root["r"];
//     String mode = "1";
//     String runtime = "15";
//     delay(5000);

//     for (int i = 0; i < 10; i++) {
//         NodeSerial.print(" {\"m\":" + mode + ",");
//         delay(500);
//         NodeSerial.print(" \"r\":" + runtime + "}");
//         delay(1000);
//         NodeSerial.print("\n");
//         Serial.println("Sent Configurations....");
//         delay(1000);
//     }
// }