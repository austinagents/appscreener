import { notFound } from "next/navigation";
import { CreatorAvatar } from "@/components/creator-avatar";
import { ClaimStatusBadge } from "@/components/claims/claim-status";
import { MovementBadge } from "@/components/movement-badge";
import { ToolLogo } from "@/components/tool-logo";
import { WorkflowStack } from "@/components/workflow-stack";
import { creatorTagDisplayLabel, creatorTagSlug, creatorTagStyle } from "@/lib/creator-tags";
import { creatorClaimStatus, creatorToolRelationships, creators, getCreator, getTool, workflows } from "@/lib/data";
import { betaEventBootstrapScript } from "@/lib/events";
import type { CreatorToolRelationship } from "@/lib/types";

export function generateStaticParams() {
  return creators.map((creator) => ({ id: creator.id }));
}

export default function CreatorPage({ params }: { params: { id: string } }) {
  const creator = getCreator(params.id);
  if (!creator) notFound();
  const creatorWorkflows = workflows.filter((workflow) => creator.workflowSlugs.includes(workflow.slug));
  const acceptedToolRelationships = creatorToolRelationships.filter((relationship) => relationship.status === "accepted" && relationship.creatorId === creator.id);
  const verifiedToolRelationships = acceptedToolRelationships.filter(isVerifiedToolRelationship);
  const mentionedToolRelationships = acceptedToolRelationships.filter((relationship) => relationship.relationshipType === "mentions");
  const creatorTools = verifiedToolRelationships.map((relationship) => ({ relationship, tool: getTool(relationship.toolSlug) })).filter((item): item is { relationship: CreatorToolRelationship; tool: NonNullable<ReturnType<typeof getTool>> } => Boolean(item.tool));
  const tags = publicCreatorTags(creator);
  const claimStatus = creatorClaimStatus(creator.id);

  return (
    <div className="stack">
      <script dangerouslySetInnerHTML={{ __html: creatorProfileEventScript(creator.id) }} />
      <section className="detailHeader">
        <div className="toolTitle">
          <CreatorAvatar name={creator.name} src={creator.avatarUrl} size={54} />
          <div>
            <p className="eyebrow">Creator signal</p>
            <h1>{creator.name}</h1>
            <p>{[creator.handle, creator.platform, creator.followers ? `${creator.followers.toLocaleString()} followers` : ""].filter(Boolean).join(" · ")}</p>
            <div className="tagRail">
              {tags.slice(0, 8).map((tag) => <a href={`/tags/${creatorTagSlug(tag)}`} key={tag} style={creatorTagStyle(tag)}>{creatorTagDisplayLabel(tag)}</a>)}
            </div>
          </div>
        </div>
        <div className="headerActions">
          <ClaimStatusBadge status={claimStatus} />
          <a className="iconTextButton" href={`/claim/creator/${creator.id}`} data-beta-creator-claim-cta="true">{claimStatus === "pending" ? "View Claim" : "Claim Profile"}</a>
          <a className="iconTextButton" href={creator.xUrl} target="_blank" rel="noopener noreferrer">X Profile</a>
        </div>
      </section>
      <section className="sidePanel ownershipPrompt">
        <div>
          <div className="panelHeader"><h2>Own this creator profile</h2></div>
          <p>Claiming lets a creator manage profile info, connect tools, connect workflows, and define topics or known-for areas after review.</p>
        </div>
        <a className="iconTextButton" href={`/claim/creator/${creator.id}`} data-beta-creator-claim-cta="true">{claimStatus === "pending" ? "Review Claim Status" : "Claim Profile"}</a>
      </section>
      <section className="gridTwo">
        <div className="sidePanel">
          <div className="panelHeader"><h2>Creator Snapshot</h2></div>
          <div className="miniList">
            <SnapshotRow label="Known For" value={tags.slice(0, 5).map(creatorTagDisplayLabel).join(" · ") || creator.creatorCategory} />
            <SnapshotRow label="Tools Used" value={creatorTools.length ? creatorTools.slice(0, 4).map(({ tool }) => tool.name).join(" · ") : "Verified tool usage pending"} />
            <SnapshotRow label="Workflows" value={creatorWorkflows.length ? creatorWorkflows.slice(0, 3).map((workflow) => workflow.name).join(" · ") : "Workflow connections pending"} />
          </div>
        </div>
        <div className="sidePanel">
          <div className="panelHeader"><h2>Relationship Status</h2></div>
          <div className="emptyState">{relationshipStatusText(verifiedToolRelationships.length, mentionedToolRelationships.length)}</div>
        </div>
      </section>
      {verifiedToolRelationships.length ? (
        <section>
          <div className="sectionHeader"><h2>Tools I Use</h2><p>Accepted uses and teaches relationships only. Each tool is shown with a safe graph context.</p></div>
          <div className="creatorToolRelationshipGrid">
            {verifiedToolRelationships.map((relationship) => <CreatorToolRow relationship={relationship} key={relationship.id} />)}
          </div>
        </section>
      ) : null}
      {mentionedToolRelationships.length ? (
        <section>
          <div className="sectionHeader"><h2>Tools Mentioned</h2><p>Mentioned tools are not treated as verified usage.</p></div>
          <div className="creatorToolRelationshipGrid">
            {mentionedToolRelationships.map((relationship) => <CreatorToolRow relationship={relationship} key={relationship.id} />)}
          </div>
        </section>
      ) : null}
      <section>
        <div className="sectionHeader"><h2>Workflows I Use / Teach</h2><p>Accepted workflow adjacency derived from reviewed creator-tool relationships.</p></div>
        <div className="workflowGrid">
          {creatorWorkflows.map((workflow) => <a className="workflowRow" href={`/workflows/${workflow.slug}`} key={workflow.id}><WorkflowStack toolSlugs={workflow.toolSlugs} /><span><strong>{workflow.name}</strong><small>{workflow.outcome}</small></span><MovementBadge value={workflow.growth24h} /></a>)}
          {!creatorWorkflows.length && <div className="emptyState">Workflow adjacency is pending stronger creator graph coverage.</div>}
        </div>
      </section>
      <section>
        <div className="sectionHeader"><h2>Topics / Known For</h2><p>Public identity categories connected to this creator node.</p></div>
        <div className="tagRail">
          {tags.map((tag) => <a href={`/tags/${creatorTagSlug(tag)}`} key={tag} style={creatorTagStyle(tag)}>{creatorTagDisplayLabel(tag)}</a>)}
        </div>
      </section>
      {creatorTools.length ? (
        <section>
          <div className="sectionHeader"><h2>Related Products</h2><p>Products connected through accepted creator-tool relationships.</p></div>
          <div className="creatorToolRelationshipGrid">
            {creatorTools.slice(0, 6).map(({ tool }) => (
              <a className="creatorToolRelationshipRow" href={`/tools/${tool.slug}`} key={tool.slug}>
                <ToolLogo officialSrc={tool.officialLogoUrl} src={tool.logoUrl} faviconSrc={tool.faviconUrl} fallback={tool.iconUrl} alt="" size={30} />
                <span><strong>{tool.name}</strong><small>{tool.category}</small></span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return <div className="miniRow"><span><strong>{label}</strong><small>{value}</small></span></div>;
}

function creatorProfileEventScript(creatorId: string) {
  return `
    ${betaEventBootstrapScript()}
    document.addEventListener("click", function(event) {
      var target = event.target && event.target.closest ? event.target.closest("[data-beta-creator-claim-cta]") : null;
      if (!target) return;
      window.__appscreenerTrackBetaEvent && window.__appscreenerTrackBetaEvent("creator_claim_cta_clicked", {
        creatorId: ${JSON.stringify(creatorId)},
        source: "creator_profile"
      });
    });
  `;
}

function CreatorToolRow({ relationship }: { relationship: CreatorToolRelationship }) {
  const tool = getTool(relationship.toolSlug);
  if (!tool) return null;

  return (
    <a className="creatorToolRelationshipRow" href={`/tools/${tool.slug}`}>
      <ToolLogo officialSrc={tool.officialLogoUrl} src={tool.logoUrl} faviconSrc={tool.faviconUrl} fallback={tool.iconUrl} alt="" size={30} />
      <span>
        <strong>{tool.name}</strong>
        <small>{tool.category}</small>
      </span>
      <b className={`creatorToolRelationshipBadge ${relationship.relationshipType}`}>{relationshipLabel(relationship.relationshipType)}</b>
    </a>
  );
}

function isVerifiedToolRelationship(relationship: CreatorToolRelationship) {
  return relationship.relationshipType === "uses" || relationship.relationshipType === "teaches";
}

function relationshipLabel(type: CreatorToolRelationship["relationshipType"]) {
  if (type === "uses") return "USES";
  if (type === "teaches") return "TEACHES";
  return "MENTIONED";
}

function relationshipStatusText(verifiedCount: number, mentionCount: number) {
  if (!verifiedCount) {
    return "Verified usage is pending. Mentioned tools are shown separately when available.";
  }

  return `${verifiedCount} verified tool ${verifiedCount === 1 ? "relationship" : "relationships"} mapped in the accepted graph. ${mentionCount ? `${mentionCount} mentioned ${mentionCount === 1 ? "tool is" : "tools are"} shown separately.` : "Mentioned tools remain separate when available."}`;
}

function publicCreatorTags(creator: NonNullable<ReturnType<typeof getCreator>>) {
  return [...new Set([
    creator.primarySpecialization,
    ...creator.specializationTags
  ].filter((tag): tag is NonNullable<typeof creator.primarySpecialization> => Boolean(tag)))];
}
