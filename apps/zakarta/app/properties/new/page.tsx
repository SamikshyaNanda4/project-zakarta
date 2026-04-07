import { CreatePropertyForm } from "@/components/create-property-form";

export const metadata = {
  title: "List Your Property | Zakarta",
  description: "Post your property for sale or rent on Zakarta.",
};

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-white to-lime-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-lime-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-50 rounded-full opacity-50 blur-2xl" />
      </div>
      <main className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">List Your Property</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below. Your contact info stays hidden until a
          verified user requests it.
        </p>
      </div>
      <CreatePropertyForm />
    </main>
    </div>
  );

}
