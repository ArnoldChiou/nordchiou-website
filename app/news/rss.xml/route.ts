import { rssResponse, NEWS } from "../../ContentPages";

export function GET() {
  return rssResponse(NEWS);
}
