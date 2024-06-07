FROM python:3.11.9-slim

WORKDIR /
COPY .env .
COPY /_utils /_utils
COPY /api /api

WORKDIR /api
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
CMD ["python3", "-m", "flask", "--app", "api/index", "run", "-p", "5000", "--host", "0.0.0.0"]
