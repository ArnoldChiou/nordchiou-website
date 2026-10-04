import { getLesson } from "@/lib/lessons";
import { LessonPage, lessonMetadata } from "../LearnPages";
import TokensLesson from "./TokensLesson";

const lesson = getLesson("tokens")!;

export const metadata = lessonMetadata(lesson);

export default function Page() {
  return (
    <LessonPage lesson={lesson}>
      <TokensLesson />
    </LessonPage>
  );
}
