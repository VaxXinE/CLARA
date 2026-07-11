type ConversationSourceBadgeProps = {
  source?: string | null;
  provider?: string | null;
};

function toSourceLabel(source?: string | null, provider?: string | null) {
  const normalizedProvider = provider?.trim().toLowerCase();
  const normalizedSource = source?.trim().toLowerCase();
  const value = normalizedProvider || normalizedSource;

  if (value === "gmail") {
    return "Gmail";
  }

  if (value === "email") {
    return "Email";
  }

  if (value === "whatsapp" || value === "whatsapp_demo") {
    return "WhatsApp";
  }

  if (value === "web_chat_demo") {
    return "Web chat";
  }

  if (!value) {
    return "Unknown source";
  }

  return value.replaceAll("_", " ");
}

export function ConversationSourceBadge(props: ConversationSourceBadgeProps) {
  return (
    <span className="source-badge">
      {toSourceLabel(props.source, props.provider)}
    </span>
  );
}
