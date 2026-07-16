import { Button, Card, Divider, Space, Tag } from "antd";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events } from "../../../data/events";
import JoinEventButton from "../../../components/JoinEventButton";

type EventDetailPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EventDetailPage({
    params,
}: EventDetailPageProps) {
    const { id } = await params;

    const event = events.find((event) => event.id === Number(id));

    if (!event) {
        notFound();
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "var(--app-bg)",
                padding: "32px 24px",
            }}
        >
            <section style={{ maxWidth: 800, margin: "0 auto" }}>
                <Card>
                    <Link href="/events">← Etkinliklere dön</Link>

                    <Divider />

                    <h1 style={{ fontSize: 30, marginBottom: 12 }}>{event.title}</h1>

                    <p
                        style={{
                            color: "var(--app-muted)",
                            fontSize: 16,
                            lineHeight: 1.6,
                        }}
                    >
                        {event.description}
                    </p>

                    <Divider />

                    <Space orientation="vertical" size="small">
                        <span>📍 {event.location}</span>
                        <span>📅 {event.date}</span>
                        <span>
                            👥 Kapasite: <Tag color="blue">{event.capacity}</Tag>
                        </span>
                    </Space>

                    <Divider />
                    <JoinEventButton />
                </Card>
            </section>
        </main>
    );
}