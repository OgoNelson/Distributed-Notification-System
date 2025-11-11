-- Seed data for email templates

INSERT INTO templates (name, subject, body) VALUES
('welcome_email', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('password_reset', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('order_confirmation', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('account_verification', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('subscription_renewal', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('newsletter', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('invoice', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>'),
('notification_alert', 'Notification', '<html><body><h1>Hello {{name}}</h1><a href="{{link}}">Click here</a></body></html>');
