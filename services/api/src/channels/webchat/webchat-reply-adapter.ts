import type {
  WebchatReplyCommand,
  WebchatReplyResult,
} from "./webchat-reply-types";

export interface WebchatReplyAdapter {
  sendReply(command: WebchatReplyCommand): Promise<WebchatReplyResult>;
}
