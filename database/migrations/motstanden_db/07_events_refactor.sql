-- Insert current version into the DB.
INSERT INTO version(migration) VALUES
    ('07_events_refactor.sql');
 

ALTER TABLE event
RENAME COLUMN description TO  description_html;

ALTER TABLE event
ADD COLUMN description_json 
    TEXT NOT NULL 
    DEFAULT '[{"type":"DIV","children":[{"text":""}]}]'
    CHECK(json_valid(description_json) = 1);
 
-- Recreate the event view with the updated info
DROP VIEW vw_event;
CREATE VIEW vw_event
AS
SELECT
    event_id,
    title,
    start_date_time,
    end_date_time,
    key_info,
    description_html,
    description_json,
    created_by as created_by_user_id, 
    created_by.full_name as created_by_full_name,
    e.created_at,
    updated_by as updated_by_user_id,
    updated_by.full_name as updated_by_full_name,
    e.updated_at,
    IIF( end_date_time is  NULL,
        IIF(datetime(start_date_time) < datetime('now'), 0, 1),
        IIF(datetime(end_date_time)   < datetime('now'), 0, 1)
    ) is_upcoming
FROM 
    event e
LEFT JOIN user created_by
ON  created_by.user_id = e.created_by
LEFT JOIN user updated_by
ON  updated_by.user_id = e.updated_by;