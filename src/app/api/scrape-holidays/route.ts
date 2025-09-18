// Plik: app/api/scrape/route.ts
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface Holiday {
  date: string;
  name: string;
  link: string;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL jest wymagany" }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Błąd pobierania strony: status ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    const holidaysList: Holiday[] = [];
    const dayContainers = $("article.unusual-day");

    dayContainers.each((_, dayElement) => {
      const dayEl = $(dayElement);
      const day = dayEl.find("a.date span.day").text().trim();
      const month = dayEl.find("a.date span.month").text().trim();
      const fullDate = `${day} ${month}`;

      if (!day || !month) return;

      dayEl.find("div.description-of-holiday").each((_, holidayElement) => {
        const nameTag = $(holidayElement).find("header h3 a");
        const name = nameTag.text().trim();
        const link = nameTag.attr("href");
        if (name && link) {
          holidaysList.push({ date: fullDate, name, link });
        }
      });
    });

    return NextResponse.json({ holidays: holidaysList });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Błąd podczas scrapowania: ${error.message}` },
      { status: 500 }
    );
  }
}
