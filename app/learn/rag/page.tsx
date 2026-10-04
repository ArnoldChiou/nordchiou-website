import { getLesson } from "@/lib/lessons";
import { LessonPage, lessonMetadata } from "../LearnPages";
import RagLesson from "./RagLesson";

const lesson = getLesson("rag")!;

export const metadata = lessonMetadata(lesson);

export default function Page() {
  return (
    <LessonPage lesson={lesson}>
      <RagLesson />
    </LessonPage>
  );
}
