-- MySQL initialization script
-- This creates multiple databases and users when MySQL container starts

-- Create template service database
CREATE DATABASE IF NOT EXISTS template_service;

-- Create user service database
CREATE DATABASE IF NOT EXISTS user_service;
GRANT ALL PRIVILEGES ON user_service.* TO 'root'@'%' IDENTIFIED BY 'supersecretpassword';

-- Apply changes
FLUSH PRIVILEGES;
