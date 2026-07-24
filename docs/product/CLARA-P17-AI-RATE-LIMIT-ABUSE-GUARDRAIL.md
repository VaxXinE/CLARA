# CLARA P17 AI Rate Limit Abuse Guardrail

P17 Real AI Analysis Activation is current.
P17-PR-01 is current.

AI rate limit and abuse guardrails are required. Future real analysis endpoints
must be bounded per safe backend identity and workspace scope before provider
calls happen.

P17-PR-01 only defines the guardrail boundary. It does not execute extension
snapshot AI analysis and does not call a real AI provider.
