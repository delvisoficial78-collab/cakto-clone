// Edite os títulos, descrições, vídeos e materiais aqui.
// Aceita URLs do YouTube, Vimeo ou link direto para um arquivo .mp4

export type Material = {
  id: string;
  title: string;
  url: string;
};

export type Lesson = {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationLabel?: string;
  materials?: Material[];
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  coverUrl?: string;
  modules: Module[];
};

export const courses: Course[] = [
  {
    id: "vivendo-do-digital",
    title: "Mentoria Vivendo do Digital",
    subtitle: "Da configuração inicial aos primeiros R$ 3.000 com automação.",
    modules: [
      {
        id: "modulo-1",
        title: "Aula 1: PRIMEIROS R$ 3.000 COM ROBÔ",
        lessons: [
          {
            id: "1-1",
            title: "Boas-vindas e visão geral",
            description: "Como funciona a mentoria e o que esperar de cada módulo.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            durationLabel: "08:42",
          },
        ],
      },
      {
        id: "modulo-2",
        title: "Aula 2: LIGANDO O ROBÔ VENDEDOR",
        lessons: [
          {
            id: "2-1",
            title: "Configuração inicial do robô",
            description: "Passo a passo para colocar o robô vendedor no ar.",
            videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
            durationLabel: "15:10",
          },
        ],
      },
      {
        id: "modulo-3",
        title: "Aula 3: ATIVANDO SEU ROBÔ COM TUDO PRONTO",
        lessons: [
          {
            id: "3-1",
            title: "Aula 3: ATIVANDO SEU ROBÔ COM TUDO PRONTO",
            description: "Ativação final, testes e go-live.",
            videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ",
            durationLabel: "02:26",
            materials: [],
          },
        ],
      },
    ],
  },
];

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getFlatLessons(course: Course): Array<{ module: Module; lesson: Lesson }> {
  return course.modules.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })));
}

export function findLesson(course: Course, lessonId: string) {
  for (const module of course.modules) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module, lesson };
  }
  return undefined;
}

export function getAdjacentLessons(course: Course, lessonId: string) {
  const flat = getFlatLessons(course);
  const idx = flat.findIndex((entry) => entry.lesson.id === lessonId);
  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}
