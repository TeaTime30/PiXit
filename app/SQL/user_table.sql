drop database if exists pixit_users;
create database pixit_users;
use pixit_users;

create table users(
    email varchar(320) not null,
    password varchar(256) not null,
    firstname varchar(20) not null,
    lastname varchar(20) not null,
    year_of_birth year,
    primary key(email)
);