update storage.buckets
set allowed_mime_types = array['text/markdown', 'text/plain', 'application/octet-stream']
where id = 'skills';
