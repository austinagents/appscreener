import Link from "next/link";
import { ClaimStatusBadge } from "@/components/claims/claim-status";
import { CreatorAvatar } from "@/components/creator-avatar";
import { WorkflowStack } from "@/components/workflow-stack";
import { creatorClaimRequests, getCreator, getTool, workflows } from "@/lib/data";

const mockTools = [
  { toolSlug: "clay", useCase: "Lead enrichment", priority: "Primary", workflowSlug: "founder-outbound-engine" },
  { toolSlug: "claude", useCase: "Research synthesis", priority: "Primary", workflowSlug: "research-assistant" },
  { toolSlug: "chatgpt", useCase: "Content repurposing", priority: "Secondary", workflowSlug: "ai-content-repurposing" }
];

const mockWorkflowSlugs = ["founder-outbound-engine", "research-assistant", "ai-content-repurposing"];
const mockTopics = ["Lead Generation", "AI Research", "Automation", "AI Agents"];

export default function CreatorDashboardPage() {
  const claim = creatorClaimRequests[0];
  const creator = claim ? getCreator(claim.creatorId) : undefined;
  const selectedWorkflows = workflows.filter((workflow) => mockWorkflowSlugs.includes(workflow.slug));

  return (
    <div className="stack">
      <section className="detailHeader">
        <div>
          <p className="eyebrow">Creator Dashboard</p>
          <h1>Profile ownership</h1>
          <p>Mock ownership workspace for testing whether creators want to manage profile info, tools, workflows, and topics after claiming.</p>
        </div>
        <ClaimStatusBadge status={claim ? "pending" : "unclaimed"} />
      </section>

      <section className="dashboardGrid ownershipDashboard">
        <aside className="dashboardNav">
          <strong>Creator Workspace</strong>
          <a href="#overview">Overview</a>
          <a href="#profile">Profile</a>
          <a href="#tools">Tools</a>
          <a href="#workflows">Workflows</a>
          <a href="#topics">Topics</a>
          <a href="#preview">Preview</a>
        </aside>
        <main className="dashboardMain">
          <section className="sidePanel" id="overview">
            <div className="panelHeader"><h2>Overview</h2></div>
            <div className="ownershipMetricGrid">
              <OwnershipMetric label="Claim status" value={claim ? "Pending Review" : "Unclaimed"} />
              <OwnershipMetric label="Profile completion" value="72%" />
              <OwnershipMetric label="Next action" value="Confirm tools used" />
            </div>
            <p className="emptyState">Static beta shell. Any profile, tool, workflow, or topic changes are mock actions and remain pending review.</p>
          </section>

          <section className="sidePanel" id="profile">
            <div className="panelHeader"><h2>Profile</h2></div>
            {creator ? (
              <div className="ownershipFormGrid">
                <MockField label="Name" value={creator.name} />
                <MockField label="Title" value={creator.creatorCategory || "Creator / Operator"} />
                <MockField label="Bio" value={creator.bio} wide />
                <MockField label="Website" value={creator.websiteUrl || creator.officialWebsite || "Add website"} />
                <MockField label="Socials" value={[creator.xUrl, creator.youtubeUrl, creator.linkedinUrl].filter(Boolean).join(" · ") || "Add socials"} />
                <button className="primaryButton" type="button">Request Profile Update</button>
              </div>
            ) : <p className="emptyState">No active creator claim is selected in this static beta shell.</p>}
          </section>

          <section className="sidePanel" id="tools">
            <div className="panelHeader"><h2>Tools I Use</h2></div>
            <div className="ownershipRows">
              {mockTools.map((item) => {
                const tool = getTool(item.toolSlug);
                const workflow = workflows.find((entry) => entry.slug === item.workflowSlug);
                if (!tool) return null;
                return <OwnershipRow key={item.toolSlug} title={tool.name} meta={`${item.useCase} · ${item.priority}`} detail={workflow ? `Related workflow: ${workflow.name}` : "Related workflow pending"} />;
              })}
            </div>
            <button className="iconTextButton" type="button">Add Tool Used</button>
          </section>

          <section className="sidePanel" id="workflows">
            <div className="panelHeader"><h2>Workflows I Use / Teach</h2></div>
            <div className="ownershipRows">
              {selectedWorkflows.map((workflow, index) => (
                <OwnershipRow key={workflow.slug} title={workflow.name} meta={index === 0 ? "Primary" : "Secondary"} detail={workflow.toolSlugs.map((slug) => getTool(slug)?.name).filter(Boolean).join(" -> ")} />
              ))}
            </div>
            <button className="iconTextButton" type="button">Add Workflow Association</button>
          </section>

          <section className="sidePanel" id="topics">
            <div className="panelHeader"><h2>Topics</h2></div>
            <div className="ownershipChipRail">
              {mockTopics.map((topic) => <span key={topic}>{topic}</span>)}
              <button type="button">Add Topic</button>
            </div>
          </section>

          <section className="sidePanel" id="preview">
            <div className="panelHeader"><h2>Preview</h2></div>
            {creator ? (
              <div className="ownershipPreview">
                <CreatorAvatar name={creator.name} src={creator.avatarUrl} size={44} />
                <span><strong>{creator.name}</strong><small>{mockTopics.slice(0, 3).join(" · ")}</small></span>
                <Link className="iconTextButton" href={`/creators/${creator.id}`}>Preview Public Profile</Link>
              </div>
            ) : <Link className="iconTextButton" href="/creators">Browse Creators</Link>}
          </section>
        </main>
      </section>
    </div>
  );
}

function OwnershipMetric({ label, value }: { label: string; value: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function MockField({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <label className={wide ? "wide" : ""}>{label}<input value={value} readOnly /></label>;
}

function OwnershipRow({ title, meta, detail }: { title: string; meta: string; detail: string }) {
  return <div className="miniRow"><span><strong>{title}</strong><small>{meta}</small><small>{detail}</small></span></div>;
}
