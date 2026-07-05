CREATE POLICY "Public can upload contact attachments"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'contact-attachments' AND (storage.foldername(name))[1] = 'submissions');