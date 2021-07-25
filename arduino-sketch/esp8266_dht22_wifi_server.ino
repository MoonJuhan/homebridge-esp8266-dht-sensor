#include <ESP8266WiFi.h>
#include "DHTesp.h"

#ifdef ESP32
#pragma message(THIS EXAMPLE IS FOR ESP8266 ONLY !)
#error Select ESP8266 board.
#endif

#ifndef STASSID
#define STASSID "YOUR-WiFi-SSID"
#define STAPSK "YOUR-WiFi-PASSWORD"
#endif

const char *ssid = STASSID;
const char *password = STAPSK;

WiFiServer server(80);

DHTesp dht;

void setup()
{
    Serial.begin(115200);
    dht.setup(5, DHTesp::DHT22);

    Serial.println();
    Serial.println();
    Serial.print(F("Connecting to "));
    Serial.println(ssid);

    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(F("."));
    }
    Serial.println();
    Serial.println(F("WiFi connected"));

    server.begin();
    Serial.println(F("Server started"));

    Serial.println(WiFi.localIP());
}

void loop()
{
    WiFiClient client = server.available();

    if (!client)
    {
        return;
    }

    Serial.println(F("new client"));

    client.setTimeout(5000);

    String req = client.readStringUntil('\r');
    Serial.println(F("request: "));
    Serial.println(req);

    while (client.available())
    {
        client.read();
    }

    delay(dht.getMinimumSamplingPeriod());

    float humidity = dht.getHumidity();
    float temperature = dht.getTemperature();

    client.print(F("HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n{&quot;humidity&quot;:"));
    client.print(humidity);
    client.print(F(",&quot;temperature&quot; : "));
    client.print(temperature);
    client.print(F("}"));

    Serial.println(F("Disconnecting from client"));
}
