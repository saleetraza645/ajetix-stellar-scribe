
-- contact_submissions: replace permissive INSERT with validated check
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Validated contact submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 200
  AND length(email) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(budget) BETWEEN 1 AND 100
  AND (custom_budget IS NULL OR length(custom_budget) <= 200)
  AND length(project_details) BETWEEN 1 AND 10000
  AND jsonb_typeof(file_urls) = 'array'
);

-- Explicit deny-read policy (defense in depth; no SELECT grant relies on this too)
CREATE POLICY "No public read of contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon, authenticated
USING (false);

-- newsletter_subscribers: replace permissive INSERT with validated check
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;

CREATE POLICY "Validated newsletter subscribe"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(email) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

CREATE POLICY "No public read of newsletter subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO anon, authenticated
USING (false);
