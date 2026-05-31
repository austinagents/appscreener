import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="stack">
      <section className="detailHeader">
        <div>
          <p className="eyebrow">Beta Dashboard</p>
          <h1>Choose workspace</h1>
          <p>Profile ownership shells for creators and product owners. Claims remain pending until reviewed.</p>
        </div>
      </section>
      <section className="gridTwo">
        <Link className="sidePanel dashboardChoice" href="/dashboard/creator">
          <div className="panelHeader"><h2>Creator Dashboard</h2></div>
          <p>Claim and manage a creator presence: profile, tools, workflows, topics, and public preview.</p>
        </Link>
        <Link className="sidePanel dashboardChoice" href="/dashboard/product">
          <div className="panelHeader"><h2>Product Dashboard</h2></div>
          <p>Claim and manage a product listing: profile, workflow roles, related creators, topics, and public preview.</p>
        </Link>
      </section>
    </div>
  );
}
