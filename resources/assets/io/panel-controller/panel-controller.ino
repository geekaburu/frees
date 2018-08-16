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
SolarPanel panel;

int position = 0;
int eastAngle = 0;
int nightIntensity = 150;

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

    // -------------------------------------------------------
    // Handle versatile mode of the panel
    // -------------------------------------------------------
    if (mode == 1) {

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
    }

    // -------------------------------------------------------
    // Handle search mode of the panel
    // -------------------------------------------------------
    if (mode == 2) {
        servo.write(90);
        int counter = 0;
        int previousPosition = 0;

        while (true) {
            if (counter == 100) {
                panel.intensity = analogRead(LDRPin1) + analogRead(LDRPin2) ;
                panel.position = position;
                break;
            } else {
                int LDR1 = analogRead(LDRPin1);
                delay(50);

                int LDR2 = analogRead(LDRPin2);
                delay(50);

                // Check the stronger intesity
                if (LDR1 < 20 && LDR2 < 20) {
                    servo.write(0);
                    delay(50);
                } else {
                    int diff = LDR1 - LDR2;
                    if (diff > 50) position--; else if (diff < (-1) * 50) position++;
                }

                // Handle extreme angle increases or decreases
                if (position >= 170) position = 170; else if (position <= 10) position = 10;
                if (previousPosition == position) {
                    if (counter < 0) counter = 0;
                    counter++;
                }

                // Write new positions to the servo
                previousPosition = position;
                servo.write(position);
                Serial.println("Position: " + (String)position);
            }
        }
    }

    servo.write(panel.position);
    delay(1000);

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
    generateSerialJSON("intensity", (String)panel.intensity);
    generateSerialJSON("voltage", (String)panel.voltage);
    generateSerialJSON("temperature", (String)dht.temperature);
    generateSerialJSON("humidity", (String)dht.humidity);
    generateSerialJSON("power", (String)panel.power);
    generateSerialJSON("energy",(String)panel.energy);
    generateSerialJSON("runtime", (String)runtime);
    ArduinoSerial.print("\n");
    Serial.println("\n}");
    delay(1000);
}