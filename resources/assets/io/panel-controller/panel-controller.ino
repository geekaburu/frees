// **********************************************************
//  Include libraries and define constants
// **********************************************************
#include <dht.h>
#include <Servo.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>

#define RXPin 10
#define TXPin 11
#define dhtPin 7
#define servoPin 3
#define LDRPin1 A1
#define LDRPin2 A2
#define voltagePin A0

SoftwareSerial ArduinoSerial(RXPin, TXPin);
#include "trait.h"

// **********************************************************
//  Define variables
// **********************************************************
dht dht;
Servo servo;
int runtime = 15;
SolarPanel panel;

// **********************************************************
//  Define the set up method
// **********************************************************
void setup() {
    Serial.begin(115200);
    ArduinoSerial.begin(9600);
    servo.attach(servoPin);
    pinMode(LDRPin1, INPUT);
    pinMode(LDRPin2, INPUT);
    pinMode(voltagePin, INPUT);
}

// **********************************************************
//  Define the loop method
// **********************************************************
void loop() {
    // -------------------------------------------------------
    // Variable Definitions
    // -------------------------------------------------------
    float voltage = 0.0;
    float totalVoltage = 0;
    int voltageCounter = 0;
    int voltageLoops = runtime / 0.5;
    
    int chk = dht.read11(dhtPin);

    panel.position = 0.00;
    panel.power = 0.00;
    panel.energy = 0.00;
    panel.voltage = 0.00;
    panel.intensity = 0.00;

    // -------------------------------------------------------
    // Handle versatile mode of the panel
    // -------------------------------------------------------
    for (int angle = 0; angle <= 180; angle += 18) {
        servo.write(angle);
        delay(500);

        int totalIntensity = analogRead(LDRPin1) + analogRead(LDRPin2);
        voltage = analogRead(voltagePin) / 1023.0 * 5.0 * 2.0;

        if (panel.intensity < totalIntensity ) {
            panel.intensity = totalIntensity;
            panel.position = angle;
            panel.voltage = voltage;
        }
        Serial.println("Current Angle: " + (String) angle + " | Current Intensity: " +  (String)totalIntensity + " | Current Voltage: " + (String)voltage);
    }

    // Write the current position 
    servo.write(panel.position);

    // -------------------------------------------------------
    // Collect voltage readings...
    // ------------------------------------------------------
    Serial.println("Voltage Readings....");
    for (int i = 0; i < voltageLoops; i++) {
        voltage = analogRead(voltagePin) / 1023.0 * 5.0 * 2.0;
        Serial.println(voltage);
        totalVoltage += voltage;
        voltageCounter++;
        delay(500);
    }

    // -------------------------------------------------------
    // Calculate the amount of energy collected
    // -------------------------------------------------------
    totalVoltage = totalVoltage / voltageCounter;
    panel.voltage = totalVoltage;
    panel.power = panel.voltage * 0.2;
    panel.energy = panel.power * runtime;

    // -------------------------------------------------------
    // Generate JSON to send to server and pass it to node MCU
    // -------------------------------------------------------
    generateSerialJSON("angle", (String)panel.position, 1);
    generateSerialJSON("voltage", (String)panel.voltage);
    generateSerialJSON("power", (String)panel.power);
    generateSerialJSON("energy",(String)panel.energy);
    generateSerialJSON("runtime", (String)runtime);
    ArduinoSerial.print("\n");
    Serial.println("\n}");
    delay(1000);
}