import Link from "next/link";
import { ClaimStatusBadge } from "@/components/claims/claim-status";
import { CreatorAvatar } from "@/components/creator-avatar";
import { ToolLogo } from "@/components/tool-logo";
import { creatorToolRelationships, creators, getTool, productClaimRequests, toolsForWorkflow, workflows } from "@/lib/data";
import { displayCategory } from "@/lib/format";

const mockWorkflowSlugs = ["founder-outbound-engine", "agency-prospecting", "b2b-lead-research"];
const mockTopics = ["Lead Generation", "Outbound", "AI Sales", "Automation"];

export default function ProductDashboardPage() {
  const claim = productClaimRequests[0];
  const tool = claim ? getTool(claim.toolSlug) : undefined;
  const selectedWorkflows = workflows.filter((workflow) => mockWorkflowSlugs.includes(workflow.slug));
  const relatedCreators = tool ? creatorToolRelationships
    .filter((relationship) => relationship.status === "accepted" && relationship.toolSlug === tool.slug)
    .map((relationship) => creators.find((creator) => creator.id === relationship.creatorId))
    .filter(Boolean)
    .slice(0, 4) : [];

  return (
    <div className="stack">
      <section className="detailHeader">
        <div>
          <p className="eyebrow">Product Dashboard</p>
          <h1>Product ownership</h1>
          <p>Mock ownership workspace for testing whether founders want to manage product info, workflow placement, creator adjacency, and topics after claiming.</p>
        </div>
        <ClaimStatusBadge status={claim ? "pending" : "unclaimed"} />
      </section>

      <section className="dashboardGrid ownershipDashboard">
        <aside className="dashboardNav">
          <strong>Product Workspace</strong>
          <a href="#overview">Overview</a>
          <a href="#profile">Profile</a>
          <a href="#workflows">Workflows</a>
          <a href="#creators">Creators</a>
          <a href="#topics">Topics</a>
          <a href="#preview">Preview</a>
        </aside>
        <main className="dashboardMain">
          <section className="sidePanel" id="overview">
            <div className="panelHeader"><h2>Overview</h2></div>
            <div className="ownershipMetricGrid">
              <OwnershipMetric label="Claim status" value={claim ? "Pending Review" : "Unclaimed"} />
              <OwnershipMetric label="Profile completion" value="68%" />
              <OwnershipMetric label="Next action" value="Request workflow role" />
            </div>
            <p className="emptyState">Static beta shell. Product edits, workflow requests, creator associations, and topic changes remain pending review.</p>
          </section>

          <section className="sidePanel" id="profile">
            <div className="panelHeader"><h2>Profile</h2></div>
            {tool ? (
              <div className="ownershipFormGrid">
                <MockField label="Product name" value={tool.name} />
                <MockField label="Website" value={tool.websiteUrl} />
                <MockField label="Description" value={tool.description} wide />
                <MockField label="Categories" value={tool.categories.map(displayCategory).join(" · ")} />
                <MockField label="Tags" value={tool.tags.slice(0, 5).join(" · ")} />
                <button className="primaryButton" type="button">Request Product Update</button>
              </div>
            ) : <p className="emptyState">No active product claim is selected in this static beta shell.</p>}
          </section>

          <section className="sidePanel" id="workflows">
            <div className="panelHeader"><h2>Used In Workflows</h2></div>
            <div className="ownershipRows">
              {selectedWorkflows.map((workflow) => (
                <OwnershipRow key={workflow.slug} title={workflow.name} meta={roleForWorkflow(workflow.slug)} detail={toolsForWorkflow(workflow).map((item) => item.name).join(" -> ")} />
              ))}
            </div>
            <button className="iconTextButton" type="button">Request Workflow Association</button>
          </section>

          <section className="sidePanel" id="creators">
            <div className="panelHeader"><h2>Creators</h2></div>
            <div className="ownershipRows">
              {relatedCreators.length ? relatedCreators.map((creator) => creator ? (
                <div className="miniRow" key={creator.id}>
                  <CreatorAvatar name={creator.name} src={creator.avatarUrl} size={28} />
                  <span><strong>{creator.name}</strong><small>Accepted relationship in the current graph</small></span>
                </div>
              ) : null) : <p className="emptyState">Related creator relationships are view-only and pending stronger graph coverage.</p>}
            </div>
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
            {tool ? (
              <div className="ownershipPreview">
                <ToolLogo officialSrc={tool.officialLogoUrl} src={tool.logoUrl} faviconSrc={tool.faviconUrl} fallback={tool.iconUrl} alt="" size={44} />
                <span><strong>{tool.name}</strong><small>{mockTopics.slice(0, 3).join(" · ")}</small></span>
                <Link className="iconTextButton" href={`/tools/${tool.slug}`}>Preview Public Product</Link>
              </div>
            ) : <Link className="iconTextButton" href="/search?type=product">Browse Products</Link>}
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

function roleForWorkflow(slug: string) {
  if (slug === "founder-outbound-engine") return "Role: Lead enrichment";
  if (slug === "agency-prospecting") return "Role: Prospect qualification";
  return "Role: Account research";
}
