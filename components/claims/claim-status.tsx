import type { ClaimStatus } from "@/lib/types";

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  return <span className={`claimStatusBadge ${status}`}>{claimStatusLabel(status)}</span>;
}

export function claimStatusLabel(status: ClaimStatus) {
  if (status === "pending") return "Claim Pending";
  if (status === "claimed") return "Claimed";
  if (status === "verified") return "Verified";
  return "Unclaimed";
}
