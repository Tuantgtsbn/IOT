
CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),   
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table type (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type varchar(255) unique
);

create table devices (
	id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_type INT,
    position varchar(255),
    unit varchar(255),
    name varchar(255),
    src varchar(255),
    isautomatic smallint default 0,
    status smallint default 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (id_type) references type(id)
);

CREATE TABLE sensors_data (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_device int,
    value FLOAT,             
    unit VARCHAR(20),        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (id_device) references devices(id)
);
create table action (
	id int GENERATED ALWAYS AS IDENTITY primary key,
    id_device int,
    action_type smallint default 0,
    status smallint default 1,
    id_user int default 1,
    created_at timestamp default current_timestamp,
    foreign key(id_device) references devices(id),
    foreign key(id_user) references users(id)
);


CREATE TABLE alerts (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_device int,
    message TEXT, 
    isSafe smallint DEFAULT 0,               
    is_resolved smallint DEFAULT 0, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (id_device) references devices(id)
);

create table subcrible (
	id int GENERATED ALWAYS AS IDENTITY primary key,
    id_user int,
    id_device int,
	foreign key (id_user) references users(id),
    foreign key (id_device) references devices(id)
);
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
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
insert into devices(id_type, position, name,src, status) values
(1,'Phòng ngủ tầng 2','Cảm biến Nhiệt độ-01','dht11.jpg',1),
(2,'Phòng ngủ tầng 2', 'Cảm biến Độ ẩm-01','dht11.jpg',1),
(3,'Bếp tâng 1','Cảm biến MQ2-01','mq2.jpg',1),
(5,'Phòng ngủ tầng 2','Điều hòa','dieuhoa.jpg',0),
(4,'Phòng ngủ tâng 2','Đèn','led.jpg',0);

insert into sensors_data (id_device, value, unit) values
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
insert into subcrible (id_user,id_device) values
(3,1),
(3,2),
(3,3),
(3,4),
(3,5),
(2,1),
(2,2),
(2,3)
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


SELECT value, unit,created_at 
FROM sensors_data 
WHERE id_device = 1 and created_at::date = '2024-11-30'::date;
SELECT sensors_data.value,devices.status,sensors_data.created_at FROM sensors_data join devices on sensors_data.id_device=devices.id where devices.id=2 order by sensors_data.created_at desc limit 1
SELECT sensors_data.value,devices.status,sensors_data.created_at FROM sensors_data join devices on sensors_data.id_device=devices.id where devices.id=1 order by sensors_data.created_at desc limit 1
select d.id as id, d.name as name, d.position as position, d.status as status, t.id_user as idUser from devices as d left join  (select * from subcrible where subcrible.id_user=2) as t on d.id = t.id_device