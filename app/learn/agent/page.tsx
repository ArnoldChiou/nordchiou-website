import { getLesson } from "@/lib/lessons";
import { LessonPage, lessonMetadata } from "../LearnPages";
import AgentLesson from "./AgentLesson";

const lesson = getLesson("agent")!;

export const metadata = lessonMetadata(lesson);

export default function Page() {
  return (
    <LessonPage lesson={lesson}>
      <AgentLesson />
    </LessonPage>
  );
}
