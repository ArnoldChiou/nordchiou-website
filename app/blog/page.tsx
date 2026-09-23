import { ContentIndex, indexMetadata, BLOG } from "../ContentPages";

export const metadata = indexMetadata(BLOG);

export default function Page() {
  return <ContentIndex section={BLOG} />;
}
