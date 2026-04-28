"use client";

import Link from "next/link";

const BBSR = [
  { name: "Chakeisiani", id: "loc_bbsr_0001" },
  { name: "Acharya Vihar", id: "loc_bbsr_0002" },
  { name: "Jharapara", id: "loc_bbsr_0003" },
  { name: "Damana", id: "loc_bbsr_0004" },
  { name: "Jan Path", id: "loc_bbsr_0005" },
  { name: "Palashpalli", id: "loc_bbsr_0006" },
  { name: "Kapila Prasad", id: "loc_bbsr_0007" },
  { name: "Ashok Nagar", id: "loc_bbsr_0008" },
  { name: "Ghatikia", id: "loc_bbsr_0009" },
  { name: "Gautam Nagar", id: "loc_bbsr_0010" },
];

const CUTTACK = [
  { name: "Badambadi", id: "loc_ctc_0001" },
  { name: "Buxi Bazar", id: "loc_ctc_0002" },
  { name: "College Square", id: "loc_ctc_0003" },
  { name: "Dolamundai", id: "loc_ctc_0004" },
  { name: "Jobra", id: "loc_ctc_0005" },
  { name: "Khan Nagar", id: "loc_ctc_0006" },
  { name: "Madhupatna", id: "loc_ctc_0007" },
  { name: "Mangalabag", id: "loc_ctc_0008" },
  { name: "Nayabazar", id: "loc_ctc_0009" },
  { name: "Ranihat", id: "loc_ctc_0010" },
];

const PURI = [
  { name: "Grand Road", id: "loc_puri_0001" },
  { name: "Swargadwar", id: "loc_puri_0002" },
  { name: "Baliapanda", id: "loc_puri_0003" },
  { name: "Chakratirtha Road", id: "loc_puri_0004" },
  { name: "Sea Beach Road", id: "loc_puri_0005" },
  { name: "Mochi Sahi", id: "loc_puri_0006" },
  { name: "Dolamandap", id: "loc_puri_0007" },
  { name: "VIP Colony", id: "loc_puri_0008" },
  { name: "Penthakata", id: "loc_puri_0009" },
  { name: "Sipasarubali", id: "loc_puri_0010" },
];

const cities = [
  { name: "Bhubaneswar", localities: BBSR },
  { name: "Cuttack", localities: CUTTACK },
  { name: "Puri", localities: PURI },
];

function buildLink(
  type: "sell" | "rent",
  area: string,
  localityId: string
) {
  return `/properties?listingType=${type}&area=${area}&localityIds=${localityId}`;
}

export default function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-border px-6 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        {/* BUY SECTION */}
        <div>
          <h2 className="text-lg font-semibold mb-6">
            Buy Properties
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {cities.map((city) => (
              <div key={city.name}>
                <h3 className="text-sm font-medium mb-3">
                  {city.name}
                </h3>

                {city.localities.map((loc) => (
                  <Link
                    key={loc.id}
                    href={buildLink("sell", city.name, loc.id)}
                    className="block text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    Properties in {loc.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* RENT SECTION */}
        <div>
          <h2 className="text-lg font-semibold mb-6">
            Rent Properties
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {cities.map((city) => (
              <div key={city.name}>
                <h3 className="text-sm font-medium mb-3">
                  {city.name}
                </h3>

                {city.localities.map((loc) => (
                  <Link
                    key={loc.id}
                    href={buildLink("rent", city.name, loc.id)}
                    className="block text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    Properties in {loc.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}