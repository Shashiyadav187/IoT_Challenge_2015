use iotdatabase;

DROP TABLE IF EXISTS devices;
CREATE TABLE devices (
    id INT NOT NULL PRIMARY KEY,
    description TEXT,
    location TEXT,
    voltage FLOAT
);

DROP TABLE IF EXISTS measurements;
CREATE TABLE measurements (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    time TIMESTAMP,
    count INT,
    type INT
);

COMMIT;
