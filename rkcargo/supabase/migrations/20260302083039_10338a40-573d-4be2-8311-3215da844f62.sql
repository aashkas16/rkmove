-- Fix invoice_type check constraint to allow all document types
ALTER TABLE public.invoices DROP CONSTRAINT invoices_invoice_type_check;
ALTER TABLE public.invoices ADD CONSTRAINT invoices_invoice_type_check 
  CHECK (invoice_type = ANY (ARRAY['GST Invoice'::text, 'LR Copy'::text, 'Quotation'::text, 'Bill'::text, 'Money Receipt'::text]));

-- Create contact_submissions table for storing contact form entries
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view/manage submissions
CREATE POLICY "Admins can manage contact submissions"
ON public.contact_submissions
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());