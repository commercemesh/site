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
        <p className={styles.heroSubtitle}>The Open Coordination Layer for AI-Native Commerce</p>
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
            to="https://github.com/commercemesh/commercemesh/wiki">
            Learn More →
          </Link>
          <Link
            className="button button--outline button--primary button--lg"
            style={{marginLeft: '1rem'}}
            to="https://discord.gg/commercemesh">
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
