export type TicketStatus = "Katılmadı" | "Katıldı";

export type Ticket = {
  id: number;
  eventTitle: string;
  fullName: string;
  location: string;
  date: string;
  qrCode: string;
  status: TicketStatus;
};

export const tickets: Ticket[] = [
  {
    id: 1,
    eventTitle: "React Workshop",
    fullName: "Mert Özkan",
    location: "Bilgisayar Laboratuvarı",
    date: "15 Temmuz 2026",
    qrCode: "EVP-DEMO-QR-12345",
    status: "Katılmadı",
  },
  {
    id: 2,
    eventTitle: "Next.js Eğitimi",
    fullName: "Ahmet Yılmaz",
    location: "Konferans Salonu",
    date: "18 Temmuz 2026",
    qrCode: "EVP-DEMO-QR-67890",
    status: "Katıldı",
  },
];