import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export function useProgress(courseId: string) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompleted(new Set());
      setLoading(false);
      return;
    }
    let active = true;
    supabase
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .then(({ data }) => {
        if (!active) return;
        const set = new Set<string>();
        data?.forEach((row) => {
          if (row.completed) set.add(row.lesson_id);
        });
        setCompleted(set);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, courseId]);

  const toggle = useCallback(
    async (lessonId: string) => {
      if (!user) return;
      const isDone = completed.has(lessonId);
      const next = new Set(completed);
      if (isDone) {
        next.delete(lessonId);
        setCompleted(next);
        await supabase
          .from("lesson_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);
      } else {
        next.add(lessonId);
        setCompleted(next);
        await supabase.from("lesson_progress").upsert(
          {
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
            completed: true,
          },
          { onConflict: "user_id,lesson_id" },
        );
      }
    },
    [completed, courseId, user],
  );

  return { completed, toggle, loading };
}
