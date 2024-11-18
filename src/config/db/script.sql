drop database smarthome;
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
    src varchar(255),
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
    action_type boolean default 0,
    status boolean default 1,
    id_user int default 1,
    created_at timestamp default current_timestamp,
    foreign key(id_device) references devices(id),
    foreign key(id_user) references users(id)
);


CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_device int,
    message TEXT, 
    isSafe BOOLEAN DEFAULT 0,               
    is_resolved BOOLEAN DEFAULT 0, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (id_device) references devices(id)
);
insert into users (username) values ('esp8266');
insert into users (username,password,email) values
('minhtuan','123456','minhtuan@gmail.com'),
('anhthu','123456','anhthu@gmail.com'),
('giatri','123456','giatri@gmail.com'),
('thanhtung','123456','thanhtung@gmail.com');

insert into type(type) values 
('Nhiệt độ'),
('Độ ẩm'),
('MQ2'),
('LED'),
('Điều hòa');

insert into devices(id_type, position, name, status) values
(1,'Phòng ngủ tầng 2','Cảm biến Nhiệt độ-01',1),
(2,'Phòng ngủ tầng 2', 'Cảm biến Độ ẩm-01',1),
(3,'Bếp tâng 1','Cảm biến MQ2-01',1),
(4,'Phòng ngủ tầng 2','Điều hòa',0),
(5,'Phòng ngủ tâng 2','Đèn',0);

insert into sensors_data (id_device, value, unit) value
(1, 46, 'celsius'),
(2, 55, 'percent'),
(3, 244,'ppm'),
(1, 47, 'celsius'),
(2, 56, 'percent'),
(3, 260,'ppm'),
(1, 22, 'celsius'),
(2, 44, 'percent'),
(3, 244,'ppm'),
(1, 46, 'celsius'),
(2, 50, 'percent'),
(3, 246,'ppm'),
(1, 46, 'celsius'),
(2, 55, 'percent'),
(3, 244,'ppm'),
(1, 22, 'celsius'),
(2, 23, 'percent'),
(3, 210,'ppm'),
(1, 11, 'celsius'),
(2, 44, 'percent'),
(3, 290,'ppm'),
(1, 46, 'celsius'),
(2, 55, 'percent'),
(2, 244,'ppm'),
(1, 46, 'celsius'),
(2, 55, 'percent'),
(3, 244,'ppm'),
(1, 46, 'celsius'),
(2, 55, 'percent'),
(3, 244,'ppm')
;


insert into action (id_device, id_user, action_type) values
(5,1,1),
(5,1,0),
(5,1,1),
(5,1,0),
(5,2,1);

insert into alerts (id_device, message) values 
(2, 'Lỗi kêt nối'),
(5, 'Lỗi kết nối'),
(3, 'Phát hiện ra khói'),
(4, 'Lỗi kết nối'),
(1, 'Cảm biến nhiệt độ bị lỗi');

