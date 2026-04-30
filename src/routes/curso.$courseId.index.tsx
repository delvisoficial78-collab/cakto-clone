import { createFileRoute, Navigate } from "@tanstack/react-router";
import { getCourse } from "@/data/course";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/curso/$courseId/")({
  component: CourseRedirect,
});

function CourseRedirect() {
  const { user, loading } = useAuth();
  const { courseId } = Route.useParams();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  const course = getCourse(courseId);
  if (!course) return <Navigate to="/" />;

  const firstLesson = course.modules[0]?.lessons[0];
  if (!firstLesson) return <Navigate to="/" />;

  return (
    <Navigate
      to="/curso/$courseId/aula/$lessonId"
      params={{ courseId, lessonId: firstLesson.id }}
    />
  );
}
