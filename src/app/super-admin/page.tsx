import { Card } from "antd";
import RoleGuard from "../../components/RoleGuard";
import SuperAdminRequestsTable from "../../components/SuperAdminRequestsTable";
import type { AdminRequestRow } from "../../components/SuperAdminRequestsTable";
import { prisma } from "../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  const adminRequests = await prisma.adminRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
  });

  const requestRows: AdminRequestRow[] = adminRequests.map((request) => ({
    id: request.id,
    organizationName: request.organizationName,
    reason: request.reason,
    status: request.status,
    user: {
      fullName: request.user.fullName,
      email: request.user.email,
    },
  }));

  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <main
        style={{
          minHeight: "calc(100vh - 68px)",
          backgroundColor: "var(--app-bg)",
          padding: "48px 24px",
        }}
      >
        <section style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Card style={{ borderRadius: 16 }}>
            <div style={{ marginBottom: 32 }}>
              <h1
                style={{
                  fontSize: 34,
                  marginBottom: 8,
                  color: "var(--app-text)",
                }}
              >
                Super Admin Paneli
              </h1>

              <p style={{ color: "var(--app-muted)", margin: 0 }}>
                Admin olmak isteyen kullanıcıların başvurularını buradan
                onaylayabilir veya reddedebilirsin.
              </p>
            </div>

            <SuperAdminRequestsTable initialRequests={requestRows} />
          </Card>
        </section>
      </main>
    </RoleGuard>
  );
}