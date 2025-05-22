/*
  # Seed data for chat application
  
  1. Data Creation
    - Creates demo labels
    - Creates demo chats similar to screenshot
  
  2. Note:
    - This will only create the structure, users will still need to register
*/

-- Insert labels
INSERT INTO labels (id, name, color)
VALUES
  ('f8d9f9f1-c5c5-4b8e-8d9e-9c1c3d7e6f5f', 'Demo', '#FDBA74'),
  ('a7c6b5d4-e3f2-4a1b-9c8d-7e6f5d4c3b2a', 'Internal', '#86EFAC'),
  ('b8d9c7e6-f5a4-3b2c-1d0e-9f8a7b6c5d4e', 'Content', '#93C5FD'),
  ('c9e8d7f6-a5b4-3c2d-1e0f-8a9b7c6d5e4f', 'Dont Send', '#FCA5A5'),
  ('d0f9e8a7-b6c5-4d3e-2f1a-0b9c8d7e6f5a', 'Signup', '#D8B4FE');

-- Create default chat templates (matches will be created when users sign up)
INSERT INTO chats (id, name, is_group, created_at, updated_at)
VALUES
  ('a1b2c3d4-e5f6-4a1b-9c8d-7e6f5d4c3b2a', 'Test El Centro', true, now(), now()),
  ('b2c3d4e5-f6a7-5b2c-0d9e-8f7a6b5c4d3b', 'Test Skope Final 5', false, now(), now()),
  ('c3d4e5f6-a7b8-6c3d-1e0f-9a8b7c6d5e4c', 'Periskope Team Chat', true, now(), now()),
  ('d4e5f6a7-b8c9-7d4e-2f1a-0b9c8d7e6f5d', 'Test Demo17', false, now(), now()),
  ('e5f6a7b8-c9d0-8e5f-3a2b-1c0d9e8f7a6e', 'Testing group', true, now(), now());

-- Link labels to chats
INSERT INTO chat_labels (chat_id, label_id)
VALUES
  ('a1b2c3d4-e5f6-4a1b-9c8d-7e6f5d4c3b2a', 'f8d9f9f1-c5c5-4b8e-8d9e-9c1c3d7e6f5f'), -- Demo
  ('b2c3d4e5-f6a7-5b2c-0d9e-8f7a6b5c4d3b', 'f8d9f9f1-c5c5-4b8e-8d9e-9c1c3d7e6f5f'), -- Demo
  ('c3d4e5f6-a7b8-6c3d-1e0f-9a8b7c6d5e4c', 'f8d9f9f1-c5c5-4b8e-8d9e-9c1c3d7e6f5f'), -- Demo
  ('c3d4e5f6-a7b8-6c3d-1e0f-9a8b7c6d5e4c', 'a7c6b5d4-e3f2-4a1b-9c8d-7e6f5d4c3b2a'), -- Internal
  ('d4e5f6a7-b8c9-7d4e-2f1a-0b9c8d7e6f5d', 'f8d9f9f1-c5c5-4b8e-8d9e-9c1c3d7e6f5f'), -- Demo
  ('d4e5f6a7-b8c9-7d4e-2f1a-0b9c8d7e6f5d', 'b8d9c7e6-f5a4-3b2c-1d0e-9f8a7b6c5d4e'), -- Content
  ('e5f6a7b8-c9d0-8e5f-3a2b-1c0d9e8f7a6e', 'f8d9f9f1-c5c5-4b8e-8d9e-9c1c3d7e6f5f'); -- Demo