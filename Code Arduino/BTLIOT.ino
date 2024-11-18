#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
// Sensor DHT11
#define DHT_PIN D2
#define DHTTYPE DHT11
DHT dht(DHT_PIN, DHTTYPE);  // Tạo đối tượng DHT
// Sensor MQ2
#define MQ2_PIN A0
// Chân còi buzzer
#define BUZZER_PIN D6
//LED 1 (đại diện cho điều hòa)
#define LED1_PIN D3
//LED2 (đại diện cho đèn lED)
#define LED2_PIN D5
int led1Status = false;
int led2Status = false;
int priority = 1;
// Ngưỡng nồng độ khí gas (giá trị từ 0 đến 1023, có thể điều chỉnh)
int gasThreshold = 400;
unsigned long previousMillis = 0;  // Lưu thời gian trước đó
const long interval = 5000;        // Thời gian gửi dữ liệu (1000 ms)
// Thông tin kết nối WiFi
String ssid = ""; // Tên đăng nhập wifi
String password = ""; // Mật khẩu mạng wifi
String host = ""; // Địa chỉ ip máy tính chạy server
uint16_t port = 0; // Cổng
String zapier_webhook_url = "https://hooks.zapier.com/hooks/catch/20559867/29zccwh/";

// Tạo đối tượng WebSocket
WebSocketsClient webSocket;
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("Disconnected from WebSocket server");
      break;
    case WStype_CONNECTED:
      Serial.println("Connected to WebSocket server");
      webSocket.sendTXT("{\"type\":\"esp8266\"}");
      break;
    case WStype_TEXT:
      // Sử dụng ArduinoJson để phân tích thông điệp JSON
      StaticJsonDocument<500> doc;

      DeserializationError error = deserializeJson(doc, payload);
      // Nhận yêu cầu tắt/bật đèn
      if (!error) {
        // Kiểm tra giá trị "type" trong message
        String msgType = doc["type"].as<String>();
        Serial.println(msgType);
        
        if (msgType == "toggleDevice") {
          int idDevice = doc["idDevice"].as<int>();
          int idUser = doc["idUser"].as<int>();
          StaticJsonDocument<500> response;
          String JsonResponse;
          Serial.print("People: ");
          Serial.print(idUser);
          Serial.print(" want to toggle device: ");
          Serial.println(idDevice);
          if (idDevice == 5) {
            led2Status = !led2Status;
            Serial.println(led2Status ? "LED ON" : "LED OFF");
            
            response["type"] = "toggleDevice";
            response["idDevice"] = 5;
            response["currentStatus"] = led2Status?1:0;
            response["isSuccess"] = 1;
            response["idUser"]= idUser;
            serializeJson(response, JsonResponse);
            webSocket.sendTXT(JsonResponse);
            response.clear();
          }else if(idDevice ==4){
            led1Status = !led1Status;
            Serial.println(led1Status ? "Air ON" : "Air OFF");
            response["type"] = "toggleDevice";
            response["idDevice"] = 4;
            response["currentStatus"] = led1Status ?1:0;
            response["isSuccess"] = 1;
            response["idUser"]= idUser;
            serializeJson(response, JsonResponse);
            webSocket.sendTXT(JsonResponse);
            response.clear();
          }
        } else if (msgType == "automatic"){
          int idDevice = doc["idDevice"].as<int>();
          bool status = doc["status"].as<bool>();
          priority = status ? 0 : 1;
          Serial.print("Priority of ");
          Serial.print(idDevice);
          Serial.print(": ");
          Serial.println(priority);
        }
      } else {

        Serial.println("Failed to parse message as JSON");
      }
      break;
  }
}
int countTempError = 0;
int countHumiError = 0;
int countGasError = 0;
WiFiClient client;
void setup() {
  Serial.begin(115200);
  // Cấu hình chân đầu vào/đầu ra
  pinMode(MQ2_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  dht.begin();
  Serial.println("Nhập địa chỉ mạng, ip server, cổng");
  while (ssid == "") {
    if (Serial.available()) {
      String input = Serial.readStringUntil('\n');  // Đọc đến khi gặp ký tự xuống dòng
      input.trim();  // Loại bỏ khoảng trắng hoặc ký tự thừa
      parseInput(input);
    }
  }
  WiFi.begin(ssid.c_str(), password.c_str());

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");

  webSocket.begin(host, port, "/");
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();

  unsigned long currentMillis = millis();  // Lấy thời gian hiện tại
  // Gửi dữ liệu từ cảm biến DHT11 mỗi 1000 ms
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;  // Cập nhật thời gian trước đó

    // Đọc dữ liệu từ cảm biến DHT11
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    // Đọc giá trị từ cảm biến MQ2
    int gasValue = analogRead(MQ2_PIN);
    StaticJsonDocument<500> doc;
    StaticJsonDocument<500> docInfor;
    StaticJsonDocument<500> docAction;
    StaticJsonDocument<500> docAlert;
    String jsonAlert;
    String jsonAction;
    String jsonInfor;
    String jsonData;
    if (!isnan(temperature)) {
      if (countTempError > 0) {
        countTempError = 0;
        docInfor["type"] = "statusDevice";
        docInfor["idDevice"] = 1;
        docInfor["status"] = 1;
        serializeJson(docInfor, jsonInfor);
        Serial.println(jsonInfor);
        webSocket.sendTXT(jsonInfor);
        docInfor.clear();

        docAlert["type"] = "alertDevice";
        docAlert["status"] = 1;
        docAlert["idDevice"] = 1;
        docAlert["message"] = "Read temperature successfull.";
        serializeJson(docAlert, jsonAlert);
        Serial.println(jsonAlert);
        webSocket.sendTXT(jsonAlert);
        docAlert.clear();
        
      }
      doc["type"] = "dataSensor";
      doc["unit"] = "celsius";
      doc["value"] = temperature;
      doc["idDevice"] = 1;
      if (temperature > 30 && led1Status == false && priority == 0) {
        led1Status = true;
        docAction["type"] = "toggleDeviceAutomatic";
        docAction["currentStatus"] = 1;
        docAction["idDevice"] = 4;
        docAction["isSuccess"] = 1;
        serializeJson(docAction, jsonAction);
        webSocket.sendTXT(jsonAction);
        docAction.clear();
        
        
      } else if (temperature < 30 && led1Status == true && priority == 0) {
        led1Status = false;
        docAction["type"] = "toggleDeviceAutomatic";
        docAction["currentStatus"] = 0;
        docAction["idDevice"] = 4;
        docAction["isSuccess"] = 1;
        serializeJson(docAction, jsonAction);
        webSocket.sendTXT(jsonAction);
        docAction.clear();
      }

      Serial.print("Temparature: ");
      Serial.println(temperature);

      serializeJson(doc, jsonData);
      //Gửi dữ liệu đo được từ các cảm biến lên server
      webSocket.sendTXT(jsonData);
    } else {
      Serial.println("Failed to read from DHT sensor!");
      countTempError += 1;
      if (countTempError == 10) {
        docInfor["type"] = "statusDevice";
        docInfor["idDevice"] = 1;
        docInfor["status"] = 0;
        serializeJson(docInfor, jsonInfor);
        Serial.println(jsonInfor);
        webSocket.sendTXT(jsonInfor);
        docInfor.clear();
        docAlert["type"] = "alertDevice";
        docAlert["idDevice"] = 1;
        docAlert["status"] = 0;
        docAlert["message"] = "Failed to connect to DHT sensor";
        countTempError = 0;
        serializeJson(docAlert, jsonAlert);
        Serial.println(jsonAlert);
        webSocket.sendTXT(jsonAlert);
        docAlert.clear();
      }
    }
    if (!isnan(humidity)) {
      if (countHumiError > 0) {
        countHumiError = 0;
        docInfor["type"] = "statusDevice";
        docInfor["idDevice"] = 2;
        docInfor["status"] = 1;
        
        serializeJson(docInfor, jsonInfor);
        Serial.println(jsonInfor);

        webSocket.sendTXT(jsonInfor);
        docInfor.clear();
        docAlert["type"] = "alertDevice";
        docAlert["status"] = 2;
        docAlert["idDevice"] = 1;
        docAlert["message"] = "Read humidity successfull.";
        serializeJson(docAlert, jsonAlert);
        Serial.println(jsonAlert);
        webSocket.sendTXT(jsonAlert);
        docAlert.clear();
      }
      doc["type"] = "dataSensor";
      doc["unit"] = "percent";
      doc["value"] = humidity;
      doc["idDevice"] = 2;
      Serial.print("Humidity: ");
      Serial.println(humidity);
      serializeJson(doc, jsonData);
      //Gửi dữ liệu đo được từ các cảm biến lên server
      webSocket.sendTXT(jsonData);
    } else {
      Serial.println("Failed to read from DHT sensor!");
      countHumiError += 1;
      if (countHumiError == 10) {
        docInfor["type"] = "statusDevice";
        docInfor["idDevice"] = 2;
        docInfor["status"] = 0;
        serializeJson(docInfor, jsonInfor);
        Serial.println(jsonInfor);
        webSocket.sendTXT(jsonInfor);
        docInfor.clear();
        docAlert["type"] = "alertDevice";
        docAlert["idDevice"] = 2;
        docAlert["status"] = 0;
        docAlert["message"] = "Failed to read from DHT sensor!";
        countHumiError = 0;
        serializeJson(docAlert, jsonAlert);
        Serial.println(jsonAlert);
        webSocket.sendTXT(jsonAlert);
        docAlert.clear();
      }
    }
    if (!isnan(gasValue)) {
      if (countGasError > 0) {
        countGasError = 0;
        docInfor["type"] = "statusDevice";
        docInfor["idDevice"] = 3;
        docInfor["status"] = 1;
        serializeJson(docInfor, jsonInfor);
        Serial.println(jsonInfor);
        webSocket.sendTXT(jsonInfor);
        docInfor.clear();
        docAlert["type"] = "alertDevice";
        docAlert["status"] = 1;
        docAlert["idDevice"] = 3;
        docAlert["message"] = "Read gas successfull.";
        serializeJson(docAlert, jsonAlert);
        Serial.println(jsonAlert);
        webSocket.sendTXT(jsonAlert);
        docAlert.clear();
      }
      doc["type"] = "dataSensor";
      doc["unit"] = "ppm";
      doc["value"] = gasValue;
      doc["idDevice"] = 3;
      Serial.print("Gas: ");
      Serial.println(gasValue);
      serializeJson(doc, jsonData);
      //Gửi dữ liệu đo được từ các cảm biến lên server
      webSocket.sendTXT(jsonData);
      //Kiểm tra xem giá trị có vượt ngưỡng không
      if (gasValue > gasThreshold) {
        digitalWrite(BUZZER_PIN, HIGH);  // Bật còi
        Serial.println("Warning! Gas level is high!");
        docAlert.clear();
        docAlert["type"] = "alertDevice";
        docAlert["idDevice"] = 3;
        docAlert["message"] = "Detect smoke !!!";
        docAlert["status"] =0;
        serializeJson(docAlert, jsonAlert);
        webSocket.sendTXT(jsonAlert);
        docAlert.clear();
        smokeAlert();
      } else {
        digitalWrite(BUZZER_PIN, LOW);  // Tắt còi
      }
    } else {
      Serial.println("Failed to read from MQ2 sensor");
      countGasError += 1;

      if (countGasError == 10) {
        docInfor["type"] = "statusDevice";
        docInfor["idDevice"] = 3;
        docInfor["status"] = 0;
        serializeJson(docInfor, jsonInfor);
        Serial.println(jsonInfor);
        webSocket.sendTXT(jsonInfor);
        docInfor.clear();
        docAlert["type"] = "alertDevice";
        docAlert["idDevice"] = 3;
        docAlert["status"] = 0;
        docAlert["message"] = "Failed to read from MQ2 sensor";
        countGasError = 0;
        serializeJson(docAlert, jsonAlert);
        Serial.println(jsonAlert);
        webSocket.sendTXT(jsonAlert);
        docAlert.clear();
      }
    }
    

    // gửi trạng thái điều hòa
    docInfor["type"] = "statusDevice";
    docInfor["idDevice"] = 4;
    docInfor["status"] = led1Status ? 1 : 0;
    serializeJson(docInfor, jsonInfor);
    webSocket.sendTXT(jsonInfor);
    docInfor.clear();
    // gửi trạng thái đèn
    docInfor["type"] = "statusDevice";
    docInfor["idDevice"] = 5;
    docInfor["status"] = led2Status ? 1 : 0;
    Serial.print("Trạng thái của điều hòa: ");
    Serial.println(led1Status?"ON":"OFF");
    Serial.print("Trạng thái của đèn: ");
    Serial.println(led2Status?"ON":"OFF");
    serializeJson(docInfor, jsonInfor);
    webSocket.sendTXT(jsonInfor);
    docInfor.clear();
    digitalWrite(LED1_PIN, led1Status ? HIGH : LOW);
    digitalWrite(LED2_PIN, led2Status ? HIGH : LOW);
  }
  
  // Chờ 10 giây trước khi đọc và gửi dữ liệu tiếp
}
void smokeAlert() {
  if(WiFi.status() == WL_CONNECTED) {
    // HTTPClient http;
    HTTPClient http2;
    // http.begin(client, zapier_webhook_url);
    // int httpResponseCode = http.GET();
    // if(httpResponseCode > 0) {
    //   Serial.println("Alert sent to Zapier successfull.");
    // } else {
    //   Serial.print("Error in sending Zapier");
    //   Serial.println(httpResponseCode);
    // }
    http2.begin(client, "http://api.telegram.org/bot7442157649:AAG-BdVqGkKyztVoLWRpJyMN0UB4vPlXrIA/sendMessage?chat_id=6160625198&text=warning gas in the kitchen");
    int httpResponseCode = http2.GET();
    if(httpResponseCode >0) {
      Serial.println("Alert sent to Telegram successfull.");
    }else {
      Serial.print("Error in sending Telegram");
      Serial.println(httpResponseCode);
    }
    // http.end();
    http2.end();
  }
}
void parseInput(String input) {
  int firstComma = input.indexOf(',');
  int secondComma = input.indexOf(',', firstComma + 1);
  int thirdComma = input.indexOf(',', secondComma + 1);

  if (firstComma > 0 && secondComma > firstComma && thirdComma > secondComma) {
    ssid = input.substring(0, firstComma);
    password = input.substring(firstComma + 1, secondComma);
    host = input.substring(secondComma + 1, thirdComma);
    port = input.substring(thirdComma + 1).toInt();

    Serial.println("Thông tin nhận được:");
    Serial.println("SSID: " + ssid);
    Serial.println("Password: " + password);
    Serial.println("Host: " + host);
    Serial.println("Port: " + String(port));
  } else {
    Serial.println("Dữ liệu nhập không hợp lệ! Hãy nhập theo định dạng: <SSID>,<PASSWORD>,<HOST>,<PORT>");
  }
}