import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/hooks/use-auth";
import { courses } from "@/data/course";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Área de Membros — Seus cursos" },
      { name: "description", content: "Acesse seus cursos e continue de onde parou." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1600px] px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="mt-1 text-muted-foreground">Continue de onde você parou.</p>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Meus cursos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const firstLesson = course.modules[0]?.lessons[0];
              return (
                <Link
                  key={course.id}
                  to="/curso/$courseId"
                  params={{ courseId: course.id }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
                >
                  <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
                    <PlayCircle className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {course.subtitle}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {course.modules.length} módulos · {totalLessons} aulas
                    </span>
                    {firstLesson && (
                      <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
