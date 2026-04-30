import { Link } from "@tanstack/react-router";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import type { Course } from "@/data/course";
import { cn } from "@/lib/utils";

type Props = {
  course: Course;
  currentLessonId: string;
  completed: Set<string>;
};

export function CourseSidebar({ course, currentLessonId, completed }: Props) {
  // Achar o módulo da aula atual para deixar aberto por padrão
  const initialOpen = new Set<string>();
  course.modules.forEach((m) => {
    if (m.lessons.some((l) => l.id === currentLessonId)) initialOpen.add(m.id);
  });
  const [open, setOpen] = useState<Set<string>>(initialOpen);

  const toggle = (id: string) => {
    const next = new Set(open);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpen(next);
  };

  return (
    <aside className="w-full lg:w-[360px] lg:shrink-0">
      <h2 className="mb-3 text-base font-semibold">Conteúdo do Curso</h2>
      <div className="space-y-2">
        {course.modules.map((module, idx) => {
          const isOpen = open.has(module.id);
          return (
            <div
              key={module.id}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(module.id)}
                className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-muted/40 transition-colors"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {idx}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{module.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {module.lessons.length} {module.lessons.length === 1 ? "aula" : "aulas"}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen && (
                <ul className="border-t border-border bg-background/40">
                  {module.lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isDone = completed.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <Link
                          to="/curso/$courseId/aula/$lessonId"
                          params={{ courseId: course.id, lessonId: lesson.id }}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors",
                            isCurrent &&
                              "bg-accent/40 border-l-2 border-primary text-foreground",
                          )}
                        >
                          <div className="h-10 w-16 shrink-0 rounded-md bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center">
                            {isDone ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                            )}
                          </div>
                          <span className="line-clamp-2 flex-1">{lesson.title}</span>
                          {isCurrent && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
