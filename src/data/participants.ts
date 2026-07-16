export type ParticipantStatus = "Katılmadı" | "Katıldı";

export type Participant = {
  id: number;
  eventId: number;
  fullName: string;
  email: string;
  qrCode: string;
  status: ParticipantStatus;
};

export const participants: Participant[] = [
  {
    id: 1,
    eventId: 1,
    fullName: "Mert Özkan",
    email: "mert@example.com",
    qrCode: "EVP-DEMO-QR-12345",
    status: "Katılmadı",
  },
  {
    id: 2,
    eventId: 1,
    fullName: "Ayşe Demir",
    email: "ayse@example.com",
    qrCode: "EVP-DEMO-QR-11111",
    status: "Katıldı",
  },
  {
    id: 3,
    eventId: 2,
    fullName: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    qrCode: "EVP-DEMO-QR-67890",
    status: "Katıldı",
  },
  {
    id: 4,
    eventId: 3,
    fullName: "Zeynep Kaya",
    email: "zeynep@example.com",
    qrCode: "EVP-DEMO-QR-33333",
    status: "Katılmadı",
  },
];