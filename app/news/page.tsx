import { ContentIndex, indexMetadata, NEWS } from "../ContentPages";

export const metadata = indexMetadata(NEWS);

export default function Page() {
  return <ContentIndex section={NEWS} />;
}
