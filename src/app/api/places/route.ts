import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ places: [] });
  }

  try {
    const body = await request.json();
    const query = body.query;

    if (!query || query.length < 2) {
      return NextResponse.json({ places: [] });
    }

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.addressComponents",
        },
        body: JSON.stringify({
          textQuery: query + " bar",
          languageCode: "zh-TW",
          locationBias: {
            circle: {
              center: { latitude: 25.033, longitude: 121.565 },
              radius: 50000,
            },
          },
          maxResultCount: 5,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ places: [] });
    }

    const data = await response.json();
    const places = (data.places || []).map(
      (place: {
        id: string;
        displayName?: { text: string };
        formattedAddress?: string;
        addressComponents?: { types: string[]; longText: string }[];
      }) => {
        const city =
          place.addressComponents?.find((c: { types: string[] }) =>
            c.types.includes("administrative_area_level_1")
          )?.longText || "";

        return {
          placeId: place.id,
          name: place.displayName?.text || "",
          address: place.formattedAddress || "",
          city,
        };
      }
    );

    return NextResponse.json({ places });
  } catch {
    return NextResponse.json({ places: [] });
  }
}
