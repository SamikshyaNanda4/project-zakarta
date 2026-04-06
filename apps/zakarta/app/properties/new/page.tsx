import { CreatePropertyForm } from "@/components/create-property-form";

export const metadata = {
  title: "List Your Property | Zakarta",
  description: "Post your property for sale or rent on Zakarta.",
};

export default function NewPropertyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">List Your Property</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below. Your contact info stays hidden until a
          verified user requests it.
        </p>
      </div>
      <CreatePropertyForm />
    </main>
  );
}
