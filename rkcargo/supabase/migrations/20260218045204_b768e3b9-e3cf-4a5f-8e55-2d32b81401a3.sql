
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;

CREATE POLICY "Admins can manage invoices"
ON public.invoices
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
