export const metadata = {
  title: "Privacy Policy - SIN Manpower",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="min-h-screen">{children}</main>
    </div>
  );
}
