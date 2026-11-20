# Prześwit lokalnie, bez internetu (zadanie 21, spec §3/A12): strona + usługa w jednym kontenerze.
#   docker build -f usluga/Dockerfile -t przeswit .
#   docker run --rm --network none -p 8770:8770 przeswit                 # http://localhost:8770
# Z kartą NVIDIA: --build-arg TORCH_INDEX=https://download.pytorch.org/whl/cu121 i docker run --gpus all …
FROM python:3.11-slim
ARG TORCH_INDEX=https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir numpy pillow && pip install --no-cache-dir --index-url ${TORCH_INDEX} torch
WORKDIR /app
COPY src/ src/
COPY usluga/ usluga/
COPY strona/public/ strona/public/
COPY dane/mini/ dane/mini/
COPY dane/mini-trudny/ dane/mini-trudny/
ENV PYTHONPATH=src:.
EXPOSE 8770
CMD ["python", "-m", "usluga.serwer", "--host", "0.0.0.0", "--bezczynnosc", "0", "--biblioteki", "mini,mini-trudny"]
