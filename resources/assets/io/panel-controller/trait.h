int mode = 1;
int runtime = 7; // Runtime in seconds

class SolarPanel {
    public:
        float power = 0.00;
        float energy = 0.00;
        float voltage = 0.00;
        float position = 0.00;
        float intensity = 0.00;
};

// **********************************************************
//  Parse a JSON Object
// **********************************************************
JsonObject& parseJson(const size_t bufferSize, String JSON) {
    DynamicJsonBuffer jsonBuffer(bufferSize);
    return jsonBuffer.parseObject(JSON);
}

// **********************************************************
//  Check if string is numeric
// **********************************************************
bool isNumeric(String str) {
    for (byte i = 0; i < str.length(); i++) {
        if (!isDigit(str.charAt(i)) && str.charAt(i) != '.' ) {
            return false;
        }
    }
    return true;
}

// **********************************************************
//  Generate JSON for Serial
// **********************************************************
JsonObject& getConfigurations() {
    // Wait for configurations from the server
    Serial.print("Waiting");
    String buffer = "";

    while (!ArduinoSerial.available()) {
        Serial.print(".");
        delay(1000);
    }

    while (true) {
        if (ArduinoSerial.available()) {
            if (ArduinoSerial.read() == '\n') {
                Serial.println("");
                Serial.println(buffer);
                return parseJson(JSON_OBJECT_SIZE(2) + 10 + 10, buffer);
            } else {
                Serial.print(".");
                buffer += ArduinoSerial.readString();
            }
        }
    }
}

// **********************************************************
//  Receive settings
// **********************************************************
void set() {
    mode = 0;
    runtime = 0;
    while (mode == 0 || runtime == 0) {
        JsonObject& root = getConfigurations();
        mode = root["m"];
        runtime = root["r"];
        Serial.println(mode);
        Serial.println(runtime);
        delay(1000);
    }
}

// **********************************************************
//  Check for serial request
// **********************************************************
int checkSerial() {
    Serial.println("Checking Serial for incoming connection....");
    String buffer = "";
    while (ArduinoSerial.available() > 0) {
        if (ArduinoSerial.read() == '\n') {
            Serial.print(buffer);
        } else {
            int oldMode = mode;
            int oldRuntime = runtime;
            buffer += ArduinoSerial.readString();
            JsonObject& root = parseJson(JSON_OBJECT_SIZE(2) + 10 + 10, buffer);
            mode = root["m"];
            runtime = root["r"];
            if(mode == 0 || runtime == 0) {
                mode = oldMode;
                runtime = oldRuntime;
                return 0;
            } else if(mode == oldMode || runtime == oldRuntime ) return 0; 
            Serial.println((String) mode + " " + (String) runtime);
            return 1;
        }
    }
    return 0;
}

// **********************************************************
//  Generate JSON for Serial
// **********************************************************
void generateSerialJSON(String key, String value, int state = 0) {
    String data;
    if (state == 1) data = " {\"" + key + "\":" + value + ",";
    else data = " \"" + key + "\":" + value + ",";

    Serial.print(data);
    ArduinoSerial.print(data);
    delay(1000);
}