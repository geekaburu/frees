#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include <dht.h>
#include <Servo.h>

#define dhtPin 7
#define RXPin 10
#define TXPin 11
#define servoPin 3
#define LDRPin1 A1
#define LDRPin2 A2
#define voltagePin A0

SoftwareSerial ArduinoSerial(RXPin, TXPin);
#include "trait.h"

dht dht;
Servo servo;
SolarPanel panel;

int error = 20;
int nightIntensity = 150;
int eastAngle = 0;
int position = 90;

void setup() {
    Serial.begin(115200);
    ArduinoSerial.begin(9600);
    servo.attach(servoPin);
    pinMode(LDRPin1, INPUT);
    pinMode(LDRPin2, INPUT);
    pinMode(voltagePin, INPUT);
    // Get
    set();
}

void loop() {
    float voltage;
    int voltageLoops = runtime / 0.5; // Number of loops
    int voltageCounter = 0;
    float totalVoltage = 0;
    int chk = dht.read11(dhtPin);

    panel.position = 0;
    panel.voltage = 0.00;
    panel.intensity = 0;

    if (mode == 1) {
        // Rotate the solar panel
        for (int position = 0; position <= 180; position += 18) {
            servo.write(position);
            delay(500);

            int totalIntensity = analogRead(LDRPin1) + analogRead(LDRPin2);
            voltage = analogRead(voltagePin) / 1023.0 * 5.0 * 2.0;

            if (panel.intensity < totalIntensity ) {
                panel.intensity = totalIntensity;
                panel.position = position;
                panel.voltage = voltage;
            }

            Serial.println("Current Angle: " + (String) position + " | Current Intensity: " +  (String)totalIntensity + " | Current Voltage: " + (String)voltage);
            if (checkSerial() == 1) return; 
        }
    } else if (mode == 2) {
        int counter = 0;
        int previousPosition = 0;

        while (true) {
            if (counter == 100) {
                panel.intensity = analogRead(LDRPin1) + analogRead(LDRPin2) ;
                panel.position = position;
                break;
            } else {
                int LDR1 = analogRead(LDRPin1);
                Serial.println(LDR1);
                delay(50);

                int LDR2 = analogRead(LDRPin2);
                Serial.println(LDR2);
                delay(50);

                if (LDR1 < 20 && LDR2 < 20) {
                    servo.write(0);
                    delay(50);
                } else {
                    // Check the stronger intesity
                    int diff = LDR1 - LDR2;
                    if (diff > 50) position--; else if (diff < (-1) * 50) position++;
                }

                if (position >= 170) position = 170; else if (position <= 10) position = 10;
                if (previousPosition == position) {
                    if (counter < 0) counter = 0;
                    counter++;
                }

                previousPosition = position;
                servo.write(position);
                Serial.println("Position: " + (String)position);
                Serial.println("-----------------");
            }
        }
        if (checkSerial() == 1) return; 
    }

    servo.write(panel.position);
    Serial.println("-------------------------------");
    delay(1000);
    Serial.println("Voltage Readings....");

    for (int i = 0; i < voltageLoops; i++) {
        //Read voltage at maximum intensity point
        voltage = analogRead(voltagePin) / 1023.0 * 5.0 * 2.0;
        Serial.println(voltage);

        totalVoltage += voltage;
        voltageCounter++;
        // if (checkSerial() == 1) return; 
        delay(1000);
    }

    // Calculate energy and watt hours
    totalVoltage = totalVoltage / voltageCounter;
    panel.voltage = totalVoltage;
    panel.power = panel.voltage * 0.2;
    panel.energy = panel.power * runtime;

    // Generate JSON String
    generateSerialJSON("angle", (String)panel.position, 1);
    generateSerialJSON("intensity", (String)panel.intensity);
    generateSerialJSON("voltage", (String)panel.voltage);
    generateSerialJSON("temperature", (String)dht.temperature);
    generateSerialJSON("humidity", (String)dht.humidity);
    generateSerialJSON("power", (String)panel.power);
    generateSerialJSON("energy", (String)panel.energy);
    ArduinoSerial.print("\n");
    Serial.println("\n}");
    delay(1000);
    if (checkSerial() == 1) return; 
}