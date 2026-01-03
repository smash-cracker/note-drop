import { MetadataRoute } from "next";
import pages from "../data/pages.json";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://note.dropeco.dev";

    const routes = Object.keys(pages).map((slug) => ({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
        },
        ...routes,
    ];
}
