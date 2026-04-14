
CREATE POLICY "Teachers can delete students"
ON public.students
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
