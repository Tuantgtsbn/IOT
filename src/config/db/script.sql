create database smarthome;
use smarthome;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),   
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table type (
	id INT AUTO_INCREMENT PRIMARY KEY,
    type varchar(255) unique
);

create table devices (
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_type INT,
    position varchar(255),
    name varchar(255),
    status boolean default 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (id_type) references type(id)
);

CREATE TABLE sensors_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_device int,
    value FLOAT,             
    unit VARCHAR(20),        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (id_device) references devices(id)
);
create table action (
	id int auto_increment primary key,
    id_device int,
    id_user int,
    action_type boolean default 0,
    created_at timestamp default current_timestamp,
    foreign key(id_device) references devices(id),
    foreign key(id_user) references users(id)
);


CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_device int,
    message TEXT,                
    is_resolved BOOLEAN DEFAULT 0, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (id_device) references devices(id)
);

insert into users (username,password,email) values
('minhtuan','123456','minhtuan@gmail.com'),
('anhthu','123456','anhthu@gmail.com'),
('giatri','123456','giatri@gmail.com'),
('thanhtung','123456','thanhtung@gmail.com');

insert into type(type) values 
('DHT11'),
('MQ2'),
('LED'),
('FAN');

insert into devices(id_type, position, name, status) values
(1,'Phòng ngủ tầng 2','Cảm biến DHT11-01',1),
(2,'Bếp tâng 1','Cảm biến MQ2-01',1),
(4,'Phòng ngủ tầng 2','Quạt',0),
(3,'Phòng ngủ tâng 2','Đèn',0);

insert into sensors_data (id_device, value, unit) value
(1, 46, 'celcius'),
(1, 55, 'percent'),
(2, 244,'ppm'),
(1, 47, 'celcius'),
(1, 56, 'percent'),
(2, 260,'ppm'),
(1, 22, 'celcius'),
(1, 44, 'percent'),
(2, 244,'ppm'),
(1, 46, 'celcius'),
(1, 50, 'percent'),
(2, 246,'ppm'),
(1, 46, 'celcius'),
(1, 55, 'percent'),
(2, 244,'ppm'),
(1, 22, 'celcius'),
(1, 23, 'percent'),
(2, 210,'ppm'),
(1, 11, 'celcius'),
(1, 44, 'percent'),
(2, 290,'ppm'),
(1, 46, 'celcius'),
(1, 55, 'percent'),
(2, 244,'ppm'),
(1, 46, 'celcius'),
(1, 55, 'percent'),
(2, 244,'ppm'),
(1, 46, 'celcius'),
(1, 55, 'percent'),
(2, 244,'ppm')
;

insert into action (id_device, id_user, action_type) values
(4,1,1),
(3,1,0),
(4,1,1),
(3,1,0),
(3,2,1);

insert into alerts (id_device, message) values 
(2, 'Lỗi kêt nối'),
(1, 'Lỗi kết nối'),
(2, 'Phát hiện ra khói'),
(3, 'Lỗi kết nối'),
(1, 'Cảm biến nhiệt độ bị lỗi');



