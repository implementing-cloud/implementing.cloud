import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadataKeywords = [
    "Implementing Cloud",
    "Cloud Computing",
    "AWS",
    "Azure",
    "GCP",
    "Infrastructure as Code",
    "Terraform",
    "Cloud Architecture",
    "DevOps",
    "Cloud Services",
    "Cloud Comparison",
    "Cloud Migration",
    "Cloud Best Practices",
    "AI Implementation",
    "Machine Learning",
    "Cloud Development",
]

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: metadataKeywords,
    authors: [
        {
            name: "Implementing Cloud Team",
            url: "https://implementingcloud.com",
        },
    ],
    creator: "Implementing Cloud",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: "/ic-logo.png",
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        creator: "@implementingcloud",
        images: ["/ic-logo.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};