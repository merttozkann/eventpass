export type AdminRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AdminRequest = {
  id: number;
  fullName: string;
  email: string;
  organizationName: string;
  reason: string;
  status: AdminRequestStatus;
};

export const adminRequests: AdminRequest[] = [
  {
    id: 1,
    fullName: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    organizationName: "Yazılım Kulübü",
    reason: "Kulüp etkinliklerini sistem üzerinden yönetmek istiyorum.",
    status: "PENDING",
  },
  {
    id: 2,
    fullName: "Zeynep Kaya",
    email: "zeynep@example.com",
    organizationName: "Kariyer Topluluğu",
    reason: "Seminer ve workshop etkinlikleri oluşturmak istiyorum.",
    status: "PENDING",
  },
  {
    id: 3,
    fullName: "Mehmet Demir",
    email: "mehmet@example.com",
    organizationName: "Girişimcilik Kulübü",
    reason: "Etkinlik katılımlarını QR kod ile takip etmek istiyorum.",
    status: "APPROVED",
  },
];