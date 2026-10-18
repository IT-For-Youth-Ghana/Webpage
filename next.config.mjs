/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.itforyouthghana.org"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
      },
      {
        protocol: "https",
        hostname: "imarticus.org",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "photos.fife.usercontent.google.com",
      },
    ],
  },
  async redirects() {
    return [
      /**
       * Retired duplicate course-detail URLs.
       *
       * Three routes rendered the same course page from the same lookup.
       * /programs/[category]/[courseId] never read params.category, so every
       * course was reachable at unbounded URLs. The canonical shape is
       * /apply-for-training/courses/[slug]; the live portal API resolves a bare
       * slug, so nothing is lost by dropping the category segment.
       *
       * The two-segment rule cannot swallow /programs/[category], because a
       * Next path parameter matches exactly one segment.
       */
      {
        source: "/programs/course/:courseSlug",
        destination: "/apply-for-training/courses/:courseSlug",
        permanent: true,
      },
      {
        source: "/programs/:category/:courseId",
        destination: "/apply-for-training/courses/:courseId",
        permanent: true,
      },
      {
        source: "/what-we-offer/students-graduates",
        destination: "/apply-for-training",
        permanent: true,
      },
      {
        source: "/what-we-offer/businesses",
        destination: "/for-organisations",
        permanent: true,
      },
      {
        source: "/what-we-offer/volunteers",
        destination: "/who-we-are/careers",
        permanent: true,
      },
      {
        source: "/opportunities/students-graduates",
        destination: "/apply-for-training",
        permanent: true,
      },
      {
        source: "/opportunities/businesses",
        destination: "/for-organisations",
        permanent: true,
      },
      {
        source: "/opportunities/volunteers",
        destination: "/who-we-are/careers",
        permanent: true,
      },
      {
        source: "/who-can-apply",
        destination: "/apply-for-training/who-can-apply",
        permanent: true,
      },
      {
        source: "/how-it-works/students-graduates",
        destination: "/apply-for-training/how-it-works",
        permanent: true,
      },
      {
        source: "/how-it-works/businesses",
        destination: "/for-organisations",
        permanent: true,
      },
      {
        source: "/how-it-works/volunteers",
        destination: "/who-we-are/careers",
        permanent: true,
      },
      {
        source: "/impact",
        destination: "/our-impact/reports",
        permanent: true,
      },
      {
        source: "/testimonials",
        destination: "/our-impact/testimonials",
        permanent: true,
      },
      {
        source: "/news",
        destination: "/news-and-updates/news",
        permanent: true,
      },
      {
        source: "/community",
        destination: "/what-we-do/community-outreach",
        permanent: true,
      },
      {
        source: "/partners",
        destination: "/who-we-are/partners",
        permanent: true,
      },
      {
        source: "/partnerships",
        destination: "/partner-with-us",
        permanent: true,
      },
      {
        source: "/partnerships/educational-partnerships",
        destination: "/partner-with-us/educational",
        permanent: true,
      },
      {
        source: "/partnerships/corporate-sponsorship",
        destination: "/for-organisations/sponsorships",
        permanent: true,
      },
      {
        source: "/partnerships/corporate-training",
        destination: "/for-organisations/corporate-training",
        permanent: true,
      },
      {
        source: "/partnerships/government-collaboration",
        destination: "/partner-with-us/government",
        permanent: true,
      },
      {
        source: "/partnerships/ngo-and-foundation-partnerships",
        destination: "/partner-with-us/ngo-foundations",
        permanent: true,
      },
      {
        source: "/partnerships/international-development",
        destination: "/partner-with-us/international-development",
        permanent: true,
      },
      {
        source: "/partnerships/technology-partners",
        destination: "/partner-with-us/technology",
        permanent: true,
      },
      {
        source: "/careers",
        destination: "/who-we-are/careers",
        permanent: true,
      },
      {
        source: "/tech-empowerment",
        destination: "/what-we-do/youth-academy",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
