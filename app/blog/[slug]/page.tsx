import { ContentPost, postMetadata, postParams, BLOG } from "../../ContentPages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return postParams(BLOG);
}

export async function generateMetadata({ params }: Props) {
  return postMetadata(BLOG, (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ContentPost section={BLOG} slug={(await params).slug} />;
}
