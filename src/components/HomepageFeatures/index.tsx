import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Discover',
    icon: '🔍',
    description: (
      <>
        Universal search and publication of commerce data. Discovery Nodes enable 
        AI agents to find products, services, and offers across the entire mesh, 
        not just within walled gardens.
      </>
    ),
  },
  {
    title: 'Transact',
    icon: '💳',
    description: (
      <>
        AI-initiated, open API commerce. Transaction Nodes process payments through 
        multiple rails while maintaining protocol compatibility, enabling true 
        competition and innovation.
      </>
    ),
  },
  {
    title: 'Trust',
    icon: '🛡️',
    description: (
      <>
        Programmable identity and reputation. Trust Nodes aggregate signals across 
        the mesh, providing portable reputation that follows sellers everywhere, 
        not trapped in platform silos.
      </>
    ),
  },
  {
    title: 'Fulfillment',
    icon: '📦',
    description: (
      <>
        Distributed shipping and routing. Fulfillment Nodes coordinate logistics 
        across carriers and providers, optimizing for speed, cost, or carbon 
        footprint based on buyer preferences.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--6')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>{icon}</div>
        <div className="padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Four Nodes, Infinite Possibilities
          </Heading>
          <p className={styles.sectionSubtitle}>
            The Commerce Mesh Protocol separates commerce into modular functions, 
            each operating as independent nodes on the network.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            Not an e-commerce platform. An extensible, open protocol for the next generation of commerce.
          </p>
          <p className={styles.targetAudience}>
            Built for AI agent developers, direct-to-consumer brands, commerce infrastructure architects, 
            and technology ecosystem influencers.
          </p>
        </div>
      </div>
    </section>
  );
}