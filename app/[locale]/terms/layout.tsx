export const metadata = {
  title: "Terms of Service - SIN Manpower",
};

export default function LocaleTermsLayout({
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
