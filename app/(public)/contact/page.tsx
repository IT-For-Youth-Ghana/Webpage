import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/contact-page";
import { getCmsContactPage } from "@/lib/cms/contact";
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCmsContactPage();

  return pageMetadata({
    title: content.eyebrow,
    description: content.description,
    path: "/contact",
  });
}

export default async function ContactRoute() {
  const content = await getCmsContactPage();
  return <ContactPage content={content} />;
}
