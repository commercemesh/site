import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          Commerce Mesh Protocol
        </Heading>
        <p className={styles.heroSubtitle}>Open Protocol for Commerce Infrastructure</p>
        <div className={styles.heroDescription}>
          <p>
            Commerce is undergoing a fundamental transformation. As AI agents become the primary interface 
            for discovery and purchasing, the need for open, interoperable protocols has never been greater.
          </p>
          <p>
            The Commerce Mesh Protocol (CMP) enables AI agents, brands, and commerce infrastructure to 
            coordinate through standardized, decentralized nodes—creating a more open and efficient 
            commerce ecosystem.
          </p>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Learn More →
          </Link>
          <Link
            className={clsx("button button--lg", styles.outlineButton)}
            to="https://discord.com/channels/1381756773563633786">
            Join the Community
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Commerce Mesh Protocol - Open Coordination Layer for AI-Native Commerce"
      description="The Commerce Mesh Protocol enables AI agents, brands, and commerce infrastructure to coordinate through standardized, decentralized nodes.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
