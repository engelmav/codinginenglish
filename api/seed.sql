use cie;

insert into cie_modules (name, description, image_path) values ('module1', 'first module', '/');

insert into cie_modules (name, description, image_path) values ('module2', 'second module', '/');

insert into cie_modules (name, description, image_path) values ('module3', 'third module', '/');

insert into cie_modules (name, description, image_path) values ('module4', 'fourth module', '/');

insert into module_sessions (cie_module_id, session_datetime) values ((select id from cie_modules where name = 'module1'), now());

insert into module_sessions (cie_module_id, session_datetime) values ((select id from cie_modules where name = 'module2'), now());
