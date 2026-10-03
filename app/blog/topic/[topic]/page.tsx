import { TopicIndex, topicMetadata, topicParams } from "../../../ContentPages";

type Props = { params: Promise<{ topic: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return topicParams();
}

export async function generateMetadata({ params }: Props) {
  return topicMetadata((await params).topic);
}

export default async function Page({ params }: Props) {
  return <TopicIndex slug={(await params).topic} />;
}
