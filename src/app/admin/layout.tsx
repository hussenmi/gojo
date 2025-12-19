import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Gojo',
  description: 'Manage your property listings',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      {children}
    </div>
  );
}
