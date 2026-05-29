import { notFound } from "next/navigation";
import { CreatorAvatar } from "@/components/creator-avatar";
import { MovementBadge } from "@/components/movement-badge";
import { ToolLogo } from "@/components/tool-logo";
import { WorkflowStack } from "@/components/workflow-stack";
import { creatorTagDisplayLabel, creatorTagSlug, creatorTagStyle } from "@/lib/creator-tags";
import { creatorToolRelationships, creators, getCreator, getTool, workflows } from "@/lib/data";
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
  const tags = publicCreatorTags(creator);

  return (
    <div className="stack">
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
          <a className="iconTextButton" href={creator.xUrl} target="_blank" rel="noopener noreferrer">X Profile</a>
        </div>
      </section>
      <section className="gridTwo">
        <div className="sidePanel">
          <div className="panelHeader"><h2>Specialization Cluster</h2></div>
          <div className="miniList">
            {tags.map((tag) => (
              <a className="miniRow" href={`/tags/${creatorTagSlug(tag)}`} key={tag}>
                <span><strong>{creatorTagDisplayLabel(tag)}</strong><small>accepted creator taxonomy</small></span>
              </a>
            ))}
          </div>
        </div>
        <div className="sidePanel">
          <div className="panelHeader"><h2>Relationship Status</h2></div>
          <div className="emptyState">{relationshipStatusText(verifiedToolRelationships.length, mentionedToolRelationships.length)}</div>
        </div>
      </section>
      {verifiedToolRelationships.length ? (
        <section>
          <div className="sectionHeader"><h2>Verified Tool Relationships</h2><p>Accepted uses and teaches relationships only.</p></div>
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
        <div className="sectionHeader"><h2>Workflow Adjacency Preview</h2><p>Based on specialization tags, not verified creator usage.</p></div>
        <div className="workflowGrid">
          {creatorWorkflows.map((workflow) => <a className="workflowRow" href={`/workflows/${workflow.slug}`} key={workflow.id}><WorkflowStack toolSlugs={workflow.toolSlugs} /><span><strong>{workflow.name}</strong><small>{workflow.outcome}</small></span><MovementBadge value={workflow.growth24h} /></a>)}
          {!creatorWorkflows.length && <div className="emptyState">Workflow adjacency is pending stronger creator graph coverage.</div>}
        </div>
      </section>
    </div>
  );
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
