\connect postgres
SELECT 'CREATE DATABASE periferia_social' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'periferia_social') \gexec

