export type EventItem = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
};

export const events: EventItem[] = [
  {
    id: 1,
    title: "React Workshop",
    description: "React temellerinin anlatılacağı uygulamalı etkinlik.",
    location: "Bilgisayar Laboratuvarı",
    date: "15 Temmuz 2026",
    capacity: 40,
  },
  {
    id: 2,
    title: "Next.js Eğitimi",
    description: "Next.js ile modern web uygulaması geliştirme etkinliği.",
    location: "Konferans Salonu",
    date: "18 Temmuz 2026",
    capacity: 60,
  },
  {
    id: 3,
    title: "Kariyer ve Staj Semineri",
    description: "Staj ve kariyer süreci hakkında bilgilendirme semineri.",
    location: "A Blok Seminer Salonu",
    date: "22 Temmuz 2026",
    capacity: 100,
  },
];