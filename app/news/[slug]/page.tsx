import { ContentPost, postMetadata, postParams, NEWS } from "../../ContentPages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return postParams(NEWS);
}

export async function generateMetadata({ params }: Props) {
  return postMetadata(NEWS, (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ContentPost section={NEWS} slug={(await params).slug} />;
}
