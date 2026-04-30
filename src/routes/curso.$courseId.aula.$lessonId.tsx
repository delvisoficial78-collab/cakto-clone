import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, BookOpen, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CourseSidebar } from "@/components/CourseSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { getCourse, findLesson, getAdjacentLessons } from "@/data/course";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/curso/$courseId/aula/$lessonId")({
  head: ({ params }) => {
    const course = getCourse(params.courseId);
    const found = course && findLesson(course, params.lessonId);
    return {
      meta: [
        {
          title: found
            ? `${found.lesson.title} — ${course?.title}`
            : "Aula — Área de Membros",
        },
      ],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { user, loading } = useAuth();
  const { courseId, lessonId } = Route.useParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  const course = getCourse(courseId);
  if (!course) return <Navigate to="/" />;

  const found = findLesson(course, lessonId);
  if (!found) return <Navigate to="/curso/$courseId" params={{ courseId }} />;

  const { lesson, module } = found;
  const { prev, next } = getAdjacentLessons(course, lessonId);

  return (
    <CourseContent
      courseId={courseId}
      lessonId={lessonId}
      course={course}
      lesson={lesson}
      module={module}
      prev={prev}
      next={next}
      sheetOpen={sheetOpen}
      setSheetOpen={setSheetOpen}
    />
  );
}

function CourseContent({
  courseId,
  lessonId,
  course,
  lesson,
  module,
  prev,
  next,
  sheetOpen,
  setSheetOpen,
}: {
  courseId: string;
  lessonId: string;
  course: ReturnType<typeof getCourse> & {};
  lesson: NonNullable<ReturnType<typeof findLesson>>["lesson"];
  module: NonNullable<ReturnType<typeof findLesson>>["module"];
  prev: ReturnType<typeof getAdjacentLessons>["prev"];
  next: ReturnType<typeof getAdjacentLessons>["next"];
  sheetOpen: boolean;
  setSheetOpen: (v: boolean) => void;
}) {
  const { completed, toggle } = useProgress(courseId);
  const isDone = completed.has(lessonId);
  const materials = lesson.materials ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1600px] px-4 py-6">
        {/* Top bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar
              </Link>
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground min-w-0">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-[280px]">{module.title}</span>
              <span>/</span>
              <span className="truncate max-w-[280px] text-foreground">{lesson.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={!prev} asChild={!!prev}>
              {prev ? (
                <Link
                  to="/curso/$courseId/aula/$lessonId"
                  params={{ courseId, lessonId: prev.lesson.id }}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="mr-1 h-4 w-4 inline" />
                  Anterior
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" disabled={!next} asChild={!!next}>
              {next ? (
                <Link
                  to="/curso/$courseId/aula/$lessonId"
                  params={{ courseId, lessonId: next.lesson.id }}
                >
                  Próxima
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <span>
                  Próxima
                  <ChevronRight className="ml-1 h-4 w-4 inline" />
                </span>
              )}
            </Button>

            {/* Botão "Conteúdo do curso" no mobile */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <BookOpen className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] overflow-y-auto bg-background p-4">
                <CourseSidebar
                  course={course!}
                  currentLessonId={lessonId}
                  completed={completed}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <VideoPlayer url={lesson.videoUrl} title={lesson.title} />

            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{lesson.title}</h1>
                {lesson.description && (
                  <p className="mt-2 max-w-2xl text-muted-foreground">{lesson.description}</p>
                )}
              </div>
              <Button
                onClick={() => toggle(lessonId)}
                variant={isDone ? "secondary" : "default"}
                className={cn(isDone && "border border-primary/40")}
              >
                <Check className="mr-2 h-4 w-4" />
                {isDone ? "Concluída" : "Marcar como concluída"}
              </Button>
            </div>

            {/* Materiais */}
            <div className="mt-8">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Materiais ({materials.length})</span>
              </div>
              {materials.length === 0 ? (
                <div className="mt-4 rounded-xl border border-border bg-card p-10 text-center">
                  <Download className="mx-auto h-8 w-8 text-muted-foreground/60" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Não há materiais disponíveis para esta aula.
                  </p>
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {materials.map((m) => (
                    <li key={m.id}>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/50 transition-colors"
                      >
                        <span className="text-sm">{m.title}</span>
                        <Download className="h-4 w-4 text-primary" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Sidebar desktop */}
          <div className="hidden lg:block">
            <CourseSidebar
              course={course!}
              currentLessonId={lessonId}
              completed={completed}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
