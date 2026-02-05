-- =====================================================
-- Security Fix: Add Proper RLS Policies (with DROP IF EXISTS)
-- =====================================================

-- Create or replace helper function
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_memberships
    WHERE user_id = _user_id
      AND org_id = _org_id
      AND status = 'active'
  )
$$;

-- =====================================================
-- 9. AI_USAGE_LOGS TABLE - Fix the duplicate policy
-- =====================================================

DROP POLICY IF EXISTS "Users can view own AI usage" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Anyone can view ai_usage_logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Public can view ai_usage_logs" ON public.ai_usage_logs;

CREATE POLICY "Users can view own AI usage"
  ON public.ai_usage_logs
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE user_id = auth.uid()
        AND org_id = ai_usage_logs.org_id
        AND status = 'active'
        AND role IN ('owner', 'admin')
    )
  );

-- =====================================================
-- 10. API_KEYS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Org members can view API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Org admins can manage API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Anyone can view api_keys" ON public.api_keys;
DROP POLICY IF EXISTS "Public can view api_keys" ON public.api_keys;

CREATE POLICY "Org members can view API keys"
  ON public.api_keys
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE user_id = auth.uid()
        AND org_id = api_keys.org_id
        AND status = 'active'
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Org admins can manage API keys"
  ON public.api_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE user_id = auth.uid()
        AND org_id = api_keys.org_id
        AND status = 'active'
        AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE user_id = auth.uid()
        AND org_id = api_keys.org_id
        AND status = 'active'
        AND role IN ('owner', 'admin')
    )
  );

-- =====================================================
-- 11. AUDIT_LOGS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Org admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Anyone can view audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Public can view audit_logs" ON public.audit_logs;

CREATE POLICY "Org admins can view audit logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.org_memberships
      WHERE user_id = auth.uid()
        AND org_id = audit_logs.org_id
        AND status = 'active'
        AND role IN ('owner', 'admin')
    )
  );