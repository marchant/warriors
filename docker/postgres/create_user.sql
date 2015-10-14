CREATE USER warrior PASSWORD 'W4Rr1oR';

REVOKE CONNECT ON DATABASE warriors FROM PUBLIC;
GRANT CONNECT ON DATABASE warriors TO warrior;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO warrior;
