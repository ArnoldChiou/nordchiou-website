import { rssResponse, BLOG } from "../../ContentPages";

export function GET() {
  return rssResponse(BLOG);
}
