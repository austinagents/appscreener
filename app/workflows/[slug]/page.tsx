import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AttentionChart } from "@/components/chart";
import { MovementBadge } from "@/components/movement-badge";
import { SaveButton } from "@/components/save-button";
import { TimeframeToggle } from "@/components/timeframe-toggle";
import { ToolTable } from "@/components/tool-table";
import { WorkflowStack } from "@/components/workflow-stack";
import { creatorWorkflowRelationships, creators, getWorkflow, toolsForWorkflow, workflows } from "@/lib/data";

export function generateStaticParams() {
  return workflows.map((workflow) => ({ slug: workflow.slug }));
}

export default function WorkflowDetailPage({ params }: { params: { slug: string } }) {
  const workflow = getWorkflow(params.slug);
  if (!workflow) notFound();
  const stackTools = toolsForWorkflow(workflow);
  const workflowCreatorRelationships = creatorWorkflowRelationships.filter((relationship) => relationship.status === "accepted" && relationship.workflowSlug === workflow.slug);
  const related = workflows.filter((item) => item.slug !== workflow.slug && item.toolSlugs.some((slug) => workflow.toolSlugs.includes(slug))).slice(0, 4);

  return (
    <div className="stack">
      <section className="detailHeader">
        <div>
          <p className="eyebrow">Workflow</p>
          <h1>{workflow.name}</h1>
          <p>{workflow.description}</p>
        </div>
        <SaveButton kind="workflows" id={workflow.slug} />
      </section>
      <section className="terminalStatus">
        <Metric label="Momentum Score" value={workflow.momentumScore} />
        <Metric label="24h Growth" value={<MovementBadge value={workflow.growth24h} />} />
        <Metric label="7d Growth" value={<MovementBadge value={workflow.growth7d} />} />
        <Metric label="Saves" value={workflow.savesCount.toLocaleString()} />
        <Metric label="Tools in stack" value={workflow.toolSlugs.length} />
        <TimeframeToggle compact />
      </section>
      <AttentionChart data={workflow.sparkline.concat(workflow.sparkline.slice(3).map((value) => value + 6))} title="Workflow Growth" />
      <section className="gridTwo wideLeft">
        <div><div className="sectionHeader"><h2>Tools In Stack</h2></div><ToolTable tools={stackTools} /></div>
        <aside className="sidePanel">
          <div className="panelHeader"><h2>Creator Relationships</h2></div>
          {workflowCreatorRelationships.length ? (
            <div className="miniList">
              {workflowCreatorRelationships.map((relationship) => {
                const creator = creators.find((item) => item.id === relationship.creatorId);
                if (!creator) return null;
                return (
                  <a className="miniRow" href={`/creators/${creator.id}`} key={relationship.id}>
                    <span><strong>{creator.name}</strong><small>{relationship.supportingToolSlugs?.length ?? 0} accepted tool overlaps</small></span>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="emptyState">Verified creator-workflow adoption is pending. This workflow is currently ranked by tool-stack composition and local movement signals.</p>
          )}
        </aside>
      </section>
      <section><div className="sectionHeader"><h2>Related Workflows</h2></div><div className="workflowGrid">{related.map((item) => <a className="workflowRow" href={`/workflows/${item.slug}`} key={item.id}><WorkflowStack toolSlugs={item.toolSlugs} /><span><strong>{item.name}</strong><small>{item.outcome}</small></span><MovementBadge value={item.growth24h} /></a>)}</div></section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}
