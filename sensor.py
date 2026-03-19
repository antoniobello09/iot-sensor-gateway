import time
import board
import adafruit_dht

sensor = adafruit_dht.DHT11(board.D4)

while True:
    try:
        temperature = sensor.temperature
        humidity = sensor.humidity
        print(f"Temp: {temperature}°C  Umidità: {humidity}%")
    except RuntimeError as e:
        print(f"Errore lettura: {e}")
    time.sleep(2)