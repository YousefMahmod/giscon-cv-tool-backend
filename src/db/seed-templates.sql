-- Seed data for templates table
-- This file inserts initial CV template records

INSERT INTO templates (title, subtitle, img, template_name, version) VALUES
    ('Classic Serif', 'Classic serif style', '/uploads/templates/classic-serif.webp', 'classic-serif', '1.0'),
    ('Mercury Flow', 'Modern business style', '/uploads/templates/mercury-flow.webp', 'mercury-flow', '1.0'),
    ('Atlantic Blue', 'Eye-catching and unique', '/uploads/templates/atlantic-blue.webp', 'atlantic-blue', '1.0');

-- Note: Make sure to upload the actual template preview images to uploads/templates/ directory
